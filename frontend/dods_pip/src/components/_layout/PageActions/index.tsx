import { useRouter } from 'next/router';
import React from 'react';

import Button from '../../Button';
import { Icons } from '../../Icon/assets';
import * as Styled from './PageActions.styles';

export interface PageActionsProps {
  hasBack?: boolean;
  backLabel?: string;
  backHandler?: () => void;
}

const PageActions: React.FC<PageActionsProps> = ({
  children,
  hasBack,
  backLabel = 'Back',
  backHandler,
}) => {
  const router = useRouter();
  return (
    <Styled.wrapper data-test="component-page-actions">
      {hasBack && (
        <Button
          data-test="actions-back-button"
          type="secondary"
          icon={Icons.IconChevronLeft}
          label={backLabel}
          onClick={backHandler ? backHandler : router.back}
        />
      )}
      {children}
    </Styled.wrapper>
  );
};

export default PageActions;
