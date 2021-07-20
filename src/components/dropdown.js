import { useEffect, useRef, useState } from "react";
import styles from "styles/dropdown.module.css";

export default function Dropdown({ label, children }) {
  const parentRef = useRef();
  const [show, setShow] = useState(false);

  useEffect(() => {
    function handleCloseDropdown(ev) {
      /** @type {HTMLDivElement} */
      const parent = parentRef.current;
      if (!parent) return;

      if (parent.contains(ev.target)) return;
      setShow(false);
    }

    window.addEventListener("click", handleCloseDropdown);

    return () => window.removeEventListener("click", handleCloseDropdown);
  }, []);

  return (
    <div ref={parentRef}>
      <span onClick={() => setShow((p) => !p)}>{label}</span>
      <div style={{ display: show ? "" : "none" }} className={styles.dropdown}>
        {children}
      </div>
    </div>
  );
}
