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

export type StatusBarTypes = 'in_progress' | 'scheduled' | 'published';

export interface StatusBarProps {
  isTransparent?: boolean;
  containerized?: boolean;
  status?: StatusBarTypes;
  dateScheduled?: string;
  saveAndExit?: boolean;
  unpublish?: boolean;
  updateArticle?: boolean;
  showDeleteButton?: boolean;
  isValidForm: boolean;
  isFutureContentDate: boolean;
  onPreview?: () => void;
  onDelete?: () => void;
  onSchedule?: () => void;
  onUnschedule?: () => Promise<void>;
  onPublish?: () => void;
  onUnpublish?: () => void;
  onSaveAndExit?: () => void;
  onUpdateArticle?: () => void;
}

export const MainContent: React.FC<StatusBarProps> = ({
  status = 'in_progress',
  dateScheduled,
  saveAndExit,
  isValidForm,
  isFutureContentDate,
  showDeleteButton,
  onPreview,
  onDelete,
  onSchedule,
  onUnschedule,
  onPublish,
  onSaveAndExit,
  onUpdateArticle,
}) => {
  const schedule = status !== 'scheduled' && status !== 'published';
  const publish = status !== 'published' && schedule;
  const update = !publish && !schedule;

  return (
    <Styled.wrapper data-test="statusbar-wrapper">
      <Styled.group>
        <Styled.tagWrapper>
          <Text color={color.theme.blue}> Status: </Text>
        </Styled.tagWrapper>
        <Styled.tagWrapper>
          <Tag
            iconBgColor={tagConstructor(status).iconColor}
            label={tagConstructor(status).label}
            icon={tagConstructor(status).icon}
            bgColor="white"
          />
        </Styled.tagWrapper>
        <Button
          type="text"
          icon={Icons.Show}
          onClick={onPreview}
          label="Preview"
          disabled={!isValidForm}
        />
        {showDeleteButton && (
          <Button type="text" icon={Icons.Bin} onClick={onDelete} label="Delete" />
        )}
      </Styled.group>

      <Styled.group reversed={!publish && !schedule && !update}>
        {dateScheduled && (
          <Styled.date data-test="date-scheduled">
            <Text>Scheduled : {dateScheduled}</Text>
          </Styled.date>
        )}

        {publish && saveAndExit && (
          <Styled.buttonSeparator data-test="saveandexit-component">
            <Button
              label={!publish && !schedule ? 'Update article' : 'Save and Exit'}
              type={update ? 'primary' : 'secondary'}
              disabled={!isValidForm}
              onClick={onSaveAndExit}
              icon={update ? Icons.ChevronRight : Icons.Exit}
              iconAlignment={update ? 'right' : 'left'}
            />
          </Styled.buttonSeparator>
        )}

        {publish &&
          (schedule ? (
            <Styled.buttonSeparator data-test="schedule-component">
              <Button
                label="Schedule"
                type={!isFutureContentDate ? 'secondary' : 'primary'}
                icon={Icons.Clock}
                disabled={!isValidForm}
                onClick={onSchedule}
              />
            </Styled.buttonSeparator>
          ) : (
            <Styled.buttonSeparator data-test="unschedule-component">
              <Button
                label="Unschedule"
                onClick={onUnschedule}
                type="secondary"
                icon={Icons.Refresh}
              />
            </Styled.buttonSeparator>
          ))}

        {publish && !isFutureContentDate && (
          <Styled.buttonSeparator data-test="publish-component">
            <Button
              onClick={onPublish}
              label="Publish now"
              iconAlignment="right"
              icon={Icons.ChevronRight}
              disabled={!isValidForm}
            />
          </Styled.buttonSeparator>
        )}

        {!publish && (
          <Styled.buttonSeparator data-test="Update-article-component">
            <Button
              label="Update article!!"
              onClick={onUpdateArticle}
              iconAlignment="right"
              icon={Icons.ChevronRight}
            />
          </Styled.buttonSeparator>
        )}
      </Styled.group>

      {isFutureContentDate && (
        <Styled.publishWarning>
          <Text type="span" bold color={color.alert.red}>
            Cannot publish now with publication date in the future
          </Text>
        </Styled.publishWarning>
      )}
    </Styled.wrapper>
  );
};

export const ReadOnlyMessage: React.FC = () => {
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
          <ReadOnlyMessage data-test="mobile-component" />
        ) : (
          <MainContent {...props} />
        )}
      </Styled.container>
    </Styled.card>
  );
};

export default StatusBar;
