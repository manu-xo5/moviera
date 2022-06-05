import { useEffect } from "react";
import { useRouter } from "next/router";

export default function ScrollWrapper({ children }) {
  const { pathname } = useRouter();


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
