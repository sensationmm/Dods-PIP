import React from 'react';

import color from '../../globals/color';
import Checkbox from '../_form/Checkbox';
import Icon, { IconSize } from '../Icon';
import { Icons } from '../Icon/assets';
import Text from '../Text';
import * as Styled from './ContentTagger.styles';
import { TagsData } from './TagBrowser';

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
  const label = numChildren > 0 ? `${tag.termLabel} (${numChildren})` : tag.termLabel;

  const allTags = existingTags.concat(addedTags.concat(addedTagsToSave));

  let childrenSelected = 0;

  const countSelectedChildren = (tag: TagsData) => {
    tag.childTerms?.forEach((child) => {
      if (allTags.find((t) => t.tagId === child.tagId) !== undefined) {
        childrenSelected++;
      }
      countSelectedChildren(child);
    });
  };

  countSelectedChildren(tag);

  const isChecked = allTags.find((t) => t.tagId === tag.tagId) !== undefined;

  return (
    <>
      <Styled.tagTreeWrapper>
        <Styled.tagTree>
          <Checkbox
            id={`browse-${tag.tagId}`}
            key={`browse-${tag.tagId}`}
            label={label}
            isChecked={isChecked}
            bold={isChecked}
            onChange={() => onChange(tag)}
            isDisabled={
              existingTags.concat(addedTagsToSave).find((t) => t.tagId === tag.tagId) !== undefined
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
              key={`tag-tree-${child.tagId}`}
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
