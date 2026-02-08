import { ReactNode } from 'react';

export interface ResponsitipProps {
  /** The tooltip content (can be any React node) */
  title: ReactNode;
  /** Trigger type: "hover" (desktop only), "click" (mobile only), or "both" (hover on desktop, click on mobile) */
  triggerType?: 'hover' | 'click' | 'both';
  /** Tooltip placement relative to the trigger element */
  placement?: string;
  /** Custom ID for the tooltip element */
  tooltipId?: string;
  /** Stretch tooltip trigger wrappers to fill parent width/height */
  fillContainer?: boolean;
  /** The element that triggers the tooltip */
  children: ReactNode;
}

declare const Responsitip: React.FC<ResponsitipProps>;

export default Responsitip;
