import dynamic from 'next/dynamic';
import React from 'react';

import InputText from '../../components/_form/InputText';
import SearchDropdown from '../../components/_form/SearchDropdown';
import SectionHeader from '../../components/_layout/SectionHeader';
import Spacer from '../../components/_layout/Spacer';
import ContentTagger from '../../components/ContentTagger';
import Icon, { IconSize } from '../../components/Icon';
import { Icons } from '../../components/Icon/assets';
import * as Validation from '../../utils/validation';
import * as Styled from './editorial-from.styles';

export interface EditorialFormFields {
  sourceName: string;
  sourceUrl: string;
  informationType: string;
  originator: string;
  title: string;
  content: string;
}

export interface EditorialFormProps {
  fieldData: EditorialFormFields;
  onFieldChange: (field: keyof EditorialFormFields, value: string) => void;
  errors: Partial<EditorialFormFields>;
  setErrors: (errors: Partial<EditorialFormFields>) => void;
  isEdit?: boolean;
}

// We need to load this dynamically since it has multiple client side `document` calls
const WysiwygEditor = dynamic(() => import('../../components/WysiwygEditor'), { ssr: false });

const EditorialForm: React.FC<EditorialFormProps> = ({
  fieldData,
  errors,
  setErrors,
  onFieldChange,
}) => {
  const validateField = (fieldName: keyof EditorialFormFields, value: string | undefined) => {
    const formErrors = JSON.parse(JSON.stringify(errors));
    !Validation.validateRequired(value as string)
      ? (formErrors[fieldName] = 'This field is required')
      : delete formErrors[fieldName];

    setErrors(formErrors);
  };

  return (
    <Styled.mainColumns>
      <div>
        <SectionHeader
          title="Meta data"
          icon={<Icon src={Icons.Checklist} size={IconSize.xlarge} />}
        />

        <Spacer size={7.5} />

        <Styled.inputFields>
          <SearchDropdown
            testId="editorial-content-source"
            size={'medium'}
            id={'content-source'}
            placeholder="Content source"
            selectedValues={[]}
            label={'Content source'}
            values={[]}
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
            selectedValues={[]}
            placeholder="Information type"
            label={'Information type'}
            values={[]}
            required
            onChange={(value) => {
              onFieldChange('informationType', value);
              validateField('informationType', fieldData.informationType);
            }}
            onBlur={() => validateField('informationType', fieldData.informationType)}
          />
          <InputText
            id="contentSourceYrl"
            testId={'content-source-url'}
            value={fieldData.sourceUrl}
            optional
            label="Content Source (URL)"
            placeholder="www.api-link-source.com"
            onChange={(value) => onFieldChange('sourceUrl', value)}
          />
          <InputText
            id="originator"
            testId={'originator'}
            value={fieldData.originator}
            label="Originator"
            placeholder="www.api-link-source.com"
            optional
            onChange={(value) => onFieldChange('originator', value)}
          />
        </Styled.inputFields>

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
          onSelectionChange={console.log}
          onTextChange={(value) => onFieldChange('content', value.toString())}
        >
          {fieldData.content}
        </WysiwygEditor>
      </div>

      <ContentTagger tags={[]} setTags={console.log} />
    </Styled.mainColumns>
  );
};

export default EditorialForm;
