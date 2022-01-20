import React from 'react';

import color from '../../globals/color';
import Chips from '../Chips';
import Icon, { IconSize } from '../Icon';
import { Icons } from '../Icon/assets';
import Text from '../Text';
import { ContentTaggerProps } from './';
import * as Styled from './ContentTagger.styles';
import { TagsData } from './TagBrowser';

type TagPanelProps = {
  title: string;
  selectedTags: ContentTaggerProps['tags'];
  deleteSelected: (tag: TagsData) => void;
  isMain?: boolean;
};

const TagPanel: React.FC<TagPanelProps> = ({
  title,
  selectedTags,
  deleteSelected,
  isMain = false,
}) => {
  const [isOpen, setIsOpen] = React.useState<boolean>(true);

  return (
    <Styled.tagPanel>
      <Styled.tagPanelHeader>
        <Styled.tagPanelHeaderText open={isOpen} onClick={() => setIsOpen(!isOpen)}>
          <Icon src={Icons.ChevronDownBold} size={IconSize.mediumLarge} />
          <Text type="body">{title}</Text>
        </Styled.tagPanelHeaderText>
      </Styled.tagPanelHeader>
      <Styled.tagPanelContent open={isOpen}>
        {selectedTags.length > 0 ? (
          selectedTags.map((tag, count) => {
            let termLabel = tag.termLabel; // @TODO: remove termName when API catches up
            if (tag.instances !== undefined) {
              termLabel += ` (${tag.instances})`;
            }
            return (
              <Styled.tag key={`tag-${tag.type}-${count}`}>
                <Chips
                  theme="dark"
                  label={termLabel}
                  onCloseClick={() => deleteSelected(tag)}
                  hasFlash={isMain}
                />
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

export default TagPanel;
