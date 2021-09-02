import classNames from 'classnames';
import React from 'react';

import color from '../../globals/color';
import Icon, { IconSize } from '../Icon';
import { Icons } from '../Icon/assets';
import Text from '../Text';
import * as Styled from './Pagination.styles';

type NumPerPage = 30 | 60 | 90;

export type PaginationProps = {
  dataLength: number;
};

type Data = {
  [key: string]: string | number;
};

type DataArray = Array<Data>;

type PaginationType = {
  PaginationStats: React.FC;
  PaginationContent: (data: DataArray) => DataArray;
  PaginationButtons: React.FC;
};

const Pagination = (dataLength: number): PaginationType => {
  const [activePage, setActivePage] = React.useState<number>(0);
  const [numPerPage, setNumPerPage] = React.useState<NumPerPage>(30);

  const pageButtons = () => {
    const numPages = Math.ceil(dataLength / numPerPage);
    const buttons = [];

    for (let i = 0; i < Math.ceil(dataLength / numPerPage); i++) {
      if (
        i === 0 ||
        i === numPages - 1 ||
        i === activePage ||
        (activePage < 3 && i < 3) ||
        (activePage > numPages - 4 && i > numPages - 4) ||
        numPages <= 5
      ) {
        buttons.push(
          <Styled.button
            key={`button-${i}`}
            data-test={`page-button-${i}`}
            className={classNames({ active: activePage === i })}
            onClick={() => setActivePage(i)}
          >
            {i + 1}
          </Styled.button>,
        );
      }

      if (
        numPages > 5 &&
        ((i === 0 && activePage >= 3) || (i === numPages - 2 && activePage < numPages - 3))
      ) {
        buttons.push(<Styled.spacer key={`spacer-${i}`}>...</Styled.spacer>);
      }
    }

    return (
      <Styled.buttonsContainer data-test="buttons-container">{buttons}</Styled.buttonsContainer>
    );
  };

  const PaginationStats: React.FC = () => {
    const changeLayout = (num: NumPerPage) => {
      setNumPerPage(num);
      setActivePage(0);
    };

    const start = activePage * numPerPage;
    const end = start + numPerPage;

    return (
      <Styled.stats data-test="component-pagination-stats">
        <Text type="bodySmall" color={color.base.grey} data-test="item-count">
          Showing {start + 1}-{Math.min(dataLength, end)} of {dataLength}
        </Text>
        <Text type="bodySmall" color={color.base.grey}>
          Items per page&nbsp;
          {/* @todo: replace with select list component */}
          <select
            data-test="set-page-count"
            onChange={(event) => changeLayout(event.target.value as unknown as NumPerPage)}
            value={numPerPage}
          >
            <option>30</option>
            <option>60</option>
            <option>90</option>
          </select>
        </Text>
      </Styled.stats>
    );
  };

  const PaginationContent = (data: DataArray): DataArray => {
    const start = activePage * numPerPage;
    const end = start + numPerPage;
    return data.slice(start, end);
  };

  const PaginationButtons: React.FC = () => {
    const numPages = Math.ceil(dataLength / numPerPage);
    const hasPrev = activePage > 0;
    const hasNext = activePage < numPages - 1;
    return (
      <Styled.pages data-test="component-pagination-buttons">
        {numPages > 1 && (
          <Styled.pageChanger
            data-test="buttons-prev-arrow"
            className={classNames({ disabled: !hasPrev })}
            onClick={() => setActivePage(activePage - 1)}
          >
            <Icon
              size={IconSize.medium}
              src={Icons.IconChevronLeft}
              color={hasPrev ? color.theme.blueMid : color.base.grey}
            />
          </Styled.pageChanger>
        )}
        {pageButtons()}
        {numPages > 1 && (
          <Styled.pageChanger
            data-test="buttons-next-arrow"
            className={classNames({ disabled: !hasNext })}
            onClick={() => setActivePage(activePage + 1)}
          >
            <Icon
              size={IconSize.medium}
              src={Icons.IconChevronRight}
              color={hasNext ? color.theme.blueMid : color.base.grey}
            />
          </Styled.pageChanger>
        )}
      </Styled.pages>
    );
  };

  return { PaginationStats, PaginationContent, PaginationButtons };
};

export default Pagination;
