import React from 'react';

import Spacer from '../../components/_layout/Spacer';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import { PlainTable } from '../../components/DataTable';
import { Icons } from '../../components/Icon/assets';
import SectionAccordion from '../../components/SectionAccordion';
import Text from '../../components/Text';
import * as Styled from './index.styles';

export interface CollectionsProps {
  canAddCollection?: boolean;
}

const Collections: React.FC<CollectionsProps> = ({ canAddCollection = true }) => {
  return (
    <Styled.sumWrapper>
      <SectionAccordion
        header={
          <Styled.sectionCustomHeader>
            <Text type="h2" headingStyle="titleLarge">
              Collections
            </Text>
            <Styled.badgeContainer>
              <Badge size="small" label="Collections" number={0} />
            </Styled.badgeContainer>
            {canAddCollection && (
              <Button
                type="secondary"
                label="Add Collection"
                icon={Icons.Add}
                iconAlignment="right"
                onClick={(e) => e.stopPropagation()}
              />
            )}
          </Styled.sectionCustomHeader>
        }
        isOpen={true}
      >
        <PlainTable headings={['Name', 'Date', 'Items']} colWidths={[4, 2, 2]} rows={[]} />
        <Spacer size={5} />
      </SectionAccordion>
    </Styled.sumWrapper>
  );
};

export default Collections;
