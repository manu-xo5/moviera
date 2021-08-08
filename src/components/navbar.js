import styles from "styles/navbar.module.css";
import Link from "components/link";
import { MenuIcon, XIcon, SearchIcon } from "@heroicons/react/solid";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { clsx } from "js/clsx";

export default function Navbar() {
  const [showMenu, setShowMenu] = useState(false);
  const history = useHistory();

  return (
    <nav className={styles.wrapper}>
      {/* Mobile Only MenuButton */}
      <MenuIcon className={styles.baseBtn} onClick={() => setShowMenu(true)} />

      {/* Logo */}
      <Link className={styles.logo} href="/">
        <span>Moviera</span>
      </Link>

      {/* Mobile Only SearchButton */}
      <SearchIcon
        className={styles.baseBtn}
        onClick={() => history.push("/search")}
      />

      {/* Menu */}
      <ul style={{ "--x": showMenu ? "0" : "-100%" }} className={styles.link}>
        <li>
          <XIcon
            className={clsx(styles.baseBtn, styles.xBtn)}
            onClick={() => setShowMenu(false)}
          />
        </li>
        {["search", "discover", "watchlist"].map((link) => (
          <li key={link} className={styles.linkItem}>
            <Link href={"/" + link}>{link}</Link>
          </li>
        ))}

        <li className={styles.linkItem}>
          <a href="https://github.com/manu-xo5/moviera">github</a>
        </li>
      </ul>
    </nav>
  );
}
