'use client';

import React, { useState, useEffect } from 'react';
import styles from '../login/Login.module.css';
import CustomSelect from '@/components/admin/CustomSelect';
import { accountsService } from '@/services/accounts-service';

export default function DriverApplicationPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [referralCode, setReferralCode] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [driverLicense, setDriverLicense] = useState<File | null>(null);
  const [proofOfIdentity, setProofOfIdentity] = useState<File | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [phonePrefix, setPhonePrefix] = useState("");
  const [phonePrefixOptions, setPhonePrefixOptions] = useState<any[]>([]);


  // Step 2 Form Data
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    country: '',
    nin_number: '',
    proof_of_identity_type: '',
  });

  const proofOfIdentityOptions = [
    { value: "electricity_bill", label: "Utility Bill" },
    { value: "lawma_bill", label: "Lawma bill" },
    { value: "bank_statement", label: "Bank Statement" },
  ]

  useEffect(() => {
    async function loadCountries() {
      try {
        const countriesData = await accountsService.getCountries();
        
        // Find Nigeria and set as the only option
        const nigeria = countriesData.find((c: any) => c.iso_code === "234" || c.dial_code === "+234") || countriesData[0];
        
        if (nigeria) {
          const options = [{
            value: String(nigeria.id),
            label: nigeria.dial_code,
            icon: nigeria.flag
          }];
          setPhonePrefixOptions(options);
          setPhonePrefix(String(nigeria.id));
          setFormData(prev => ({ ...prev, country: String(nigeria.id) }));
        }
      } catch (error) {
        console.error("Failed to fetch countries for phone prefixes", error);
      }
    }
    loadCountries();
  }, []);

  const handleSelectChange = (name: string, value: string) => {
    if (name === "phonePrefix") {
      setPhonePrefix(value);
      setFormData(prev => ({ ...prev, country: value }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleVerifyReferral = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsValidating(true);

    try {
      const data = new FormData();
      data.append('referral_code', referralCode);

      const result = await accountsService.verifyDriverReferral(data);

      if (result && result.success) {
        setStep(2);
      } else {
        setErrorMsg('Invalid referral code. Please try again.');
      }
    } catch (err: any) {
      // remove error message after 3 seconds
      setTimeout(() => {
        setErrorMsg('');
        setReferralCode('');
      }, 4000);
      // extract error message if it's an array
      const responseData = err.response?.data;
      const apiErrorMessage = responseData?.referral_code?.[0] || responseData?.error || 'Failed to verify referral code. Please try again.';

      setErrorMsg(apiErrorMessage);
    } finally {
      setIsValidating(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      if (name === 'driver_license') {
        setDriverLicense(files[0]);
      } else if (name === 'proof_of_identity') {
        setProofOfIdentity(files[0]);
      }
    }
  };

  const handleSubmitRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });

      if (driverLicense) {
        data.append('driver_license', driverLicense);
      }
      if (proofOfIdentity) {
        data.append('proof_of_identity', proofOfIdentity);
      }

      const result = await accountsService.registerDriverOnline(referralCode, data);

      if (result && result.success) {
        setSuccessMsg('Registration completed successfully! We will contact you soon.');
        setStep(1); // Optional: Reset or show a success view instead
        setReferralCode('');
      } else {
        setErrorMsg('Registration failed. Please try again.');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.response?.data?.error || 'Failed to register. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className={styles.login_page}>
      <div className={styles.login_container}>
        <div className={styles.login_form_wrapper} style={{ maxWidth: step === 2 ? '500px' : '440px' }}>
          {/* Logo */}
          <div className={styles.logo_wrapper}>
            <svg width="199" height="62" viewBox="0 0 199 62" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4.94922 30.6917L20.79 3.63037H179.198L195.039 30.6917L179.198 57.7531H20.79L4.94922 30.6917Z" fill="white" stroke="#111111" stroke-width="2.64013" />
              <path d="M45.0647 40.605H38.2006L41.3715 21.5048H48.1051C50.0263 21.5048 51.6211 21.8965 52.8894 22.6799C54.164 23.4633 55.0625 24.5856 55.5847 26.0467C56.107 27.5016 56.2003 29.2394 55.8645 31.2601C55.5412 33.2124 54.8977 34.888 53.934 36.2869C52.9703 37.6796 51.7361 38.7491 50.2314 39.4952C48.7268 40.235 47.0046 40.605 45.0647 40.605ZM42.8171 37.1449H45.2979C46.4978 37.1449 47.5486 36.9211 48.4501 36.4734C49.3579 36.0258 50.1009 35.3356 50.6791 34.403C51.2636 33.4704 51.677 32.2766 51.9195 30.8217C52.1495 29.4415 52.134 28.3223 51.8729 27.4643C51.618 26.6001 51.1237 25.969 50.39 25.5711C49.6563 25.1669 48.6926 24.9648 47.4989 24.9648H44.8409L42.8171 37.1449ZM57.3077 40.605L60.4787 21.5048H68.0143C69.4567 21.5048 70.6443 21.7597 71.5769 22.2696C72.5158 22.7794 73.1748 23.5037 73.5541 24.4426C73.9396 25.3752 74.0297 26.4757 73.8245 27.7441C73.6132 29.0124 73.1562 30.1005 72.4536 31.0083C71.7572 31.916 70.8495 32.6155 69.7303 33.1067C68.6174 33.5916 67.3273 33.8341 65.8599 33.8341H60.8144L61.374 30.5886H65.7573C66.5283 30.5886 67.1874 30.4829 67.7345 30.2715C68.2816 30.0601 68.7138 29.743 69.0309 29.3202C69.3542 28.8974 69.5656 28.372 69.665 27.7441C69.7707 27.1037 69.7334 26.569 69.5531 26.14C69.3728 25.7047 69.0464 25.3752 68.5739 25.1514C68.1013 24.9213 67.4796 24.8063 66.7086 24.8063H63.9853L61.346 40.605H57.3077ZM69.0588 31.9129L72.3697 40.605H67.9117L64.7035 31.9129H69.0588ZM81.9057 21.5048L78.7348 40.605H74.6965L77.8675 21.5048H81.9057ZM82.0573 40.605L85.2282 21.5048H97.8746L97.3151 24.8343H88.7069L87.9608 29.3855H95.7296L95.17 32.715H87.4012L86.0956 40.605H82.0573ZM112.389 21.5048H116.427L114.375 33.9087C114.145 35.3014 113.613 36.5201 112.78 37.5646C111.947 38.6092 110.887 39.4237 109.6 40.0081C108.313 40.5863 106.877 40.8754 105.291 40.8754C103.706 40.8754 102.369 40.5863 101.281 40.0081C100.193 39.4237 99.4065 38.6092 98.9215 37.5646C98.4365 36.5201 98.3091 35.3014 98.5391 33.9087L100.591 21.5048H104.629L102.624 33.5637C102.512 34.2911 102.568 34.9377 102.792 35.5035C103.022 36.0693 103.401 36.5139 103.93 36.8372C104.458 37.1605 105.111 37.3221 105.888 37.3221C106.672 37.3221 107.38 37.1605 108.015 36.8372C108.655 36.5139 109.18 36.0693 109.591 35.5035C110.007 34.9377 110.272 34.2911 110.383 33.5637L112.389 21.5048ZM116.578 40.605L119.749 21.5048H123.788L121.176 37.2755H129.365L128.805 40.605H116.578ZM131.479 40.605L134.65 21.5048H138.689L136.077 37.2755H144.266L143.706 40.605H131.479ZM145.996 21.5048H150.519L153.513 29.7306H153.718L159.416 21.5048H163.939L154.93 33.8528L153.802 40.605H149.792L150.92 33.8528L145.996 21.5048Z" fill="#111111" />
            </svg>
          </div>

          {/* Heading */}
          <h1 className={styles.heading}>
            {step === 1 ? 'Driver Application' : 'Driver Details'}
          </h1>
          <p className={styles.subheading}>
            {step === 1
              ? 'Please enter your referral code to proceed.'
              : 'Complete your registration by providing your details.'}
          </p>

          {errorMsg && (
            <div style={{ background: '#FEF2F2', borderLeft: '4px solid #EF4444', padding: '12px', marginBottom: '16px', textAlign: 'left', borderRadius: '4px' }}>
              <p style={{ fontSize: '14px', color: '#B91C1C', margin: 0 }}>{errorMsg}</p>
            </div>
          )}

          {successMsg && (
            <div style={{ background: '#ECFDF5', borderLeft: '4px solid #10B981', padding: '12px', marginBottom: '16px', textAlign: 'left', borderRadius: '4px' }}>
              <p style={{ fontSize: '14px', color: '#047857', margin: 0 }}>{successMsg}</p>
            </div>
          )}

          {step === 1 && !successMsg && (
            <form className={styles.form} onSubmit={handleVerifyReferral}>
              <div className={styles.form_group}>
                <label htmlFor="referral_code" className={styles.label}>
                  Referral Code
                </label>
                <div className={styles.input_wrapper}>
                  <input
                    type="text"
                    id="referral_code"
                    name="referral_code"
                    required
                    placeholder="e.g. DRI-AE-80080"
                    className={styles.input}
                    value={referralCode}
                    onChange={(e) => setReferralCode(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isValidating || !referralCode}
                className={styles.signin_btn}
                style={{ background: (!referralCode || isValidating) ? '#F3F4F6' : '#111827', color: (!referralCode || isValidating) ? '#9CA3AF' : '#FFFFFF' }}
              >
                {isValidating ? 'Validating...' : 'Validate Code'}
              </button>
            </form>
          )}

          {step === 2 && !successMsg && (
            <form className={styles.form} onSubmit={handleSubmitRegistration}>
              <div className={styles.form_group}>
                <label htmlFor="full_name" className={styles.label}>Full Name</label>
                <div className={styles.input_wrapper}>
                  <input
                    id="full_name"
                    name="full_name"
                    type="text"
                    required
                    className={styles.input}
                    value={formData.full_name}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className={styles.form_group}>
                <label htmlFor="email" className={styles.label}>Email Address</label>
                <div className={styles.input_wrapper}>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className={styles.input}
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className={styles.form_group}>
                <label htmlFor="phone_number" className={styles.label}>Phone Number</label>
                <div style={{ display: 'flex', border: '1px solid #E5E7EB', borderRadius: '8px' }}>
                  <div style={{ width: '130px', borderRight: '1px solid #E5E7EB', background: '#fff', borderTopLeftRadius: '8px', borderBottomLeftRadius: '8px' }}>
                    <CustomSelect
                      name="phonePrefix"
                      value={phonePrefix}
                      placeholder="+1"
                      options={phonePrefixOptions}
                      onChange={handleSelectChange}
                      variant="minimal"
                    />
                  </div>
                  <input
                    id="phone_number"
                    name="phone_number"
                    type="tel"
                    required
                    className={styles.input}
                    style={{ border: 'none', flex: 1, borderTopRightRadius: '8px', borderBottomRightRadius: '8px' }}
                    placeholder="(555) 000-0000"
                    value={formData.phone_number}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className={styles.form_group}>
                <label htmlFor="nin_number" className={styles.label}>NIN Number</label>
                <div className={styles.input_wrapper}>
                  <input
                    id="nin_number"
                    name="nin_number"
                    type="text"
                    required
                    className={styles.input}
                    value={formData.nin_number}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className={styles.form_group}>
                <label htmlFor="proof_of_identity_type" className={styles.label}>Proof of Identity Type</label>
                <div className={styles.input_wrapper}>
                  <CustomSelect
                    name="proof_of_identity_type"
                    value={formData.proof_of_identity_type}
                    placeholder="Select proof of identity type"
                    options={proofOfIdentityOptions}
                    onChange={handleSelectChange}
                    variant="minimal"
                  />
                </div>
              </div>

              <div className={styles.form_group}>
                <label htmlFor="driver_license" className={styles.label}>Driver License</label>
                <div className={styles.input_wrapper}>
                  <input
                    id="driver_license"
                    name="driver_license"
                    type="file"
                    required
                    className={styles.input}
                    style={{ padding: '8px', cursor: 'pointer' }}
                    onChange={handleFileChange}
                  />
                </div>
              </div>

              <div className={styles.form_group}>
                <label htmlFor="proof_of_identity" className={styles.label}>Proof of Identity Document</label>
                <div className={styles.input_wrapper}>
                  <input
                    id="proof_of_identity"
                    name="proof_of_identity"
                    type="file"
                    required
                    className={styles.input}
                    style={{ padding: '8px', cursor: 'pointer' }}
                    onChange={handleFileChange}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className={styles.signin_btn}
                  style={{ flex: 1, marginTop: 0, background: '#F3F4F6', color: '#111827' }}
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={styles.signin_btn}
                  style={{ flex: 2, marginTop: 0, background: isSubmitting ? '#F3F4F6' : '#111827', color: isSubmitting ? '#9CA3AF' : '#FFFFFF' }}
                >
                  {isSubmitting ? 'Submitting...' : 'Complete Registration'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className={styles.footer}>
        <p className={styles.copyright}>© 2026 Drifully. All rights reserved.</p>
        <div className={styles.socials}>
          <a href="#" className={styles.social_link} aria-label="X (Twitter)">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
          <a href="#" className={styles.social_link} aria-label="Facebook">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </a>
          <a href="#" className={styles.social_link} aria-label="Instagram">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
          </a>
        </div>
      </footer>
    </main>
  );
}
