import classNames from 'classnames';
import { getTime } from 'date-fns';
import React from 'react';

import Loader from '../../components/Loader';
import Notification, { NotificationProps } from '../../components/Notification';
import { getIndexById } from '../../utils/array';
import * as Styled from './LoadingHOC.styles';

export type LoadingHOCProps = {
  isLoading: boolean;
  setLoading: (state: boolean) => void;
  addNotification: (props: PushNotificationProps) => void;
};

interface PushNotificationProps extends Omit<NotificationProps, 'onClose'> {}

interface PushNotification extends PushNotificationProps {
  [key: string]: unknown;
  id: string;
}

// @TODO make this type tighter
/* eslint-disable-next-line  @typescript-eslint/no-explicit-any */
const LoadingHOC = (WrappedComponent: React.FC<any>): unknown => {
  function HOC(props: Record<string, unknown>) {
    const [isLoading, setIsLoading] = React.useState(false);
    const [notifications, setNotifications] = React.useState<Array<PushNotification>>([]);
    const notificationsRef = React.useRef(notifications);
    notificationsRef.current = notifications;

    const pushNotification = (props: PushNotificationProps) => {
      const current = notifications.slice();

      const notification: PushNotification = { ...props, id: getTime(new Date()).toString() };

      current.push(notification);
      setNotifications(current);
    };

    const popNotification = (id: PushNotification['id']) => {
      const current = notificationsRef.current.slice();

      const removeIndex = getIndexById(current, 'id', id) || -1;

      current.splice(removeIndex, 1);

      setNotifications(current);
    };

    return (
      <>
        <Styled.mask className={classNames({ visible: isLoading })}>
          <Loader />
        </Styled.mask>
        <Styled.notifications>
          {notifications.map((item) => (
            <Notification
              key={`notification-${item.id}`}
              {...item}
              onClose={() => popNotification(item.id)}
            />
          ))}
        </Styled.notifications>
        <WrappedComponent
          data-test="wrapped-component"
          {...props}
          isLoading={isLoading}
          setLoading={setIsLoading}
          addNotification={pushNotification}
        />
      </>
    );
  }

  return HOC;
};

export default LoadingHOC;
