import Quill from 'quill';

// Exists only to override the existing blot's tag from <em> to <i>
const Italic = Quill.import('formats/italic');
Italic.tagName = 'I';
Quill.register(Italic, true);
