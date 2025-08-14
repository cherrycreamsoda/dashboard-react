import styles from "./TimeframeButtons.module.css";

interface TimeframeButtonsProps {
  viewMode: "yearly" | "monthly" | "weekly";
  onViewModeChange: (mode: "yearly" | "monthly" | "weekly") => void;
}

export default function TimeframeButtons({
  viewMode,
  onViewModeChange,
}: TimeframeButtonsProps) {
  return (
    <div className={styles.viewToggleContainer}>
      <button
        className={`${styles.viewButton} ${
          viewMode === "yearly" ? styles.viewActive : styles.viewInactive
        }`}
        onClick={() => onViewModeChange("yearly")}
        disabled={true} // Coming soon
      >
        Y
      </button>
      <button
        className={`${styles.viewButton} ${
          viewMode === "monthly" ? styles.viewActive : styles.viewInactive
        }`}
        onClick={() => onViewModeChange("monthly")}
      >
        M
      </button>
      <button
        className={`${styles.viewButton} ${
          viewMode === "weekly" ? styles.viewActive : styles.viewInactive
        }`}
        onClick={() => onViewModeChange("weekly")}
      >
        W
      </button>
    </div>
  );
}
