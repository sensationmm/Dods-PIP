import './blots/font-style';
import './blots/align';
import './blots/bold';
import './blots/italic';
import './blots/content-tag';

import color from '@dods-ui/globals/color';
import Quill from 'quill';
import React, { useEffect } from 'react';

import * as Styled from './wysiwyg-editor.styles';

type ContentSelection = {
  fromIndex: number;
  toIndex: number;
  text: string;
};

export type ContentTag = {
  value: string;
  type: string;
  term: string;
};

export interface WysiwygEditorProps {
  id?: string;
  placeholder?: string;
  readOnly?: boolean;
  toolbarConfig?: [];
  onTextChange: (value: string) => void;
  onSelection?: (selection: ContentSelection) => void;
  tags?: ContentTag[];
}

const COLOURS = [
  ...Object.values(color.theme),
  ...Object.values(color.base),
  ...Object.values(color.accent),
  ...Object.values(color.alert),
];

const DEFAULT_TOOLBAR_CONFIG = [
  ['bold', 'italic', 'underline', 'strike'],
  [{ 'font-style': ['title large', 'title', 'title small', 'body', 'body small'] }],
  [{ align: '' }, { align: 'center' }, { align: 'right' }],
  [{ list: 'bullet' }, { list: 'ordered' }],
  ['blockquote', 'link', 'clean'],
  [{ color: COLOURS }],
];

const appendCoreStyles = () =>
  ['core', 'snow'].forEach((styleSheet) => {
    if (document.querySelector(`[href="//cdn.quilljs.com/1.3.6/quill.${styleSheet}.css]"`)) {
      return;
    }

    const link = document.createElement('link');
    link.dataset.testid = `quill-css-${styleSheet}`;
    link.href = `//cdn.quilljs.com/1.3.6/quill.${styleSheet}.css`;
    link.rel = 'stylesheet';

    document.head.appendChild(link);
  });

const embedTags = (quillInstance: Quill, tags: ContentTag[]) => {
  tags.forEach((tag) => {
    if (tag.value?.length) {
      const matches = quillInstance.getText().matchAll(RegExp(`\\b${tag.value}\\b`, 'igm'));
      Array.from(matches).forEach((match) => {
        // replace text with embedded 'content-tag
        // Known bug here, the index shifts after each new element is added, therefore, the content replacement shifts exponentially -_-
        quillInstance.deleteText(match.index as number, (tag.value as string).length);
        quillInstance.insertEmbed(match.index as number, 'content-tag', tag);
      });
    }
  });
};

const WysiwygEditor: React.FC<WysiwygEditorProps> = ({
  id = `wysiwyg-editor_${+new Date()}`,
  placeholder = 'Enter content...',
  toolbarConfig = DEFAULT_TOOLBAR_CONFIG,
  readOnly = false,
  children,
  onTextChange,
  onSelection,
  tags = [],
}) => {
  useEffect(() => {
    appendCoreStyles();

    const quill = new Quill('#' + id, {
      modules: {
        toolbar: toolbarConfig,
      },
      readOnly,
      placeholder,
      theme: 'snow',
    });

    quill.on('text-change', function (delta, oldDelta, source) {
      onTextChange(document.querySelector('.ql-editor')?.innerHTML || '');
    });

    onSelection &&
      quill.on('selection-change', function (range, oldRange, source) {
        if (range?.length <= 0) return;
        onSelection({
          fromIndex: range.index,
          toIndex: range.length,
          text: quill.getText(range.index, range.length),
        });
      });

    // add tags markup to content
    tags.length && embedTags(quill, tags);
  }, []);

  return (
    <Styled.wrapper data-testid="wysiwyg-editor">
      <div {...{ id }}>{children}</div>
    </Styled.wrapper>
  );
};

export default WysiwygEditor;
