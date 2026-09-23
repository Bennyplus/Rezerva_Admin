import { publicApi } from '@/lib/api-client';

/* ─── Types ─── */
export type DriverStatus = "Active" | "Inactive" | "Suspended" | "Deactivated";
export type AvailabilityStatus = "Available" | "On Trip" | "Offline";
export type LicenseStatus = "Valid" | "Expired";
export type BookingStatus = "Completed" | "Cancelled" | "In Progress";
export type VerificationStatus = "Verified" | "Unverified";

export interface TripRecord {
  id: string;
  pickup: string;
  destination: string;
  date: string;
  time: string;
  status: "Completed" | "Cancelled";
}

export interface DriverDocument {
  label: string;
  filename: string;
  size: string;
  url?: string;
}

export interface Driver {
  id: string;
  driverCode?: string;
  name: string;
  avatar: string;
  rating: number;
  phone: string;
  email: string;
  licenseNo: string;
  licenseStatus: LicenseStatus;
  status: DriverStatus;
  availability: AvailabilityStatus;
  location: string;
  totalTrips: number;
  reports: number;
  currentBooking: string | null;
  assignedTrips: number;
  verificationStatus?: VerificationStatus;
  accountNumber?: string;
  bankName?: string;
  totalEarnings?: string;
  tripsHistory: TripRecord[];
  documents: {
    driversLicense: DriverDocument;
    vehicleDocuments?: DriverDocument;
    nin?: DriverDocument;
    proofOfAddress?: DriverDocument;
    nin2?: DriverDocument;
  };
}

export const driversService = {
  getDrivers: async (): Promise<Driver[]> => {
    try {
      const response = await publicApi.get('', {
        params: {
          path: 'administration/users/',
          user_type: 'DRIVER',
        },
      });
      const raw =
        response?.data?.results ||
        response?.data?.data ||
        (Array.isArray(response?.data) ? response.data : []);
      return raw.map((item: any) => mapDriver(item));
    } catch (error) {
      console.error('Failed to get drivers:', error);
      throw error;
    }
  },

  getDriverDetails: async (driverId: string | number): Promise<Driver> => {
    try {
      const response = await publicApi.get('', {
        params: {
          path: 'administration/drivers/info/',
          driver_id: driverId,
        },
      });
      return mapDriverDetail(response.data);
    } catch (error) {
      console.error(`Failed to get driver details for ID ${driverId}:`, error);
      throw error;
    }
  },

  suspendUser: async (
    userId: string | number,
    notes?: string
  ): Promise<any> => {
    try {
      const formData = new FormData();
      formData.append('notes', notes || 'User suspended by admin');

      const response = await publicApi.post('', formData, {
        params: {
          path: 'administration/suspend-user/',
          user_id: userId,
        },
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        successMessage: 'User account has been suspended.',
      } as any);
      return response.data;
    } catch (error) {
      console.error(`Failed to suspend user ${userId}:`, error);
      throw error;
    }
  },

  verifyUser: async (userId: string | number): Promise<any> => {
    try {
      const response = await publicApi.post(
        '',
        {},
        {
          params: {
            path: 'administration/users/verify/',
            user_id: userId,
          },
          successMessage: 'User has been verified.',
        } as any
      );
      return response.data;
    } catch (error) {
      console.error(`Failed to verify user ${userId}:`, error);
      throw error;
    }
  },

  suspendDriver: async (
    driverId: string | number,
    notes?: string
  ): Promise<any> => {
    return driversService.suspendUser(driverId, notes);
  },

  verifyDriver: async (driverId: string | number): Promise<any> => {
    return driversService.verifyUser(driverId);
  },
};

function formatTripDate(dateStr?: string): string {
  if (!dateStr) return '30 Mar 2026';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

function formatTripTime(timeStr?: string): string {
  if (!timeStr) return '10:30AM';
  try {
    const parts = timeStr.split(':');
    if (parts.length >= 2) {
      let hours = parseInt(parts[0], 10);
      const mins = parts[1];
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      return `${String(hours).padStart(2, '0')}:${mins}${ampm}`;
    }
    return timeStr;
  } catch {
    return timeStr;
  }
}

function mapDriverDetail(data: any): Driver {
  const user = data?.user || {};
  const profile = data?.profile || {};
  const driverStats = data?.driver_stats || {};
  const vehicleStats =
    Array.isArray(data?.vehicle_stats) && data.vehicle_stats.length > 0
      ? data.vehicle_stats[0]
      : null;
  const paymentInfo = data?.payment_info || {};
  const tripHistoryRaw = Array.isArray(data?.trip_history) ? data.trip_history : [];

  const dialCode = profile.dial_code ? `${profile.dial_code} ` : '';
  const phone = profile.phone_number || user.phone_number || 'N/A';
  const fullPhone = phone.startsWith('+') ? phone : `${dialCode}${phone}`;

  const vehicleDocRaw = vehicleStats?.vehicle_document?.[0];
  const vehicleDocFile = vehicleDocRaw?.file || '';
  const vehicleDocName = vehicleDocFile
    ? vehicleDocFile.split('/').pop()?.split('?')[0] || 'vehicle_document.pdf'
    : 'vehicle_document.pdf';

  const trips: TripRecord[] = tripHistoryRaw.map((t: any, i: number) => ({
    id: `trip-${i + 1}`,
    pickup: t.pickup_location || 'Pickup Location',
    destination: t.destination || 'Destination',
    date: formatTripDate(t.trip_date),
    time: formatTripTime(t.departure_time),
    status: 'Completed',
  }));

  const verificationStatus: VerificationStatus =
    driverStats.verification_status === 'Verified' || user.is_verified === true
      ? 'Verified'
      : 'Unverified';

  return {
    id: String(profile.user || user.id || '10'),
    driverCode: profile.referral_code || `DRI-ID01-${profile.user || user.id || 10}`,
    name: profile.full_name || user.full_name || 'N/A',
    email: profile.email || user.email || 'N/A',
    phone: fullPhone,
    licenseNo: vehicleStats?.plate_number || 'N/A',
    avatar:
      profile.profile_picture ||
      user.profile_picture ||
      '/images/admin/profile-Avatar.svg',
    rating: typeof driverStats.rating === 'number' ? driverStats.rating : 5,
    status: verificationStatus === 'Verified' ? 'Active' : 'Inactive',
    availability: 'Available',
    location: profile.address_line_1 || 'Lagos',
    licenseStatus:
      vehicleStats?.verification_status === 'PENDING' ? 'Valid' : 'Valid',
    totalTrips:
      typeof driverStats.total_trips === 'number'
        ? driverStats.total_trips
        : trips.length,
    reports: 0,
    currentBooking: null,
    assignedTrips: trips.length,
    verificationStatus,
    accountNumber: paymentInfo.account_number || '123456789098',
    bankName: paymentInfo.bank_name || 'Zenith',
    totalEarnings: driverStats.wallet_balance
      ? `$${Number(driverStats.wallet_balance).toLocaleString('en-US', {
          minimumFractionDigits: 2,
        })}`
      : '$400,000.00',
    tripsHistory:
      trips.length > 0
        ? trips
        : [
            {
              id: 'trip-1',
              pickup: 'Frebson Fitness Gym',
              destination: 'CMS Bus Stop Lagos Island',
              date: '30 Mar 2026',
              time: '10:30AM',
              status: 'Completed',
            },
            {
              id: 'trip-2',
              pickup: 'Frebson Fitness Gym',
              destination: 'CMS Bus Stop Lagos Island',
              date: '30 Mar 2026',
              time: '10:30AM',
              status: 'Cancelled',
            },
          ],
    documents: {
      driversLicense: {
        label: 'Drivers License',
        filename: 'my-cv.pdf',
        size: '120 KB',
      },
      vehicleDocuments: {
        label: 'Vehicle Documents',
        filename: vehicleDocName,
        size: '120 KB',
        url: vehicleDocFile || undefined,
      },
      nin: {
        label: 'NIN',
        filename: 'my-cv.pdf',
        size: '120 KB',
      },
    },
  };
}

function mapDriver(item: any): Driver {
  const statusStr = item?.status || item?.profile?.status || item?.account_status;
  let status: DriverStatus = 'Active';
  if (statusStr === 'Suspended') status = 'Suspended';
  else if (statusStr === 'Deactivated') status = 'Deactivated';
  else if (statusStr === 'Inactive' || statusStr === 'Offline') status = 'Inactive';
  else if (item?.is_verified === 'Not Verified') status = 'Inactive';
  else status = 'Active';

  return {
    id: String(item.id),
    driverCode: item?.referral_code || item?.driver_code || item?.profile?.driver_id || `DRI-ID01-${item.id || 123}`,
    name: item.full_name || item.name || 'N/A',
    email: item.email || 'N/A',
    phone: item.phone_number || item.phone || 'N/A',
    licenseNo: item?.profile?.license_number || item.license_number || 'N/A',
    avatar: item?.profile_picture || item?.profile?.profile_picture || item.avatar || '/images/admin/profile-Avatar.svg',
    rating: typeof item?.rating === 'number' ? item.rating : (typeof item?.profile?.rating === 'number' ? item.profile.rating : 5),
    status,
    availability: item?.profile?.status || 'Offline',
    location: item.location || 'Unknown',
    licenseStatus: item.license_status || 'Valid',
    totalTrips: typeof item.total_trips === 'number' ? item.total_trips : (item?.profile?.total_trips || 0),
    reports: item.reports || 0,
    currentBooking: item.current_booking || null,
    assignedTrips: item.assigned_trips || 0,
    verificationStatus: item.is_verified === 'Verified' ? 'Verified' : (item.is_verified === 'Not Verified' ? 'Unverified' : 'Verified'),
    accountNumber: item.account_number || '123456789098',
    bankName: item.bank_name || 'Zenith',
    totalEarnings: item.total_earnings || '$400,000.00',
    tripsHistory: Array.isArray(item.trips_history) ? item.trips_history : [
      {
        id: "trip-1",
        pickup: "Frebson Fitness Gym",
        destination: "CMS Bus Stop Lagos Island",
        date: "30 Mar 2026",
        time: "10:30AM",
        status: "Completed",
      },
      {
        id: "trip-2",
        pickup: "Frebson Fitness Gym",
        destination: "CMS Bus Stop Lagos Island",
        date: "30 Mar 2026",
        time: "10:30AM",
        status: "Cancelled",
      }
    ],
    documents: {
      driversLicense: {
        label: "Drivers License",
        filename: item?.profile?.driver_license || "my-cv.pdf",
        size: "120 KB",
      },
      vehicleDocuments: {
        label: "Vehicle Documents",
        filename: item?.profile?.vehicle_document || "my-cv.pdf",
        size: "120 KB",
      },
      nin: {
        label: "NIN",
        filename: item?.profile?.nin_document || "my-cv.pdf",
        size: "120 KB",
      },
    },
  };
}
