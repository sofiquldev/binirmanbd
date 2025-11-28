import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * Custom hook for managing overflow menu items
 * Automatically detects when items overflow and moves them to a dropdown
 * 
 * @param {Array} items - Array of items to display
 * @param {Object} options - Configuration options
 * @param {React.RefObject} options.containerRef - Ref to the container element
 * @param {React.RefObject} options.itemsRef - Ref to the items wrapper element
 * @param {React.RefObject} options.moreButtonRef - Ref to the "More" button element
 * @param {string} options.actionButtonsSelector - CSS selector for action buttons (default: '.action-buttons')
 * @param {number} options.gap - Gap between items in pixels (default: 32)
 * @param {number} options.padding - Container padding in pixels (default: 16)
 * @param {number} options.moreButtonReserveWidth - Reserved width for "More" button in pixels (default: 80)
 * 
 * @returns {Object} - { visibleItems, hiddenItems, isMoreOpen, setIsMoreOpen }
 */
export function useOverflowMenu(items = [], options = {}) {
  const {
    containerRef,
    itemsRef,
    moreButtonRef,
    actionButtonsSelector = '.action-buttons',
    gap = 32,
    padding = 16,
    moreButtonReserveWidth = 80,
  } = options;

  const [visibleItems, setVisibleItems] = useState(items);
  const [hiddenItems, setHiddenItems] = useState([]);
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const checkOverflow = useCallback(() => {
    if (!containerRef?.current || !itemsRef?.current) {
      // Reset to show all items if refs are not available
      setVisibleItems(items);
      setHiddenItems([]);
      return;
    }

    const container = containerRef.current;
    const itemsContainer = itemsRef.current;
    const actionButtons = container.querySelector(actionButtonsSelector);
    const actionButtonsWidth = actionButtons?.offsetWidth || 0;

    // Get container width
    const containerWidth = container.offsetWidth;

    // Try to find measurement container first (for accurate width calculation)
    const measurementContainer = container.querySelector('[data-measurement="true"]');
    let itemElements = [];
    
    if (measurementContainer) {
      // Use the measurement container to get all item widths
      const measurementItems = measurementContainer.querySelector('div');
      if (measurementItems) {
        itemElements = Array.from(measurementItems.children);
      }
    }
    
    // Fallback: use visible items if measurement container not found
    if (itemElements.length === 0) {
      itemElements = Array.from(itemsContainer.children);
    }
    
    if (itemElements.length === 0 || itemElements.length !== items.length) {
      // If we can't measure all items, show all
      setVisibleItems(items);
      setHiddenItems([]);
      return;
    }

    // Calculate available width
    // First, try to fit all items without "More" button
    let availableWidth = containerWidth - actionButtonsWidth - padding;
    
    const visible = [];
    const hidden = [];
    let totalWidth = 0;

    // First pass: try to fit all items without "More" button
    for (let i = 0; i < itemElements.length; i++) {
      const itemElement = itemElements[i];
      const itemWidth = itemElement.offsetWidth + gap;

      if (totalWidth + itemWidth <= availableWidth) {
        totalWidth += itemWidth;
        visible.push(items[i]);
      } else {
        // This item doesn't fit, add it and all remaining to hidden
        for (let j = i; j < items.length; j++) {
          hidden.push(items[j]);
        }
        break;
      }
    }

    // If we have hidden items, recalculate with actual "More" button width
    if (hidden.length > 0) {
      // Get actual "More" button width if available, otherwise use reserve width
      const moreButtonWidth = moreButtonRef?.current?.offsetWidth || moreButtonReserveWidth;
      availableWidth = containerWidth - actionButtonsWidth - moreButtonWidth - gap - padding;
      totalWidth = 0;
      visible.length = 0;
      hidden.length = 0;

      // Second pass with actual "More" button width
      for (let i = 0; i < itemElements.length; i++) {
        const itemElement = itemElements[i];
        const itemWidth = itemElement.offsetWidth + gap;

        if (totalWidth + itemWidth <= availableWidth) {
          totalWidth += itemWidth;
          visible.push(items[i]);
        } else {
          for (let j = i; j < items.length; j++) {
            hidden.push(items[j]);
          }
          break;
        }
      }
    }

    // Update state only if values changed
    // Compare by creating a string key from item properties
    const getItemKey = (item) => {
      if (item?.value) return item.value;
      if (item?.id) return item.id;
      if (item?.key) return item.key;
      return JSON.stringify(item);
    };

    const visibleKeys = visible.map(getItemKey).join(',');
    const hiddenKeys = hidden.map(getItemKey).join(',');

    setVisibleItems((prev) => {
      const prevKeys = prev.map(getItemKey).join(',');
      return prevKeys !== visibleKeys ? visible : prev;
    });

    setHiddenItems((prev) => {
      const prevKeys = prev.map(getItemKey).join(',');
      return prevKeys !== hiddenKeys ? hidden : prev;
    });
  }, [items, containerRef, itemsRef, moreButtonRef, actionButtonsSelector, gap, padding, moreButtonReserveWidth]);

  useEffect(() => {
    let timeoutId;
    let resizeObserver;
    let rafId;
    let mutationObserver;

    const scheduleCheck = () => {
      // Cancel any pending checks
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      
      // Use requestAnimationFrame to batch updates
      rafId = requestAnimationFrame(() => {
        checkOverflow();
      });
    };

    // Initial check after a short delay to ensure DOM is ready
    timeoutId = setTimeout(scheduleCheck, 100);

    // Set up ResizeObserver for container
    if (containerRef?.current) {
      resizeObserver = new ResizeObserver(scheduleCheck);
      resizeObserver.observe(containerRef.current);
      
      // Also observe the items container
      if (itemsRef?.current) {
        resizeObserver.observe(itemsRef.current);
      }
    }

    // Set up MutationObserver to watch for DOM changes (like More button appearing)
    if (containerRef?.current) {
      mutationObserver = new MutationObserver(() => {
        // Debounce mutation observations
        scheduleCheck();
      });
      mutationObserver.observe(containerRef.current, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class'],
      });
    }

    // Also listen to window resize with debouncing
    let resizeTimeout;
    const handleResize = () => {
      if (resizeTimeout) {
        clearTimeout(resizeTimeout);
      }
      resizeTimeout = setTimeout(scheduleCheck, 50);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (resizeTimeout) clearTimeout(resizeTimeout);
      if (rafId) cancelAnimationFrame(rafId);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      if (mutationObserver) {
        mutationObserver.disconnect();
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [checkOverflow, containerRef, itemsRef]);

  // Re-check when items change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      checkOverflow();
    }, 150);
    return () => clearTimeout(timeoutId);
  }, [items, checkOverflow]);

  // Re-check when hidden items change (to account for More button appearing)
  useEffect(() => {
    if (hiddenItems.length > 0) {
      // More button will appear, recalculate with its width
      const timeoutId = setTimeout(() => {
        checkOverflow();
      }, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [hiddenItems.length, checkOverflow]);

  return {
    visibleItems,
    hiddenItems,
    isMoreOpen,
    setIsMoreOpen,
  };
}

