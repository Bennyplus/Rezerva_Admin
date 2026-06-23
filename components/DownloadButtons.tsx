"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

interface DownloadButtonsProps {
  variant?: "hero" | "cta" | "footer" | "default";
  playIconSrc?: string;
  appIconSrc?: string;
}

export default function DownloadButtons({
  variant = "default",
  playIconSrc = "/icons/google-play.svg",
  appIconSrc = "/icons/apple.svg"
}: DownloadButtonsProps) {
  const [os, setOs] = useState<"ios" | "android" | "desktop">("desktop");

  const GOOGLE_PLAY_URL = "https://play.google.com/store/apps/details?id=com.drifully.app";
  const APP_STORE_URL = "https://apps.apple.com/app/idYOUR_APP_ID"; // Placeholder

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    if (/android/i.test(userAgent)) {
      setOs("android");
    } else if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) {
      setOs("ios");
    } else {
      setOs("desktop");
    }
  }, []);

  const handleStoreClick = (e: React.MouseEvent<HTMLAnchorElement>, targetStore: "play" | "app") => {
    // If on mobile, route to the correct store regardless of which button was clicked
    if (os === "android") {
      e.preventDefault();
      window.open(GOOGLE_PLAY_URL, "_blank");
    } else if (os === "ios") {
      e.preventDefault();
      window.open(APP_STORE_URL, "_blank");
    }
    // If on desktop, let the default href behavior proceed (goes to targetStore)
  };

  let containerClass = "download-buttons";
  let playClass = "btn btn-primary";
  let appClass = "btn";
  let playStyle = {};
  let appStyle = {};

  if (variant === "hero") {
    containerClass = "hero__actions";
    playClass = "btn btn-primary hero__play-btn";
    appClass = "btn hero__app-btn";
  } else if (variant === "cta") {
    containerClass = "cta-section__actions";
    playClass = "btn btn-white";
    appClass = "btn btn-ghost-white";
  } else if (variant === "footer") {
    containerClass = "footer__apps";
    playClass = "footer__app-btn footer__app-btn--dark";
    appClass = "footer__app-btn footer__app-btn--outline";
  } else if (variant === "default") {
    containerClass = "download-buttons-default";
    playClass = "btn btn-primary";
    appClass = "btn";
    playStyle = { display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#111', color: '#fff', padding: '12px 24px', borderRadius: '12px' };
    appStyle = { display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '12px', color: '#868C98' };
  }

  // mobileclass should exclude cta too
  const mobileClass = variant === "footer" || variant === "cta" ? "" : "mobile-dl-btn";

  return (
    <div className={containerClass} style={variant === "default" ? { display: 'flex', gap: 'var(--space-4)', justifyContent: 'center' } : {}}>
      <Link
        href={GOOGLE_PLAY_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Get Drifully on Google Play"
        className={`${playClass} ${mobileClass}`.trim()}
        style={playStyle}
        onClick={(e) => handleStoreClick(e, "play")}
      >
        <span>Get it on Google Play</span>
        <Image src={playIconSrc} alt="" width={18} height={18} />
      </Link>

      <Link
        href={APP_STORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Download Drifully on the App Store"
        className={`${appClass} ${mobileClass}`.trim()}
        style={appStyle}
        onClick={(e) => handleStoreClick(e, "app")}
      >
        <span>Download on App Store</span>
        <Image src={appIconSrc} alt="" width={18} height={18} />
      </Link>
    </div>
  );
}
