import { useState, useEffect } from "react";

const KEY = "finna-collection";

function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) ?? [];
  } catch {
    return [];
  }
}

export default function useCollection() {
  const [items, setItems] = useState(load);

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(items));
  }, [items]);

  const has = (id) => items.some((item) => item.id === id);

  const add = (item) =>
    setItems((prev) => (prev.some((i) => i.id === item.id) ? prev : [...prev, item]));

  const remove = (id) => setItems((prev) => prev.filter((i) => i.id !== id));

  return { items, has, add, remove };
}
