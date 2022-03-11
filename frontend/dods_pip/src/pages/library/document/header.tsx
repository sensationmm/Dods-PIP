import Breadcrumbs from '@dods-ui/components/Breadcrumbs';
import Icon, { IconSize } from '@dods-ui/components/Icon';
import { Icons } from '@dods-ui/components/Icon/assets';
import IconContentSource from '@dods-ui/components/IconContentSource';
import { IconType as ContentSourceIconType } from '@dods-ui/components/IconContentSource/assets';
import Text from '@dods-ui/components/Text';
import color from '@dods-ui/globals/color';
import Link from 'next/link';
import React from 'react';

import * as Styled from './header.styles';

export interface HeaderProps {
  documentTitle?: string;
  contentSource?: ContentSourceIconType;
  sourceReferenceUri?: string;
  informationType?: string;
  publishedDateTime?: string;
  documentId?: string;
}

const Header: React.FC<HeaderProps> = ({
  documentTitle,
  contentSource,
  sourceReferenceUri,
  informationType,
  publishedDateTime,
}) => {
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
      {/* {documentId && user?.isDodsUser && (
        <Button
          onClick={() => router.push(`/editorial/article/${documentId}`)}
          label="Edit"
          icon={Icons.Pencil}
        />
      )} */}
    </Styled.header>
  );
};

export default Header;
