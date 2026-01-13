import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useMediaQuery, useIsDesktop } from './useMediaQuery';

describe('useMediaQuery', () => {
  let matchMediaMock;

  beforeEach(() => {
    // Create a mock for window.matchMedia
    matchMediaMock = vi.fn();
    window.matchMedia = matchMediaMock;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return false initially when query does not match', () => {
    matchMediaMock.mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });

    const { result } = renderHook(() => useMediaQuery('(min-width: 900px)'));
    expect(result.current).toBe(false);
  });

  it('should return true initially when query matches', () => {
    matchMediaMock.mockReturnValue({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });

    const { result } = renderHook(() => useMediaQuery('(min-width: 900px)'));
    expect(result.current).toBe(true);
  });

  it('should update when media query changes', async () => {
    const listeners = [];
    const mockMediaQuery = {
      matches: false,
      addEventListener: vi.fn((event, handler) => {
        listeners.push(handler);
      }),
      removeEventListener: vi.fn(),
    };

    matchMediaMock.mockReturnValue(mockMediaQuery);

    const { result } = renderHook(() => useMediaQuery('(min-width: 900px)'));
    expect(result.current).toBe(false);

    // Simulate media query change
    mockMediaQuery.matches = true;
    listeners.forEach(listener => listener({ matches: true }));

    await waitFor(() => {
      expect(result.current).toBe(true);
    });
  });

  it('should clean up event listeners on unmount', () => {
    const removeEventListener = vi.fn();
    matchMediaMock.mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener,
    });

    const { unmount } = renderHook(() => useMediaQuery('(min-width: 900px)'));
    unmount();

    expect(removeEventListener).toHaveBeenCalled();
  });

  it('should use addListener fallback for older browsers', () => {
    const removeListener = vi.fn();
    matchMediaMock.mockReturnValue({
      matches: false,
      addListener: vi.fn(),
      removeListener,
      // No addEventListener
    });

    const { unmount } = renderHook(() => useMediaQuery('(min-width: 900px)'));
    unmount();

    expect(removeListener).toHaveBeenCalled();
  });
});

describe('useIsDesktop', () => {
  let matchMediaMock;

  beforeEach(() => {
    matchMediaMock = vi.fn();
    window.matchMedia = matchMediaMock;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return true for desktop screens (>= 900px)', () => {
    matchMediaMock.mockReturnValue({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });

    const { result } = renderHook(() => useIsDesktop());
    expect(result.current).toBe(true);
  });

  it('should return false for mobile screens (< 900px)', () => {
    matchMediaMock.mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });

    const { result } = renderHook(() => useIsDesktop());
    expect(result.current).toBe(false);
  });
});
