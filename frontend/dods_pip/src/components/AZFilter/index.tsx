import React from 'react';

import color from '../../globals/color';
import Icon, { IconSize } from '../Icon';
import { Icons } from '../Icon/assets';
import Text from '../Text';
import * as Styled from './AZFilter.styles';

export interface AZFilterProps {
  selectedLetter: string;
  setSelectedLetter: (letter: string) => void;
}

const alfabet = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
];

const AZFilter: React.FC<AZFilterProps> = ({ selectedLetter, setSelectedLetter }) => {
  const [hoveringAzFilter, setHoveringAzFilter] = React.useState(false);
  const selectLetter = (letter: string) => {
    setSelectedLetter(letter);
  };

  return (
    <div
      onMouseEnter={() => setHoveringAzFilter(true)}
      onMouseLeave={() => setHoveringAzFilter(false)}
      data-test="component-AZFilter"
    >
      <Styled.wrapper>
        <div data-test="button-all" onClick={() => selectLetter('')}>
          <Styled.viewAll>
            <Icon
              src={Icons.IconAzFilter}
              size={IconSize.large}
              color={selectedLetter === '' ? color.theme.blueMid : color.base.grey}
            />
            <Text
              type="bodySmall"
              bold
              color={selectedLetter === '' ? color.theme.blueMid : color.base.grey}
            >
              VIEW ALL
            </Text>
          </Styled.viewAll>
        </div>
        <Styled.letterSection>
          {alfabet.map((alf) => (
            <div data-test={`button-${alf}`} key={alf} onClick={() => selectLetter(alf)}>
              <Styled.letter selected={selectedLetter === alf}>
                <Text
                  type="bodyLarge"
                  center
                  color={
                    selectedLetter === alf
                      ? color.base.white
                      : hoveringAzFilter
                      ? color.theme.blue
                      : color.base.grey
                  }
                >
                  {alf}
                </Text>
              </Styled.letter>
            </div>
          ))}
        </Styled.letterSection>
      </Styled.wrapper>
    </div>
  );
};

export default AZFilter;
