import color from '@dods-ui/globals/color';
import { useRouter } from 'next/router';
import React from 'react';

import Spacer from '../_layout/Spacer';
import Button from '../Button';
import DayPicker, { DayType } from '../DayPicker';
import Icon, { IconSize } from '../Icon';
import { Icons } from '../Icon/assets';
import Text from '../Text';
import * as Styled from './Alert.styles';

export type AlertData = {
  uuid: string;
  collectionId: string;
  title: string;
  searchQueriesCount: number;
  recipientsCount: number;
  isScheduled: boolean;
  schedule: string;
  deliveryTimes?: Array<string>;
  lastStepCompleted: number;
};
export interface AlertProps extends AlertData {
  isConsultant?: boolean;
  onDelete: () => void;
  onCopy: () => void;
  onViewSettings: (step?: string) => void;
}

type ScheduleCron = {
  deliveryDays: DayType[];
  deliveryTimes: Array<string>;
};

export const parseScheduleCron = (schedule: string): ScheduleCron => {
  if (schedule) {
    const cronParts = schedule.split(' ');
    const deliveryDays = cronParts[5].split(',') as ScheduleCron['deliveryDays'];
    const deliveryTimes = cronParts[2].split(',').map((time) => `${time}:00`);

    return { deliveryDays, deliveryTimes };
  }

  return { deliveryDays: [], deliveryTimes: [] };
};

const Alert: React.FC<AlertProps> = ({
  uuid,
  collectionId,
  title,
  searchQueriesCount,
  recipientsCount,
  isScheduled = false,
  schedule,
  lastStepCompleted,
  isConsultant = false,
  onDelete,
  onCopy,
  onViewSettings,
}) => {
  const router = useRouter();
  const [showAllTimes, setShowAllTimes] = React.useState<boolean>(false);
  const [showEditOptions, setShowEditOptions] = React.useState<boolean>(false);

  const isComplete = lastStepCompleted === 4;
  const immediateDelivery = !isScheduled;

  const { deliveryDays, deliveryTimes } = parseScheduleCron(schedule);

  return (
    <Styled.wrapper data-test="component-alert">
      <Styled.content>
        <Styled.details>
          <Text type="h3" headingStyle="title">
            {title}
          </Text>
          <Spacer size={2} />
          <ul>
            <Text type="liSmall">
              Search queries: <strong>{searchQueriesCount !== 0 ? searchQueriesCount : '-'}</strong>
            </Text>
            <Text type="liSmall">
              Recipients: <strong>{recipientsCount !== 0 ? recipientsCount : '-'}</strong>
            </Text>
          </ul>
        </Styled.details>
        {isComplete ? (
          <div>
            <Styled.deliveryTitle>
              <Text type="label" bold>
                Delivery Schedule
                {immediateDelivery && ': '}
              </Text>
              {immediateDelivery && <Text color={color.base.greyDark}>&nbsp;Immediate</Text>}
            </Styled.deliveryTitle>
            <Spacer size={3} />
            <DayPicker
              selected={!immediateDelivery ? (deliveryDays as DayType[]) : undefined}
              disabled={immediateDelivery}
            />
            {!immediateDelivery && deliveryTimes && (
              <>
                <Spacer size={3} />
                <Styled.times>
                  {deliveryTimes.slice(0, 4).map((time, count) => (
                    <Styled.time key={`time-${count}`}>
                      <Text bold>{time}</Text>
                    </Styled.time>
                  ))}
                  {deliveryTimes.length > 4 && (
                    <Styled.timeAdded
                      onMouseEnter={() => setShowAllTimes(true)}
                      onMouseLeave={() => setShowAllTimes(false)}
                    >
                      <Text color={!showAllTimes ? color.base.greyDark : color.base.white}>
                        +{deliveryTimes.slice(4).length}
                      </Text>
                    </Styled.timeAdded>
                  )}
                </Styled.times>
                {showAllTimes && [
                  <Spacer size={2} key="extra-spacer" />,
                  <Styled.times key="extra-times">
                    {deliveryTimes.slice(4).map((time, count) => (
                      <Styled.time key={`time-${count}`}>
                        <Text bold>{time}</Text>
                      </Styled.time>
                    ))}
                  </Styled.times>,
                ]}
              </>
            )}
          </div>
        ) : (
          <Styled.incomplete>
            <Styled.incompleteAlert>
              <Icon src={Icons.Issue} size={IconSize.medium} color={color.base.white} />
            </Styled.incompleteAlert>
            <Text>Alert incomplete</Text>
          </Styled.incomplete>
        )}
      </Styled.content>
      <Styled.actions>
        <div>
          {isConsultant && (
            <>
              <Button
                type="text"
                isSmall
                inline
                label="Delete"
                icon={Icons.Bin}
                onClick={onDelete}
              />
              <Button
                type="text"
                isSmall
                inline
                label="Copy to"
                icon={Icons.Copy}
                onClick={onCopy}
              />
            </>
          )}
        </div>

        {isComplete ? (
          <Styled.actionsButtons>
            {!showEditOptions ? (
              <>
                <Button
                  type="secondary"
                  isSmall
                  inline
                  label="View settings"
                  icon={Icons.Document}
                  onClick={() => router.push(`/collections/${collectionId}/alerts/${uuid}/preview`)}
                />
                {isConsultant && (
                  <Button
                    type="secondary"
                    isSmall
                    inline
                    label="Edit settings"
                    icon={Icons.Pencil}
                    onClick={() => setShowEditOptions(true)}
                  />
                )}
                <Button
                  isSmall
                  inline
                  label="View Results"
                  icon={Icons.ChevronRightBold}
                  iconAlignment="right"
                  onClick={() => router.push(`/collections/${collectionId}/alerts/${uuid}/results`)}
                />
              </>
            ) : (
              <>
                <Button
                  type="text"
                  isSmall
                  label="Cancel"
                  onClick={() => setShowEditOptions(false)}
                />
                <Button isSmall label="Edit Info" onClick={() => onViewSettings('?step=1')} />
                <Button isSmall label="Edit Queries" onClick={() => onViewSettings('?step=2')} />
                <Button isSmall label="Edit Recipients" onClick={() => onViewSettings('?step=3')} />
                <Button isSmall label="Edit Schedule" onClick={() => onViewSettings('?step=4')} />
              </>
            )}
          </Styled.actionsButtons>
        ) : (
          <Styled.actionsButtons>
            <Button
              label="Click to complete"
              icon={Icons.ChevronRightBold}
              iconAlignment="right"
              onClick={() =>
                router.push(
                  `/collections/${collectionId}/alerts/${uuid}/edit?step=${lastStepCompleted + 1}`,
                )
              }
            />
          </Styled.actionsButtons>
        )}
      </Styled.actions>
    </Styled.wrapper>
  );
};

export default Alert;
