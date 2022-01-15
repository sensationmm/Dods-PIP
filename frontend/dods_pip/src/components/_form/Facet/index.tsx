import Checkbox from '@dods-ui/components/_form/Checkbox';
import color from '@dods-ui/globals/color';
import React from 'react';

import Icon, { IconSize } from '../../Icon';
import { Icons } from '../../Icon/assets';
import Text from '../../Text';
import * as Styled from './Facet.styles';
import {next} from "cheerio/lib/api/traversing";

export interface FacetProps {
  title: string;
  records: never[];
  clearable?: boolean;
  onClearSelection?: () => void;
  onChange: (topic: Record<string, any>) => void;
  expanded: boolean;
  darkMode?: boolean;
  checked?: never[];
}

const Facet: React.FC<FacetProps> = ({
  clearable,
  title,
  onClearSelection,
  children,
  records,
  onChange,
  darkMode,
}) => {
  const defaultCount = 5;
  const [expanded, setExpanded] = React.useState<boolean>(true);
  const [viewMore, setViewMore] = React.useState<boolean>(false);
  const [showCount, setShowCount] = React.useState<number>(defaultCount);
  const expandedIcon = expanded ? Icons.ChevronDownBold : Icons.ChevronRightBold;
  const viewMoreIcon = viewMore ? Icons.ChevronDownBold : Icons.ChevronRightBold;
  const [checked, setChecked] = React.useState<Record<string, any>>([]);

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
                color={darkMode ? color.base.white : color.base.greyDark}
              />
            </Styled.facetToggle>
            <Text type="bodyLarge" bold>
              {title}
            </Text>
          </div>
          <Styled.facetClearBtn onClick={onClearSelection} disabled={!clearable}>
            <Icon src={Icons.Bin} size={IconSize.small} data-test="component-icon" />
            Clear
          </Styled.facetClearBtn>
        </Styled.facetHeader>
        {expanded && (
          <Styled.facetCollapsiblePanel>
            {records &&
              records
                .slice(0, showCount)
                .sort((a: Record<string, any>, b: Record<string, any>) => b.doc_count - a.doc_count)
                .map((item: Record<string, any>, i: number) => {
                  return (
                    <Checkbox
                      label={item.key}
                      hint={item.doc_count}
                      id={`content-source-${i}`}
                      key={`content-source-${i}`}
                      isChecked={item.isChecked || false}
                      onChange={() => {
                        const exists = checked.includes(item);
                        let nextState;
                        item.isChecked = !item.isChecked;
                        if (exists) {
                          nextState = checked.filter((c: any) => c !== item);
                          setChecked(nextState);
                        } else {
                          nextState = checked.concat([item]);
                          setChecked(nextState);
                        }
                        onChange(nextState);
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
                <Icon src={viewMoreIcon} size={IconSize.xsmall} />
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
