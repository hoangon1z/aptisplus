"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const DocumentEntryContext = createContext(false);

/** Lives in the root layout: resets on a document load, survives client routing. */
export function DocumentEntryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [entryPath] = useState(pathname);
  const [leftEntry, setLeftEntry] = useState(false);

  useEffect(() => {
    if (pathname !== entryPath) setLeftEntry(true);
  }, [pathname, entryPath]);

  return (
    <DocumentEntryContext.Provider
      value={entryPath === "/" && pathname === "/" && !leftEntry}
    >
      {children}
    </DocumentEntryContext.Provider>
  );
}

export function useHomepageDocumentEntry() {
  return useContext(DocumentEntryContext);
}
