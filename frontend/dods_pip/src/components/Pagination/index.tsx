import classNames from 'classnames';
import React, { useEffect } from 'react';

import color from '../../globals/color';
import Select from '../_form/Select';
import Icon, { IconSize } from '../Icon';
import { Icons } from '../Icon/assets';
import Text from '../Text';
import * as Styled from './Pagination.styles';

type NumPerPage = '30' | '60' | '90';

export type PaginationProps = {
  dataLength: number;
};

type PaginationType = {
  activePage: number;
  numPerPage: number;
  PaginationStats: React.FC;
  PaginationContent: <Type>(data: Type) => Type;
  PaginationButtons: React.FC;
};

const Pagination = (dataLength: number): PaginationType => {
  const [activePage, setActivePage] = React.useState<number>(0);
  const [numPerPage, setNumPerPage] = React.useState<NumPerPage>('30');

  useEffect(() => {
    setActivePage(0);
  }, [dataLength]);

  const pageButtons = () => {
    const numPages = Math.ceil(dataLength / parseInt(numPerPage));
    const buttons = [];

    for (let i = 0; i < Math.ceil(dataLength / parseInt(numPerPage)); i++) {
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
    const changeLayout = (num: string) => {
      setNumPerPage(num as NumPerPage);
      setActivePage(0);
    };

    const start = activePage * parseInt(numPerPage);
    const end = start + parseInt(numPerPage);

    return (
      <Styled.stats data-test="component-pagination-stats">
        <Text type="bodySmall" color={color.base.grey} data-test="item-count">
          Showing {dataLength > 0 ? start + 1 : 0}-{Math.min(dataLength, end)} of {dataLength}
        </Text>
        <Styled.perPage>
          <Text type="bodySmall" color={color.base.grey}>
            Items per page&nbsp;
          </Text>
          <Select
            testId="select-items-per-page"
            id="pagination-pp"
            data-test="set-page-count"
            size="small"
            options={[
              { value: '30', label: '30' },
              { value: '60', label: '60' },
              { value: '90', label: '90' },
            ]}
            onChange={changeLayout}
            placeholder=""
            value={numPerPage}
            isFullWidth={false}
            isFilter
          />
        </Styled.perPage>
      </Styled.stats>
    );
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const PaginationContent = (data: any) => {
    const start = activePage * parseInt(numPerPage);
    const end = start + numPerPage;
    return data.slice(start, end);
  };

  const PaginationButtons: React.FC = () => {
    const numPages = Math.ceil(dataLength / parseInt(numPerPage));
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
              src={Icons.ChevronLeftBold}
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
              src={Icons.ChevronRightBold}
              color={hasNext ? color.theme.blueMid : color.base.grey}
            />
          </Styled.pageChanger>
        )}
      </Styled.pages>
    );
  };

  return {
    activePage,
    numPerPage: parseInt(numPerPage, 10),
    PaginationStats,
    PaginationContent,
    PaginationButtons,
  };
};

export default Pagination;
