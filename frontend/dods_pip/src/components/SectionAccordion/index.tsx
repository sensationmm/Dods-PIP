import React from 'react';

import color from '../../globals/color';
import Icon, { IconSize } from '../Icon';
import { Icons } from '../Icon/assets';
import * as Styled from './SectionAccordion.styles';

export interface SectionAccordionProps {
  id?: string;
  header: React.ReactNode;
  isOpen?: boolean;
  children: React.ReactNode;
  callback?: () => void;
}

const SectionAccordion: React.FC<SectionAccordionProps> = ({
  id,
  header,
  isOpen = false,
  children,
  callback,
}) => {
  const [open, setOpen] = React.useState<boolean>(isOpen);

  React.useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  const handleOnClick = () => {
    callback && callback();
    setOpen(!open);
  };

  return (
    <Styled.wrapper data-test="component-section-accordion" id={id}>
      <Styled.header data-test="header" onClick={handleOnClick}>
        <Styled.headerContent closed={!open}>{header}</Styled.headerContent>
        <Icon
          data-test="icon"
          src={open ? Icons.ChevronDown : Icons.ChevronUp}
          size={IconSize.large}
          color={color.theme.blue}
        />
      </Styled.header>
      {open && <Styled.content>{children}</Styled.content>}
    </Styled.wrapper>
  );
};

export default SectionAccordion;
