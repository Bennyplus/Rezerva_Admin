import styles from "./StatCard.module.css";

interface StatCardProps {
  label: string;
  value: number | string;
  accent?: string;
  id?: string;
  growth?: string;
  isPositive?: boolean;
}

export default function StatCard({ label, value, accent, id, growth, isPositive }: StatCardProps) {
  return (
    <div className={styles.card} id={id}>
      <span className={styles.label}>{label}</span>
      <div className={styles.valueArea}>
        <div className={styles.valueRow}>
          <span className={styles.value}>{value}</span>
          {growth && (
            <span className={`${styles.growth} ${isPositive ? styles.positive : styles.negative}`}>
              {growth}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
