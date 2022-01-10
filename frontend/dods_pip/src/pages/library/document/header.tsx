import Breadcrumbs from '@dods-ui/components/Breadcrumbs';
import Icon, { IconSize } from '@dods-ui/components/Icon';
import { Icons } from '@dods-ui/components/Icon/assets';
import IconContentSource from '@dods-ui/components/IconContentSource';
import { IconType as ContentSourceIconType } from '@dods-ui/components/IconContentSource/assets';
import color from '@dods-ui/globals/color';
import Link from 'next/link';
import React from 'react';

import * as Styled from './header.styles';

export interface HeaderProps {
  documentTitle?: string;
  contentSource?: ContentSourceIconType;
  sourceReferenceUri?: string;
  informationType?: string;
  formattedTime?: string;
}

const Header: React.FC<HeaderProps> = ({
  documentTitle,
  contentSource,
  sourceReferenceUri,
  informationType,
  formattedTime,
}) => {
  return (
    <div>
      <Breadcrumbs
        history={[
          { href: '/library', label: 'Library' },
          { href: '/library', label: documentTitle || '' },
        ]}
      />
      <Styled.heading>{documentTitle}</Styled.heading>
      <Styled.infoRow>
        <span aria-label="Content source">
          <Styled.infoIcon>
            <IconContentSource icon={contentSource} />
          </Styled.infoIcon>
          {sourceReferenceUri && (
            <Link href={sourceReferenceUri}>
              <a>{contentSource}</a>
            </Link>
          )}
        </span>
        <Styled.infoSpacer />
        <span aria-label="Information type">
          <Styled.infoIcon>
            <Icon src={Icons.Document} size={IconSize.mediumLarge} color={color.base.greyDark} />
          </Styled.infoIcon>
          {informationType}
        </span>
        <Styled.infoSpacer />
        <span aria-label="Published date">{formattedTime}</span>)
      </Styled.infoRow>
    </div>
  );
};

export default Header;
