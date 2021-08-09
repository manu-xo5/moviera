import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollWrapper({ children }) {
  const { pathname } = useLocation();

  useEffect(() => {
    const hash = window.location.hash;

    if (hash) {
      document.querySelector(hash).scrollIntoView({ behaviour: "smooth" });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return <>{children}</>;
}
