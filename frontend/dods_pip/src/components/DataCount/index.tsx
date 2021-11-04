import React, { ReactElement } from 'react';

import color from '../../globals/color';
import Text from '../Text';
import * as Styled from './data-count.styles';

export interface DataCountProps {
  total: number;
  locale?: string;
}
// TODO: Create & consume shared locale/IT8n object

const DataCount = ({ total = 0, locale = 'en-GB' }: DataCountProps): ReactElement => {
  return (
    <Styled.dataCount>
      <Text type="bodySmall" color={color.base.grey} data-test="data-count-component">
        Total{' '}
        <span style={{ color: color.theme.blueMid }}>
          <b data-test="items-count">{new Intl.NumberFormat(locale).format(total)}</b>
        </span>{' '}
        item{total === 0 || total > 1 ? 's' : null}
      </Text>
    </Styled.dataCount>
  );
};

export default DataCount;
