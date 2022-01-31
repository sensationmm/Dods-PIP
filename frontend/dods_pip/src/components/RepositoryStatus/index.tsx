import React from 'react';

import color from '../../globals/color';
import { Icons } from '../Icon/assets';
import Tag, { TagProps } from '../Tag';

export type RepositoryStatusTypes =
  | 'ingested'
  | 'draft'
  | 'in_progress'
  | 'scheduled'
  | 'published';
export interface RepositoryStatusProps extends Pick<TagProps, 'width' | 'size'> {
  type: RepositoryStatusTypes;
}

const RepositoryStatus: React.FC<RepositoryStatusProps> = ({ type, width, size }) => {
  switch (type) {
    case 'ingested':
      return (
        <Tag
          label="Ingested"
          icon={Icons.Disk}
          iconColor={color.theme.blue}
          iconBgColor={color.base.white}
          iconBorderColor={color.base.greyLight}
          size={size}
          width={width}
        />
      );
    case 'draft':
      return (
        <Tag
          label="Draft"
          icon={Icons.Pencil}
          iconBgColor={color.theme.blueMid}
          size={size}
          width={width}
        />
      );
    case 'in_progress':
      return (
        <Tag
          label="In progress"
          icon={Icons.Pencil}
          iconBgColor={color.theme.blueLight}
          size={size}
          width={width}
        />
      );
    case 'scheduled':
      return (
        <Tag
          label="Scheduled"
          icon={Icons.Clock}
          iconBgColor={color.alert.green}
          size={size}
          width={width}
        />
      );
    case 'published':
    default:
      return (
        <Tag
          label="Published"
          icon={Icons.TickBold}
          iconBgColor={color.alert.green}
          size={size}
          width={width}
        />
      );
  }
};

export default RepositoryStatus;
