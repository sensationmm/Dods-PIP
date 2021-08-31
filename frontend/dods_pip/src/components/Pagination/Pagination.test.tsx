import { shallow } from 'enzyme';
import React from 'react';

import Pagination from '.';

const data = [
  { name: 'Article1' },
  { name: 'Article2' },
  { name: 'Article3' },
  { name: 'Article4' },
  { name: 'Article5' },
  { name: 'Article6' },
  { name: 'Article7' },
  { name: 'Article8' },
  { name: 'Article9' },
  { name: 'Article10' },
  { name: 'Article11' },
  { name: 'Article12' },
  { name: 'Article13' },
  { name: 'Article14' },
  { name: 'Article15' },
  { name: 'Article16' },
  { name: 'Article17' },
  { name: 'Article18' },
  { name: 'Article19' },
  { name: 'Article20' },
  { name: 'Article21' },
  { name: 'Article22' },
  { name: 'Article23' },
  { name: 'Article24' },
  { name: 'Article25' },
  { name: 'Article26' },
  { name: 'Article27' },
  { name: 'Article28' },
  { name: 'Article29' },
  { name: 'Article30' },
  { name: 'Article31' },
  { name: 'Article22' },
  { name: 'Article33' },
  { name: 'Article34' },
  { name: 'Article35' },
  { name: 'Article36' },
  { name: 'Article37' },
  { name: 'Article38' },
  { name: 'Article39' },
  { name: 'Article40' },
  { name: 'Article41' },
  { name: 'Article42' },
  { name: 'Article43' },
  { name: 'Article44' },
  { name: 'Article45' },
  { name: 'Article46' },
  { name: 'Article47' },
  { name: 'Article48' },
  { name: 'Article49' },
  { name: 'Article50' },
  { name: 'Article51' },
  { name: 'Article52' },
  { name: 'Article53' },
  { name: 'Article54' },
  { name: 'Article55' },
  { name: 'Article56' },
  { name: 'Article57' },
  { name: 'Article58' },
  { name: 'Article59' },
];

describe('Pagination', () => {
  let count = 0;
  const setState = jest.fn();
  const useStateSpy = jest.spyOn(React, 'useState');

  const defaultState = {
    activePage: 3,
    numPerPage: 5,
  };

  const states = [
    // PaginationStats
    defaultState, // renders without error
    defaultState, // changes items per page

    // PaginationContent
    defaultState, // returns correct slice

    // PaginationButtons
    defaultState, // renders without error
    defaultState, // shows correct stats
    defaultState, // decrements page on prev click
    defaultState, // increments page on next click
    { ...defaultState, activePage: 0 }, // disables prev arrow when first page is active
    { ...defaultState, numPerPage: 30, activePage: 1 }, // disables next arrow when last page is active
    { ...defaultState, numPerPage: 60, activePage: 1 }, // hides arrows when only one page
    defaultState, // sets page when number clicked
    { ...defaultState, numPerPage: 6, activePage: 2 }, // resticts viewable pages - page 3 of 10
    { ...defaultState, numPerPage: 6, activePage: 4 }, // resticts viewable pages - page 5 of 10
    { ...defaultState, numPerPage: 6, activePage: 7 }, // resticts viewable pages - page 8 of 10
  ];

  beforeEach(() => {
    useStateSpy
      .mockImplementationOnce(() => [states[count].activePage, setState])
      .mockImplementationOnce(() => [states[count].numPerPage, setState]);
  });

  describe('PaginationStats', () => {
    it('renders without error', () => {
      const { PaginationStats } = Pagination(data.length);
      const wrapper = shallow(<PaginationStats />);
      const component = wrapper.find('[data-test="component-pagination-stats"]');
      expect(component.length).toEqual(1);
    });

    it('shows correct stats', () => {
      const { PaginationStats } = Pagination(data.length);
      const wrapper = shallow(<PaginationStats />);
      const itemCount = wrapper.find('[data-test="item-count"]');
      expect(itemCount.props().children.join('')).toEqual('Showing 16-20 of 59');
    });

    it('changes items per page', () => {
      const { PaginationStats } = Pagination(data.length);
      const wrapper = shallow(<PaginationStats />);
      const numChanger = wrapper.find('[data-test="set-page-count"]');
      numChanger.simulate('change', { target: { value: 90 } });

      expect(setState).toHaveBeenCalledWith(90);
      expect(setState).toHaveBeenCalledWith(0);
    });
  });

  describe('PaginationContent', () => {
    it('returns correct slice', () => {
      const { PaginationContent } = Pagination(data.length);
      const content = PaginationContent(data);

      expect(content).toEqual([
        { name: 'Article16' },
        { name: 'Article17' },
        { name: 'Article18' },
        { name: 'Article19' },
        { name: 'Article20' },
      ]);
    });
  });

  describe('PaginationButtons', () => {
    it('renders without error', () => {
      const { PaginationButtons } = Pagination(data.length);
      const wrapper = shallow(<PaginationButtons />);
      const component = wrapper.find('[data-test="component-pagination-buttons"]');
      expect(component.length).toEqual(1);
    });

    it('decrements page on prev click', () => {
      const { PaginationButtons } = Pagination(data.length);
      const wrapper = shallow(<PaginationButtons />);
      const prevArrow = wrapper.find('[data-test="buttons-prev-arrow"]');
      prevArrow.simulate('click');
      expect(prevArrow.hasClass('disabled')).toEqual(false);
      expect(setState).toHaveBeenCalledWith(2);
    });

    it('increments page on next click', () => {
      const { PaginationButtons } = Pagination(data.length);
      const wrapper = shallow(<PaginationButtons />);
      const nextArrow = wrapper.find('[data-test="buttons-next-arrow"]');
      nextArrow.simulate('click');
      expect(nextArrow.hasClass('disabled')).toEqual(false);
      expect(setState).toHaveBeenCalledWith(4);
    });

    it('disables prev arrow when first page is active', () => {
      const { PaginationButtons } = Pagination(data.length);
      const wrapper = shallow(<PaginationButtons />);
      const prevArrow = wrapper.find('[data-test="buttons-prev-arrow"]');
      expect(prevArrow.hasClass('disabled')).toEqual(true);
    });

    it('disabled next arrow when last page is active', () => {
      const { PaginationButtons } = Pagination(data.length);
      const wrapper = shallow(<PaginationButtons />);
      const nextArrow = wrapper.find('[data-test="buttons-next-arrow"]');
      expect(nextArrow.hasClass('disabled')).toEqual(true);
    });

    it('hides arrows when only one page', () => {
      const { PaginationButtons } = Pagination(data.length);
      const wrapper = shallow(<PaginationButtons />);
      const prevArrow = wrapper.find('[data-test="buttons-next-arrow"]');
      const nextArrow = wrapper.find('[data-test="buttons-next-arrow"]');
      expect(prevArrow.length).toEqual(0);
      expect(nextArrow.length).toEqual(0);
    });

    it('sets page when number clicked', () => {
      const { PaginationButtons } = Pagination(data.length);
      const wrapper = shallow(<PaginationButtons />);
      const pageNumber = wrapper.find('[data-test="page-button-3"]');
      pageNumber.simulate('click');
      expect(setState).toHaveBeenCalledWith(3);
    });

    describe('restricts viewable pages', () => {
      it('page 3 of 10', () => {
        const { PaginationButtons } = Pagination(data.length);
        const wrapper = shallow(<PaginationButtons />);
        const buttonsContainer = wrapper.find('[data-test="buttons-container"]');
        expect(buttonsContainer.text()).toEqual('123...10');
      });

      it('page 5 of 10', () => {
        const { PaginationButtons } = Pagination(data.length);
        const wrapper = shallow(<PaginationButtons />);
        const buttonsContainer = wrapper.find('[data-test="buttons-container"]');
        expect(buttonsContainer.text()).toEqual('1...5...10');
      });

      it('page 8 of 10', () => {
        const { PaginationButtons } = Pagination(data.length);
        const wrapper = shallow(<PaginationButtons />);
        const buttonsContainer = wrapper.find('[data-test="buttons-container"]');
        expect(buttonsContainer.text()).toEqual('1...8910');
      });
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    count++;
  });
});
