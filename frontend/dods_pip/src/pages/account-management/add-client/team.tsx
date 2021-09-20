import React from 'react';

import PageActions from '../../../components/_layout/PageActions';
import Panel from '../../../components/_layout/Panel';
import SectionHeader from '../../../components/_layout/SectionHeader';
import Spacer from '../../../components/_layout/Spacer';
import Button from '../../../components/Button';
import { Icons } from '../../../components/Icon/assets';
import color from '../../../globals/color';

export interface TeamProps {
  onSubmit: () => void;
  onBack: () => void;
}

const Team: React.FC<TeamProps> = ({ onSubmit, onBack }) => {
  return (
    <main data-test="team">
      <Panel isNarrow bgColor={color.base.ivory}>
        <SectionHeader title="Team" subtitle="Coming Soon" icon={Icons.IconSuitcase} />

        <Spacer size={20} />

        <PageActions data-test="page-actions" hasBack backHandler={onBack}>
          <Button
            data-test="continue-button"
            label="Save and continue"
            onClick={onSubmit}
            icon={Icons.IconChevronRight}
            iconAlignment="right"
          />
        </PageActions>
      </Panel>
    </main>
  );
};

export default Team;
