import Spacer from '@dods-ui/components/_layout/Spacer';
import Tag from '@dods-ui/components/Tag';
import classNames from 'classnames';
import React from 'react';

import color from '../../../globals/color';
import Icon, { IconSize } from '../../Icon';
import { Icons } from '../../Icon/assets';
import Text from '../../Text';
import Label, { LabelProps } from '../Label';
import * as Styled from './Facet.styles';
import Checkbox from "@dods-ui/components/_form/Checkbox";


export interface FacetProps extends Omit<LabelProps, 'label'> {
  title: string;
  records: never[];
  clearable?: boolean;
  onClearSelection?: () => void;
  onChange: (topic: Record<string, any>) => void;
  children: React.ReactNode;
  expanded: boolean;
}

const Facet: React.FC<FacetProps> = ({
  clearable,
  title,
  onClearSelection,
  children,
  records,
  onChange,
}) => {
  const defaultCount = 5;
  const [expanded, setExpanded] = React.useState<boolean>(true);
  const [viewMore, setViewMore] = React.useState<boolean>(false);
  const [showCount, setShowCount] = React.useState<number>(defaultCount);
  const expandedIcon = expanded ? Icons.ChevronDownBold : Icons.ChevronRightBold;
  const viewMoreIcon = viewMore ? Icons.ChevronDownBold : Icons.ChevronRightBold;

  return (
    <Styled.facet data-test="component-facet" disabled>
      <Styled.facetLayout data-test="component-facet-layout">
        <Styled.facetHeader>
          <Styled.facetToggleWrap
            onClick={() => {
              setExpanded(!expanded);
            }}
          >
            <Styled.facetToggle>
              <Icon src={expandedIcon} size={IconSize.medium} data-test="component-icon" />
            </Styled.facetToggle>
            <Text type="bodyLarge" bold>
              {title}
            </Text>
          </Styled.facetToggleWrap>
          <Styled.facetClearBtn onClick={onClearSelection} disabled={!clearable}>
            <Icon src={Icons.Bin} size={IconSize.small} data-test="component-icon" />
            Clear
          </Styled.facetClearBtn>
        </Styled.facetHeader>
        {expanded && (
          <Styled.facetCollapsiblePanel>
            {records &&
              records.slice(0, showCount).map((topic: Record<string, any>, i: number) => {
                console.log('topic:', topic);
                return (
                  <Checkbox
                    label={topic.key}
                    id={`content-source-${i}`}
                    key={`content-source-${i}`}
                    isChecked={false}
                    onChange={() => {
                      onChange(topic);
                    }}
                  />
                );
              })}
            {records && records.length > 5 && (
              <Styled.facetViewMoreBtn
                onClick={() => {
                  setShowCount(!viewMore ? records.length : defaultCount);
                  setViewMore(!viewMore);
                }}
              >
                <Icon src={viewMoreIcon} />
                View more
              </Styled.facetViewMoreBtn>
            )}
            {children}
          </Styled.facetCollapsiblePanel>
        )}
      </Styled.facetLayout>
    </Styled.facet>
  );
};

export default Facet;
