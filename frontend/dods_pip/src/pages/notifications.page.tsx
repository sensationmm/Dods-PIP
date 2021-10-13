import React, { useState } from 'react';

import InputText from '../components/_form/InputText';
import RadioGroup from '../components/_form/radio';
import Panel from '../components/_layout/Panel';
import Spacer from '../components/_layout/Spacer';
import Button from '../components/Button';
import { NotificationProps } from '../components/Notification';
import LoadingHOC, { LoadingHOCProps } from '../hoc/LoadingHOC';

interface NotificationsProps extends LoadingHOCProps {}

export const Notifications: React.FC<NotificationsProps> = ({ addNotification }) => {
  // @todo: remove this page
  const [title, setTitle] = useState('Notification');
  const [text, setText] = useState('');
  const [type, setType] = useState('info');
  const [actionLabel, setActionLabel] = useState('');

  return (
    <div data-test="page-notifications">
      <main>
        <Panel>
          <RadioGroup
            required
            name="type"
            label="Type"
            value={type}
            onChange={setType}
            items={[
              { label: 'info', value: 'info' },
              { label: 'confirm', value: 'confirm' },
              { label: 'warn', value: 'warn' },
              { label: 'alert', value: 'alert' },
            ]}
          />
          <Spacer size={5} />
          <InputText required id="title" label="Title" value={title} onChange={setTitle} />
          <Spacer size={5} />
          <InputText optional id="text" label="Text" value={text} onChange={setText} />
          <Spacer size={5} />
          <InputText
            optional
            id="actionLabel"
            label="Action Label"
            value={actionLabel}
            onChange={setActionLabel}
          />
          <Spacer size={5} />
          <Button
            inline
            onClick={() =>
              addNotification({
                type: type as NotificationProps['type'],
                title,
                text,
                actionLabel,
                action: () => window.alert('Action Clicked'),
              })
            }
            label="Add Notification"
          />
        </Panel>
      </main>
    </div>
  );
};

export default LoadingHOC(Notifications);
