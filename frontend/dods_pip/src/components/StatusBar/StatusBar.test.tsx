import { shallow } from 'enzyme';
import React from 'react';
import { Icons } from '../Icon/assets';
import color from '../../globals/color';
import { useMediaQuery } from 'react-responsive';
import { tagConstructor } from './tagConstructor';
import StatusBar, { MainContent, ReadOnlyMessage } from '.';

const useMediaQueryMock = useMediaQuery as jest.Mock;

jest.mock('react-responsive', () => ({
  useMediaQuery: jest.fn(),
}));

describe('Status Bar', () => {
  it('renders without error', () => {
    const wrapper = shallow(<StatusBar isTransparent={false} />);
    const component = wrapper.find('[data-test="card-component"]');
    expect(component.length).toEqual(1);
  });

  describe('When viewport is mobile', () => {
    it('should render component successfully', () => {
      useMediaQueryMock.mockReturnValueOnce({ isMobileOrTablet: true });
      const wrapper = shallow(<StatusBar isTransparent />);
      const component = wrapper.find('[data-test="mobile-component"]');
      expect(component.length).toEqual(1);
    });

    it('should not render component', () => {
      useMediaQueryMock.mockReturnValueOnce({ isMobileOrTablet: true });
      const wrapper = shallow(<StatusBar />);
      const component = wrapper.find('[data-test="mobile-component"]');
      expect(component.length).toEqual(1);
    });

    it('should render component successfully', () => {
      const wrapper = shallow(<ReadOnlyMessage />);
      const component = wrapper.find('[data-test="mobile-component"]');
      expect(component.length).toEqual(1);
    });
  });

  describe('tagConstructor test', () => {
    it('When de configuration is set to in_progress it should have the pencil icon and the colour should be color.theme.blueLight', () => {
      const result = tagConstructor('in_progress');
      expect(result.icon).toEqual(Icons.Pencil);
      expect(result.iconColor).toEqual(color.theme.blueLight);
      expect(result.label).toEqual('In progress');
    });
    it('When de configuration is set to Scheduled it should have the clock icon and the colour should be color.accent.green', () => {
      const result = tagConstructor('scheduled');
      expect(result.icon).toEqual(Icons.Clock);
      expect(result.iconColor).toEqual(color.accent.green);
      expect(result.label).toEqual('Scheduled');
    });
    it('When de configuration is set to published it should have the Tick icon and the colour should be color.accent.green', () => {
      const result = tagConstructor('published');
      expect(result.icon).toEqual(Icons.Tick);
      expect(result.iconColor).toEqual(color.accent.green);
      expect(result.label).toEqual('Published');
    });
  });

  it('MainContent reders without issues', () => {
    const wrapper = shallow(<MainContent />);
    const container = wrapper.find('[data-test="statusbar-wrapper"]');
    expect(container.length).toEqual(1);
  });

  it('When dateScheduled is set is should show the date component ', () => {
    const wrapper = shallow(<MainContent dateScheduled="12 December 2021 at 12:00" />);
    const component = wrapper.find('[data-test="date-scheduled"]');
    expect(component.length).toEqual(1);
  });

  it('Should show the save and exit component ', () => {
    const wrapper = shallow(<MainContent saveAndExit />);
    const component = wrapper.find('[data-test="saveandexit-component"]');
    expect(component.length).toEqual(1);
  });

  it('Should show the schedule component ', () => {
    const wrapper = shallow(<MainContent schedule />);
    const component = wrapper.find('[data-test="schedule-component"]');
    expect(component.length).toEqual(1);
  });

  it('Should show the unschedule component ', () => {
    const wrapper = shallow(<MainContent unschedule />);
    const component = wrapper.find('[data-test="unschedule-component"]');
    expect(component.length).toEqual(1);
  });

  it('Should show the unschedule component ', () => {
    const wrapper = shallow(<MainContent publish />);
    const component = wrapper.find('[data-test="publish-component"]');
    expect(component.length).toEqual(1);
  });

  it('Should show the unschedule component ', () => {
    const wrapper = shallow(<MainContent unpublish />);
    const component = wrapper.find('[data-test="unpublish-component"]');
    expect(component.length).toEqual(1);
  });

  it('Should show the unschedule component ', () => {
    const wrapper = shallow(<MainContent updateArticle />);
    const component = wrapper.find('[data-test="Update-article-component"]');
    expect(component.length).toEqual(1);
  });
});
