import Icon, { IconSize } from '@dods-ui/components/Icon';
import { Icons } from '@dods-ui/components/Icon/assets';
import Text from '@dods-ui/components/Text';
import React, { useState } from 'react';

import * as Styled from './FacetContainer.styles';

interface FacetContainerProps {
  heading: string;
  onClearSelection?: () => void;
  children: JSX.Element;
}

const FacetContainer: React.FC<FacetContainerProps> = ({ heading, children, onClearSelection }) => {
  const [expanded, setExpanded] = useState(true);
  const expandedIcon = expanded ? Icons.ChevronDownBold : Icons.ChevronRightBold;

  return (
    <Styled.container className={!expanded ? 'content-hidden' : ''}>
      <Styled.header>
        <Styled.toggle onClick={() => setExpanded(!expanded)}>
          <Icon src={expandedIcon} size={IconSize.medium} data-test="component-icon" />
        </Styled.toggle>
        <Styled.headingContainer>
          <Text type="bodyLarge" bold>
            {heading}
          </Text>
        </Styled.headingContainer>
        {onClearSelection && (
          <Styled.clearBtn onClick={onClearSelection} disabled={false}>
            <Icon src={Icons.Bin} size={IconSize.small} data-test="component-icon" />
            <Styled.clearBtnText>Clear</Styled.clearBtnText>
          </Styled.clearBtn>
        )}
      </Styled.header>
      {expanded && <Styled.childrenContainer>{children}</Styled.childrenContainer>}
    </Styled.container>
  );
};

export default FacetContainer;
