const STEPS = [
  {
    number: "01",
    title: "Pick A Ride",
    description:
      "Browse hundreds of vehicles and filter by type, feature, price and more.",
    visual: "phone-mockup",
  },
  {
    number: "02",
    title: "Select Dates",
    description:
      "Set your pickup and return time based on when you need the car",
    visual: "date-picker",
  },
  {
    number: "03",
    title: "Confirm & Go",
    description:
      "Review your details, book instantly, and get ready to hit the road without delays",
    visual: "confirm",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="howitworks"
      aria-labelledby="how-heading"
    >
      <picture className="howitworks__trackmark">
        <source media="(max-width: 768px)" srcSet="/images/trackmark-mobile.png" />
        <img
          src="/images/trackmark.png"
          alt=""
          aria-hidden="true"
        />
      </picture>
      <div className="container">
        {/* Header */}
        <header className="howitworks__header">
          <h2 id="how-heading" className="heading-2 howitworks__heading">
            Book in 3 simple steps
            <img
              src="/images/first_car-side.svg"
              className="howitworks__title-icon"
              alt=""
              aria-hidden="true"
            />
          </h2>
          <p>
            Get from booking to driving in just a few simple steps—quick,
            seamless, and designed for your convenience
          </p>
          <img
            src="/images/second_car-tilt.svg"
            className="step-card__top-left-icon"
            alt=""
            aria-hidden="true"
          />
        </header>

        {/* Steps */}
        <div className="howitworks__grid" role="list">
          {STEPS.map((step, i) => (
            <StepCard key={step.number} step={step} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StepCard({
  step,
  index,
}: {
  step: (typeof STEPS)[0];
  index: number;
}) {
  return (
    <article className="step-card" role="listitem" id={`step-${step.number}`}>
      {/* Watermark number */}
      {/* <span className="step-card__number" aria-hidden="true">
        {step.number}
      </span> */}

      {/* Title */}
      <h3 className="step-card__title">{step.title}</h3>

      {/* Visual area */}
      <div
        className="step-card__visual"
        aria-hidden="true"
        style={index === 0 ? { alignItems: "flex-end", paddingTop: "var(--space-8)" } : undefined}
      >
        {index === 0 && (
          <img
            src="/images/1st-card.svg"
            alt="Pick A Ride Phone"
            style={{ width: "71%", height: "auto", objectFit: "contain" }}
          />
        )}
        {index === 1 && <DatePickerMockup />}
        {index === 2 && <ConfirmMockup />}
      </div>


      {/* Description */}
      <p className="body-md step-card__desc">{step.description}</p>
    </article>
  );
}

/* ── Visual: date picker for Step 2 ── */
function DatePickerMockup() {
  return (
    <div
      style={{
        width: "85%",
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      <div className="date-picker-mock">
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <p className="date-picker-mock__label">Pick-up and Drop Off dates</p>
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.55rem",
              color: "var(--color-muted)",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              border: "1px solid var(--color-border)",
              borderRadius: "6px",
              padding: "4px",
            }}
          >
            Edit
            <img
              src="/icons/edit.png"
              alt="edit"
              style={{ width: "10px", height: "10px", objectFit: "contain" }}
            />
          </span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            paddingBottom: "var(--space-4)"
          }}
        >
          <span className="date-picker-mock__value">30 Mar 2025 - 11 May 2025</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ width: "47%", backgroundColor: "var(--color-surface)", padding: "var(--space-2)", borderRadius: "var(--radius-md)" }}>
            <p className="date-picker-mock__label">Daily Rate</p>
            <p className="date-picker-mock__total">$120</p>
          </div>
          <div style={{ width: "47%", backgroundColor: "var(--color-surface)", padding: "var(--space-2)", borderRadius: "var(--radius-md)" }}>
            <p className="date-picker-mock__label">Estimated Total</p>
            <p className="date-picker-mock__total">$240</p>
          </div>
        </div>
        <div className="date-picker-mock__avail">
          <span
            style={{
              width: "8px",
              height: "8px",
              backgroundColor: "#016630",
              borderRadius: "50%",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg
              width="5"
              height="5"
              viewBox="0 0 10 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2 5L4 7L8 3"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span>Great news — this vehicle is available for your selected dates</span>
        </div>
      </div>
    </div>
  );
}

/* ── Visual: booking confirmed for Step 3 ── */
export function ConfirmMockup(props: any) {
  return (
    <div className={`step-card__confirm-box ${props.className || ''}`} style={{ width: "77%", backgroundColor: "#ffffff", borderRadius: "var(--radius-xl)", ...props.style }}>
      <div className="step-card__confirm-icon-wrapper">
        <div className="step-card__confirm-pulse"></div>
        <div className="step-card__confirm-pulse-inner"></div>
        <div className="step-card__confirm-icon">
          <img src="/images/checkmark.svg" alt="Confirmed" aria-hidden="true" />
        </div>
      </div>
      <p className="step-card__confirm-title">Booking Confirmed 🎉</p>
      <p className="step-card__confirm-sub">
        Your vehicle has been successfully reserved for your selected dates.
      </p>
    </div>
  );
}
