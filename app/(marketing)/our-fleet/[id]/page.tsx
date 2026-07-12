"use client";

import { use, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Spinner from "@/components/admin/Spinner";
import { marketingService } from "@/services/marketing-service";
import { vehiclesService } from "@/services/vehicles-service";
import { Vehicle } from "@/types/vehicle";
import styles from "./page.module.css";

function StarIcon({ size = 27, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="#000"
      stroke="none"
      className={className}
    >
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  );
}


function FeatureIcon({ name }: { name: string }) {
  let iconFile = "gas-station.svg"; // default fallback
  switch (name) {
    case "Air Conditioning":
      iconFile = "air-conditioner.svg";
      break;
    case "Air Bags":
      iconFile = "air-bag.svg";
      break;
    case "Heated Seats":
      iconFile = "heated-seats.svg";
      break;
    case "Climate Control":
      iconFile = "climate.svg";
      break;
    case "USB Charging Ports":
      iconFile = "usb-charging-ports.svg";
      break;
    case "Bluetooth":
      iconFile = "bluetooth.svg";
      break;
    case "Anti-lock Braking System":
      iconFile = "anti-lock.svg";
      break;
    case "Navigation":
      iconFile = "map.svg";
      break;
  }

  return (
    <Image
      src={`/images/our-fleet/${iconFile}`}
      alt={`${name} icon`}
      width={20}
      height={20}
      aria-hidden="true"
    />
  );
}

export default function VehicleDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [brands, setBrands] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [featuresList, setFeaturesList] = useState<any[]>([]);
  const [currency, setCurrency] = useState<string>("USD");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Read cached currency (set by fleet page via ipapi.co)
  useEffect(() => {
    const cached = localStorage.getItem('drifully_currency');
    if (cached) setCurrency(cached);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [vehicleData, optionsData] = await Promise.all([
          marketingService.getVehicleById(unwrappedParams.id),
          vehiclesService.getVehicleOptions()
        ]);
        setVehicle(vehicleData);
        setBrands(optionsData.brands);
        setCategories(optionsData.categories);
        setFeaturesList(optionsData.features);
      } catch (err: any) {
        setError("Failed to load vehicle details.");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (unwrappedParams.id) {
      fetchData();
    }
  }, [unwrappedParams.id]);

  const brandData = vehicle ? brands.find(b => b.id === vehicle.brand_id) : null;
  const categoryData = vehicle ? categories.find(c => c.id === vehicle.category_id) : null;
  const displayBrand = brandData ? brandData.name : vehicle?.name?.split(' ')[0];
  const displayCategory = categoryData ? categoryData.name : vehicle?.category;
  const displayName = vehicle ? (brandData ? `${displayBrand} ${vehicle.model}` : vehicle.name) : "";

  const handleBookNow = () => {
    if (typeof window !== "undefined") {
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
      if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) {
        window.open("https://apps.apple.com/app/drifully", "_blank");
      } else {
        window.open("https://play.google.com/store/apps/details?id=com.drifully.app", "_blank");
      }
    }
  };



  if (loading) {
    return (
      <>
        <Navbar />
        <main className="container" style={{ paddingTop: '120px', minHeight: '60vh', textAlign: 'center' }}>
          <Spinner />
        </main>
        <Footer />
      </>
    );
  }

  if (error || !vehicle) {
    return (
      <>
        <Navbar />
        <main className="container" style={{ paddingTop: '120px', minHeight: '60vh', textAlign: 'center' }}>
          <h1 className="heading-1">{error || "Vehicle Not Found"}</h1>
          <p style={{ marginTop: '20px' }}>
            <Link href="/our-fleet" className="btn btn-primary">Back to Fleet</Link>
          </p>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className={styles.main}>
        <div className="container">
          {/* Back Button */}
          <Link href="/our-fleet" className={styles.backBtn}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to Fleet
          </Link>

          {/* Gallery Grid */}
          <div className={styles.galleryContainer}>
            <div className={styles.galleryTop}>
              <div className={styles.galleryTopImg}>
                <Image src={vehicle.gallery[0] || vehicle.image || '/images/placeholder-car.png'} alt={vehicle.name} fill style={{ objectFit: 'cover' }} priority />
              </div>
              <div className={styles.galleryTopImg}>
                <Image src={vehicle.gallery[1] || vehicle.image || '/images/placeholder-car.png'} alt={vehicle.name} fill style={{ objectFit: 'cover' }} priority />
              </div>
            </div>
            <div className={styles.galleryBottom}>
              <div className={styles.galleryBottomImg}>
                <Image src={vehicle.gallery[2] || vehicle.image || '/images/placeholder-car.png'} alt={vehicle.name} fill style={{ objectFit: 'cover' }} />
              </div>
              <div className={styles.galleryBottomImg}>
                <Image src={vehicle.gallery[3] || vehicle.image || '/images/placeholder-car.png'} alt={vehicle.name} fill style={{ objectFit: 'cover' }} />
              </div>
              <div className={styles.galleryBottomImg}>
                <Image src={vehicle.gallery[4] || vehicle.image || '/images/placeholder-car.png'} alt={vehicle.name} fill style={{ objectFit: 'cover' }} />
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <div className={styles.detailsGrid}>
            {/* Left Column (Info) */}
            <div>
              <div className={styles.header}>
                <h1 className={`heading-1 ${styles.title}`}>{displayName}</h1>
              </div>

              {/* Badges */}
              <div className={styles.badges}>
                <span className={styles.badge}>
                  <Image src="/images/our-fleet/profile.svg" alt="Seats" width={24} height={24} aria-hidden="true" />
                  {vehicle.capacity} Seats
                </span>
                <span className={styles.badge}>
                  {categoryData?.icon ? (
                    <Image src={categoryData.icon} alt={displayCategory} width={24} height={24} aria-hidden="true" />
                  ) : (
                    <Image src="/images/our-fleet/jeep.svg" alt="Category" width={24} height={24} aria-hidden="true" />
                  )}
                  {displayCategory}
                </span>
                <span className={styles.badge}>
                  {vehicle.transmission}
                </span>
                <span className={styles.badge}>
                  <Image src="/images/our-fleet/gas-station.svg" alt="Fuel" width={24} height={24} aria-hidden="true" />
                  {vehicle.fuel}
                </span>
              </div>

              {/* Mobile Price & Rating (Hidden on desktop) */}
              <div className={styles.mobilePriceRating}>
                <div>
                  <span className={styles.mobilePriceAmount}>
                    {new Intl.NumberFormat(undefined, { style: 'currency', currency, maximumFractionDigits: 0 }).format(
                      typeof vehicle.price === 'number' ? vehicle.price : parseFloat(vehicle.price)
                    )}
                  </span>
                  <span className={styles.mobilePriceUnit}>/day</span>
                  <br />
                  <span className={styles.mobilePriceTaxes}>Before taxes</span>
                </div>
                <div className={styles.mobileRatingRow}>
                  <StarIcon size={18} />
                  <span className={styles.mobileRatingScore}>{vehicle.rating}</span>
                  <span className={styles.mobileRatingReviews}>({vehicle.reviews} reviews)</span>
                </div>
              </div>

              {/* Features */}
              <div className={styles.featuresSection}>
                <h2 className={styles.featuresTitle}>Features</h2>
                <div className={styles.featuresGrid}>
                  {vehicle.features?.map(featureId => {
                    const featureData = featuresList.find(f => f.id === featureId);
                    const featureName = featureData ? featureData.name : `Feature ${featureId}`;
                    return (
                      <div key={featureId} className={styles.featureItem}>
                        <div className={styles.featureIcon}>
                          <FeatureIcon name={featureName} />
                        </div>
                        <span>{featureName}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Rules of the Road */}
              {vehicle.rules && vehicle.rules.length > 0 && (
                <div className={styles.rulesSection}>
                  <h2 className={styles.rulesTitle}>Rules of the road</h2>
                  <div className={styles.rulesList}>
                    {vehicle.rules.map((rule, index) => {
                      const parts = rule.split('.');
                      const title = parts[0];
                      const desc = parts.slice(1).join('.');
                      return (
                        <div key={index}>
                          <h3 className={styles.ruleItemTitle}>{index + 1}. {title}</h3>
                          {desc && <p className={styles.ruleItemDesc}>{desc.trim()}</p>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column (Sticky Card - Hidden on Mobile) */}
            <div className={styles.rightSidebar}>
              <div className={styles.ratingRow}>
                <StarIcon size={22} />
                <span className={styles.ratingScore}>{vehicle.rating}</span>
                <span className={styles.ratingReviews}>({vehicle.reviews} reviews)</span>
              </div>
              <div className={styles.stickyCard}>
                <div className={styles.priceRow}>
                  <span className={styles.priceAmount}>
                    {new Intl.NumberFormat(undefined, { style: 'currency', currency, maximumFractionDigits: 0 }).format(
                      typeof vehicle.price === 'number' ? vehicle.price : parseFloat(vehicle.price)
                    )}
                    <span className={styles.priceUnit}>/day</span>
                  </span>
                  <span className={styles.priceTaxes}>Before taxes</span>
                </div>
                <button className={`btn btn-primary ${styles.bookBtn}`} onClick={handleBookNow}>
                  Book Now
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Sticky Book Button (Hidden on Desktop) */}
        <div className={styles.mobileStickyBookBtn}>
          <button className={`btn btn-primary ${styles.bookBtn}`} onClick={handleBookNow}>
            Book Now
          </button>
        </div>
      </main>

      <Footer />
    </>
  );
}
