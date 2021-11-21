import React from 'react';

import color from '../../../globals/color';
import Icon, { IconSize } from '../../Icon';
import { Icons } from '../../Icon/assets';
import Text from '../../Text';
import Spacer from '../Spacer';
import * as Styled from './SectionHeader.styles';

export interface SectionHeaderProps {
  icon: Icons | JSX.Element;
  title: string;
  subtitle?: string | Array<string>;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ icon, title, subtitle }) => {
  return (
    <Styled.wrapper data-test="component-section-header">
      {typeof icon == 'string' ? (
        <Icon src={icon} size={IconSize.xxxlarge} data-test="sectionheader-icon" />
      ) : (
        icon
      )}
      <Styled.titles>
        <Text type="h2" headingStyle="title" data-test="sectionheader-title">
          {title}
        </Text>

        {subtitle && (
          <div>
            <Spacer size={2} />
            {!Array.isArray(subtitle) ? (
              <Text type="p" data-test="sectionheader-subtitle" color={color.base.black}>
                {subtitle}
              </Text>
            ) : (
              subtitle.map((para, count) => (
                <Text
                  key={`sectionheader-subtitle-${count}`}
                  type="p"
                  data-test={`sectionheader-subtitle-${count}`}
                  color={color.base.black}
                >
                  {para}
                </Text>
              ))
            )}
          </div>
        )}
      </Styled.titles>
    </Styled.wrapper>
  );
};

export default SectionHeader;
