import './blots/font-style';
import './blots/align';
import './blots/bold';
import './blots/italic';

import color from '@dods-ui/globals/color';
import Quill from 'quill';
import React, { useEffect } from 'react';

import * as Styled from './wysiwyg-editor.styles';

export interface WysiwygEditorProps {
  id?: string;
  placeholder?: string;
  readOnly?: boolean;
  toolbarConfig?: [];
  onTextChange: (value: string) => void;
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

const WysiwygEditor: React.FC<WysiwygEditorProps> = ({
  id = `wysiwyg-editor_${+new Date()}`,
  placeholder = 'Enter content...',
  toolbarConfig = DEFAULT_TOOLBAR_CONFIG,
  readOnly = false,
  children,
  onTextChange,
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
  }, []);

  return (
    <Styled.wrapper data-testid="wysiwyg-editor">
      <div {...{ id }}>{children}</div>
    </Styled.wrapper>
  );
};

export default WysiwygEditor;
