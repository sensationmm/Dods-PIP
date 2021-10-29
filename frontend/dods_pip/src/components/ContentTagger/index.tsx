import React from 'react';

import color from '../../globals/color';
import Icon, { IconSize } from '../Icon';
import { Icons } from '../Icon/assets';
import Chip from '../Chips';
import Text from '../Text';
import * as Styled from './ContentTagger.styles';
import MockTags from '../../mocks/data/tagging.json';
import Spacer from '../_layout/Spacer';
import Checkbox from '../_form/Checkbox';
import Button from '../Button';

type TagsData = {
  id: string;
  label: string;
  type: 'geographies' | 'organisations' | 'people' | 'topics';
  children?: TagsData[];
};

interface SelectedTags extends TagsData {
  instances: number;
}

export interface ContentTaggerProps {
  tags: SelectedTags[];
  setTags: (tags: TagsData[]) => void;
}

type TagPanelProps = {
  title: string;
  selectedTags: ContentTaggerProps['tags'];
  tagData: TagsData[];
  disabled: boolean;
  onBrowse: () => void;
  onEndBrowse: () => void;
  onChange: (tag: TagsData) => void;
  numChanges: boolean;
  onClear: () => void;
};

const TagPanel: React.FC<TagPanelProps> = ({
  title,
  selectedTags,
  tagData,
  disabled,
  onBrowse,
  onEndBrowse,
  onChange,
  numChanges,
  onClear,
}) => {
  const [isOpen, setIsOpen] = React.useState<boolean>(true);
  const [isBrowse, setIsBrowse] = React.useState(false);

  const handleOnClear = () => {
    onClear();
    setIsBrowse(false);
  };

  return (
    <Styled.tagPanel disabled={disabled}>
      <Styled.tagPanelHeader>
        <Styled.tagPanelHeaderText open={isOpen} onClick={() => setIsOpen(!isOpen)}>
          <Icon src={Icons.ChevronDownBold} size={IconSize.mediumLarge} />
          <Text type="body">{title}</Text>
        </Styled.tagPanelHeaderText>
        {isOpen && !numChanges && (
          <Styled.browse
            onClick={() => {
              isBrowse ? onEndBrowse() : onBrowse();
              setIsBrowse(!isBrowse);
            }}
          >
            <Icon src={!isBrowse ? Icons.Menu : Icons.CrossBold} />
            <Text type="labelSmall" bold>
              {!isBrowse ? 'Browse' : 'Close'}
            </Text>
          </Styled.browse>
        )}
      </Styled.tagPanelHeader>
      <Styled.tagPanelContent open={isOpen}>
        {!isBrowse ? (
          selectedTags.length > 0 ? (
            selectedTags.map((tag, count) => (
              <Styled.tag key={`tag-${tag.type}-${count}`}>
                <Chip theme="dark" label={`${tag.label} (${tag.instances})`} />
              </Styled.tag>
            ))
          ) : (
            <Text type="bodySmall" color={color.base.greyDark}>
              No tag added
            </Text>
          )
        ) : (
          <Styled.browser hasChanges={numChanges > 0}>
            <>
              {tagData
                .sort((a, b) => (a.label > b.label ? 1 : -1))
                .map((tag, count) => {
                  const label =
                    tag.children && tag.children?.length > 0
                      ? `${tag.label} (${tag.children.length})`
                      : tag.label;

                  return (
                    <Checkbox
                      key={`browse-${tag.type}-${count}`}
                      label={label}
                      isChecked={selectedTags.find((t) => t.id === tag.id) !== undefined}
                      onChange={() => onChange(tag)}
                    />
                  );
                })}
              {numChanges > 0 && (
                <Styled.actions>
                  <Button
                    type="secondary"
                    isSmall
                    label="Cancel"
                    icon={Icons.ChevronLeftBold}
                    onClick={handleOnClear}
                  />
                  <Button isSmall label={`Apply (${numChanges})`} icon={Icons.TickBold} />
                </Styled.actions>
              )}
            </>
          </Styled.browser>
        )}
      </Styled.tagPanelContent>
    </Styled.tagPanel>
  );
};

const ContentTagger: React.FC<ContentTaggerProps> = ({ tags }) => {
  const [tagsData] = React.useState<TagsData[]>(MockTags.tags as unknown as TagsData[]);
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [editing, setEditing] = React.useState<string>();
  const [addedTags, setAddedTags] = React.useState<TagsData[]>([]);
  const [removedTags, setRemovedTags] = React.useState<TagsData[]>([]);

  const manageAddedTags = (tag: TagsData) => {
    const currentTags = addedTags.slice();

    const foundID = addedTags.find((t) => t.id === tag.id);

    if (foundID !== undefined) {
      currentTags.splice(currentTags.indexOf(foundID), 1);
    } else {
      currentTags.push(tag);
    }

    setAddedTags(currentTags);
  };

  const manageRemovedTags = (tag: TagsData) => {
    const currentTags = removedTags.slice();

    const foundID = removedTags.find((t) => t.id === tag.id);

    if (foundID !== undefined) {
      currentTags.splice(currentTags.indexOf(foundID, 1));
    } else {
      currentTags.push(tag);
    }

    setRemovedTags(currentTags);
  };

  const changeTag = (tag: TagsData) => {
    if (tags.find((t) => t.id === tag.id)) {
      manageRemovedTags(tag);
    } else {
      manageAddedTags(tag);
    }
  };

  const handleOnClear = () => {
    setAddedTags([]);
    setRemovedTags([]);
  };

  const currentTags = tags
    .concat(addedTags)
    .filter((t) => !removedTags.map((r) => r.id).includes(t.id));

  const numChanges = addedTags.concat(removedTags).length;

  return (
    <Styled.wrapper data-test="component-content-tagger" collapsed={isCollapsed}>
      {isCollapsed ? (
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
      ) : (
        <>
          <Styled.header>
            <Styled.headerText>
              <Icon src={Icons.Tag} size={IconSize.xlarge} />
              <Text type="bodyLarge" bold>
                Tagging
              </Text>
            </Styled.headerText>
            <div onClick={() => setIsCollapsed(true)}>
              <Icon src={Icons.ChevronRight} size={IconSize.xlarge} color={color.base.greyDark} />
            </div>
          </Styled.header>

          <Styled.content>
            <TagPanel
              title="Geographies"
              selectedTags={currentTags.filter((tag) => tag.type == 'geographies')}
              tagData={tagsData.filter((tag) => tag.type === 'geographies')}
              disabled={(addedTags.length > 0 && editing && editing !== 'geographies') || false}
              onBrowse={() => setEditing('geographies')}
              onEndBrowse={setEditing}
              onChange={changeTag}
              numChanges={numChanges > 0 && editing === 'geographies' && numChanges}
              onClear={handleOnClear}
            />
            <Spacer size={6} />
            <TagPanel
              title="Organisations"
              selectedTags={currentTags.filter((tag) => tag.type == 'organisations')}
              tagData={tagsData.filter((tag) => tag.type === 'organisations')}
              disabled={(addedTags.length > 0 && editing && editing !== 'organisations') || false}
              onBrowse={() => setEditing('organisations')}
              onEndBrowse={setEditing}
              onChange={changeTag}
              numChanges={numChanges > 0 && editing === 'organisations' && numChanges}
              onClear={handleOnClear}
            />
            <Spacer size={6} />
            <TagPanel
              title="People"
              selectedTags={currentTags.filter((tag) => tag.type == 'people')}
              tagData={tagsData.filter((tag) => tag.type === 'people')}
              disabled={(addedTags.length > 0 && editing && editing !== 'people') || false}
              onBrowse={() => setEditing('people')}
              onEndBrowse={setEditing}
              onChange={changeTag}
              numChanges={numChanges > 0 && editing === 'people' && numChanges}
              onClear={handleOnClear}
            />
            <Spacer size={6} />
            <TagPanel
              title="Topics"
              selectedTags={currentTags.filter((tag) => tag.type == 'topics')}
              tagData={tagsData.filter((tag) => tag.type === 'topics')}
              disabled={(addedTags.length > 0 && editing && editing !== 'topics') || false}
              onBrowse={() => setEditing('topics')}
              onEndBrowse={setEditing}
              onChange={changeTag}
              numChanges={numChanges > 0 && editing === 'topics' && numChanges}
              onClear={handleOnClear}
            />
          </Styled.content>
        </>
      )}
    </Styled.wrapper>
  );
};

export default ContentTagger;
