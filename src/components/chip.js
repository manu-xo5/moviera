import styles from "styles/chip.module.css";

export default function Chip({ children, color }) {
  return (
    <span style={{ "--color": color }} className={styles.chip}>
      {children}
    </span>
  );
}
