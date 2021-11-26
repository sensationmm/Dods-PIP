import Link from 'next/link';
import React, { useEffect, useState } from 'react';

import color from '../../globals/color';
import Text from '../Text';
import * as Styled from './Breadcrumbs.styles';

export interface BreadcrumbsProps {
  history: History[];
}

type History = {
  href: string;
  label: string;
};

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ history }) => {
  const [allHistory, setAllHistory] = useState<History[]>([]);
  useEffect(() => {
    if (history?.length > 4) {
      setAllHistory([
        history[0],
        { label: '...', href: '' },
        history[history.length - 2],
        history[history.length - 1],
      ]);
    } else {
      setAllHistory(history);
    }
  }, [history]);

  return (
    <Styled.wrapper data-test="component-breadcrumbs">
      {allHistory?.map((h, idx) => (
        <Styled.breadcrumb key={h.label}>
          {idx < allHistory.length - 1 && h.label !== '...' ? (
            <Link href={h.href} passHref>
              <Styled.anchor>
                <Text
                  type="body"
                  color={color.theme.blue}
                  bold={idx !== allHistory.length - 1}
                  data-test={'link-text-' + idx}
                >
                  {h.label}
                </Text>
              </Styled.anchor>
            </Link>
          ) : (
            <Styled.anchor>
              <Text
                type="body"
                color={color.theme.blue}
                bold={idx !== allHistory.length - 1}
                data-test={'link-text-' + idx}
              >
                {h.label}
              </Text>
            </Styled.anchor>
          )}
          {idx !== allHistory.length - 1 && (
            <Styled.slash>
              <Text type="body" color={color.theme.blue}>
                /
              </Text>
            </Styled.slash>
          )}
        </Styled.breadcrumb>
      ))}
    </Styled.wrapper>
  );
};

export default Breadcrumbs;
