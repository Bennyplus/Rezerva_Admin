import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Contact Us | Drifully',
  description: 'Questions, issues, or special requests? Reach out and we\'ll get back to you quickly.',
};

export default function ContactUsPage() {
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
                      <select className="contact-form-select" defaultValue="+1">
                        <option value="+1">🇺🇸 +1</option>
                        <option value="+44">🇬🇧 +44</option>
                        <option value="+234">🇳🇬 +234</option>
                      </select>
                      <input type="tel" className="contact-form-input" placeholder="(555) 000-0000" />
                    </div>
                  </div>

                  <div className="contact-form-group">
                    <label className="contact-form-label">Subject</label>
                    <select className="contact-form-select" defaultValue="">
                      <option value="" disabled>Select a topic</option>
                      <option value="general_inquiry">General Inquiry</option>
                      <option value="booking_issue">Booking Issue</option>
                      <option value="chauffeur_service">Chauffeur Service</option>
                      <option value="support">Support</option>
                      <option value="other">Other</option>
                    </select>
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
