import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useIsDesktop } from './useMediaQuery';

const Responsitip = ({
  title,
  placement,
  triggerType,
  children,
  tooltipId,
  fillContainer,
}) => {
  const isDesktop = useIsDesktop();

  const [showTooltip, setShowTooltip] = useState(false);
  const wrapperRef = useRef(null);
  const idRef = useRef(tooltipId || `responsitip-${Math.random().toString(36).slice(2, 11)}`);

  // Determine effective mode (desktop: hover-only, mobile: click-only) based on prop.
  // "hover" -> desktop only, "click" -> mobile only, "both" -> hover desktop + click mobile.
  let effectiveMode = 'none';
  if (triggerType === 'both') {
    effectiveMode = isDesktop ? 'hover' : 'click';
  } else if (triggerType === 'hover') {
    effectiveMode = isDesktop ? 'hover' : 'none';
  } else if (triggerType === 'click') {
    effectiveMode = isDesktop ? 'none' : 'click';
  }

  // Mobile-only: close tooltip when clicking outside and close when another tooltip opens.
  useEffect(() => {
    if (effectiveMode !== 'click' || !showTooltip) {
      return undefined;
    }

    function handleClickOutside (e) {
      if (!e.target.closest('.responsitip')) {
        setShowTooltip(false);
      }
    }

    function handleTooltipOpened (e) {
      if (wrapperRef.current && e.detail !== wrapperRef.current) {
        setShowTooltip(false);
      }
    }

    if (!isDesktop) {
      document.addEventListener('click', handleClickOutside);
      window.addEventListener('responsitipOpened', handleTooltipOpened);
      return () => {
        document.removeEventListener('click', handleClickOutside);
        window.removeEventListener('responsitipOpened', handleTooltipOpened);
      };
    }
    return undefined;
  }, [effectiveMode, showTooltip, isDesktop]);

  if (effectiveMode === 'none') {
    return children;
  }
  const trigger = effectiveMode === 'hover' ? ['hover', 'focus'] : ['click'];
  const wrappedChildren = fillContainer ? (
    <span
      style={{
        alignItems: 'center',
        display: 'flex',
        height: '100%',
        justifyContent: 'center',
        width: '100%',
      }}
    >
      {children}
    </span>
  ) : children;

  const tooltipOverlay = (
    <Tooltip
      data-testid="tooltip"
      className="u-z-index-9020"
      id={idRef.current}
    >
      {title}
    </Tooltip>
  );

  // Render for hover trigger using OverlayTrigger (desktop)
  if (trigger.includes('hover')) {
    return (
      <OverlayTrigger
        placement={placement}
        overlay={tooltipOverlay}
        trigger={trigger}
      >
        {wrappedChildren}
      </OverlayTrigger>
    );
  }

  // Render for click trigger using OverlayTrigger controlled via `show` (mobile)
  const handleClick = () => {
    if (!showTooltip) {
      window.dispatchEvent(new CustomEvent('responsitipOpened', { detail: wrapperRef.current }));
    }
    setShowTooltip((prev) => !prev);
  };

  return (
    <OverlayTrigger overlay={tooltipOverlay} placement={placement} show={!isDesktop ? showTooltip : undefined}>
      <span
        ref={wrapperRef}
        className="responsitip"
        onClick={!isDesktop ? handleClick : undefined}
        style={fillContainer ? {
          alignItems: 'center',
          cursor: 'pointer',
          display: 'flex',
          height: '100%',
          justifyContent: 'center',
          width: '100%',
        } : { cursor: 'pointer', display: 'inline-block' }}
      >
        {wrappedChildren}
      </span>
    </OverlayTrigger>
  );
};

Responsitip.propTypes = {
  title: PropTypes.node.isRequired,
  placement: PropTypes.string,
  triggerType: PropTypes.oneOf(['hover', 'click', 'both']),
  children: PropTypes.node.isRequired,
  tooltipId: PropTypes.string,
  fillContainer: PropTypes.bool,
};

Responsitip.defaultProps = {
  placement: 'top',
  triggerType: 'hover',
  tooltipId: undefined,
  fillContainer: false,
};

export default Responsitip;
