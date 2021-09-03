import styled from 'styled-components';

import spacing from '../../globals/spacing';

export const wrapper = styled.div`
  width: 100%;
  padding: ${spacing(3)} ${spacing(4)};
  display: flex;
`;

export const anchor = styled.a`
  text-decoration: none;
  margin-right: ${spacing(3)};
`;

export const slash = styled.span`
  margin-right: ${spacing(3)};
`;

export const breadcrumb = styled.div`
  display: flex;
`;
