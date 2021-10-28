import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { configure } from 'enzyme';
import enableHooks from 'jest-react-hooks-shallow';

enableHooks(jest);

configure({ adapter: new Adapter() });

global.mockSubscriptionList = [
  { uuid: '12-12', name: 'Bronze' },
  { uuid: '12-13', name: 'Silver' },
  { uuid: '12-14', name: 'Gold' },
];
