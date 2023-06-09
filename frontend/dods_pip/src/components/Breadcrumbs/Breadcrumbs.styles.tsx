import styled from 'styled-components';

import spacing from '../../globals/spacing';

export const wrapper = styled.div`
  width: 100%;
  display: flex;
`;

export const anchor = styled.a`
  text-decoration: none;
  margin-right: ${spacing(3)};
  color: inherit;

  &:hover {
    text-decoration: underline;
  }
`;

export const slash = styled.span`
  margin-right: ${spacing(3)};
`;

export const breadcrumb = styled.div`
  display: flex;
`;
