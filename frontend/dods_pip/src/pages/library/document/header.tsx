import Breadcrumbs from '@dods-ui/components/Breadcrumbs';
import Button from '@dods-ui/components/Button';
import Icon, { IconSize } from '@dods-ui/components/Icon';
import { Icons } from '@dods-ui/components/Icon/assets';
import IconContentSource from '@dods-ui/components/IconContentSource';
import { IconType as ContentSourceIconType } from '@dods-ui/components/IconContentSource/assets';
import Modal from '@dods-ui/components/Modal';
import Text from '@dods-ui/components/Text';
import color from '@dods-ui/globals/color';
import useUser from '@dods-ui/lib/useUser';
import Link from 'next/link';
import React from 'react';

import * as Styled from './header.styles';

export interface HeaderProps {
  documentTitle?: string;
  contentSource?: ContentSourceIconType;
  sourceReferenceUri?: string;
  informationType?: string;
  publishedDateTime?: string;
  onEdit: () => void;
  onDelete: () => void;
}

const Header: React.FC<HeaderProps> = ({
  documentTitle,
  contentSource,
  sourceReferenceUri,
  informationType,
  publishedDateTime,
  onEdit,
  onDelete,
}) => {
  const { user } = useUser({ redirectTo: '/' });
  const [showDelete, setShowDelete] = React.useState<boolean>(false);
  return (
    <Styled.header>
      <Styled.mainSection>
        <Breadcrumbs
          history={[
            { href: '/library', label: 'Library' },
            { href: '/library', label: documentTitle || '' },
          ]}
        />
        <Styled.h1Container>
          <Text type="h1" color={color.theme.blue}>
            {documentTitle}
          </Text>
        </Styled.h1Container>
        <Styled.infoRow>
          <Styled.infoItem>
            <Text bold type="label">
              Source:
            </Text>
            <Styled.infoIcon>
              <IconContentSource icon={contentSource} />
            </Styled.infoIcon>
            {sourceReferenceUri && (
              <Link href={sourceReferenceUri}>
                <a>{contentSource}</a>
              </Link>
            )}
          </Styled.infoItem>
          <Styled.infoSpacer />
          <Styled.infoItem>
            <Text bold type="label">
              Type:
            </Text>
            <Styled.infoIcon>
              <Icon src={Icons.Document} size={IconSize.mediumLarge} color={color.base.greyDark} />
            </Styled.infoIcon>
            {informationType}
          </Styled.infoItem>
          <Styled.infoSpacer />
          <Styled.infoItem>
            <Text bold type="label">
              Date:
            </Text>
            {publishedDateTime}
          </Styled.infoItem>
        </Styled.infoRow>
      </Styled.mainSection>
      {user?.isDodsUser && (
        <>
          <Button
            onClick={() => setShowDelete(true)}
            label="Delete"
            icon={Icons.Bin}
            type="secondary"
          />
          <Button onClick={onEdit} label="Edit" icon={Icons.Pencil} />
        </>
      )}

      {showDelete && (
        <Modal
          title="Do you wish to delete this article?"
          titleIcon={Icons.Bin}
          size="large"
          onClose={() => setShowDelete(false)}
          buttons={[
            {
              isSmall: true,
              type: 'secondary',
              label: 'Cancel',
              onClick: () => setShowDelete(false),
            },
            {
              isSmall: true,
              type: 'primary',
              label: 'Confirm and delete',
              icon: Icons.Bin,
              onClick: onDelete,
            },
          ]}
          buttonAlignment="right"
        >
          <Text>You cannot undo this action</Text>
        </Modal>
      )}
    </Styled.header>
  );
};

export default Header;
