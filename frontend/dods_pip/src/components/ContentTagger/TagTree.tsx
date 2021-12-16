import React from 'react';

import color from '../../globals/color';
import Checkbox from '../_form/Checkbox';
import Icon, { IconSize } from '../Icon';
import { Icons } from '../Icon/assets';
import Text from '../Text';
import { TagsData } from './';
import * as Styled from './ContentTagger.styles';

type TagTreeProps = {
  tag: TagsData;
  existingTags: TagsData[];
  addedTags: TagsData[];
  addedTagsToSave: TagsData[];
  onChange: (tag: TagsData) => void;
};

const TagTree: React.FC<TagTreeProps> = ({
  tag,
  existingTags,
  addedTags,
  addedTagsToSave,
  onChange,
}) => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  const numChildren = tag.childTerms ? tag.childTerms.length : 0;
  const termLabel = tag.termLabel || tag.termName; // @TODO: remove termName when API catches up
  const label = numChildren > 0 ? `${termLabel} (${numChildren})` : termLabel;

  const allTags = existingTags.concat(addedTags.concat(addedTagsToSave));

  let childrenSelected = 0;

  const countSelectedChildren = (tag: TagsData) => {
    tag.childTerms?.forEach((child) => {
      if (allTags.find((t) => t.id === child.id) !== undefined) {
        childrenSelected++;
      }
      countSelectedChildren(child);
    });
  };

  countSelectedChildren(tag);

  const termId = tag.tagId || tag.id; // @TODO remove tag.id when API catches up
  const isChecked = allTags.find((t) => t.id === termId) !== undefined;

  return (
    <>
      <Styled.tagTreeWrapper>
        <Styled.tagTree>
          <Checkbox
            id={`browse-${termId}`}
            key={`browse-${termId}`}
            label={label}
            isChecked={isChecked}
            bold={isChecked}
            onChange={() => onChange(tag)}
            isDisabled={
              existingTags
                .concat(addedTagsToSave)
                .find((t) => t.id === termId || t.tagId === termId) !== undefined // @TODO remove tag.id when API catches up
            }
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
        {!isOpen && childrenSelected > 0 && (
          <Styled.counter>
            <Text type="bodySmall" bold color={color.base.white}>
              {childrenSelected}
            </Text>
          </Styled.counter>
        )}
      </Styled.tagTreeWrapper>

      {isOpen && numChildren > 0 && (
        <Styled.tagTreeChildren>
          {tag.childTerms?.map((child) => (
            <TagTree
              key={`tag-tree-${child.id}`}
              tag={child}
              existingTags={existingTags}
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

export default TagTree;
