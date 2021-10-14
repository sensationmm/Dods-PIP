import React from 'react';

import color from '../../globals/color';
import Spacer from '../_layout/Spacer';
import Button from '../Button';
import Icon, { IconSize } from '../Icon';
import { Icons } from '../Icon/assets';
import Text from '../Text';
import * as Styled from './Notification.styles';

export interface NotificationProps {
  title: string;
  text?: string;
  type?: 'info' | 'confirm' | 'warn' | 'alert';
  action?: () => void;
  actionLabel?: string;
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({
  title,
  text,
  type = 'info',
  action,
  actionLabel = 'Confirm',
  onClose,
}) => {
  let icon, IconComponent;
  const [fadeOut, setFadeOut] = React.useState(false);
  let timeout2: ReturnType<typeof setTimeout>;

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      closeNotification();
    }, 5000);

    return () => {
      clearTimeout(timeout);
      clearTimeout(timeout2);
    };
  }, []);

  const closeNotification = () => {
    setFadeOut(true);
    timeout2 = setTimeout(() => {
      onClose();
    }, 500);
  };

  switch (type) {
    case 'alert':
      icon = Icons.Alert;
      IconComponent = Styled.iconAlert;
      break;
    case 'warn':
      icon = Icons.Issue;
      IconComponent = Styled.iconIssue;
      break;
    case 'confirm':
      icon = Icons.TickBold;
      IconComponent = Styled.iconSuccess;
      break;
    case 'info':
    default:
      icon = Icons.Info;
      IconComponent = Styled.iconInfo;
      break;
  }

  return (
    <Styled.wrapper data-test="component-notification" fadeOut={fadeOut}>
      <Styled.content>
        <IconComponent>
          <Icon src={icon} color={color.base.white} size={IconSize.large} />
        </IconComponent>
        <Styled.text>
          <Text bold color={color.theme.blue}>
            {title}
          </Text>
          <Spacer />
          {text && <Text color={color.theme.blue}>{text}</Text>}
        </Styled.text>
      </Styled.content>
      {action && actionLabel ? (
        <Button label={actionLabel} onClick={action} />
      ) : (
        <Styled.close data-test="notification-close" onClick={closeNotification}>
          <Icon src={Icons.CrossBold} size={IconSize.mediumLarge} />
        </Styled.close>
      )}
    </Styled.wrapper>
  );
};

export default Notification;
