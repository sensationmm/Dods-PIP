import React from 'react';

import Spacer from '../../_layout/Spacer';
import Breadcrumbs, { BreadcrumbsProps } from '../../Breadcrumbs';
import Text from '../../Text';
import Panel, { PanelProps } from '../Panel';
import * as Styled from './PageHeader.styles';

export interface PageHeaderProps {
  title: string;
  content?: JSX.Element;
  footer?: JSX.Element;
  flexDirection?: 'row' | 'column';
  breadcrumbs?: React.ReactElement<BreadcrumbsProps, typeof Breadcrumbs>;
  bgColor?: PanelProps['bgColor'];
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  content,
  footer,
  flexDirection = 'row',
  breadcrumbs,
  bgColor,
}) => {
  return (
    <Styled.wrapper data-test="component-page-header">
      <Panel data-test="component-header" isPadded bgColor={bgColor}>
        {breadcrumbs && (
          <>
            {breadcrumbs}
            <Spacer size={6} />
          </>
        )}
        <Styled.container flexDirection={flexDirection}>
          <div>
            <Text type="h1" headingStyle="hero" data-test="pageheader-title">
              {title}
            </Text>
          </div>

          {content && <div>{content}</div>}
        </Styled.container>
        {footer && <Styled.footer>{footer}</Styled.footer>}
      </Panel>
    </Styled.wrapper>
  );
};

export default PageHeader;
