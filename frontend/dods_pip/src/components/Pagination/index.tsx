import classNames from 'classnames';
import React, { useEffect } from 'react';

import color from '../../globals/color';
import Select from '../_form/Select';
import Icon, { IconSize } from '../Icon';
import { Icons } from '../Icon/assets';
import Text from '../Text';
import * as Styled from './Pagination.styles';

type NumPerPage = '5' | '10' | '30' | '60' | '90';

export type PaginationProps = {
  dataLength: number;
};

export type PaginationType = {
  activePage: number;
  numPerPage: number;
  PaginationStats: React.FC;
  PaginationContent: <Type>(data: Type) => Type;
  PaginationButtons: React.FC;
};

const Pagination = (dataLength: number, numPerPageOverride: NumPerPage = '30'): PaginationType => {
  const [activePage, setActivePage] = React.useState<number>(0);
  const [numPerPage, setNumPerPage] = React.useState<NumPerPage>(numPerPageOverride);
  const numPages = Math.ceil(dataLength / parseInt(numPerPage));

  useEffect(() => {
    setActivePage(0);
  }, [dataLength]);

  const pageButtons = () => {
    const buttons = [];

    for (let i = 0; i < numPages; i++) {
      if (i === 0 || i === activePage || (activePage < 5 && i < 5) || numPages <= 5) {
        buttons.push(
          <Styled.button
            key={`button-${i}`}
            data-test={`page-button-${i}`}
            className={classNames({ active: activePage === i })}
            onClick={() => {
              setActivePage(i);
              window.scrollTo(0, 0);
            }}
          >
            {i + 1}
          </Styled.button>,
        );
      }
    }

    return (
      <Styled.buttonsContainer data-test="buttons-container">{buttons}</Styled.buttonsContainer>
    );
  };

  const inlinePageNav = () => {
    const inlinePages = [];

    for (let i = 0; i < numPages; i++) {
      const iValue = (i + 1).toString();
      inlinePages.push({ value: iValue, label: iValue });
    }

    return (
      <Styled.inlineNav>
        <Text type="bodySmall" color={color.base.grey} data-test="viewing-page">
          Viewing page
        </Text>
        <Select
          testId="inline-pages"
          id="inline-pagination"
          data-test="set-pages"
          size="small"
          options={inlinePages}
          onChange={(e) => {
            setActivePage(parseInt(e) - 1);
            window.scrollTo(0, 0);
          }}
          placeholder=""
          value={(activePage + 1).toString()}
          isFullWidth={false}
          isFilter
        />
        <Text type="bodySmall" color={color.base.grey} data-test="item-text">
          of
        </Text>
        <Text type="bodySmall" bold color={color.theme.blueMid} data-test="item-pages">
          {numPages}
        </Text>
      </Styled.inlineNav>
    );
  };

  const PaginationStats: React.FC = ({ children }) => {
    const changeLayout = (num: string) => {
      setNumPerPage(num as NumPerPage);
      setActivePage(0);
      window.scrollTo(0, 0);
    };

    const start = activePage * parseInt(numPerPage);
    const end = start + parseInt(numPerPage);

    return (
      <Styled.stats data-test="component-pagination-stats">
        <Text type="bodySmall" color={color.base.grey}>
          Showing{' '}
          <strong style={{ color: color.theme.blueMid }} data-test="item-count">
            {dataLength > 0 ? start + 1 : 0}-{Math.min(dataLength, end)}
          </strong>{' '}
          of{' '}
          <strong style={{ color: color.theme.blueMid }} data-test="item-total">
            {dataLength}
          </strong>
        </Text>
        {children}
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
              { value: '5', label: '5' },
              { value: '10', label: '10' },
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
            onClick={() => {
              setActivePage(activePage - 1);
              window.scrollTo(0, 0);
            }}
          >
            <Icon
              size={IconSize.medium}
              src={Icons.ChevronLeftBold}
              color={hasPrev ? color.base.greyDark : color.base.greyMid}
            />
          </Styled.pageChanger>
        )}
        {numPages <= 5 ? pageButtons() : inlinePageNav()}
        {numPages > 1 && (
          <Styled.pageChanger
            data-test="buttons-next-arrow"
            className={classNames({ disabled: !hasNext })}
            onClick={() => {
              setActivePage(activePage + 1);
              window.scrollTo(0, 0);
            }}
          >
            <Icon
              size={IconSize.medium}
              src={Icons.ChevronRightBold}
              color={hasNext ? color.base.greyDark : color.base.greyMid}
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
