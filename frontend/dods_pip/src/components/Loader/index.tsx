import Lottie from 'react-lottie';
import animationData from './dods-loader.json';

import * as Styled from './Loader.styles';

const Loader: React.FC = () => {
  return (
    <Styled.mask data-test={'component-loader'}>
      {/* TODO: add mask color/opacity once design chooses one */}
      <Lottie
        options={{ loop: true, autoplay: true, animationData: animationData }}
        height={40}
        width={40}
      />
    </Styled.mask>
  );
};

export default Loader;
