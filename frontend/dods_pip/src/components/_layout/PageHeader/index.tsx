import React from 'react';

import Text from '../../Text';
import * as Styled from './PageHeader.styles';

export interface PageHeaderProps {
  title: string;
  content?: JSX.Element;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, content }) => {
  return (
    <Styled.wrapper data-test="component-page-header">
      <Styled.container>
        <div>
          <Text type="h1" headingStyle="hero" data-test="pageheader-title">
            {title}
          </Text>
        </div>

        {content && <div>{content}</div>}
      </Styled.container>
    </Styled.wrapper>
  );
};

export default PageHeader;
