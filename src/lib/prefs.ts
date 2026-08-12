"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Everything personal lives in localStorage: no accounts, no backend, nothing
 * that can leak. Each store is a key plus a tiny subscribe/notify pair so every
 * mounted component updates together.
 */

const listeners = new Map<string, Set<() => void>>();

function notify(key: string) {
  listeners.get(key)?.forEach((fn) => fn());
}

function subscribe(key: string, fn: () => void) {
  const set = listeners.get(key) ?? new Set();
  set.add(fn);
  listeners.set(key, set);

  // Another tab changed it.
  const onStorage = (event: StorageEvent) => {
    if (event.key === key) fn();
  };
  window.addEventListener("storage", onStorage);

  return () => {
    set.delete(fn);
    window.removeEventListener("storage", onStorage);
  };
}

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage blocked — the feature degrades to "this session only".
  }
  notify(key);
}

/**
 * Reads a stored value. `hydrated` is false on the first render so server and
 * client markup match; render skeletons or nothing until it flips.
 */
export function useStored<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(fallback);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const sync = () => setValue(read<T>(key, fallback));
    sync();
    setHydrated(true);
    return subscribe(key, sync);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const update = useCallback(
    (next: T) => {
      write(key, next);
      setValue(next);
    },
    [key]
  );

  return { value, setValue: update, hydrated };
}

/* --------------------------------------------------------- my semester */

export interface MySemester {
  department: string; // department.link, e.g. "/cse-ise-aiml"
  year: number;
  semester: number;
}

export const MY_SEMESTER_KEY = "knotes:my-semester";

export function useMySemester() {
  const { value, setValue, hydrated } = useStored<MySemester | null>(
    MY_SEMESTER_KEY,
    null
  );
  return { mine: value, setMine: setValue, hydrated };
}

/* ------------------------------------------------------------ bookmarks */

export const BOOKMARKS_KEY = "knotes:bookmarks";

export interface Bookmark {
  link: string;
  title: string;
  subject: string;
  path: string;
}

export function useBookmarks() {
  const { value, setValue, hydrated } = useStored<Bookmark[]>(BOOKMARKS_KEY, []);

  const has = useCallback(
    (link: string) => value.some((item) => item.link === link),
    [value]
  );

  const toggle = useCallback(
    (bookmark: Bookmark) =>
      setValue(
        value.some((item) => item.link === bookmark.link)
          ? value.filter((item) => item.link !== bookmark.link)
          : [bookmark, ...value]
      ),
    [value, setValue]
  );

  return { bookmarks: value, has, toggle, hydrated };
}

/* --------------------------------------------------------------- done */

export const DONE_KEY = "knotes:done";

/** Subject paths the reader has ticked off. */
export function useDone() {
  const { value, setValue, hydrated } = useStored<string[]>(DONE_KEY, []);

  const has = useCallback((path: string) => value.includes(path), [value]);

  const toggle = useCallback(
    (path: string) =>
      setValue(
        value.includes(path)
          ? value.filter((item) => item !== path)
          : [...value, path]
      ),
    [value, setValue]
  );

  return { done: value, has, toggle, hydrated };
}
