import InputText from '@dods-ui/components/_form/InputText';
import SearchDropdown from '@dods-ui/components/_form/SearchDropdown';
import { SelectItem } from '@dods-ui/components/_form/Select';
import SectionHeader from '@dods-ui/components/_layout/SectionHeader';
import Spacer from '@dods-ui/components/_layout/Spacer';
import ContentTagger from '@dods-ui/components/ContentTagger';
import { TagsData } from '@dods-ui/components/ContentTagger/TagBrowser';
import Icon, { IconSize } from '@dods-ui/components/Icon';
import { Icons } from '@dods-ui/components/Icon/assets';
import SectionAccordion from '@dods-ui/components/SectionAccordion';
import { ContentTag } from '@dods-ui/components/WysiwygEditor';
import * as Validation from '@dods-ui/utils/validation';
import dynamic from 'next/dynamic';
import React, { useState } from 'react';
import JsxParser from 'react-jsx-parser';

import * as Styled from './editorial-from.styles';

export interface EditorialFormFields {
  sourceName: string;
  sourceUrl: string;
  informationType: string;
  title: string;
  content: string;
}

export interface EditorialFormProps {
  fieldData: EditorialFormFields;
  onFieldChange: (field: keyof EditorialFormFields, value: string) => void;
  errors: Partial<EditorialFormFields>;
  setErrors: (errors: Partial<EditorialFormFields>) => void;
  infoTypeValues: SelectItem[];
  contentSourceValues: SelectItem[];
  tags?: TagsData[];
  onTagsChange: (tags: TagsData[]) => void;
  isEdit?: boolean;
}

type TextSelection = {
  fromIndex: number;
  toIndex: number;
  text: string;
  occurrences: number;
};

// We need to load this dynamically since it has multiple client side `document` calls
const WysiwygEditor = dynamic(() => import('@dods-ui/components/WysiwygEditor'), { ssr: false });

const EditorialForm: React.FC<EditorialFormProps> = ({
  fieldData,
  errors,
  setErrors,
  onFieldChange,
  infoTypeValues,
  contentSourceValues,
  tags = [],
  onTagsChange,
}) => {
  const [selectedText, setSelectedText] = useState<string>();
  const [selectedTextOccurrences, setSelectedTextOccurrences] = useState<number>();

  const validateField = (fieldName: keyof EditorialFormFields, value: string | undefined) => {
    const formErrors = JSON.parse(JSON.stringify(errors));
    !Validation.validateRequired(value as string)
      ? (formErrors[fieldName] = 'This field is required')
      : delete formErrors[fieldName];

    setErrors(formErrors);
  };

  const getContentTags = (tags: TagsData[] | undefined): ContentTag[] => {
    if (!tags) return [] as ContentTag[];
    return tags.map((tag) => ({
      type: tag.type as string,
      term: tag.termLabel,
      value: tag.termLabel,
    }));
  };

  const onEditorTextSelection = (params: TextSelection) => {
    const text = params.text.trim();
    if (text.length > 0) {
      setSelectedText(params.text);
      setSelectedTextOccurrences(params.occurrences);
      return;
    }
    setSelectedText(undefined);
    setSelectedTextOccurrences(undefined);
  };

  return (
    <Styled.mainColumns>
      <div>
        <SectionAccordion
          header={
            <SectionHeader
              title="Meta data"
              icon={<Icon src={Icons.Checklist} size={IconSize.xlarge} />}
            />
          }
          isOpen={true}
        >
          <Styled.inputFields>
            <SearchDropdown
              testId="editorial-content-source"
              size={'medium'}
              id={'content-source'}
              placeholder={fieldData.sourceName || 'Content source'}
              selectedValues={[fieldData.sourceName]}
              label={'Content source'}
              values={contentSourceValues}
              required
              onChange={(value) => {
                onFieldChange('sourceName', value);
                validateField('sourceName', fieldData.sourceName);
              }}
              onBlur={() => validateField('sourceName', fieldData.sourceName)}
            />
            <SearchDropdown
              testId="editorial-info-type"
              size={'medium'}
              id={'info-type'}
              selectedValues={[fieldData.informationType]}
              placeholder={fieldData.informationType || 'Information type'}
              label={'Information type'}
              values={infoTypeValues}
              required
              onChange={(value) => {
                onFieldChange('informationType', value);
                validateField('informationType', fieldData.informationType);
              }}
              onBlur={() => validateField('informationType', fieldData.informationType)}
            />
            <InputText
              id="contentSourceUrl"
              testId={'content-source-url'}
              value={fieldData.sourceUrl}
              optional
              label="Content Source (URL)"
              placeholder="www.api-link-source.com"
              onChange={(value) => onFieldChange('sourceUrl', value)}
            />
          </Styled.inputFields>
        </SectionAccordion>

        <Spacer size={10} />

        <SectionHeader
          title="Edit content"
          icon={<Icon src={Icons.Edit} size={IconSize.xlarge} />}
        />

        <Spacer size={7.5} />

        <InputText
          id="title"
          testId={'title'}
          value={fieldData.title}
          label="Content title"
          placeholder="Add a title for this content"
          onBlur={() => validateField('title', fieldData.title)}
          required
          onChange={(value) => onFieldChange('title', value)}
        />

        <Spacer size={7.5} />

        <WysiwygEditor
          placeholder={'Type or paste your content here'}
          onTextChange={(value) => onFieldChange('content', value)}
          tags={getContentTags(tags)}
          onSelection={onEditorTextSelection}
        >
          <JsxParser jsx={fieldData.content.toString()} />
        </WysiwygEditor>
      </div>

      <ContentTagger
        highlight={selectedText}
        highlightWordCount={selectedTextOccurrences}
        tags={tags}
        setTags={onTagsChange}
      />
    </Styled.mainColumns>
  );
};

export default EditorialForm;
