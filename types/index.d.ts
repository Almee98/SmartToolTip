import { ReactNode } from 'react';

export interface SmartTooltipProps {
  /** The tooltip content (can be any React node) */
  title: ReactNode;
  /** Trigger type: "hover" (desktop only), "click" (mobile only), or "both" (hover on desktop, click on mobile) */
  triggerType?: 'hover' | 'click' | 'both';
  /** Tooltip placement relative to the trigger element */
  placement?: string;
  /** Custom ID for the tooltip element */
  tooltipId?: string;
  /** The element that triggers the tooltip */
  children: ReactNode;
}

declare const SmartTooltip: React.FC<SmartTooltipProps>;

export default SmartTooltip;
