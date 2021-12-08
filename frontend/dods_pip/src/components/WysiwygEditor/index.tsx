import './blots/font-style';

import Quill, { SelectionChangeHandler, TextChangeHandler } from 'quill';
import React, { useEffect, useState } from 'react';

import color from '../../globals/color';
import * as Styled from './wysiwyg-editor.styles';

export interface WysiwygEditorProps {
  id?: string;
  placeholder?: string;
  readOnly?: boolean;
  toolbarConfig?: [];
  onSelectionChange: SelectionChangeHandler;
  onTextChange: TextChangeHandler;
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

const WysiwygEditor: React.FC<WysiwygEditorProps> = ({
  id = `wysiwyg-editor_${+new Date()}`,
  placeholder = 'Enter content...',
  toolbarConfig = DEFAULT_TOOLBAR_CONFIG,
  readOnly = false,
  children,
  onTextChange,
  onSelectionChange,
}) => {
  const [quillInstance, setQuillInstance] = useState<Quill | null>(null);
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
    setQuillInstance(quill);
  }, []);

  quillInstance?.on('selection-change', onSelectionChange);
  quillInstance?.on('text-change', onTextChange);

  return (
    <Styled.wrapper data-testid="wysiwyg-editor">
      <div {...{ id }}>{children}</div>
    </Styled.wrapper>
  );
};

export default WysiwygEditor;
