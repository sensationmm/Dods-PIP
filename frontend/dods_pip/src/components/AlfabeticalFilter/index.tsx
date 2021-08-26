import React, { useState } from 'react';

import color from '../../globals/color';
import Icon, { IconSize } from '../Icon';
import { Icons } from '../Icon/assets';
import Text from '../Text';
import * as Styled from './AZFilter.styles';

export interface AZFilterProps {
  onClick?: (letter: string) => void;
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

const AZFilter: React.FC<AZFilterProps> = ({ onClick }) => {
  const [hoveringAzFilter, setHoveringAzFilter] = useState(false);
  const [selectedLetter, setSelectedLetter] = useState('');
  const selectLetter = (letter: string) => {
    setSelectedLetter(letter);
    onClick?.(letter);
  };

  return (
    <div
      onMouseEnter={() => setHoveringAzFilter(true)}
      onMouseLeave={() => setHoveringAzFilter(false)}
      data-test="component-AZFilter"
    >
      <Styled.wrapper>
        <div onClick={() => selectLetter('')}>
          <Styled.viewAll>
            <Icon
              src={Icons.IconAzFilter}
              size={IconSize.large}
              color={selectedLetter === '' ? color.base.black : color.base.grey}
            />
            <Text
              type="bodySmall"
              color={selectedLetter === '' ? color.theme.blue : color.base.grey}
            >
              VIEW ALL
            </Text>
          </Styled.viewAll>
        </div>
        <Styled.letterSection>
          {alfabet.map((alf) => (
            <div key={alf} onClick={() => selectLetter(alf)}>
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
