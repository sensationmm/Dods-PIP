import Checkbox from '@dods-ui/components/_form/Checkbox';
import color from '@dods-ui/globals/color';
import React, { useMemo } from 'react';

import Icon, { IconSize } from '../../Icon';
import { Icons } from '../../Icon/assets';
import Text from '../../Text';
import * as Styled from './Facet.styles';

export interface FacetProps {
  title: string;
  records: {
    key: string;
    doc_count: number;
    selected?: boolean;
  }[];
  onClearSelection?: () => void;
  onChange: (key: string) => void;
  checked?: never[];
}

const defaultVisibleRecords = 5;

const Facet: React.FC<FacetProps> = ({ title, onClearSelection, records = [], onChange }) => {
  const [expanded, setExpanded] = React.useState(true);
  const [viewMore, setViewMore] = React.useState(false);
  const expandedIcon = expanded ? Icons.ChevronDownBold : Icons.ChevronRightBold;
  const viewMoreIcon = viewMore ? Icons.ChevronRightBold : Icons.ChevronDownBold;

  const sortedRecords = useMemo(() => records.sort((a, b) => b.doc_count - a.doc_count), [records]);

  const recordsToShow = useMemo(() => {
    if (viewMore) {
      return sortedRecords;
    }

    return sortedRecords.slice(0, defaultVisibleRecords);
  }, [viewMore, sortedRecords]);

  const renderShowMore = useMemo(() => {
    const totalRecords = sortedRecords.length;

    if (totalRecords <= defaultVisibleRecords) return null;

    return (
      <Styled.facetViewMoreBtn
        onClick={() => {
          setViewMore(!viewMore);
        }}
      >
        <Icon src={viewMoreIcon} size={IconSize.xsmall} />
        {viewMore ? 'View less' : 'View more'}
      </Styled.facetViewMoreBtn>
    );
  }, [viewMore, sortedRecords]);

  return (
    <Styled.facet data-test="component-facet" disabled>
      <Styled.facetLayout data-test="component-facet-layout">
        <Styled.facetHeader>
          <div
            onClick={() => {
              setExpanded(!expanded);
            }}
          >
            <Styled.facetToggle>
              <Icon
                src={expandedIcon}
                size={IconSize.medium}
                data-test="component-icon"
                color={color.base.greyDark}
              />
            </Styled.facetToggle>
            <Text type="bodyLarge" bold>
              {title}
            </Text>
          </div>
          <Styled.facetClearBtn onClick={onClearSelection} disabled={false}>
            <Icon src={Icons.Bin} size={IconSize.small} data-test="component-icon" />
            Clear
          </Styled.facetClearBtn>
        </Styled.facetHeader>
        {expanded && (
          <Styled.facetCollapsiblePanel>
            {recordsToShow.map((item, i: number) => {
              return (
                <Checkbox
                  label={item.key}
                  hint={item.doc_count}
                  id={`content-source-${i}`}
                  key={`content-source-${i}`}
                  isChecked={item.selected || false}
                  onChange={() => onChange(item.key)}
                />
              );
            })}
            {renderShowMore}
          </Styled.facetCollapsiblePanel>
        )}
      </Styled.facetLayout>
    </Styled.facet>
  );
};

export default Facet;
