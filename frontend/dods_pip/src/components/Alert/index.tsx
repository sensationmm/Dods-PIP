import color from '@dods-ui/globals/color';
import React from 'react';

import Spacer from '../_layout/Spacer';
import Button from '../Button';
import DayPicker, { DayType } from '../DayPicker';
import { Icons } from '../Icon/assets';
import Text from '../Text';
import * as Styled from './Alert.styles';

export interface AlertProps {
  title: string;
  searchQueries: number;
  recipients: number;
  immediateDelivery: boolean;
  deliveryDay?: DayType;
  deliveryTimes?: Array<string>;
  isConsultant: boolean;
  onDelete: () => void;
  onCopy: () => void;
  onViewSettings: () => void;
  onViewResults: () => void;
}

const Alert: React.FC<AlertProps> = ({
  title,
  searchQueries,
  recipients,
  immediateDelivery = false,
  deliveryDay,
  deliveryTimes,
  isConsultant,
  onDelete,
  onCopy,
  onViewSettings,
  onViewResults,
}) => {
  const [showAllTimes, setShowAllTimes] = React.useState<boolean>(false);
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
              Search queries: <strong>{searchQueries}</strong>
            </Text>
            <Text type="liSmall">
              Recipients: <strong>{recipients}</strong>
            </Text>
          </ul>
        </Styled.details>
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
            selected={!immediateDelivery ? deliveryDay : undefined}
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
        <Styled.actionsButtons>
          <Button
            type="secondary"
            isSmall
            inline
            label="View settings"
            icon={Icons.Pencil}
            onClick={onViewSettings}
          />
          <Button
            isSmall
            inline
            label="View Results"
            icon={Icons.ChevronRightBold}
            iconAlignment="right"
            onClick={onViewResults}
          />
        </Styled.actionsButtons>
      </Styled.actions>
    </Styled.wrapper>
  );
};

export default Alert;
