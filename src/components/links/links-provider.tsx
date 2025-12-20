'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { mockLinks, type LinkData } from '@/components/dashboard/mock-data';

interface LinksContextType {
  links: LinkData[];
  addLink: (link: LinkData) => void;
}

const LinksContext = createContext<LinksContextType | undefined>(undefined);

export function LinksProvider({ children }: { children: ReactNode }) {
  const [links, setLinks] = useState<LinkData[]>(mockLinks);

  const addLink = (link: LinkData) => {
    setLinks((prevLinks) => [link, ...prevLinks]);
  };

  return (
    <LinksContext.Provider value={{ links, addLink }}>
      {children}
    </LinksContext.Provider>
  );
}

export function useLinks() {
  const context = useContext(LinksContext);
  if (context === undefined) {
    throw new Error('useLinks must be used within a LinksProvider');
  }
  return context;
}
