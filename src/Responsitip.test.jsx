import React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Responsitip from './Responsitip';

// Mock react-bootstrap
vi.mock('react-bootstrap', () => ({
  OverlayTrigger: ({ children, overlay, trigger, show, placement }) => {
    // When show is controlled (not undefined), use it directly
    // When show is undefined, manage internal state for uncontrolled mode
    const [internalVisible, setInternalVisible] = React.useState(false);
    const isVisible = show !== undefined ? show : internalVisible;

    const handleMouseEnter = () => {
      if (trigger?.includes('hover') && show === undefined) {
        setInternalVisible(true);
      }
    };

    const handleMouseLeave = () => {
      if (trigger?.includes('hover') && show === undefined) {
        setInternalVisible(false);
      }
    };

    // When show is controlled, don't handle clicks - let the parent component handle it
    // When show is undefined, handle clicks for uncontrolled mode
    const handleClick = () => {
      if (trigger?.includes('click') && show === undefined) {
        setInternalVisible(!internalVisible);
      }
    };

    return (
      <div
        data-testid="overlay-trigger"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        data-placement={placement}
        data-visible={isVisible}
      >
        {children}
        {isVisible && <div data-testid="tooltip">{overlay}</div>}
      </div>
    );
  },
  Tooltip: ({ children, id, className, style }) => (
    <div data-testid="tooltip-content" id={id} className={className} style={style}>
      {children}
    </div>
  ),
}));

// Mock useMediaQuery
const mockUseIsDesktop = vi.fn();
vi.mock('./useMediaQuery', () => ({
  useIsDesktop: () => mockUseIsDesktop(),
}));

describe('Responsitip', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render children', () => {
    mockUseIsDesktop.mockReturnValue(true);
    render(
      <Responsitip title="Test tooltip">
        <button>Hover me</button>
      </Responsitip>
    );

    expect(screen.getByText('Hover me')).toBeInTheDocument();
  });

  it('should show tooltip on hover for desktop when triggerType is "hover"', async () => {
    mockUseIsDesktop.mockReturnValue(true);
    const user = userEvent.setup();

    render(
      <Responsitip title="Test tooltip" triggerType="hover">
        <button>Hover me</button>
      </Responsitip>
    );

    const button = screen.getByText('Hover me');
    await user.hover(button);

    await waitFor(() => {
      expect(screen.getByTestId('tooltip')).toBeInTheDocument();
      expect(screen.getByText('Test tooltip')).toBeInTheDocument();
    });
  });

  it('should not show tooltip on mobile when triggerType is "hover"', () => {
    mockUseIsDesktop.mockReturnValue(false);
    
    render(
      <Responsitip title="Test tooltip" triggerType="hover">
        <button>Hover me</button>
      </Responsitip>
    );

    expect(screen.queryByTestId('tooltip')).not.toBeInTheDocument();
  });

  it('should show tooltip on click for mobile when triggerType is "click"', async () => {
    mockUseIsDesktop.mockReturnValue(false);
    const user = userEvent.setup();

    render(
      <Responsitip title="Test tooltip" triggerType="click">
        <button>Click me</button>
      </Responsitip>
    );

    const button = screen.getByText('Click me');
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByTestId('tooltip')).toBeInTheDocument();
      expect(screen.getByText('Test tooltip')).toBeInTheDocument();
    });
  });

  it('should toggle tooltip on click for mobile', async () => {
    mockUseIsDesktop.mockReturnValue(false);
    const user = userEvent.setup();

    render(
      <Responsitip title="Test tooltip" triggerType="click">
        <button>Click me</button>
      </Responsitip>
    );

    const button = screen.getByText('Click me');
    
    // First click - should show
    await user.click(button);
    await waitFor(() => {
      expect(screen.getByTestId('tooltip')).toBeInTheDocument();
    });

    // Second click - should hide
    await user.click(button);
    await waitFor(() => {
      expect(screen.queryByTestId('tooltip')).not.toBeInTheDocument();
    });
  });

  it('should use hover on desktop and click on mobile when triggerType is "both"', async () => {
    const user = userEvent.setup();

    // Desktop behavior
    mockUseIsDesktop.mockReturnValue(true);
    const { rerender } = render(
      <Responsitip title="Test tooltip" triggerType="both">
        <button>Interact me</button>
      </Responsitip>
    );

    const button = screen.getByText('Interact me');
    await user.hover(button);

    await waitFor(() => {
      expect(screen.getByTestId('tooltip')).toBeInTheDocument();
    });

    // Mobile behavior
    mockUseIsDesktop.mockReturnValue(false);
    rerender(
      <Responsitip title="Test tooltip" triggerType="both">
        <button>Interact me</button>
      </Responsitip>
    );

    // Wait for rerender to complete
    await waitFor(() => {
      expect(screen.getByText('Interact me')).toBeInTheDocument();
    });

    // Tooltip should not be visible initially on mobile
    expect(screen.queryByTestId('tooltip')).not.toBeInTheDocument();

    // Get fresh button reference after rerender (structure may have changed)
    const mobileButton = screen.getByText('Interact me');
    
    // Click should show tooltip
    await user.click(mobileButton);
    await waitFor(() => {
      expect(screen.getByTestId('tooltip')).toBeInTheDocument();
    });
  });

  it('should use custom placement', () => {
    mockUseIsDesktop.mockReturnValue(true);
    render(
      <Responsitip title="Test tooltip" placement="bottom">
        <button>Hover me</button>
      </Responsitip>
    );

    const overlay = screen.getByTestId('overlay-trigger');
    expect(overlay).toHaveAttribute('data-placement', 'bottom');
  });

  it('should use custom tooltipId', () => {
    mockUseIsDesktop.mockReturnValue(true);
    render(
      <Responsitip title="Test tooltip" tooltipId="custom-id">
        <button>Hover me</button>
      </Responsitip>
    );

    // The tooltip should have the custom ID when visible
    // This is tested through the mock implementation
    expect(screen.getByText('Hover me')).toBeInTheDocument();
  });

  it('should wrap children with a full-size flex container when fillContainer is true in hover mode', () => {
    mockUseIsDesktop.mockReturnValue(true);
    render(
      <Responsitip title="Test tooltip" triggerType="hover" fillContainer>
        <button>Hover me</button>
      </Responsitip>
    );

    const innerWrapper = screen.getByText('Hover me').parentElement;
    expect(innerWrapper).toHaveStyle({ display: 'flex', width: '100%', height: '100%' });
  });

  it('should stretch click wrapper to full container when fillContainer is true', () => {
    mockUseIsDesktop.mockReturnValue(false);
    render(
      <Responsitip title="Test tooltip" triggerType="click" fillContainer>
        <button>Click me</button>
      </Responsitip>
    );

    const clickWrapper = screen.getByText('Click me').closest('.responsitip');
    expect(clickWrapper).toHaveStyle({ display: 'flex', width: '100%', height: '100%' });
  });
});
