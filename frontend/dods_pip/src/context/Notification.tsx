import { PushNotification } from '@dods-ui/hoc/LoadingHOC';
import { createContext } from 'react';

export type NotificationContextType = {
  notifications: Array<PushNotification>;
  setNotifications: (n: Array<PushNotification>) => void;
};

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
/* @ts-ignore-next */
const NotificationContext = createContext<NotificationContextType>([]);

export default NotificationContext;
