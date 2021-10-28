import classNames from 'classnames';
import React from 'react';

import color from '../../../globals/color';
import Text from '../../Text';
import Label from '../Label';
import * as Styled from './TextArea.styles';

export interface TextAreaProps {
  id?: string;
  label?: string;
  required?: boolean;
  optional?: boolean;
  characterLimit?: number;
  value?: string;
  placeholder?: string;
  isDisabled?: boolean;
  error?: string | undefined;
  helperText?: string;
  onChange: (val: string) => void;
  inline?: boolean;
}

const TextArea: React.FC<TextAreaProps> = ({
  id,
  label,
  required = false,
  optional = false,
  characterLimit,
  value,
  placeholder,
  isDisabled = false,
  error,
  helperText,
  onChange,
  inline,
}) => {
  const hasCharacterLimit =
    characterLimit && typeof characterLimit === 'number' && characterLimit > 0;
  const onChangeHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (characterLimit && hasCharacterLimit) {
      if (e.target.value?.length < characterLimit) {
        onChange(e.target.value);
      } else {
        onChange(e.target.value?.slice(0, characterLimit));
      }
    } else {
      onChange(e.target.value);
    }
  };

  return (
    <Styled.wrapper data-test="component-textarea">
      <Styled.topArea>
        <div>
          {label && (
            <Label label={label} required={required} optional={optional} isDisabled={isDisabled} />
          )}
        </div>
        {hasCharacterLimit && (
          <Styled.requiredHelper>
            <Text data-test="textarea-label-character-limit" type={'span'}>
              {!value
                ? 0
                : characterLimit && value && value.length < characterLimit
                ? value.length
                : characterLimit}
              /{characterLimit}
            </Text>
          </Styled.requiredHelper>
        )}
      </Styled.topArea>
      <Styled.textarea
        data-test="textarea-input"
        className={classNames({ error: typeof error === 'string' })}
        cols={4}
        rows={5}
        id={id}
        maxLength={characterLimit}
        value={characterLimit ? value?.slice(0, characterLimit) : value}
        placeholder={placeholder}
        onChange={onChangeHandler}
        disabled={isDisabled}
        inline={inline}
      />
      {(helperText || typeof error === 'string') && (
        <Text
          data-test="component-input-base-helper"
          type={'span'}
          color={
            !isDisabled
              ? typeof error !== 'string'
                ? color.theme.blueMid
                : color.alert.red
              : color.base.grey
          }
          bold
        >
          {typeof error !== 'string' ? helperText : error}
        </Text>
      )}
    </Styled.wrapper>
  );
};

export default TextArea;
