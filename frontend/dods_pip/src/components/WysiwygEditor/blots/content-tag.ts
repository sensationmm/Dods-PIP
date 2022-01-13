import { ContentTag } from '@dods-ui/components/WysiwygEditor';
import Quill from 'quill';
// https://github.com/quilljs/parchment/#blots

class ContentTagBlot extends Quill.import('blots/embed') {
  static blotName = 'content-tag';
  static className = 'content-tag';
  static tagName = 'span';

  static create(value: ContentTag): HTMLAnchorElement {
    const node = super.create(value);

    node.innerHTML = `<a href="#">${value.value}<span class="tooltip">${value.type} → ${value.term}</span></a>`;

    return node;
  }
}

Quill.register(ContentTagBlot);
