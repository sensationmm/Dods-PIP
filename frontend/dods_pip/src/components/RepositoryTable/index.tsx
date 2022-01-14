import format from 'date-fns/format';
import React from 'react';
import { useMediaQuery } from 'react-responsive';

import color from '../../globals/color';
import { breakpoints } from '../../globals/media';
import Button from '../Button';
import Icon, { IconSize } from '../Icon';
import { Icons } from '../Icon/assets';
import RepositoryStatus, { RepositoryStatusTypes } from '../RepositoryStatus';
import Text from '../Text';
import Tooltip from '../Tooltip';
import * as Styled from './RepositoryTable.styles';

export type RepositoryRowData = {
  id: string;
  documentName: string;
  status: RepositoryStatusTypes;
  updated: Date;
  assignedEditor?: string;
};

export interface RepositoryTableProps {
  data: RepositoryRowData[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export interface RepositoryRowProps {
  data: RepositoryRowData;
  keyString: string;
  onEdit: () => void;
  onDelete: () => void;
}

export const RepositoryRow: React.FC<RepositoryRowProps> = ({
  keyString,
  data,
  onEdit,
  onDelete,
}) => {
  const isMobileOrTablet = useMediaQuery({ query: breakpoints.mobileOrTablet });
  const [isHovered, setIsHovered] = React.useState<boolean>(false);

  const date = new Date(data.updated);

  const rowIsLocked = data.assignedEditor !== undefined || false;

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
              <Text bold>{data.documentName}</Text>
            </Styled.titleText>
          </Styled.tableTitle>

          <Styled.tableStats>
            <Text type="span" data-test="row-time">
              {data.status === 'scheduled'
                ? 'Scheduled: '
                : data.status === 'draft'
                ? 'Last edited: '
                : ''}
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
                  onClick={onDelete}
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
            <Button type="secondary" label="Delete" icon={Icons.Bin} onClick={onDelete} />
            <Button label="Edit" icon={Icons.Pencil} onClick={onEdit} />
          </Styled.mobileActions>
        )}
      </Styled.tableRow>
    </>
  );
};

const RepositoryTable: React.FC<RepositoryTableProps> = ({ data, onEdit, onDelete }) => {
  return (
    <Styled.wrapper data-test="component-repository-table">
      <Styled.header>
        <Styled.tableHeadingTitle>
          <Text bold>Title</Text>
        </Styled.tableHeadingTitle>
        <Styled.tableHeadingStatus>
          <Text bold center>
            Status
          </Text>
        </Styled.tableHeadingStatus>
      </Styled.header>
      {data.map((item, count) => {
        return (
          <RepositoryRow
            key={`repository-row-${count}`}
            keyString={`repository-row-${count}`}
            data-test={`repository-row-${count}`}
            data={item}
            onEdit={() => onEdit(item.id)}
            onDelete={() => onDelete(item.id)}
          />
        );
      })}
    </Styled.wrapper>
  );
};

export default RepositoryTable;
