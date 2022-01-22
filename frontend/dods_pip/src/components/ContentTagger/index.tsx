import React from 'react';

import color from '../../globals/color';
import { ucFirst } from '../../utils/string';
import Toggle from '../_form/Toggle';
import Spacer from '../_layout/Spacer';
import Button from '../Button';
import Icon, { IconSize } from '../Icon';
import { Icons } from '../Icon/assets';
import Text from '../Text';
import * as Styled from './ContentTagger.styles';
import TagBrowser, { TagsData, tagTypes } from './TagBrowser';
import TagPanel from './TagPanel';

interface SelectedTags extends TagsData {
  instances?: number;
}

export interface ContentTaggerProps {
  tags: SelectedTags[];
  setTags: (tags: TagsData[]) => void;
  highlight?: string;
  highlightWordCount?: number;
}

const ContentTagger: React.FC<ContentTaggerProps> = ({
  tags,
  setTags,
  highlight,
  highlightWordCount,
}) => {
  const [isFirstLoad, setIsFirstLoad] = React.useState<boolean>(true);
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [addedTags, setAddedTags] = React.useState<TagsData[]>([]);
  const [addedTagsToSave, setAddedTagsToSave] = React.useState<TagsData[]>([]);
  const [showTagBrowser, setShowTagBrowser] = React.useState<boolean>(false);
  const [clearWarning, setClearWarning] = React.useState<boolean>(false);

  const handleOnClear = () => {
    setAddedTags([]);
    setTags([]);
    setClearWarning(false);
  };

  const deleteTag = (tag: TagsData) => {
    const current = tags.slice();

    current.splice(current.indexOf(tag), 1);

    setTags(current);
  };

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
        <TagBrowser
          tags={tags}
          setTags={setTags}
          active={showTagBrowser}
          setActive={setShowTagBrowser}
          addedTags={addedTags}
          setAddedTags={setAddedTags}
          addedTagsToSave={addedTagsToSave}
          setAddedTagsToSave={setAddedTagsToSave}
          highlight={highlight}
          highlightWordCount={highlightWordCount}
          showHighlight={showHighlight}
        />
      )}
    </>
  );
};

export default ContentTagger;
