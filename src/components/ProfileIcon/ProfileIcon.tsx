import styles from "./ProfileIcon.module.css";

export default function ProfileIcon() {
  return (
    <div className={styles.profileContainer}>
      <span className={styles.nameText}>Hamza Zain</span>
      <div className={styles.profileIcon}>
        <div className={styles.whiteOutline}>
          <div className={styles.blackRing}>
            <div className={styles.gradientCircle}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
