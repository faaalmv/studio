"use client";

import { useState, useCallback } from 'react';

export const useCollapsible = (allItems: string[] = []) => {
  const [expandedItems, setExpandedItems] = useState<string[]>(allItems);

  const toggleItem = useCallback((item: string) => {
    setExpandedItems(prev =>
      prev.includes(item)
        ? prev.filter(i => i !== item)
        : [...prev, item]
    );
  }, []);

  const expandAll = useCallback(() => {
    setExpandedItems(allItems);
  }, [allItems]);

  const collapseAll = useCallback(() => {
    setExpandedItems([]);
  }, []);

  return { expandedItems, toggleItem, expandAll, collapseAll };
};
