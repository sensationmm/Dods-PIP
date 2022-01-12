import Quill from 'quill';
// https://github.com/quilljs/parchment/#blots

type styleWhitelist = 'body' | 'body small' | 'title small' | 'title' | 'title large';
const styles: Record<styleWhitelist, Record<string, string>> = {
  body: {
    fontFamily: 'Open Sans',
    fontSize: '16px',
  },
  'body small': {
    fontFamily: 'Open Sans',
    fontSize: '14px',
  },
  'title small': {
    fontFamily: 'Libre Baskerville',
    fontSize: '18px',
  },
  title: {
    fontFamily: 'Libre Baskerville',
    fontSize: '24px',
  },
  'title large': {
    fontFamily: 'Libre Baskerville',
    fontSize: '32px',
  },
};

class StyleBlot extends Quill.import('blots/block') {
  static blotName = 'font-style';
  static className = 'font-style';
  static tagName = 'P';

  static create(value: styleWhitelist): HTMLParagraphElement {
    const node = super.create(value);

    if (!styles.hasOwnProperty(value)) return node;

    const styleProps = styles[value];

    for (const key in styleProps) {
      node.style[key] = styleProps[key];
    }

    return node;
  }
}

Quill.register(StyleBlot);
