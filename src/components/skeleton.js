import React from "react";
import styles from "styles/skeleton.module.css";

export default function Skeleton({ className, ...props }) {
  return <span style={props} className={styles.skeleton}></span>;
}
