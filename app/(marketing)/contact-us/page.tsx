"use client";

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CustomSelect from '@/components/admin/CustomSelect';

const subjectOptions = [
  { value: "general_inquiry", label: "General Inquiry" },
  { value: "booking_issue", label: "Booking Issue" },
  { value: "chauffeur_service", label: "Chauffeur Service" },
  { value: "support", label: "Support" },
  { value: "other", label: "Other" },
];

const phonePrefixOptions = [
  { value: "+1", label: "🇺🇸 +1" },
  { value: "+44", label: "🇬🇧 +44" },
  { value: "+234", label: "🇳🇬 +234" },
];

export default function ContactUsPage() {
  const [subject, setSubject] = useState("");
  const [phonePrefix, setPhonePrefix] = useState("+1");

  const handleSelectChange = (name: string, value: string) => {
    if (name === "subject") {
      setSubject(value);
    } else if (name === "phonePrefix") {
      setPhonePrefix(value);
    }
  };

  return (
    <>
      <Navbar />
      <main className="contact-section">
        <div className="container">
          <div className="contact-grid">
            {/* Left Column */}
            <div className="contact-left">
              <h1 className="contact-title">We&rsquo;re here to help</h1>
              <p className="contact-desc">
                Questions, issues, or special requests? Reach out and we&rsquo;ll get back to you quickly.
              </p>

              <div className="contact-info-card">
                <div className="contact-info-title">Chat with us directly</div>
                <div className="contact-info-item">Email: support@drifully.com</div>
                <div className="contact-info-item">Phone: +234 255 473 4562</div>
              </div>
            </div>

            {/* Right Column (Form) */}
            <div className="contact-right">
              <div className="contact-form-card">
                <form>
                  <div className="contact-form-row">
                    <div className="contact-form-group">
                      <label className="contact-form-label">Full Name</label>
                      <input type="text" className="contact-form-input" placeholder="Enter full name" />
                    </div>
                    <div className="contact-form-group">
                      <label className="contact-form-label">Email Address</label>
                      <input type="email" className="contact-form-input" placeholder="Enter email address" />
                    </div>
                  </div>

                  <div className="contact-form-group">
                    <label className="contact-form-label">
                      Phone Number <span>(Optional)</span>
                    </label>
                    <div className="contact-phone-wrapper">
                      <div style={{ width: '100px', borderRight: '1px solid #E2E4E9' }}>
                        <CustomSelect
                          name="phonePrefix"
                          value={phonePrefix}
                          placeholder="+1"
                          options={phonePrefixOptions}
                          onChange={handleSelectChange}
                          variant="minimal"
                        />
                      </div>
                      <input type="tel" className="contact-form-input" placeholder="(555) 000-0000" />
                    </div>
                  </div>

                  <div className="contact-form-group">
                    <label className="contact-form-label">Subject</label>
                    <CustomSelect
                      name="subject"
                      value={subject}
                      placeholder="General Inquiry"
                      options={subjectOptions}
                      onChange={handleSelectChange}
                    />
                  </div>

                  <div className="contact-form-group">
                    <label className="contact-form-label">Message</label>
                    <textarea className="contact-form-textarea" placeholder="How can we help?"></textarea>
                  </div>

                  <button type="button" className="contact-submit-btn">
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
