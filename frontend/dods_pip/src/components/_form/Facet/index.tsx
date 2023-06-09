import Checkbox from '@dods-ui/components/_form/Checkbox';
import Spacer from '@dods-ui/components/_layout/Spacer';
import Chips from '@dods-ui/components/Chips';
import color from '@dods-ui/globals/color';
import React, { useMemo } from 'react';

import Icon, { IconSize } from '../../Icon';
import { Icons } from '../../Icon/assets';
import Text from '../../Text';
import InputSearch from '../InputSearch';
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
  onSearch?: boolean;
}

const defaultVisibleRecords = 5;

const Facet: React.FC<FacetProps> = ({
  title,
  onClearSelection,
  records = [],
  onChange,
  onSearch = false,
}) => {
  const [expanded, setExpanded] = React.useState(true);
  const [viewMore, setViewMore] = React.useState(false);
  const [searchText, setSearchText] = React.useState('');
  const [viewResults, setViewResults] = React.useState(false);
  const expandedIcon = expanded ? Icons.ChevronDownBold : Icons.ChevronRightBold;
  const viewMoreIcon = viewMore ? Icons.ChevronRightBold : Icons.ChevronDownBold;

  const selectedRecords = useMemo(() => records.filter((record) => record.selected), [records]);

  const sortedRecords = useMemo(
    () => records.filter((record) => !record.selected).sort((a, b) => b.doc_count - a.doc_count),
    [records],
  );

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
    <Styled.facet data-test="component-facet">
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
          <Styled.facetClearBtn onClick={onClearSelection} disabled={selectedRecords.length === 0}>
            <Icon src={Icons.Bin} size={IconSize.small} data-test="component-icon" />
            Clear
          </Styled.facetClearBtn>
        </Styled.facetHeader>
        {selectedRecords.length > 0 && (
          <Styled.facetChipsWrapper>
            {selectedRecords.map(({ key }, i: number) => {
              return (
                <Chips
                  label={key}
                  key={`${key}-chip-${i}`}
                  onCloseClick={() => onChange(key)}
                  theme={'dark'}
                />
              );
            })}
          </Styled.facetChipsWrapper>
        )}
        {expanded && recordsToShow.length > 0 && (
          <Styled.facetCollapsiblePanel>
            {onSearch && (
              <>
                <InputSearch
                  onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
                    console.log(e.key);
                    if (e.key !== 'Shift') {
                      setViewResults(true);
                    }
                    if (e.key === 'Backspace' && searchText.length < 2) {
                      setViewResults(false);
                    }
                  }}
                  size="medium"
                  id={`search-${title}`}
                  value={searchText}
                  onChange={(val) => {
                    setSearchText(val);
                  }}
                  onClear={() => {
                    setSearchText('');
                    setViewResults(false);
                  }}
                />
                <Spacer size={5} />
              </>
            )}
            {viewResults &&
              sortedRecords
                .filter(({ key }) =>
                  key.toLocaleLowerCase().includes(searchText.toLocaleLowerCase()),
                )
                .map(({ key, doc_count, selected }, i: number) => {
                  return (
                    <Checkbox
                      label={key}
                      hint={doc_count}
                      id={`content-source-${i}`}
                      key={`content-source-${i}`}
                      isChecked={selected || false}
                      onChange={() => onChange(key)}
                    />
                  );
                })}
            {!viewResults &&
              recordsToShow.map(({ key, doc_count, selected }, i: number) => {
                return (
                  <Checkbox
                    label={key}
                    hint={doc_count}
                    id={`content-source-${i}`}
                    key={`content-source-${i}`}
                    isChecked={selected || false}
                    onChange={() => onChange(key)}
                  />
                );
              })}
            {!viewResults && renderShowMore}
          </Styled.facetCollapsiblePanel>
        )}
      </Styled.facetLayout>
    </Styled.facet>
  );
};

export default Facet;
