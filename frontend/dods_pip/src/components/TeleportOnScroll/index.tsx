import React, { FC, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

import * as Styled from './TeleportOnScroll.styles';

export interface StickyEffectProps {
  portalContainerId?: string;
  hasStickyTeleport?: boolean;
  stickyTeleportPosition?: 'top' | 'bottom';
  stickyTeleportBuffer?: number;
  children: JSX.Element;
}

const TeleportOnScroll: FC<StickyEffectProps> = ({
  portalContainerId = '__next',
  hasStickyTeleport = true,
  stickyTeleportPosition = 'bottom',
  stickyTeleportBuffer = 0,
  children,
}) => {
  const [isElementOutOfView, setIsElementOutOfView] = React.useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const checkPosition = (entries: IntersectionObserverEntry[]) =>
    setIsElementOutOfView(entries[0].intersectionRatio === 0);

  useEffect(() => {
    if (!children) throw new DOMException('TeleportOnScroll: Child component required');
    const observer = new IntersectionObserver(checkPosition, {});
    observer.observe(containerRef.current?.children[0] as Element);

    return () => {
      observer.disconnect();
    };
  }, [containerRef, children]);

  return (
    <div ref={containerRef}>
      {children}
      {isElementOutOfView &&
        createPortal(
          <Styled.teleportedEl
            {...{
              isSticky: hasStickyTeleport,
              stickyPos: stickyTeleportPosition,
              stockyBuffer: stickyTeleportBuffer,
            }}
          >
            {children}
          </Styled.teleportedEl>,
          document.getElementById(portalContainerId) as Element,
        )}
    </div>
  );
};

export default TeleportOnScroll;
