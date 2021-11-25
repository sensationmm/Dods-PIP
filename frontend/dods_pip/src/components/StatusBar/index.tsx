import React from 'react';
import { useMediaQuery } from 'react-responsive';

import color from '../../globals/color';
import { breakpoints } from '../../globals/media';
import Button from '../Button';
import Icon, { IconSize } from '../Icon';
import { Icons } from '../Icon/assets';
import Tag from '../Tag';
import Text from '../Text';
import * as Styled from './StatusBar.styles';
import { tagConstructor } from './tagConstructor';

type statusBarTypes = 'in_progress' | 'scheduled' | 'published';

export interface StatusBarProps {
  isTransparent?: boolean;
  containerized?: boolean;
  statusBarType?: statusBarTypes;
  dateScheduled?: string;
  saveAndExit?: boolean;
  scheduleDisabled?: boolean;
  schedule?: boolean;
  publishDisabled?: boolean;
  publish?: boolean;
  unschedule?: boolean;
  unpublish?: boolean;
  updateArticle?: boolean;

  onPreview?: () => void;
  onDelete?: () => void;
  onSchedule?: () => void;
  onUnschedule?: () => void;
  onPublish?: () => void;
  onUnpublish?: () => void;
  onSaveAndEdit?: () => void;
  onUpdateArticle?: () => void;
}

export const MainContent: React.FC<StatusBarProps> = ({
  statusBarType = 'in_progress',
  dateScheduled,
  saveAndExit,
  schedule,
  publish,
  publishDisabled,
  scheduleDisabled,
  unschedule,
  unpublish,
  updateArticle,

  onPreview,
  onDelete,
  onSchedule,
  onUnschedule,
  onPublish,
  onUnpublish,
  onSaveAndEdit,
  onUpdateArticle,
}) => (
  <Styled.wrapper data-test="statusbar-wraper">
    <Styled.group>
      <Styled.tagWrapper>
        <Text color={color.theme.blue}> Status: </Text>
      </Styled.tagWrapper>
      <Styled.tagWrapper>
        <Tag
          iconBgColor={tagConstructor(statusBarType).iconColor}
          label={tagConstructor(statusBarType).label}
          icon={tagConstructor(statusBarType).icon}
          bgColor="white"
        />
      </Styled.tagWrapper>
      <Button type="text" icon={Icons.Show} onClick={onPreview} label="Preview" />
      <Button type="text" icon={Icons.Bin} onClick={onDelete} label="Delete" />
    </Styled.group>

    <Styled.group>
      {dateScheduled && (
        <Styled.date data-test="date-scheduled">
          <Text>Scheduled : {dateScheduled}</Text>
        </Styled.date>
      )}

      {saveAndExit && (
        <Styled.buttonSeparator data-test="saveandexit-component">
          <Button
            label="Save and Exit"
            type="secondary"
            onClick={onSaveAndEdit}
            icon={Icons.Exit}
          />
        </Styled.buttonSeparator>
      )}

      {schedule && (
        <Styled.buttonSeparator data-test="schedule-component">
          <Button
            label="Schedule"
            type="secondary"
            icon={Icons.Clock}
            disabled={scheduleDisabled}
            onClick={onSchedule}
          />
        </Styled.buttonSeparator>
      )}
      {unschedule && (
        <Styled.buttonSeparator data-test="unschedule-component">
          <Button
            label="Unscheduled"
            onClick={onUnschedule}
            type="secondary"
            icon={Icons.Refresh}
          />
        </Styled.buttonSeparator>
      )}

      {publish && (
        <Styled.buttonSeparator data-test="publish-component">
          <Button
            onClick={onPublish}
            label="Publish now"
            iconAlignment="right"
            icon={Icons.ChevronRight}
            disabled={publishDisabled}
          />
        </Styled.buttonSeparator>
      )}
      {unpublish && (
        <Styled.buttonSeparator data-test="unpublish-component">
          <Button type="secondary" onClick={onUnpublish} label="Unpublish" icon={Icons.Refresh} />
        </Styled.buttonSeparator>
      )}

      {updateArticle && (
        <Styled.buttonSeparator data-test="Update-article-component">
          <Button
            label="Update article"
            onClick={onUpdateArticle}
            iconAlignment="right"
            icon={Icons.ChevronRight}
          />
        </Styled.buttonSeparator>
      )}
    </Styled.group>
  </Styled.wrapper>
);

export const MobileComponent: React.FC = () => {
  return (
    <div data-test="mobile-component">
      <Styled.inlineView>
        <Icon size={IconSize.large} src={Icons.Show} color={color.theme.blue} />
        <Styled.text>
          <Text bold color={color.theme.blue}>
            Read-only mode
          </Text>
        </Styled.text>
      </Styled.inlineView>
      <Text color={color.base.greyDark}>To edit this editorial you must be in desktop mode</Text>
    </div>
  );
};

const StatusBar: React.FC<StatusBarProps> = ({ isTransparent, containerized = true, ...props }) => {
  const isMobileOrTablet = useMediaQuery({ query: breakpoints.mobileOrTablet });

  return (
    <Styled.card isTransparent={isTransparent} data-test="card-component">
      <Styled.container containerized={containerized}>
        {isMobileOrTablet ? (
          <MobileComponent data-test="mobile-component" />
        ) : (
          <MainContent {...props} />
        )}
      </Styled.container>
    </Styled.card>
  );
};

export default StatusBar;
