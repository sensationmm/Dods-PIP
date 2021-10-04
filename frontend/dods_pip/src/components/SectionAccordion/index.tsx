import React from 'react';

import color from '../../globals/color';
import Avatar, { UserType } from '../Avatar';
import Icon, { IconSize } from '../Icon';
import { Icons } from '../Icon/assets';
import Text from '../Text';
import * as Styled from './SectionAccordion.styles';

export interface SectionAccordionProps {
  id?: string;
  avatarType: UserType;
  header?: string;
  subheader?: string;
  open?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
}

const SectionAccordion: React.FC<SectionAccordionProps> = ({
  id,
  avatarType,
  header,
  subheader,
  open = false,
  onClick,
  children,
}) => {
  return (
    <Styled.wrapper data-test="component-serction-accordion" id={id} onClick={onClick}>
      <Styled.topPart>
        <Styled.headerWrapper>
          <Avatar type={avatarType} size="medium" />
          <Styled.header>
            <Text type="headerTitle" color={color.theme.blue}>
              {header}
            </Text>
            <Text type="bodyLarge" color={color.base.black}>
              {subheader}
            </Text>
          </Styled.header>
        </Styled.headerWrapper>

        <Icon
          data-test="icon"
          src={open ? Icons.IconChevronDown : Icons.IconChevronUp}
          size={IconSize.large}
          color={color.theme.blue}
        />
      </Styled.topPart>
      {children}
      {!open && <Styled.layer data-test="layer" />}
    </Styled.wrapper>
  );
};

export default SectionAccordion;
