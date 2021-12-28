import WysiwygEditor, { WysiwygEditorProps } from './index';
import { act, cleanup, render, RenderResult } from '@testing-library/react';
import Quill from 'quill';
import './blots/font-style';

jest.mock('quill', () =>
  jest.fn().mockReturnValue(() => ({
    on: jest.fn(),
  })),
);
jest.mock('./blots/align', () => jest.fn());
jest.mock('./blots/bold', () => jest.fn());
jest.mock('./blots/font-style', () => jest.fn());
jest.mock('./blots/italic', () => jest.fn());

const COMPONENT_ID = 'test_id';

const onTextChangeMock = jest.fn();
const DEFAULT_PROPS: WysiwygEditorProps = {
  id: COMPONENT_ID,
  onTextChange: onTextChangeMock,
};

const getComponentWithProps = async (
  props: WysiwygEditorProps = DEFAULT_PROPS,
): Promise<RenderResult> => {
  const _render = render(<WysiwygEditor {...{ props }} />);
  await _render.findByTestId(TEST_ID_COMPONENT);
  return _render;
};

const TEST_ID_COMPONENT = 'wysiwyg-editor';

xdescribe('WysiwygEditor', () => {
  Object.defineProperty(document, 'head', {
    value: {
      appendChild: jest.fn(),
    },
  });

  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  let component: RenderResult;

  beforeEach(async () => {
    await act(async () => {
      component = await getComponentWithProps();
    });
  });

  it.each<string[]>([['snow'], ['core']])('should inject %s css file', (stylesheet) => {
    const link = document.createElement('link');
    link.dataset.testid = `quill-css-${stylesheet}`;
    link.href = `//cdn.quilljs.com/1.3.6/quill.${stylesheet}.css`;
    link.rel = 'stylesheet';

    expect(document.head.appendChild).toHaveBeenCalledWith(link);
    expect(document.head.appendChild).toHaveBeenCalledTimes(2);
  });

  it('should render div for editor injection', () => {
    expect(component.container.querySelector('#' + COMPONENT_ID)).not.toBeNull();
  });

  it('should initiate quill library', () => {
    expect(Quill).toHaveBeenCalledWith('#' + COMPONENT_ID);
  });
});
