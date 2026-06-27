"use client";

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CustomSelect from '@/components/admin/CustomSelect';
import { accountsService } from '@/services/accounts-service';



const subjectOptions = [
  { value: "general", label: "General Inquiry" },
  { value: "booking", label: "Booking Issue" },
  { value: "payment", label: "Payment Issue" },
  { value: "technical", label: "Technical Support" },
  { value: "complaint", label: "Complaint" },
  { value: "other", label: "Other" },
];

export default function ContactUsPage() {
  const [subject, setSubject] = useState("");
  const [phonePrefix, setPhonePrefix] = useState("");
  const [phonePrefixOptions, setPhonePrefixOptions] = useState<any[]>([]);
  const [countries, setCountries] = useState<any[]>([]);

  // Form states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");
  const [bookingId, setBookingId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadCountries() {
      try {
        const countriesData = await accountsService.getCountries();
        setCountries(countriesData);
        const options = countriesData.map(c => ({
          value: String(c.id),
          label: c.dial_code,
          icon: c.flag
        }));

        setPhonePrefixOptions(options);

        // Set US as default, or fallback to first
        const defaultCountry = countriesData.find(c => c.iso_code === "US") || countriesData[0];
        if (defaultCountry) {
          setPhonePrefix(String(defaultCountry.id));
        }
      } catch (error) {
        console.error("Failed to fetch countries for phone prefixes", error);
      }
    }
    loadCountries();
  }, []);

  const handleSelectChange = (name: string, value: string) => {
    if (name === "subject") {
      setSubject(value);
    } else if (name === "phonePrefix") {
      setPhonePrefix(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");
    setErrorMessage("");

    try {
      const countryId = phonePrefix ? parseInt(phonePrefix, 10) : 1;

      await accountsService.contactUs({
        full_name: fullName,
        email,
        phone_number: phoneNumber ? `${phoneNumber}` : undefined,
        country: countryId,
        subject: subject || "general",
        message: subject === "booking_issue" && bookingId ? `Booking ID: ${bookingId}\n\n${message}` : message
      });
      setSubmitStatus("success");
      setFullName("");
      setEmail("");
      setPhoneNumber("");
      setMessage("");
      setBookingId("");
      setSubject("");
    } catch (error: any) {
      console.error("Contact us error:", error);
      setSubmitStatus("error");
      setErrorMessage(error.response?.data?.message || "Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
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
              <div>
                <h1 className="contact-title">We&rsquo;re here to help</h1>
                <p className="contact-desc">
                  Questions, issues, or special requests? Reach out and we&rsquo;ll get back to you quickly.
                </p>
              </div>
            </div>

            {/* Right Column (Form) */}
            <div className="contact-right">
              <div className="contact-form-card">
                {submitStatus === "success" ? (
                  <div style={{ textAlign: "center", padding: "40px 20px" }}>
                    <h3 style={{ fontSize: "24px", marginBottom: "16px", color: "#0A0D14" }}>Message Sent Successfully!</h3>
                    <p style={{ color: "#4b5563" }}>Thank you for contacting us. We will get back to you shortly.</p>
                    <button
                      onClick={() => setSubmitStatus("idle")}
                      className="contact-submit-btn"
                      style={{ marginTop: "24px" }}
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="contact-form" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {submitStatus === "error" && (
                      <div style={{ padding: "12px", backgroundColor: "#fef2f2", color: "#ef4444", borderRadius: "8px", fontSize: "14px" }}>
                        {errorMessage}
                      </div>
                    )}
                    <div className="contact-form-row">
                      <div className="contact-form-group">
                        <label className="contact-form-label">Full Name</label>
                        <input
                          type="text"
                          className="contact-form-input"
                          placeholder="Enter full name"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          required
                        />
                      </div>
                      <div className="contact-form-group">
                        <label className="contact-form-label">Email Address</label>
                        <input
                          type="email"
                          className="contact-form-input"
                          placeholder="Enter email address"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="contact-form-group">
                      <label className="contact-form-label">
                        Phone Number <span>(Optional)</span>
                      </label>
                      <div className="contact-phone-wrapper">
                        <div style={{ width: '130px', borderRight: '1px solid #E2E4E9' }}>
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
                          type="tel"
                          className="contact-form-input"
                          placeholder="(555) 000-0000"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                        />
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

                    {subject === "booking_issue" && (
                      <div className="contact-form-group">
                        <label className="contact-form-label">Booking ID</label>
                        <input
                          type="text"
                          className="contact-form-input"
                          placeholder="Enter booking ID"
                          value={bookingId}
                          onChange={(e) => setBookingId(e.target.value)}
                          required
                        />
                      </div>
                    )}

                    <div className="contact-form-group">
                      <label className="contact-form-label">Message</label>
                      <textarea
                        className="contact-form-textarea"
                        placeholder="How can we help?"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                      />
                    </div>

                    <button type="submit" className="contact-submit-btn" disabled={isSubmitting}>
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Info card – sits below the form on mobile */}
            <div className="contact-info-card contact-info-card--bottom">
              <div className="contact-info-title">Chat with us directly</div>
              <div className="contact-info-item">Email: support@drifully.com</div>
              <div className="contact-info-item">Phone: +234 255 473 4562</div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
