"use client";
import styles from "./WelcomeBack.module.css";

interface WelcomeBackProps {
  onDataTypeChange: (type: "income" | "expense") => void;
  activeDataType: "income" | "expense";
  incomeTotal: number;
  expenseTotal: number;
}

export default function WelcomeBack({
  onDataTypeChange,
  activeDataType,
  incomeTotal,
  expenseTotal,
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
    </div>
  );
}
