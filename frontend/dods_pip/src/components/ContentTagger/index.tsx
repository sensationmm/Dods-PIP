import React from 'react';

import fetchJson from '../../lib/fetchJson';
import color from '../../globals/color';
import MockTags from '../../mocks/data/tagging.json';
import { ucFirst } from '../../utils/string';
import Checkbox from '../_form/Checkbox';
import Toggle from '../_form/Toggle';
import Spacer from '../_layout/Spacer';
import Button from '../Button';
import Chip from '../Chips';
import Icon, { IconSize } from '../Icon';
import { Icons } from '../Icon/assets';
import IconButton from '../IconButton';
import Text from '../Text';
import * as Styled from './ContentTagger.styles';

type TagsData = {
  id: string;
  termName: string;
  childTerms?: TagsData[];
};

interface SelectedTags extends TagsData {
  instances?: number;
}

export interface ContentTaggerProps {
  tags: SelectedTags[];
  setTags: (tags: TagsData[]) => void;
}

type TagPanelProps = {
  title: string;
  selectedTags: ContentTaggerProps['tags'];
  disabled?: boolean;
  deleteSelected: (tag: TagsData) => void;
};

const tagTypes = [
  { id: 0, label: 'geographies' },
  { id: 1, label: 'organisations' },
  { id: 2, label: 'people' },
  { id: 3, label: 'topics' },
];

const TagPanel: React.FC<TagPanelProps> = ({
  title,
  selectedTags,
  disabled = false,
  deleteSelected,
}) => {
  const [isOpen, setIsOpen] = React.useState<boolean>(true);

  return (
    <Styled.tagPanel disabled={disabled}>
      <Styled.tagPanelHeader>
        <Styled.tagPanelHeaderText open={isOpen} onClick={() => setIsOpen(!isOpen)}>
          <Icon src={Icons.ChevronDownBold} size={IconSize.mediumLarge} />
          <Text type="body">{title}</Text>
        </Styled.tagPanelHeaderText>
      </Styled.tagPanelHeader>
      <Styled.tagPanelContent open={isOpen}>
        {selectedTags.length > 0 ? (
          selectedTags.map((tag, count) => {
            let tagLabel = tag.termName;
            if (tag.instances !== undefined) {
              tagLabel += ` (${tag.instances})`;
            }
            return (
              <Styled.tag key={`tag-${tag.type}-${count}`}>
                <Chip theme="dark" label={tagLabel} onCloseClick={() => deleteSelected(tag)} />
              </Styled.tag>
            );
          })
        ) : (
          <Text type="bodySmall" color={color.base.greyDark}>
            No tag added
          </Text>
        )}
      </Styled.tagPanelContent>
    </Styled.tagPanel>
  );
};

type TagTreeProps = {
  tag: TagsData;
  addedTags: TagsData[];
  addedTagsToSave: TagsData[];
  onChange: (tag: TagsData) => void;
};

const TagTree: React.FC<TagTreeProps> = ({ tag, addedTags, addedTagsToSave, onChange }) => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  const numChildren = tag.childTerms ? tag.childTerms.length : 0;
  const label = numChildren > 0 ? `${tag.termName} (${numChildren})` : tag.termName;

  const allTags = addedTags.concat(addedTagsToSave);

  // let childrenSelected = 0;
  // let current = tag;
  // let hasChildren = current?.childTerms?.length > 0;

  // const countSelectedChildren = (tag: TagsData) => {
  //   tag.childTerms?.forEach((term) => {
  //     if (allTags.find((t) => t.id === term.id) !== undefined) {
  //       childrenSelected++;
  //     }
  //   });

  //   if()
  // };

  // while (hasChildren) {
  //   current.childTerms?.forEach((term) => {
  //     if (allTags.find((t) => t.id === term.id) !== undefined) {
  //       childrenSelected++;
  //     }
  //   });
  //   current;
  // }

  return (
    <>
      <Styled.tagTree>
        <Checkbox
          id={`browse-${tag.id}`}
          key={`browse-${tag.id}`}
          label={label}
          isChecked={allTags.find((t) => t.id === tag.id) !== undefined}
          onChange={() => onChange(tag)}
          isDisabled={addedTagsToSave.find((t) => t.id === tag.id) !== undefined}
        />
        {numChildren > 0 && (
          <Styled.tagTreeToggle onClick={() => setIsOpen(!isOpen)}>
            <Icon
              src={isOpen ? Icons.ChevronDownBold : Icons.ChevronRightBold}
              size={IconSize.medium}
              color={color.base.greyDark}
            />
          </Styled.tagTreeToggle>
        )}
      </Styled.tagTree>

      {numChildren > 0 && (
        <Styled.tagTreeChildren open={isOpen}>
          {tag.childTerms?.map((child) => (
            <TagTree
              key={`tag-tree-${child.id}`}
              tag={child}
              addedTags={addedTags}
              addedTagsToSave={addedTagsToSave}
              onChange={onChange}
            />
          ))}
        </Styled.tagTreeChildren>
      )}
    </>
  );
};

const ContentTagger: React.FC<ContentTaggerProps> = ({ tags }) => {
  const [tagsData, setTagsData] = React.useState<TagsData[]>(MockTags as unknown as TagsData[]);
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [editing, setEditing] = React.useState<string>();
  const [addedTags, setAddedTags] = React.useState<TagsData[]>([]);
  const [addedTagsToSave, setAddedTagsToSave] = React.useState<TagsData[]>([]);
  const [selectedTags, setSelectedTags] = React.useState<TagsData[]>([]);
  const [showTagBrowser, setShowTagBrowser] = React.useState<boolean>(true);
  const [isBrowsing, setIsBrowsing] = React.useState<boolean>(false);
  const [activeTab, setActiveTab] = React.useState<number>(0);
  const [closeWarning, setCloseWarning] = React.useState<boolean>(false);

  const manageAddedTags = (tag: TagsData) => {
    const currentTags = addedTags.slice();

    const foundID = addedTags.find((t) => t.id === tag.id);

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

  const handleOnClear = () => {
    setAddedTags([]);
  };

  const flatten = (tags: TagsData[]): Array<string> => {
    const flat: Array<string> = [];
    tags.forEach((tag: TagsData) => {
      if (Array.isArray(tag.childTerms) && tag.childTerms.length > 0) {
        flat.push(tag.id);
        flat.push(...flatten(tag.childTerms));
      } else {
        flat.push(tag.id);
      }
    });

    return flat;
  };

  const handleClose = () => {
    if (addedTagsToSave.length > 0) {
      setCloseWarning(true);
    } else {
      setAddedTags([]);
      setShowTagBrowser(false);
    }
  };

  const confirmAndClose = () => {
    setAddedTagsToSave([]);
    setCloseWarning(false);
    setShowTagBrowser(false);
  };

  const currentTags = tags.concat(addedTags);
  const numChanges = addedTagsToSave.length;

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
            <Styled.box tags={false} onClick={() => setShowTagBrowser(!showTagBrowser)}>
              <Styled.search>
                <div>
                  <Text type="bodyLarge" bold>
                    {!showTagBrowser && (addedTagsToSave.length > 0 || addedTags.length > 0)
                      ? 'Search in progress'
                      : 'Search or browse'}
                  </Text>
                  <Spacer />
                  <Text type="bodySmall" color={color.base.greyDark}>
                    Highlighted word: none
                  </Text>
                </div>
                <Styled.searchButton>
                  <Icon src={Icons.SearchBold} size={IconSize.mediumLarge} />
                </Styled.searchButton>
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
                {tagTypes.map((type) => (
                  <>
                    <TagPanel
                      key={`panel-${type.label}`}
                      title={ucFirst(type.label)}
                      selectedTags={currentTags.filter((tag) => tag.type == type.label)}
                      disabled={
                        (addedTags.length > 0 && editing && editing !== type.label) || false
                      }
                    />
                    <Spacer size={6} />
                  </>
                ))}
              </Styled.content>
            </Styled.box>
          </>
        )}
      </Styled.wrapper>

      {showTagBrowser && (
        <Styled.browserWindow>
          <Styled.browser>
            <Styled.box tags={false}>
              <Styled.header>
                <Styled.headerText>
                  <Icon src={Icons.Search} size={IconSize.xlarge} />
                  <Text type="h2" headingStyle="title" bold>
                    Search new tags
                  </Text>
                </Styled.headerText>
                <Styled.toggle>
                  <Toggle
                    isActive={isBrowsing}
                    onChange={() => setIsBrowsing(!isBrowsing)}
                    labelOff="Search"
                    labelOn="Browse"
                  />
                </Styled.toggle>
              </Styled.header>
              <Spacer size={9} />
              <Styled.tabs>
                {tagTypes.map((type) => (
                  <Styled.tab
                    key={`tab-${type.id}`}
                    active={activeTab === type.id}
                    onClick={() => setActiveTab(type.id)}
                  >
                    <Text
                      type="body"
                      color={activeTab === type.id ? color.theme.blueDark : color.base.greyDark}
                      bold={activeTab === type.id}
                      center
                    >
                      {ucFirst(type.label)} (
                      {flatten(tagsData[type.label as string] as TagsData[]).length})
                    </Text>
                  </Styled.tab>
                ))}
              </Styled.tabs>
              <Styled.tabContentMask>
                <Styled.tabContent>
                  {tagsData[tagTypes[activeTab as number].label as string]
                    .sort((a: TagsData, b: TagsData) => (a.termName > b.termName ? 1 : -1))
                    .map((tag: TagsData, count: number) => (
                      <TagTree
                        key={`tag-tree-${count}`}
                        tag={tag}
                        addedTags={addedTags}
                        addedTagsToSave={addedTagsToSave}
                        onChange={manageAddedTags}
                      />
                    ))}
                </Styled.tabContent>
              </Styled.tabContentMask>

              <Styled.actions>
                <Text type="span" color={color.base.greyDark}>
                  Total{' '}
                  <strong style={{ color: color.theme.blueMid }}>
                    {
                      flatten(tagsData[tagTypes[activeTab as number].label as string] as TagsData[])
                        .length
                    }
                  </strong>{' '}
                  items
                </Text>

                <Styled.actionsButton>
                  {addedTags.length > 0 && (
                    <Text type="span" color={color.base.greyDark}>
                      <strong style={{ color: color.theme.blueMid }}>{addedTags.length}</strong>{' '}
                      Taxonomies selected
                    </Text>
                  )}
                  <Button
                    type="secondary"
                    isSmall
                    icon={Icons.ChevronRightBold}
                    iconAlignment="right"
                    label="Add to selection"
                    onClick={handleAddToSelection}
                    disabled={addedTags.length === 0}
                  />
                </Styled.actionsButton>
              </Styled.actions>
            </Styled.box>

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
                {numChanges > 0 ? (
                  tagTypes
                    .filter(
                      (type) => addedTagsToSave.filter((tag) => tag.type == type.label).length > 0,
                    )
                    .map((type) => (
                      <>
                        <TagPanel
                          key={`panel-${type.label}`}
                          title={ucFirst(type.label)}
                          selectedTags={addedTagsToSave.filter((tag) => tag.type == type.label)}
                          deleteSelected={onDeleteSelected}
                        />
                        <Spacer size={6} />
                      </>
                    ))
                ) : (
                  <Styled.instructions>
                    <Text type="h3" headingStyle="titleSmall" color={color.theme.blue}>
                      How it works
                    </Text>
                    <ol>
                      <Text type="li" color={color.base.greyDark}>
                        {isBrowsing ? 'Browse' : 'Search'} for a taxonomy
                      </Text>
                      <Text type="li" color={color.base.greyDark}>
                        Select the taxonomies needed
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
                  <Button isSmall icon={Icons.TickBold} label="Apply selection" />
                </Styled.browserActions>
              )}

              <Styled.controls>
                <IconButton
                  type="secondary"
                  isSmall
                  icon={Icons.Minus}
                  onClick={() => setShowTagBrowser(false)}
                />
                <IconButton type="secondary" isSmall icon={Icons.CrossBold} onClick={handleClose} />
              </Styled.controls>
            </Styled.box>

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
                    <Text>All tags added to the selection will be lost.</Text>
                  </div>
                </Styled.closeWarningText>

                <Styled.actions>
                  <Text type="span" color={color.base.greyDark}>
                    Total{' '}
                    <strong style={{ color: color.theme.blueMid }}>
                      {
                        flatten(
                          tagsData[tagTypes[activeTab as number].label as string] as TagsData[],
                        ).length
                      }
                    </strong>{' '}
                    items
                  </Text>

                  <Styled.actionsButton>
                    {addedTags.length > 0 && (
                      <Text type="span" color={color.base.greyDark}>
                        <strong style={{ color: color.theme.blueMid }}>{addedTags.length}</strong>{' '}
                        Taxonomies selected
                      </Text>
                    )}
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
          </Styled.browser>
        </Styled.browserWindow>
      )}
    </>
  );
};

export default ContentTagger;
