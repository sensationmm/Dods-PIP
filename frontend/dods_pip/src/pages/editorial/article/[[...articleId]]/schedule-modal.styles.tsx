import spacing from '@dods-ui/globals/spacing';
import styled from 'styled-components';

export const fields = styled.div`
  display: flex;
  gap: ${spacing(14)};
  margin-bottom: ${spacing(8)};
`;

export const inputGroup = styled.div`
  display: flex;
  gap: ${spacing(2)};
`;

export const timeInput = styled.div`
  width: 70px;
`;

export const buttons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${spacing(2)};
  margin-bottom: ${spacing(10)};
`;
