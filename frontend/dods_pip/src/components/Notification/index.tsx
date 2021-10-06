import React from 'react';

import * as Styled from './Notification.styles';

export interface NotificationProps {}

const Notification: React.FC<NotificationProps> = () => {
  return <Styled.wrapper data-test="component-notification">Notification</Styled.wrapper>;
};

export default Notification;
