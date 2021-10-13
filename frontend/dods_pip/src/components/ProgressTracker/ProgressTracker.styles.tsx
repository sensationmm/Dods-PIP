import styled from 'styled-components';

import color from '../../globals/color';
import media from '../../globals/media';
import spacing from '../../globals/spacing';
import { span as Text } from '../Text/Text.styles';

export const wrapper = styled.div`
  display: flex;
  justify-content: flex-start;
`;

type ProgressProps = {
  condensed: boolean;
};

export const step = styled.div<ProgressProps>`
  display: flex;
  align-items: center;
  flex-direction: ${(p) => (p.condensed ? 'row-reverse' : 'row')};
  margin-right: ${spacing(1)};

  &:last-of-type {
    margin-right: 0;
  }

  .label {
    display: none;
    white-space: nowrap;
  }

  ${({ condensed }) => media.greaterThan('md')`
  margin-right: ${condensed ? spacing(10) : spacing(12)};

    .label {
      display: block;
    }
  `};
`;

interface StepProps extends ProgressProps {
  active: boolean;
}

export const stepCount = styled.div<StepProps>`
  width: 24px;
  height: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid ${color.theme.blue};
  background: ${(p) => (p.active ? color.theme.blue : color.base.white)};
  color: ${(p) => (p.active ? color.base.white : color.theme.blue)};
  border-radius: 50%;
  margin: 0;

  ${Text} {
    font-size: 14px;
  }

  ${({ condensed }) => media.greaterThan('md')`
    width: ${condensed ? '30px' : '54px'};
    height: ${condensed ? '30px' : '54px'};
    margin: ${condensed ? `0 ${spacing(2)} 0 0 ` : `0 0 0 ${spacing(2)}`};

    ${Text} {
      font-size: ${condensed ? '18px' : '24px'};
    }
  `};
`;

export const currentStep = styled.div`
  display: flex;
  align-items: center;
  padding-left: ${spacing(2)};

  ${media.greaterThan('md')`
    display: none;
`};
`;
