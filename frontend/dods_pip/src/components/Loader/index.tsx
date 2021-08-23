import classNames from 'classnames';
import Lottie from 'react-lottie';

import animationData from './dods-loader.json';
import * as Styled from './Loader.styles';

type LoaderProps = {
  inline?: boolean;
};

const Loader: React.FC<LoaderProps> = ({ inline = false }) => {
  return (
    <Styled.mask data-test={'component-loader'} className={classNames({ inline: inline })}>
      <Lottie
        options={{ loop: true, autoplay: true, animationData: animationData }}
        height={40}
        width={40}
      />
    </Styled.mask>
  );
};

export default Loader;
