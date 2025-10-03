'use client'

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [pathname]); // run after navigation

  return <>{children}</>;
}
