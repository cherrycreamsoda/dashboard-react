"use client";
import styles from "./WelcomeBack.module.css";

interface WelcomeBackProps {
  onDataTypeChange: (type: "income" | "expense") => void;
  activeDataType: "income" | "expense";
  incomeTotal: number;
  expenseTotal: number;
  viewMode: "yearly" | "monthly" | "weekly";
  onViewModeChange: (mode: "yearly" | "monthly" | "weekly") => void;
}

export default function WelcomeBack({
  onDataTypeChange,
  activeDataType,
  incomeTotal,
  expenseTotal,
  viewMode,
  onViewModeChange,
}: WelcomeBackProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className={styles.welcomeContainer}>
      <h1 className={styles.welcomeTitle}>Welcome Back!</h1>
      <div className={styles.tagsContainer}>
        <button
          className={`${styles.dataButton} ${
            activeDataType === "income" ? styles.active : styles.inactive
          }`}
          onClick={() => onDataTypeChange("income")}
        >
          <span className={styles.tagText}>
            Income: {formatCurrency(incomeTotal)}
          </span>
        </button>
        <button
          className={`${styles.dataButton} ${
            activeDataType === "expense" ? styles.active : styles.inactive
          }`}
          onClick={() => onDataTypeChange("expense")}
        >
          <span className={styles.tagText}>
            Expense: {formatCurrency(expenseTotal)}
          </span>
        </button>
      </div>

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
    </div>
  );
}
