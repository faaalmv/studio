
import { renderHook, act } from '@testing-library/react';
import { useCollapsible } from '../use-collapsible';

describe('useCollapsible', () => {
  const allItems = ['group1', 'group2', 'group3'];

  it('should initialize with all items expanded', () => {
    const { result } = renderHook(() => useCollapsible(allItems));
    expect(result.current.expandedItems).toEqual(allItems);
  });

  it('should toggle an item', () => {
    const { result } = renderHook(() => useCollapsible(allItems));

    act(() => {
      result.current.toggleItem('group1');
    });

    expect(result.current.expandedItems).toEqual(['group2', 'group3']);

    act(() => {
      result.current.toggleItem('group1');
    });

    expect(result.current.expandedItems).toEqual(['group2', 'group3', 'group1']);
  });

  it('should expand all items', () => {
    const { result } = renderHook(() => useCollapsible(allItems));

    act(() => {
      result.current.collapseAll();
    });

    expect(result.current.expandedItems).toEqual([]);

    act(() => {
      result.current.expandAll();
    });

    expect(result.current.expandedItems).toEqual(allItems);
  });

  it('should collapse all items', () => {
    const { result } = renderHook(() => useCollapsible(allItems));

    act(() => {
      result.current.collapseAll();
    });

    expect(result.current.expandedItems).toEqual([]);
  });
});
