import React, { useEffect } from 'react';

import * as Styled from './StickyEffect.styles';

/**
 * @param yAxis  number of pixles scrolling down, where the sticky content should show
 * @param yAxisLimit number of pixles from the bottom where the sticky content should stop being the sticky effect
 */
export interface StickyEffectProps {
  children?: React.ReactNode;
  stickyContent?: React.ReactNode;
  yAxis: number;
  yAxisLimit: number;
}

export const viewportTotalHeight = (): number => document.body.scrollHeight;
export const topRightNavigationTracker = (): number => window.pageYOffset;
export const totalNavigationPx = (): number => window.pageYOffset + window.innerHeight;

export const timer = (
  setShouldStick: React.Dispatch<React.SetStateAction<boolean>>,
  setShowFooter: React.Dispatch<React.SetStateAction<boolean>>,
  yAxis: number,
  yAxisLimit: number,
): ReturnType<typeof setTimeout> =>
  setTimeout(
    (window.onscroll = () => {
      // this conditional is the one in charge of weather showing or not the sticky footer
      if (topRightNavigationTracker() >= yAxis) {
        setShowFooter(true);
      } else {
        setShowFooter(false);
      }

      // this conditional is the one in charge of weather adding or not the sticky effect to the footer
      if (viewportTotalHeight() - totalNavigationPx() < yAxisLimit) {
        setShouldStick(false);
      } else {
        setShouldStick(true);
      }
    }),
    2000,
  );

const StickyEffect: React.FC<StickyEffectProps> = ({
  children,
  stickyContent,
  yAxis,
  yAxisLimit,
}) => {
  const [showFooter, setShowFooter] = React.useState(false);
  const [shouldStick, setShouldStick] = React.useState(true);

  useEffect(() => {
    const timerId = timer(setShouldStick, setShowFooter, yAxis, yAxisLimit);
    return () => {
      global.clearTimeout(timerId);
    };
  }, []);

  return (
    <Styled.wrapper data-test="component-sticky-footer">
      <Styled.stillContent>{children}</Styled.stillContent>
      {showFooter && (
        <Styled.stickyFooterContent data-test="sticky-footer" shouldStick={shouldStick}>
          {stickyContent}
        </Styled.stickyFooterContent>
      )}
    </Styled.wrapper>
  );
};

export default StickyEffect;
