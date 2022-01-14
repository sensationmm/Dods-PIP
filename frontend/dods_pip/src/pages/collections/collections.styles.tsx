import { wrapper as Badge } from '@dods-ui/components/Badge/Badge.styles';
import color from '@dods-ui/globals/color';
import dropShadow from '@dods-ui/globals/elevation';
import spacing from '@dods-ui/globals/spacing';
import styled from 'styled-components';

export const allCollections = styled.div`
  position: relative;
  background: ${color.base.white};
  border-radius: ${spacing(2)};
  box-shadow: ${dropShadow.dropShadow2};
  padding-bottom: ${spacing(3)};
`;

export const allCollectionsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${spacing(10)} ${spacing(10)} ${spacing(4)} ${spacing(10)};

  ${Badge} {
    margin-left: ${spacing(12)};
  }
`;

export const allCollectionsTitle = styled.div`
  display: flex;
  align-items: center;
`;

export const allCollectionsFilter = styled.div`
  display: flex;
  align-items: center;

  > div {
    margin-left: ${spacing(2)};
  }
`;

export const allCollectionsFooter = styled.div`
  padding: 0 ${spacing(8)};
`;

type AddCollectionContentProps = {
  stacked: boolean;
};
export const addCollectionContent = styled.div<AddCollectionContentProps>`
  display: ${({ stacked }) => (stacked ? 'block' : 'grid')};
  grid-template-columns: 1fr 1fr;
  column-gap: ${spacing(10)};
`;

export const header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 48px;
`;
