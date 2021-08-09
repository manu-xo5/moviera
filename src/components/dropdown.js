import { ChevronDownIcon } from "@heroicons/react/solid";
import { cloneElement, useEffect, useRef, useState } from "react";
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

  const labelWithChevron = cloneElement(label, {
    ...label.props,
    children: [
      label.props.children,
      <ChevronDownIcon
        className={`${styles.icon} ${show ? styles.iconRotate : ""}`}
      />,
    ],
  });

  return (
    <div ref={parentRef}>
      <span className={styles.label} onClick={() => setShow((p) => !p)}>
        {labelWithChevron}
      </span>
      <div
        className={`${styles.dropdown} ${show ? styles.open : styles.close}`}
      >
        {children}
      </div>
    </div>
  );
}
