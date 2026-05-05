import Image from "next/image";
import Link from "next/link";
import DownloadButtons from "./DownloadButtons";

export default function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-heading">
      <div className="container">
        <div className="hero__inner">
          <div className="hero__left">
            {/* ── Headline & Description ── */}
            <div className="hero__copy-top">
              <h1 id="hero-heading" className="hero__headline">
                Rent a car, your way.
                <br />
                Anytime, anywhere.
              </h1>

              <p className="hero__description">
                Drive yourself or get a chauffeur, book in seconds with Drifully. Fast, flexible, and hassle-free.
              </p>
            </div>

            {/* ── Actions & Meta ── */}
            <div className="hero__copy-bottom">
              <DownloadButtons variant="hero" />

              <p className="hero__meta">
                Available for trips, events, business, and more.
              </p>
            </div>
          </div>

          {/* ── App Mockup (Beneath description on mobile) ── */}
          <div className="hero__visual" aria-hidden="true">
            <div className="hero__mockup-wrapper">
              <div className="hero__blob hero__blob--top" />
              <div className="hero__blob hero__blob--bottom" />

              <Image
                src="https://prosper-django-bucket.s3.us-east-2.amazonaws.com/iPhone.svg"
                alt="Drifully app on a phone showing available cars"
                width={580}
                height={600}
                priority
                className="hero__img"
              />

              <FloatingBadge
                className="hero__badge--1"
                iconSrc="/images/book.png"
                text="Book in Seconds"
              />
              <FloatingBadge
                className="hero__badge--2"
                iconSrc="/images/trust.png"
                text="Trusted &amp; Reliable"
              />
              <FloatingBadge
                className="hero__badge--3"
                iconSrc="/images/car.png"
                text="Drive Yourself or Chauffeur"
              />
            </div>
          </div>


        </div>

      </div>

      {/* Float animation is declared in globals.css */}
    </section>
  );
}

/* ── Floating badge component ── */
function FloatingBadge({
  className,
  iconSrc,
  text,
}: {
  className: string;
  iconSrc: string;
  text: string;
}) {
  return (
    <div className={`hero__badge ${className}`}>
      <div className="hero__badge-icon" aria-hidden="true">
        <Image src={iconSrc} alt="" width={36} height={36} />
      </div>
      <span
        className="hero__badge-text"
        dangerouslySetInnerHTML={{ __html: text }}
      />
    </div>
  );
}


/* ── Icon components ── */
function GooglePlayIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M3.18 23.76a2 2 0 0 0 2.25-.43l12.84-7.41-3.23-3.23L3.18 23.76zM21.37 10.22l-2.8-1.62-3.61 3.61 3.61 3.61 2.82-1.63a2.01 2.01 0 0 0 0-3.97zM2.01 1.15A2 2 0 0 0 2 2v20a2 2 0 0 0 .01.85l11.27-11.27L2.01 1.15zM18.27 2.66 5.43.06a2 2 0 0 0-2.25.44l11.66 11.66 3.43-3.5z" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  );
}
