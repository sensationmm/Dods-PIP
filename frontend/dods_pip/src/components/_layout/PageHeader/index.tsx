import React from 'react';

import Text from '../../Text';
import Panel from '../Panel';
import * as Styled from './PageHeader.styles';

export interface PageHeaderProps {
  title: string;
  content?: JSX.Element;
  flexDirection?: 'row' | 'column';
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, content, flexDirection = 'row' }) => {
  return (
    <Styled.wrapper data-test="component-page-header">
      <Panel data-test="component-header" isPadded={false}>
        <Styled.container flexDirection={flexDirection}>
          <div>
            <Text type="h1" headingStyle="hero" data-test="pageheader-title">
              {title}
            </Text>
          </div>

          {content && <div>{content}</div>}
        </Styled.container>
      </Panel>
    </Styled.wrapper>
  );
};

export default PageHeader;
