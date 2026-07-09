import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Cancellation Policy | Drifully",
  description: "Drifully Reservation Cancellation, Modification & Refund Policy",
};

export default function CancellationPolicyPage() {
  return (
    <main>
      <Navbar />

      <div className={styles.container}>
        <h1 className={styles.title}>DRIFULLY RESERVATION CANCELLATION, MODIFICATION &amp; REFUND POLICY</h1>
        <p className={styles.effectiveDate}>Effective Date: 04--072026</p>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>1. PURPOSE</h2>
          <p className={styles.text}>
            This Reservation Cancellation, Modification &amp; Refund Policy (&quot;Policy&quot;) governs all vehicle reservations made with Drifully (&quot;Company,&quot; &quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). It explains how reservations may be canceled, modified, refunded, or forfeited.
            By booking a vehicle through Drifully&apos;s website, mobile application, customer support, or any authorized booking channel, you agree to this Policy.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>2. 24-HOUR RISK-FREE CANCELLATION</h2>
          <p className={styles.text}>Customers may cancel a reservation within 24 hours of booking and receive a 100% refund, provided that:</p>
          <ul className={styles.list}>
            <li className={styles.listItem}>the reservation was made at least 48 hours before pickup;</li>
            <li className={styles.listItem}>the vehicle has not been picked up;</li>
            <li className={styles.listItem}>no delivery or chauffeur dispatch has already occurred.</li>
          </ul>
          <p className={styles.text}>No cancellation fee applies.</p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>3. STANDARD CANCELLATION</h2>
          <p className={styles.text}>After the grace period:</p>

          <h3 className={styles.subSectionTitle}>More than 48 Hours Before Pickup</h3>
          <p className={styles.text}>Cancellation Fee:</p>
          <ul className={styles.list}>
            <li className={styles.listItem}>10% of the total reservation amount</li>
            <li className={styles.listItem}>Remaining balance refunded.</li>
          </ul>

          <h3 className={styles.subSectionTitle}>Within 48 Hours Before Pickup</h3>
          <p className={styles.text}>Cancellation Fee:</p>
          <ul className={styles.list}>
            <li className={styles.listItem}>25% of the total reservation amount OR one rental day, whichever is greater.</li>
            <li className={styles.listItem}>Remaining balance refunded.</li>
          </ul>

          <h3 className={styles.subSectionTitle}>Same-Day Cancellation</h3>
          <p className={styles.text}>If cancelled before the pickup time:</p>
          <p className={styles.text}>Customer forfeits</p>
          <ul className={styles.list}>
            <li className={styles.listItem}>50% of the total reservation cost.</li>
          </ul>

          <h3 className={styles.subSectionTitle}>After Pickup Time</h3>
          <p className={styles.text}>Reservation is considered a Late Cancellation/No-Show and applicable penalties apply.</p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>4. RESERVATION HOLD POLICY</h2>
          <p className={styles.text}>Drifully understands that travel delays can occur.</p>

          <h3 className={styles.subSectionTitle}>Self-Drive Rentals</h3>
          <p className={styles.text}>Your reservation will be held for:</p>
          <p className={styles.text}>Up to 2 hours after your scheduled pickup time.</p>
          <p className={styles.text}>After two hours:</p>
          <ul className={styles.list}>
            <li className={styles.listItem}>reservation may be cancelled;</li>
            <li className={styles.listItem}>vehicle may be released to another customer;</li>
            <li className={styles.listItem}>no-show fees may apply.</li>
          </ul>

          <h3 className={styles.subSectionTitle}>Chauffeur Bookings</h3>
          <p className={styles.text}>Drivers will wait:</p>
          <ul className={styles.list}>
            <li className={styles.listItem}>30 minutes for city pickups.</li>
            <li className={styles.listItem}>60 minutes for airport pickups (unless flight tracking indicates delays).</li>
          </ul>
          <p className={styles.text}>Waiting charges may begin after the complimentary waiting period.</p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>5. RESCHEDULING POLICY</h2>
          <p className={styles.text}>Instead of cancelling, customers may request to reschedule.</p>

          <h3 className={styles.subSectionTitle}>One Complimentary Change</h3>
          <p className={styles.text}>Each reservation qualifies for:</p>
          <p className={styles.text}>One free date or time change provided the request is received at least: 48 hours before pickup.</p>

          <p className={styles.text}>Additional changes may incur:</p>
          <ul className={styles.list}>
            <li className={styles.listItem}>administrative fee;</li>
            <li className={styles.listItem}>rate difference;</li>
            <li className={styles.listItem}>seasonal price adjustment.</li>
          </ul>
          <p className={styles.text}>Rescheduling is subject to vehicle availability.</p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>6. VEHICLE UPGRADE OR DOWNGRADE</h2>
          <p className={styles.text}>Changing vehicle class after confirmation may result in:</p>
          <ul className={styles.list}>
            <li className={styles.listItem}>higher rental rates;</li>
            <li className={styles.listItem}>lower rental rates;</li>
            <li className={styles.listItem}>different security deposits;</li>
            <li className={styles.listItem}>updated insurance pricing.</li>
          </ul>
          <p className={styles.text}>Availability is not guaranteed.</p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>7. EARLY RETURN POLICY</h2>
          <p className={styles.text}>Customers may return the vehicle before the scheduled end of the rental. However:</p>
          <ul className={styles.list}>
            <li className={styles.listItem}>unused rental days are generally non-refundable;</li>
            <li className={styles.listItem}>discounted packages remain non-refundable;</li>
            <li className={styles.listItem}>monthly rentals may be recalculated using applicable daily or weekly rates if returned significantly earlier than agreed.</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>8. NO-SHOW POLICY</h2>
          <p className={styles.text}>A reservation becomes a No-Show when:</p>
          <ul className={styles.list}>
            <li className={styles.listItem}>customer fails to arrive within the reservation hold period;</li>
            <li className={styles.listItem}>customer cannot present required identification;</li>
            <li className={styles.listItem}>driver&apos;s license is invalid;</li>
            <li className={styles.listItem}>payment authorization fails;</li>
            <li className={styles.listItem}>customer cannot meet Drifully eligibility requirements.</li>
          </ul>
          <p className={styles.text}>Penalty: Customer forfeits:</p>
          <ul className={styles.list}>
            <li className={styles.listItem}>first rental day;</li>
            <li className={styles.listItem}>reservation processing fee;</li>
            <li className={styles.listItem}>delivery fee (if already incurred).</li>
          </ul>
          <p className={styles.text}>Remaining balance may be refunded where applicable.</p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>9. REFUND POLICY</h2>
          <p className={styles.text}>Approved refunds are processed back to the original payment method. Estimated processing times:</p>
          <ul className={styles.list}>
            <li className={styles.listItem}>Debit/Credit Cards: 5–10 business days</li>
            <li className={styles.listItem}>Bank Transfers: 3–7 business days</li>
            <li className={styles.listItem}>Digital Wallets: 1–5 business days</li>
          </ul>
          <p className={styles.text}>Processing times depend on financial institutions.</p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>10. NON-REFUNDABLE ITEMS</h2>
          <p className={styles.text}>Unless required by law, the following charges are non-refundable once incurred:</p>
          <ul className={styles.list}>
            <li className={styles.listItem}>booking fees;</li>
            <li className={styles.listItem}>delivery charges;</li>
            <li className={styles.listItem}>airport pickup fees;</li>
            <li className={styles.listItem}>chauffeur dispatch fees;</li>
            <li className={styles.listItem}>administrative fees;</li>
            <li className={styles.listItem}>activated insurance premiums;</li>
            <li className={styles.listItem}>tolls;</li>
            <li className={styles.listItem}>traffic violations;</li>
            <li className={styles.listItem}>parking tickets;</li>
            <li className={styles.listItem}>fuel replacement;</li>
            <li className={styles.listItem}>cleaning fees;</li>
            <li className={styles.listItem}>smoking penalties;</li>
            <li className={styles.listItem}>pet cleaning charges on pet allowed vehicles;</li>
            <li className={styles.listItem}>government taxes already remitted.</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>11. TRAVEL DISRUPTION POLICY</h2>
          <p className={styles.text}>Because Drifully primarily serves travelers and members of the Nigerian diaspora, we recognize that unforeseen travel disruptions may occur. Customers affected by:</p>
          <ul className={styles.list}>
            <li className={styles.listItem}>airline cancellations;</li>
            <li className={styles.listItem}>significant flight delays;</li>
            <li className={styles.listItem}>missed international connections;</li>
            <li className={styles.listItem}>airport closures;</li>
            <li className={styles.listItem}>immigration processing delays;</li>
            <li className={styles.listItem}>visa issuance delays;</li>
            <li className={styles.listItem}>baggage delays that materially affect travel;</li>
          </ul>
          <p className={styles.text}>may request relief from cancellation penalties. Supporting documentation may be required.</p>
          <p className={styles.text}>Drifully may, at its sole discretion:</p>
          <ul className={styles.list}>
            <li className={styles.listItem}>waive cancellation fees;</li>
            <li className={styles.listItem}>issue a travel credit;</li>
            <li className={styles.listItem}>reschedule the reservation;</li>
            <li className={styles.listItem}>provide a full or partial refund.</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>12. DIASPORA FLEX POLICY</h2>
          <p className={styles.text}>As part of Drifully&apos;s commitment to serving Nigerians living abroad and international visitors: Eligible customers whose flights are delayed by more than six hours may receive:</p>
          <ul className={styles.list}>
            <li className={styles.listItem}>one complimentary reservation modification;</li>
            <li className={styles.listItem}>adjusted pickup time;</li>
            <li className={styles.listItem}>pickup date extension;</li>
            <li className={styles.listItem}>vehicle substitution (if required).</li>
          </ul>
          <p className={styles.text}>Vehicle availability cannot be guaranteed. Flight confirmation or airline documentation may be required.</p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>13. SPECIAL EVENT BOOKINGS</h2>
          <p className={styles.text}>Bookings made during:</p>
          <ul className={styles.list}>
            <li className={styles.listItem}>Christmas</li>
            <li className={styles.listItem}>New Year</li>
            <li className={styles.listItem}>Easter</li>
            <li className={styles.listItem}>Eid celebrations</li>
            <li className={styles.listItem}>Major festivals</li>
            <li className={styles.listItem}>Elections</li>
            <li className={styles.listItem}>National holidays</li>
            <li className={styles.listItem}>International conferences</li>
            <li className={styles.listItem}>Sporting events</li>
          </ul>
          <p className={styles.text}>may require:</p>
          <ul className={styles.list}>
            <li className={styles.listItem}>higher deposits;</li>
            <li className={styles.listItem}>minimum rental periods;</li>
            <li className={styles.listItem}>earlier cancellation deadlines;</li>
            <li className={styles.listItem}>stricter refund rules.</li>
          </ul>
          <p className={styles.text}>These conditions will be displayed before payment.</p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>14. VEHICLE DELIVERY CANCELLATIONS</h2>
          <p className={styles.text}>Where vehicle delivery has been scheduled: If cancellation occurs after the driver has departed, the customer remains responsible for:</p>
          <ul className={styles.list}>
            <li className={styles.listItem}>delivery costs;</li>
            <li className={styles.listItem}>driver transportation;</li>
            <li className={styles.listItem}>parking;</li>
            <li className={styles.listItem}>tolls;</li>
            <li className={styles.listItem}>logistics expenses already incurred.</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>15. AIRPORT DELIVERY CANCELLATIONS</h2>
          <p className={styles.text}>For airport pickups: After Drifully personnel arrive at the airport, the following may become non-refundable:</p>
          <ul className={styles.list}>
            <li className={styles.listItem}>airport parking;</li>
            <li className={styles.listItem}>airport access fees;</li>
            <li className={styles.listItem}>driver waiting charges;</li>
            <li className={styles.listItem}>delivery fee.</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>16. CHAUFFEUR RESERVATIONS</h2>
          <p className={styles.text}>More than 24 hours before pickup:</p>
          <ul className={styles.list}>
            <li className={styles.listItem}>Full refund.</li>
          </ul>
          <p className={styles.text}>Less than 24 hours:</p>
          <ul className={styles.list}>
            <li className={styles.listItem}>30% cancellation fee.</li>
          </ul>
          <p className={styles.text}>Within 6 hours:</p>
          <ul className={styles.list}>
            <li className={styles.listItem}>50% cancellation fee.</li>
          </ul>
          <p className={styles.text}>After chauffeur dispatch:</p>
          <ul className={styles.list}>
            <li className={styles.listItem}>Dispatch costs are non-refundable.</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>17. CANCELLATION BY DRIFULLY</h2>
          <p className={styles.text}>Drifully may cancel reservations where:</p>
          <ul className={styles.list}>
            <li className={styles.listItem}>vehicle becomes mechanically unavailable;</li>
            <li className={styles.listItem}>accident or theft occurs;</li>
            <li className={styles.listItem}>fraud is suspected;</li>
            <li className={styles.listItem}>payment authorization fails;</li>
            <li className={styles.listItem}>identity verification cannot be completed;</li>
            <li className={styles.listItem}>customer violates our Terms of Use.</li>
          </ul>
          <p className={styles.text}>Where cancellation is solely due to Drifully&apos;s operational reasons, customers will receive either:</p>
          <ul className={styles.list}>
            <li className={styles.listItem}>a full refund; or</li>
            <li className={styles.listItem}>a comparable replacement vehicle (subject to availability).</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>18. FORCE MAJEURE</h2>
          <p className={styles.text}>Cancellation penalties may be waived when performance is affected by events beyond reasonable control, including:</p>
          <ul className={styles.list}>
            <li className={styles.listItem}>natural disasters;</li>
            <li className={styles.listItem}>terrorism;</li>
            <li className={styles.listItem}>civil unrest;</li>
            <li className={styles.listItem}>pandemics;</li>
            <li className={styles.listItem}>government restrictions;</li>
            <li className={styles.listItem}>war;</li>
            <li className={styles.listItem}>widespread transportation shutdowns.</li>
          </ul>
          <p className={styles.text}>Supporting evidence may be requested.</p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>19. REPEATED CANCELLATIONS</h2>
          <p className={styles.text}>Customers who repeatedly reserve and cancel vehicles may have:</p>
          <ul className={styles.list}>
            <li className={styles.listItem}>reservation privileges restricted;</li>
            <li className={styles.listItem}>deposits increased;</li>
            <li className={styles.listItem}>bookings declined;</li>
            <li className={styles.listItem}>accounts suspended.</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>20. ABUSE OF THE CANCELLATION POLICY</h2>
          <p className={styles.text}>Drifully reserves the right to investigate and prevent abuse, including:</p>
          <ul className={styles.list}>
            <li className={styles.listItem}>repeated speculative bookings;</li>
            <li className={styles.listItem}>duplicate reservations;</li>
            <li className={styles.listItem}>fraudulent chargebacks;</li>
            <li className={styles.listItem}>misuse of promotional discounts;</li>
            <li className={styles.listItem}>intentional vehicle blocking.</li>
          </ul>
          <p className={styles.text}>Accounts may be suspended or permanently terminated.</p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>21. HOW TO CANCEL</h2>
          <p className={styles.text}>Reservations may be cancelled through:</p>
          <ul className={styles.list}>
            <li className={styles.listItem}>Drifully Mobile App</li>
            <li className={styles.listItem}>Drifully Website</li>
            <li className={styles.listItem}>Customer Support</li>
            <li className={styles.listItem}>Email</li>
            <li className={styles.listItem}>Telephone</li>
          </ul>
          <p className={styles.text}>Cancellation becomes effective only after confirmation from Drifully.</p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>22. CONTACT INFORMATION</h2>
          <div className={styles.contactInfo}>
            <p className={styles.text}>
              <strong>Company Name:</strong> Drifully Customer Support<br />
              <strong>Email:</strong> drifully@gmail.com<br />
              <strong>Phone:</strong> +234 7039344411<br />
              <strong>Website:</strong> www.drifullyrentals.com
            </p>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>23. POLICY CHANGES</h2>
          <p className={styles.text}>Drifully reserves the right to amend this Policy at any time. Any revisions will be published on our website and mobile applications. Unless otherwise required by law, the version in effect at the time of booking will govern that reservation.</p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>CUSTOMER ACKNOWLEDGEMENT</h2>
          <p className={styles.text}>By completing a reservation with Drifully, you acknowledge that you have read, understood, and agree to be bound by this Reservation Cancellation, Modification &amp; Refund Policy.</p>
        </section>

      </div>

      <Footer />
    </main>
  );
}

