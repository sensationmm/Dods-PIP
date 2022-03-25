import format from 'date-fns/format';
import React from 'react';
import { useMediaQuery } from 'react-responsive';

import color from '../../globals/color';
import { breakpoints } from '../../globals/media';
import Button from '../Button';
import Icon, { IconSize } from '../Icon';
import { Icons } from '../Icon/assets';
import Modal from '../Modal';
import RepositoryStatus, { RepositoryStatusTypes } from '../RepositoryStatus';
import Text from '../Text';
import Tooltip from '../Tooltip';
import * as Styled from './RepositoryTable.styles';

export type RepositoryRowData = {
  id: string;
  documentName: string;
  status: RepositoryStatusTypes;
  updated: Date;
  scheduled?: Date;
  assignedEditor?: string;
};

export interface RepositoryTableProps {
  data: RepositoryRowData[];
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export interface RepositoryRowProps {
  data: RepositoryRowData;
  keyString: string;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  focused: boolean;
}

export const RepositoryRow: React.FC<RepositoryRowProps> = ({
  keyString,
  data,
  onView,
  onEdit,
  onDelete,
  focused,
}) => {
  const isMobileOrTablet = useMediaQuery({ query: breakpoints.mobileOrTablet });
  const [isHovered, setIsHovered] = React.useState<boolean>(focused);
  const [showDelete, setShowDelete] = React.useState<boolean>(false);

  const date = new Date(
    data.status.toLowerCase() === 'scheduled' && data.scheduled ? data.scheduled : data.updated,
  );

  const rowIsLocked = data.assignedEditor !== undefined || false;

  React.useEffect(() => {
    setIsHovered(focused);
  }, [focused]);

  return (
    <>
      <Styled.tableRow
        data-test="component-repository-row"
        key={keyString}
        onMouseEnter={() => !rowIsLocked && !isMobileOrTablet && setIsHovered(true)}
        onMouseLeave={() => !rowIsLocked && !isMobileOrTablet && setIsHovered(false)}
        locked={rowIsLocked}
      >
        <div>
          {isMobileOrTablet && (
            <Styled.mobileStatus>
              <RepositoryStatus type={data.status} size="small" width="auto" />
            </Styled.mobileStatus>
          )}
          <Styled.tableTitle locked={rowIsLocked}>
            {rowIsLocked && (
              <Tooltip
                body={`This content is locked - ${data.assignedEditor} is currently editing the content.`}
                trigger={
                  <Icon src={Icons.Lock} size={IconSize.xlarge} color={color.accent.orange} />
                }
                alignment={isMobileOrTablet ? 'topRight' : 'topLeft'}
              />
            )}
            <Styled.titleText locked={rowIsLocked}>
              <Text bold>
                <span onClick={onView}>{data.documentName}</span>
              </Text>
            </Styled.titleText>
          </Styled.tableTitle>

          <Styled.tableStats>
            <Text type="span" data-test="row-time">
              {data.status.toLowerCase() === 'scheduled'
                ? 'Scheduled: '
                : data.status.toLowerCase() === 'draft'
                ? 'Last edited: '
                : data.status.toLowerCase() === 'ingested'
                ? 'Ingested: '
                : 'Created: '}
              {format(date, "dd MMM yyyy 'at' HH:mm")}
            </Text>

            {isHovered && !isMobileOrTablet && (
              <>
                <RepositoryStatus data-test="hovered-status" type={data.status} width="auto" />
                <Button
                  type="secondary"
                  label="Delete"
                  icon={Icons.Bin}
                  isSmall
                  onClick={() => setShowDelete(true)}
                />
                <Button label="Edit" icon={Icons.Pencil} isSmall onClick={onEdit} />
              </>
            )}
            {!isHovered && !isMobileOrTablet && (
              <Styled.tableStatus data-test="unhovered-status">
                <RepositoryStatus type={data.status} width="fixed" />
              </Styled.tableStatus>
            )}
          </Styled.tableStats>
        </div>
        {isMobileOrTablet && !rowIsLocked && (
          <Styled.mobileActions>
            <Button
              type="secondary"
              label="Delete"
              icon={Icons.Bin}
              onClick={() => setShowDelete(true)}
              tabIndex={0}
            />
            <Button label="Edit" icon={Icons.Pencil} onClick={onEdit} tabIndex={0} />
          </Styled.mobileActions>
        )}
      </Styled.tableRow>

      {showDelete && (
        <Modal
          title="Do you wish to delete this record?"
          titleIcon={Icons.Bin}
          size="large"
          onClose={() => {
            setShowDelete(false);
          }}
          buttons={[
            {
              isSmall: true,
              type: 'secondary',
              label: 'Back',
              onClick: () => setShowDelete(false),
            },
            {
              isSmall: true,
              type: 'primary',
              label: 'Confirm and delete',
              icon: Icons.Bin,
              onClick: onDelete,
            },
          ]}
          buttonAlignment="right"
        >
          <Text>This record will be permanently deleted from the database.</Text>
        </Modal>
      )}
    </>
  );
};

const RepositoryTable: React.FC<RepositoryTableProps> = ({ data, onView, onEdit, onDelete }) => {
  const [focused, setFocused] = React.useState<boolean>(false);
  return (
    <Styled.wrapper data-test="component-repository-table" onFocus={() => setFocused(true)}>
      <Styled.header>
        <Styled.tableHeadingTitle>
          <Text bold>Title</Text>
        </Styled.tableHeadingTitle>
        <div />
        <Styled.tableHeadingTitle>
          <Text bold>Date</Text>
        </Styled.tableHeadingTitle>
        <Styled.tableHeadingStatus>
          <Text bold center>
            Status
          </Text>
        </Styled.tableHeadingStatus>
      </Styled.header>
      <div onFocus={() => setFocused(true)} tabIndex={0} />
      {data.map((item, count) => (
        <RepositoryRow
          key={`repository-row-${count}`}
          keyString={`repository-row-${count}`}
          data-test={`repository-row-${count}`}
          data={item}
          onView={() => onView(item.id)}
          onEdit={() => onEdit(item.id)}
          onDelete={() => onDelete(item.id)}
          focused={focused}
        />
      ))}
      {data.length === 0 && <Text center>No records to show</Text>}
    </Styled.wrapper>
  );
};

export default RepositoryTable;
