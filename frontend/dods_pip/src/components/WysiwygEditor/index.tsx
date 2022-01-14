import './blots/font-style';
import './blots/align';
import './blots/bold';
import './blots/italic';
import './blots/content-tag';

import color from '@dods-ui/globals/color';
import Quill from 'quill';
import React, { useEffect, useState } from 'react';

import * as Styled from './wysiwyg-editor.styles';

type ContentSelection = {
  fromIndex: number;
  toIndex: number;
  text: string;
  occurrences: number;
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
  const [quillInstance, setQuillInstance] = useState<Quill>();

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

    quill.on('text-change', function () {
      onTextChange(document.querySelector('.ql-editor')?.innerHTML || '');
    });

    onSelection &&
      quill.on('selection-change', function (range) {
        if (range?.length > 0) {
          const selectedText = quill.getText(range.index, range.length);
          const matches = Array.from(quill.getText().matchAll(RegExp(selectedText, 'igm')));
          onSelection({
            fromIndex: range.index,
            toIndex: range.length,
            text: selectedText,
            occurrences: matches.length,
          });
        }
      });

    setQuillInstance(quill);
  }, []);

  /** TODO: RTE content tagging 
  useEffect(() => {
    if (!tags.length || !quillInstance) return;

    quillInstance.focus();

    tags
      .sort((a, b) => b.value.length - a.value.length)
      .forEach((tag) => {
        if (!tag.value.length) return;

        // embed matching tags
        const matches = quillInstance.getText().matchAll(RegExp(`${tag.value}`, 'igm'));
        Array.from(matches)
          .reverse()
          .forEach((match) => {
            console.info('<><><> match', match);
            if (match && typeof match.index === 'number') {
              const matchedText = quillInstance.getText(match.index, match[0].length);
              quillInstance.deleteText(match.index, match[0].length);
              quillInstance.insertEmbed(match.index, 'content-tag', { ...tag, value: matchedText });
            }
          });

        // embed tag over selected text
        const selection = quillInstance.getSelection();
        if (selection !== null && typeof selection.index === 'number' && selection.length) {
          const selectionIndex = selection.index;
          const selectionLength = selection.length;
          const selectedText = quillInstance.getText(selectionIndex, selectionLength);
          quillInstance.deleteText(selectionIndex, selectionLength);
          quillInstance.insertEmbed(selectionIndex, 'content-tag', { ...tag, value: selectedText });
        }
      });
  }, [tags.length, quillInstance]);
  end content tagging */

  return (
    <Styled.wrapper data-testid="wysiwyg-editor">
      <div id={id}>{children}</div>
    </Styled.wrapper>
  );
};

export default WysiwygEditor;
