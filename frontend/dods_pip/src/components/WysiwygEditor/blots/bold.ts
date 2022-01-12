import Quill from 'quill';

// Exists only to overide the existing blot's tag from <strong> to <b>
const Bold = Quill.import('formats/bold');
Bold.tagName = 'B';
Quill.register(Bold, true);
