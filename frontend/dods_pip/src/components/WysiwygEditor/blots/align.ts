import Quill from 'quill';

// Exists only to override the existing blot's implementation from css class injection to inline style
const Align = Quill.import('attributors/style/align');
Quill.register(Align, true);
