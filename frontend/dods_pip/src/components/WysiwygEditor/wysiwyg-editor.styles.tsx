import styled from 'styled-components';

import color from '../../globals/color';
import spacing from '../../globals/spacing';

export const wrapper = styled.div`
  width: 100%;

  b {
    font-family: 'OpenSansBold', sans-serif;
  }

  .ql-font-style {
    .ql-picker-item[data-value='body']::before {
      font-family: 'OpenSans', sans-serif;
      font-size: 16px;
    }
    .ql-picker-item[data-value='body small']::before {
      font-family: 'OpenSans', sans-serif;
      font-size: 14px;
    }
    .ql-picker-item[data-value='title large']::before {
      font-family: 'Libre Baskerville', serif;
      font-size: 32px;
    }
    .ql-picker-item[data-value='title']::before {
      font-family: 'Libre Baskerville', serif;
      font-size: 24px;
    }
    .ql-picker-item[data-value='title small']::before {
      font-family: 'Libre Baskerville', serif;
      font-size: 18px;
    }
  }

  .ql-toolbar.ql-snow .ql-picker.ql-expanded .ql-picker-options {
    border-radius: 8px;
  }

  .ql-picker:not(.ql-color):not(.ql-background):not(.ql-heading) {
    .ql-picker-label,
    .ql-picker-item {
      &::before {
        text-transform: capitalize;
        content: attr(data-value) !important;
      }
    }
  }

  .ql-snow.ql-toolbar button.ql-active {
    background: ${color.shadow.blue} !important;
    color: ${color.base.black};
  }

  .ql-snow.ql-toolbar button.ql-active .ql-stroke {
    stroke: ${color.base.black};
  }

  .ql-toolbar {
    background-color: ${color.base.white};
    padding: 0 ${spacing(4)} !important;
    min-height: 56px;
    border: 1px solid ${color.base.greyLight};
    border-radius: 8px 8px 0 0;
  }

  .ql-snow.ql-toolbar,
  .ql-snow .ql-toolbar {
    padding: 0;
    .ql-picker,
    button {
      min-height: 32px;
      padding: 7px;
      min-width: 32px;
      display: block;

      .ql-picker-label {
        &::before {
          line-height: 1;
          padding-right: ${spacing(6)};
        }
        padding: 0;
        border: 0 !important;
      }
    }
  }

  .ql-toolbar button,
  .ql-toolbar .ql-picker {
    border: 1px solid ${color.base.greyLighter};
    background: ${color.base.white} !important;
    border: 1px solid ${color.base.greyLight} !important;
    box-shadow: 0px 1px 8px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
  }

  .ql-toolbar button + button,
  .ql-toolbar .ql-picker + .ql-picker {
    margin-left: ${spacing(1)};
  }

  .ql-formats {
    margin: ${spacing(3)} ${spacing(2)} !important;
  }

  .ql-editor {
    background: #eaeef3;
    min-height: 500px;
    padding: ${spacing(6)};
  }
  .ql-editor * {
    font-family: 'Open Sans';
    font-size: 12px;
    line-height: 1.25;
  }

  .ql-editor b {
    font-family: 'Open Sans Bold';
  }

  .ql-editor.ql-blank::before {
    left: ${spacing(6)};
  }

  .ql-editor .tooltip {
    display: none;
  }
`;
