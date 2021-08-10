import classNames from 'classnames';
import React from 'react';
import Loader from '../../components/Loader';

import * as Styled from './LoadingHOC.styles';

export type LoadingHOCProps = {
  isLoading: boolean;
  setLoading: (state: boolean) => void;
};

const LoadingHOC = <P extends object>(WrappedComponent: React.FunctionComponent<P>) => {
  function HOC(props: any) {
    const [isLoading, setIsLoading] = React.useState(false);

    return (
      <>
        <Styled.mask className={classNames({ visible: isLoading })}>
          <Loader />
        </Styled.mask>
        <WrappedComponent {...props} isLoading={isLoading} setLoading={setIsLoading} />
      </>
    );
  }

  return HOC;
};

export default LoadingHOC;
