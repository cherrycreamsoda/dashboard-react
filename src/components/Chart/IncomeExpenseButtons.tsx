"use client";

import styles from "./IncomeExpenseButtons.module.css";

interface IncomeExpenseButtonsProps {
  onDataTypeChange: (type: "income" | "expense") => void;
  activeDataType: "income" | "expense";
  incomeTotal: number;
  expenseTotal: number;
}

export default function IncomeExpenseButtons({
  onDataTypeChange,
  activeDataType,
  incomeTotal,
  expenseTotal,
}: IncomeExpenseButtonsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className={styles.tagsContainer}>
      <button
        className={`${styles.dataButton} ${styles.incomeButton} ${
          activeDataType === "income" ? styles.active : styles.inactive
        }`}
        onClick={() => onDataTypeChange("income")}
      >
        <span className={styles.tagText}>
          Income: {formatCurrency(incomeTotal)}
        </span>
      </button>
      <button
        className={`${styles.dataButton} ${styles.expenseButton} ${
          activeDataType === "expense" ? styles.active : styles.inactive
        }`}
        onClick={() => onDataTypeChange("expense")}
      >
        <span className={styles.tagText}>
          Expense: {formatCurrency(expenseTotal)}
        </span>
      </button>
    </div>
  );
}
