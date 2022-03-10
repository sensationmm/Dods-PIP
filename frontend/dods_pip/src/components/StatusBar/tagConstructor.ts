import color from '../../globals/color';
import { Icons } from '../Icon/assets';

type TagConfigurationType = {
  label: string;
  icon?: Icons;
  iconColor?: string;
};

export const tagConstructor = (type: string): TagConfigurationType => {
  const tagConfiguration: TagConfigurationType = { label: '' };

  switch (type) {
    case 'in_progress':
    case 'draft':
    case 'created':
      tagConfiguration.label = 'In progress';
      tagConfiguration.icon = Icons.Pencil;
      tagConfiguration.iconColor = color.theme.blueLight;
      break;
    case 'scheduled':
      tagConfiguration.label = 'Scheduled';
      tagConfiguration.icon = Icons.Clock;
      tagConfiguration.iconColor = color.accent.green;
      break;
    case 'published':
      tagConfiguration.label = 'Published';
      tagConfiguration.icon = Icons.Tick;
      tagConfiguration.iconColor = color.accent.green;
      break;
  }

  return tagConfiguration;
};
