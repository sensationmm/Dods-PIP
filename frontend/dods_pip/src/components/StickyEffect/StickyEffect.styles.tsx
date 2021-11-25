import styled from 'styled-components';

export const wrapper = styled.div`
  width: 100%;
  position: relative;
`;

export const stillContent = styled.div`
  width: 100%;
  margin: auto 0;
`;

type StickyContentProps = {
  shouldStick: boolean;
};

export const stickyFooterContent = styled.div<StickyContentProps>`
  width: 100%;
  position: ${({ shouldStick }) => (shouldStick ? 'fixed' : 'absolute')};
  bottom: 0;
`;
