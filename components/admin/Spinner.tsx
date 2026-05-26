import styles from "./Spinner.module.css";

interface SpinnerProps {
  size?: number;
  className?: string;
  color?: string;
}

export default function Spinner({ size = 24, className = "", color }: SpinnerProps) {
  return (
    <svg
      className={`${styles.spinner} ${className}`}
      width={size}
      height={size}
      viewBox="0 0 50 50"
      fill="none"
      stroke="currentColor"
      style={color ? { color } : undefined}
    >
      <circle
        className={styles.path}
        cx="25"
        cy="25"
        r="20"
        strokeWidth="5"
      ></circle>
    </svg>
  );
}
