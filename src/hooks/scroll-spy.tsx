import { useEffect, useState } from "react";

export function useScrollSpy(sectionIds: string[], offset = 0) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const handler = () => {
      const scrollY = window.scrollY + offset + 1;

      const sections = sectionIds
        .map((id) => {
          const el = document.getElementById(id);
          if (!el) return { id, top: 0 };
          return { id, top: el.offsetTop };
        })
        .filter((s) => s.top <= scrollY);

      if (sections.length > 0) {
        const current = sections[sections.length - 1];
        setActiveId(current.id);
      } else {
        setActiveId(sectionIds[0]);
      }
    };

    window.addEventListener("scroll", handler, { passive: true });
    handler(); // run on mount

    return () => window.removeEventListener("scroll", handler);
  }, [sectionIds, offset]);

  return activeId;
}
