import { useEffect, useRef, useSyncExternalStore } from 'react';
import { useLocation } from 'react-router-dom';

export interface PageSEOOptions {
  title: string;
  description?: string;
  path?: string; // canonical path, e.g. "/about"
  ogImage?: string;
  ogType?: 'website' | 'article' | 'video.other';
}

interface PageSEOEntry extends PageSEOOptions { locationKey: string; }
const entries = new Map<symbol, PageSEOEntry>();
const listeners = new Set<() => void>();
let snapshot: PageSEOEntry | undefined;
const publish = () => {
  snapshot = [...entries.values()].at(-1);
  listeners.forEach((listener) => listener());
};
const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
};
export const usePageSEOState = () => useSyncExternalStore(subscribe, () => snapshot, () => undefined);

/**
 * Registers route metadata for the single Helmet-backed PageSEOHead.
 * Existing page callers retain this hook; unmounting clears their metadata.
 */
export function usePageSEO({ title, description, path, ogImage, ogType = 'website' }: PageSEOOptions) {
  const owner = useRef(Symbol('page-seo'));
  const { key: locationKey, pathname } = useLocation();
  useEffect(() => {
    const id = owner.current;
    entries.set(id, { title, description, path: path ?? pathname, ogImage, ogType, locationKey });
    publish();
    return () => { entries.delete(id); publish(); };
  }, [title, description, path, ogImage, ogType, locationKey, pathname]);
}
