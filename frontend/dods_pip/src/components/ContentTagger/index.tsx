import debounce from 'lodash/debounce';
import React, { useEffect, useMemo } from 'react';

import color from '../../globals/color';
import fetchJson from '../../lib/fetchJson';
import { Api, BASE_URI } from '../../utils/api';
import { ucFirst } from '../../utils/string';
import Checkbox from '../_form/Checkbox';
import InputSearch from '../_form/InputSearch';
import Label from '../_form/Label';
import RadioGroup from '../_form/RadioGroup';
import Toggle from '../_form/Toggle';
import Spacer from '../_layout/Spacer';
import Button from '../Button';
import Chips from '../Chips';
import Icon, { IconSize } from '../Icon';
import { Icons } from '../Icon/assets';
import IconButton from '../IconButton';
import Loader from '../Loader';
import Text from '../Text';
import * as Styled from './ContentTagger.styles';
import TagPanel from './TagPanel';
import TagTree from './TagTree';

type TagTreeDataType = 'people' | 'organisations' | 'topics' | 'geographies';

type TagTreeData = {
  people: TagsData[];
  organisations: TagsData[];
  topics: TagsData[];
  geographies: TagsData[];
};

type TagsSearchDataItem = {
  hitCount: number;
  results: TagsData[];
};

type TagSearchData = {
  people: TagsSearchDataItem;
  organisations: TagsSearchDataItem;
  topics: TagsSearchDataItem;
  geographies: TagsSearchDataItem;
};

export type TagsData = {
  tagId: string;
  termLabel: string;
  alternative_labels?: Array<string>;
  childTerms?: TagsData[];
  ancestorTerms?: TagsData[];
  type?: string;
};

interface SelectedTags extends TagsData {
  instances?: number;
}

export interface ContentTaggerProps {
  tags: SelectedTags[];
  setTags: (tags: TagsData[]) => void;
  highlight?: string;
  highlightWordCount?: number;
}

const tagTypes = [
  { id: 0, label: 'Topics' },
  { id: 1, label: 'Geographies' },
  { id: 2, label: 'Organisations' },
  { id: 3, label: 'People' },
];

const ContentTagger: React.FC<ContentTaggerProps> = ({
  tags,
  setTags,
  highlight,
  highlightWordCount,
}) => {
  const [isFirstLoad, setIsFirstLoad] = React.useState<boolean>(true);
  const [fetchingTagsData, setFetchingTagsData] = React.useState<boolean>(false);
  const [searchingTagsData, setSearchingTagsData] = React.useState<boolean>(false);
  const [tagsData, setTagsData] = React.useState<TagTreeData>();
  const [tagsSearch, setTagsSearch] = React.useState<TagSearchData>();
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [addedTags, setAddedTags] = React.useState<TagsData[]>([]);
  const [addedTagsToSave, setAddedTagsToSave] = React.useState<TagsData[]>([]);
  const [showTagBrowser, setShowTagBrowser] = React.useState<boolean>(false);
  const [isBrowsing, setIsBrowsing] = React.useState<boolean>(false);
  const [activeTab, setActiveTab] = React.useState<number>(0);
  const [closeWarning, setCloseWarning] = React.useState<boolean>(false);
  const [multipleWarning, setMultipleWarning] = React.useState<boolean>(false);
  const [clearWarning, setClearWarning] = React.useState<boolean>(false);
  const [taxonomySearch, setTaxonomySearch] = React.useState<string>('');
  const [highlightApply, setHighlightApply] = React.useState<string>('one');

  const hasTagTree = tagsData && Object.keys(tagsData).length !== 0;
  const hasSearchResults = tagsSearch && Object.keys(tagsSearch).length !== 0;

  const loadTree = async () => {
    setFetchingTagsData(true);
    const response = await fetchJson(`${BASE_URI}${Api.TaxonomyTree}`);
    setTagsData(response as unknown as TagTreeData);
    setFetchingTagsData(false);
  };

  const debounceSearchTags = debounce(async (tag: string) => {
    setSearchingTagsData(true);
    const response = await fetchJson(`${BASE_URI}${Api.TaxonomySearch}/${tag}`);
    setTagsSearch(response as unknown as TagSearchData);
    setSearchingTagsData(false);
  }, 500);

  const searchTags = useMemo(() => debounceSearchTags, []);

  useEffect(() => {
    showTagBrowser && isBrowsing && !fetchingTagsData && !hasTagTree && loadTree();
  }, [showTagBrowser, isBrowsing]);

  useEffect(() => {
    taxonomySearch !== '' && searchTags(taxonomySearch);
  }, [taxonomySearch]);

  const manageAddedTags = (tag: TagsData) => {
    const currentTags = addedTags.slice();

    const foundID = addedTags.find((t) => t.tagId === tag.tagId);

    if (foundID !== undefined) {
      currentTags.splice(currentTags.indexOf(foundID), 1);
    } else {
      currentTags.push({ ...tag, type: tagTypes[activeTab].label });
    }

    setAddedTags(currentTags);
  };

  const onDeleteSelected = (tag: TagsData) => {
    const currentTags = addedTagsToSave.slice();

    currentTags.splice(currentTags.indexOf(tag), 1);

    setAddedTagsToSave(currentTags);
  };

  const handleAddToSelection = () => {
    setAddedTagsToSave(addedTagsToSave.concat(addedTags));
    setAddedTags([]);
  };

  const handleSaveToHighlight = () => {
    setTags(addedTags);
  };

  const handleAddToHighlight = () => {
    if (highlightWordCount && highlightWordCount > 1) {
      setMultipleWarning(true);
    } else {
      handleSaveToHighlight();
    }
  };

  const handleOnClear = () => {
    setAddedTags([]);
    setTags([]);
    setClearWarning(false);
  };

  const handleSave = () => {
    setCloseWarning(false);
    setShowTagBrowser(false);
    setTags(tags.concat(addedTagsToSave));
    setAddedTagsToSave([]);
    setTaxonomySearch('');
    setTagsSearch(undefined);
  };

  const deleteTag = (tag: TagsData) => {
    const current = tags.slice();

    current.splice(current.indexOf(tag), 1);

    setTags(current);
  };

  const flatten = (tags: TagsData[]): Array<string> => {
    const flat: Array<string> = [];
    tags.forEach((tag: TagsData) => {
      if (Array.isArray(tag.childTerms) && tag.childTerms.length > 0) {
        flat.push(tag.tagId);
        flat.push(...flatten(tag.childTerms));
      } else {
        flat.push(tag.tagId);
      }
    });

    return flat;
  };

  const handleClose = () => {
    if (addedTagsToSave.length > 0 || (highlight !== undefined && addedTags.length > 0)) {
      setCloseWarning(true);
    } else {
      setAddedTags([]);
      setShowTagBrowser(false);
      setTaxonomySearch('');
      setTagsSearch(undefined);
    }
  };

  const confirmAndClose = () => {
    setAddedTags([]);
    setAddedTagsToSave([]);
    setCloseWarning(false);
    setShowTagBrowser(false);
    setTaxonomySearch('');
    setTagsSearch(undefined);
  };

  const onSearch = (val: string) => {
    if (val === '') {
      setTagsSearch(undefined);
    }
    setTaxonomySearch(val);
  };

  const highlightSearch = (val: string) => {
    const found = val.toLowerCase().indexOf(taxonomySearch.toLowerCase());

    const pre = val.substring(0, found);
    const highlight = val.substring(found, found + taxonomySearch.length);
    const post = val.substring(found + taxonomySearch.length, val.length);

    return (
      <>
        {pre}
        <strong>{highlight}</strong>
        {post}
      </>
    );
  };

  const controls = (
    <Styled.controls>
      <IconButton
        type="secondary"
        isSmall
        icon={Icons.Minus}
        onClick={() => setShowTagBrowser(false)}
      />
      <IconButton type="secondary" isSmall icon={Icons.CrossBold} onClick={handleClose} />
    </Styled.controls>
  );

  const showHighlight = (isWarning = false) => {
    return (
      <Styled.highlight>
        <Text type={isWarning ? 'body' : 'bodySmall'} color={color.base.greyDark}>
          Highlighted word:
        </Text>
        <Text
          type={isWarning ? 'body' : 'bodySmall'}
          bold={highlight !== undefined}
          color={highlight ? color.accent.orange : color.base.greyDark}
        >
          {highlight || 'No word highlighted'}
        </Text>
      </Styled.highlight>
    );
  };

  const addedTagsMessage =
    addedTags.length > 0 &&
    (highlight !== undefined ? (
      <Text type="span" color={color.base.greyDark}>
        Tag selected:{' '}
        <strong style={{ color: color.theme.blueMid }}>{addedTags[0].termLabel}</strong>
      </Text>
    ) : (
      <Text type="span" color={color.base.greyDark}>
        <strong style={{ color: color.theme.blueMid }}>{addedTags.length}</strong> Tags selected
      </Text>
    ));

  const searchInProgress = !showTagBrowser && (addedTagsToSave.length > 0 || addedTags.length > 0);

  return (
    <>
      <Styled.wrapper data-test="component-content-tagger" collapsed={isCollapsed}>
        {isCollapsed ? (
          <Styled.box tags={false}>
            <Styled.content>
              <Styled.collapsed>
                <Styled.headerText>
                  <Icon src={Icons.Tag} size={IconSize.xlarge} />
                  <Text type="bodyLarge" bold>
                    Tagging
                  </Text>
                </Styled.headerText>
                <Styled.expand onClick={() => setIsCollapsed(false)}>
                  <Icon src={Icons.ChevronLeftBold} />
                  <Text type="body" bold color={color.theme.blueMid}>
                    Expand
                  </Text>
                </Styled.expand>
              </Styled.collapsed>
            </Styled.content>
          </Styled.box>
        ) : (
          <>
            <Styled.box
              tags={false}
              onClick={() => {
                setIsFirstLoad(false);
                setShowTagBrowser(!showTagBrowser);
              }}
            >
              <Styled.search inProgress={searchInProgress}>
                <div>
                  <Text type="bodyLarge" bold>
                    {searchInProgress ? 'Search in progress' : 'Search tags'}
                  </Text>
                  <Spacer />
                  {showHighlight()}
                </div>
                <Styled.searchButton>
                  <Icon src={Icons.ChevronRightBold} size={IconSize.medium} />
                </Styled.searchButton>
                <Styled.inProgress>
                  <Icon src={Icons.Issue} size={IconSize.mediumLarge} color={color.base.white} />
                </Styled.inProgress>
              </Styled.search>
            </Styled.box>

            <Spacer size={4} />

            <Styled.box tags>
              <Styled.header>
                <Styled.headerText>
                  <Icon src={Icons.Tag} size={IconSize.xlarge} />
                  <Text type="bodyLarge" bold>
                    Tags
                  </Text>
                </Styled.headerText>
                <div onClick={() => setIsCollapsed(true)}>
                  <Icon
                    src={Icons.ChevronRight}
                    size={IconSize.xlarge}
                    color={color.base.greyDark}
                  />
                </div>
              </Styled.header>
              <hr />

              <Styled.content>
                <Styled.autoTag>
                  <Toggle isSmall labelOn="Auto tag" isDisabled onChange={console.log} />
                  <Styled.autoTagButtons>
                    <Button type="text" label="Refresh" icon={Icons.Refresh} isSmall disabled />
                    <Button
                      type="text"
                      label="Clear"
                      icon={Icons.Bin}
                      isSmall
                      onClick={() => setClearWarning(true)}
                    />
                  </Styled.autoTagButtons>
                </Styled.autoTag>
                <Spacer size={6} />
                {tagTypes.map((type) => (
                  <div key={`panel-${type.label}`}>
                    <TagPanel
                      title={ucFirst(type.label)}
                      selectedTags={tags.filter((tag) => tag.type == type.label)}
                      deleteSelected={deleteTag}
                      isMain={!isFirstLoad}
                    />
                    <Spacer size={6} />
                  </div>
                ))}
              </Styled.content>

              {clearWarning && (
                <Styled.clear>
                  <Text center bold>
                    Do you want to clear all tags?
                  </Text>
                  <Spacer size={6} />
                  <Button
                    type="secondary"
                    width="full"
                    label="Back"
                    onClick={() => setClearWarning(false)}
                  />
                  <Spacer size={2} />
                  <Button width="full" label="Clear tags" onClick={handleOnClear} />
                </Styled.clear>
              )}
            </Styled.box>
          </>
        )}
      </Styled.wrapper>

      {showTagBrowser && (
        <Styled.browserWindow>
          <Styled.browser hasHighlight={highlight !== undefined}>
            <Styled.box tags={false}>
              <Styled.header>
                <Styled.headerText>
                  <Icon src={Icons.Search} size={IconSize.xlarge} />
                  <Text type="h2" headingStyle="title" bold>
                    Search new tags
                  </Text>
                </Styled.headerText>
                {!highlight && (
                  <Styled.toggle>
                    <Toggle
                      isActive={isBrowsing}
                      onChange={() => setIsBrowsing(!isBrowsing)}
                      labelOff="Search"
                      labelOn="Browse"
                    />
                  </Styled.toggle>
                )}
              </Styled.header>

              {!isBrowsing && (
                <Styled.contentPadded>
                  <InputSearch
                    id="search-taxonomies"
                    label="Search tags"
                    value={taxonomySearch}
                    onChange={onSearch}
                  />
                  <Spacer size={2} />
                  {showHighlight()}
                </Styled.contentPadded>
              )}
              <Spacer size={9} />

              <>
                <Styled.tabs>
                  {tagTypes.map((type) => {
                    const disableTab = !isBrowsing && taxonomySearch === '';
                    return (
                      <Styled.tab
                        key={`tab-${type.id}`}
                        active={activeTab === type.id}
                        disabled={disableTab}
                        onClick={() => setActiveTab(type.id)}
                      >
                        <Text
                          type="body"
                          color={
                            disableTab
                              ? color.base.greyMid
                              : activeTab === type.id
                              ? color.theme.blueDark
                              : color.base.greyDark
                          }
                          bold={activeTab === type.id && !disableTab}
                          center
                        >
                          {ucFirst(type.label)}
                          {isBrowsing && hasTagTree && tagsData
                            ? ` (${new Intl.NumberFormat().format(
                                flatten(tagsData[type.label as TagTreeDataType] as TagsData[])
                                  .length,
                              )})`
                            : !isBrowsing && !searchingTagsData && tagsSearch
                            ? ` (${new Intl.NumberFormat().format(
                                flatten(
                                  tagsSearch[type.label as TagTreeDataType].results as TagsData[],
                                ).length,
                              )})`
                            : ''}
                        </Text>
                      </Styled.tab>
                    );
                  })}
                </Styled.tabs>
                <Styled.tabContentMask>
                  {isBrowsing ? (
                    !hasTagTree ? (
                      <Styled.tabContent>
                        <Loader inline />
                      </Styled.tabContent>
                    ) : (
                      <Styled.tabContent>
                        {tagsData &&
                          tagsData[tagTypes[activeTab as number].label as TagTreeDataType]
                            .sort((a: TagsData, b: TagsData) =>
                              a.termLabel > b.termLabel ? 1 : -1,
                            )
                            .map((tag: TagsData, count: number) => (
                              <TagTree
                                key={`tag-tree-${activeTab}-${count}`}
                                tag={tag}
                                existingTags={tags}
                                addedTags={addedTags}
                                addedTagsToSave={addedTagsToSave}
                                onChange={manageAddedTags}
                              />
                            ))}
                      </Styled.tabContent>
                    )
                  ) : (
                    <Styled.tabContent isSearch>
                      {!hasSearchResults && !searchingTagsData ? (
                        <Text center color={color.base.greyDark}>
                          Start searching to see results
                        </Text>
                      ) : searchingTagsData ? (
                        <Loader inline />
                      ) : tagsSearch &&
                        tagsSearch[tagTypes[activeTab as number].label as TagTreeDataType].results
                          .length > 0 ? (
                        <Styled.tagSearch>
                          <Text bold>Name</Text>
                          <Text bold>Taxonomy root</Text>
                          {tagsSearch[
                            tagTypes[activeTab as number].label as TagTreeDataType
                          ].results
                            .sort((a: TagsData, b: TagsData) =>
                              a.termLabel > b.termLabel ? 1 : -1,
                            )
                            .map((tag: TagsData) => {
                              const allTags = tags.concat(addedTags.concat(addedTagsToSave));
                              const isChecked =
                                allTags.find((t) => t.tagId === tag.tagId) !== undefined;

                              let label = tag.termLabel;

                              if (
                                tag.alternative_labels &&
                                tag.alternative_labels.length > 0 &&
                                tag.termLabel.indexOf(taxonomySearch) < 0
                              ) {
                                let alt = '';
                                let count = 0;
                                while (alt === '' && count < tag.alternative_labels.length) {
                                  const altLabel = tag.alternative_labels[count];
                                  if (
                                    altLabel.toLowerCase().indexOf(taxonomySearch.toLowerCase()) > 0
                                  ) {
                                    alt = ` (${altLabel})`;
                                  } else {
                                    count++;
                                  }
                                }
                                label += alt;
                              }

                              const disableOption =
                                (highlight !== undefined &&
                                  addedTags.length > 0 &&
                                  addedTags[0].tagId !== tag.tagId) ||
                                tags.concat(addedTagsToSave).find((t) => t.tagId === tag.tagId) !==
                                  undefined;

                              return [
                                <Styled.searchCheckbox key={`search-checkbox-${tag.tagId}`}>
                                  <Checkbox
                                    id={`browse-${tag.tagId}`}
                                    isChecked={isChecked}
                                    onChange={() => manageAddedTags(tag)}
                                    isDisabled={disableOption}
                                  />
                                  <Label
                                    htmlFor={`browse-${tag.tagId}`}
                                    label={highlightSearch(label)}
                                    isDisabled={disableOption}
                                  />
                                </Styled.searchCheckbox>,
                                <div key={`search-ancestors-${tag.tagId}`}>
                                  <Text>
                                    /
                                    {tag.ancestorTerms &&
                                      tag.ancestorTerms[0] &&
                                      tag.ancestorTerms[0].termLabel}
                                  </Text>
                                </div>,
                              ];
                            })}
                        </Styled.tagSearch>
                      ) : (
                        <Text center color={color.base.greyDark}>
                          {tagTypes[activeTab as number].label} tags not found for{' '}
                          <strong>{taxonomySearch}</strong>
                        </Text>
                      )}
                    </Styled.tabContent>
                  )}
                </Styled.tabContentMask>
              </>

              <Styled.actions>
                {isBrowsing && hasTagTree ? (
                  <Text type="span" color={color.base.greyDark}>
                    Total{' '}
                    <strong style={{ color: color.theme.blueMid }}>
                      {tagsData
                        ? new Intl.NumberFormat().format(
                            flatten(
                              tagsData[tagTypes[activeTab].label as TagTreeDataType] as TagsData[],
                            ).length,
                          )
                        : '-'}
                    </strong>{' '}
                    items
                  </Text>
                ) : !isBrowsing && !searchingTagsData && tagsSearch ? (
                  <Text type="span" color={color.base.greyDark}>
                    Total{' '}
                    <strong style={{ color: color.theme.blueMid }}>
                      {tagsSearch
                        ? flatten(
                            tagsSearch[tagTypes[activeTab].label as TagTreeDataType]
                              .results as TagsData[],
                          ).length
                        : 0}
                    </strong>{' '}
                    items
                  </Text>
                ) : (
                  <div />
                )}

                <Styled.actionsButton>
                  {addedTagsMessage}
                  <Button
                    type="secondary"
                    isSmall
                    icon={Icons.ChevronRightBold}
                    iconAlignment="right"
                    label={highlight !== undefined ? 'Add to content' : 'Add to selection'}
                    onClick={highlight !== undefined ? handleAddToHighlight : handleAddToSelection}
                    disabled={addedTags.length === 0}
                  />
                </Styled.actionsButton>
              </Styled.actions>

              {highlight && controls}
            </Styled.box>

            {!highlight && (
              <Styled.box tags={false}>
                <Styled.header>
                  <Styled.headerText>
                    <Icon src={Icons.Checklist} size={IconSize.xlarge} />
                    <Text type="h2" headingStyle="title" bold>
                      Selected tags
                    </Text>
                  </Styled.headerText>
                </Styled.header>
                <Styled.content>
                  {addedTagsToSave.length > 0 ? (
                    tagTypes
                      .filter(
                        (type) =>
                          addedTagsToSave.filter((tag) => tag.type == type.label).length > 0,
                      )
                      .map((type) => (
                        <div key={`panel-${type.label}`}>
                          <TagPanel
                            title={ucFirst(type.label)}
                            selectedTags={addedTagsToSave.filter((tag) => tag.type == type.label)}
                            deleteSelected={onDeleteSelected}
                          />
                          <Spacer size={6} />
                        </div>
                      ))
                  ) : (
                    <Styled.instructions>
                      <Text type="h3" headingStyle="titleSmall" color={color.theme.blue}>
                        How it works
                      </Text>
                      <ol>
                        <Text type="li" color={color.base.greyDark}>
                          {isBrowsing ? 'Browse' : 'Search'} for a tag
                        </Text>
                        <Text type="li" color={color.base.greyDark}>
                          Select the tags needed
                        </Text>
                        <Text type="li" color={color.base.greyDark}>
                          Click on <strong>‘Add to selection’</strong> to add them to them here
                        </Text>
                        <Text type="li" color={color.base.greyDark}>
                          Save and confirm to add them to the content
                        </Text>
                      </ol>
                    </Styled.instructions>
                  )}
                </Styled.content>
                {addedTagsToSave.length > 0 && (
                  <Styled.browserActions>
                    <Button
                      isSmall
                      icon={Icons.TickBold}
                      label={`Apply selection (${addedTagsToSave.length})`}
                      onClick={handleSave}
                    />
                  </Styled.browserActions>
                )}

                {controls}
              </Styled.box>
            )}

            {closeWarning && (
              <Styled.closeWarning>
                <Styled.headerText>
                  <Icon src={Icons.Search} size={IconSize.xlarge} />
                  <Text type="h2" headingStyle="title" bold>
                    Search new tags
                  </Text>
                </Styled.headerText>
                <Styled.controls>
                  <IconButton
                    type="secondary"
                    isSmall
                    icon={Icons.CrossBold}
                    onClick={() => setCloseWarning(false)}
                  />
                </Styled.controls>

                <Styled.closeWarningText>
                  <div>
                    <Styled.headerText>
                      <Styled.closeWarningAlert>
                        <Icon src={Icons.Alert} color={color.base.white} size={IconSize.medium} />
                      </Styled.closeWarningAlert>
                      <Text type="h3" headingStyle="title" bold>
                        Do you wish to close without saving?
                      </Text>
                    </Styled.headerText>
                    <Spacer size={4} />
                    <Text>
                      {highlight === undefined
                        ? 'All tags added to the selection will be lost.'
                        : 'Tag will not be added to the selection'}
                    </Text>
                  </div>
                </Styled.closeWarningText>

                <Styled.actions>
                  <Text type="span" color={color.base.greyDark}>
                    Total{' '}
                    <strong style={{ color: color.theme.blueMid }}>
                      {isBrowsing
                        ? tagsData
                          ? flatten(
                              tagsData[tagTypes[activeTab].label as TagTreeDataType] as TagsData[],
                            ).length
                          : 0
                        : tagsSearch
                        ? flatten(
                            tagsSearch[tagTypes[activeTab].label as TagTreeDataType]
                              .results as TagsData[],
                          ).length
                        : 0}
                    </strong>{' '}
                    items
                  </Text>

                  <Styled.actionsButton>
                    <Button
                      type="secondary"
                      isSmall
                      label="Back"
                      onClick={() => setCloseWarning(false)}
                    />
                    <Button
                      type="primary"
                      isSmall
                      icon={Icons.Bin}
                      label="Confirm and close"
                      onClick={confirmAndClose}
                    />
                  </Styled.actionsButton>
                </Styled.actions>
              </Styled.closeWarning>
            )}

            {multipleWarning && (
              <Styled.closeWarning>
                <Styled.headerText>
                  <Icon src={Icons.Search} size={IconSize.xlarge} />
                  <Text type="h2" headingStyle="title" bold>
                    Search new tags
                  </Text>
                </Styled.headerText>
                <Styled.controls>
                  <IconButton
                    type="secondary"
                    isSmall
                    icon={Icons.CrossBold}
                    onClick={() => setMultipleWarning(false)}
                  />
                </Styled.controls>

                <Styled.closeWarningText>
                  <div>
                    <Styled.headerText>
                      <Styled.closeWarningAlert>
                        <Icon src={Icons.Alert} color={color.base.white} size={IconSize.medium} />
                      </Styled.closeWarningAlert>
                      <Text type="h3" headingStyle="title" bold>
                        Multiple instances detected
                      </Text>
                    </Styled.headerText>
                    <Spacer size={4} />
                    <hr />
                    <Spacer size={4} />
                    <Text>
                      We have detected the highlighted text multiple times in the content.
                    </Text>
                    <Spacer size={4} />
                    <Styled.multipleWarningInfo>
                      {showHighlight(true)}
                      <Spacer size={2} />
                      <Styled.highlight>
                        <Text color={color.base.greyDark}>Selected tag:</Text>
                        <Chips label={addedTags[0].termLabel} />
                      </Styled.highlight>
                    </Styled.multipleWarningInfo>
                    <Spacer size={6} />

                    <RadioGroup
                      label={<Text bold>Select an action to apply to this instance</Text>}
                      items={[
                        { value: 'one', label: 'Only this instance' },
                        { value: 'all', label: `All instances (${highlightWordCount})` },
                      ]}
                      selectedValue={highlightApply}
                      onChange={setHighlightApply}
                      stackItems
                    />
                  </div>
                </Styled.closeWarningText>

                <Styled.actions>
                  <div />
                  <Styled.actionsButton>
                    <Button
                      type="secondary"
                      isSmall
                      label="Back"
                      onClick={() => setMultipleWarning(false)}
                    />
                    <Button
                      type="primary"
                      isSmall
                      icon={Icons.Bin}
                      label="Confirm and close"
                      onClick={() => handleSaveToHighlight()}
                    />
                  </Styled.actionsButton>
                </Styled.actions>
              </Styled.closeWarning>
            )}
          </Styled.browser>
        </Styled.browserWindow>
      )}
    </>
  );
};

export default ContentTagger;