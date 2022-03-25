import { shallow } from 'enzyme';
import React from 'react';

import RepositoryTable, { RepositoryRow, RepositoryRowProps, RepositoryTableProps } from '.';
import MockRepository from '../../mocks/data/repository.json';
import Tooltip from '../Tooltip';

jest.mock('react-responsive', () => ({
  useMediaQuery: jest
    .fn()
    .mockReturnValueOnce(true) // renders mobile variant without error
    .mockReturnValueOnce(true) // renders mobile locked variant
    .mockReturnValueOnce(true) // renders without error
    .mockReturnValue(false), // ...rest
}));

describe('RepositoryTable', () => {
  let wrapper, mockOnEdit, mockOnDelete;

  beforeEach(() => {
    mockOnEdit = jest.fn();
    mockOnDelete = jest.fn();
    wrapper = shallow(
      <RepositoryTable
        data={MockRepository.data as unknown as RepositoryTableProps['data']}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />,
    );
  });

  it('renders without error', () => {
    const component = wrapper.find('[data-test="component-repository-table"]');
    expect(component.length).toEqual(1);
  });

  it('fires onEdit', () => {
    const row = wrapper.find('[data-test="repository-row-3"]');
    row.props().onEdit();
    expect(mockOnEdit).toHaveBeenCalledWith(MockRepository.data[3].id);
  });

  it('fires onDelete', () => {
    const row = wrapper.find('[data-test="repository-row-3"]');
    row.props().onDelete();
    expect(mockOnDelete).toHaveBeenCalledWith(MockRepository.data[3].id);
  });
});

describe('RepositoryRow', () => {
  let wrapper, component, mockOnEdit, mockOnDelete;

  const mockSetHover = jest.fn();
  const useStateSpy = jest
    .spyOn(React, 'useState')
    .mockImplementationOnce(() => [false, mockSetHover]) // renders mobile variant without error
    .mockImplementationOnce(() => [false, mockSetHover]) // renders mobile locked variant
    .mockImplementationOnce(() => [false, mockSetHover]) // renders without error
    .mockImplementationOnce(() => [false, mockSetHover]) // fires mouseEnter
    .mockImplementationOnce(() => [true, mockSetHover]) // fires mouseLeave
    .mockImplementation(() => [false, mockSetHover]); // ...rest

  beforeEach(() => {
    mockOnEdit = jest.fn();
    mockOnDelete = jest.fn();
    wrapper = shallow(
      <RepositoryRow
        keyString="example"
        data={MockRepository.data[0] as unknown as RepositoryRowProps['data']}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        focused={true}
      />,
    );
    component = wrapper.find('[data-test="component-repository-row"]');
  });

  it('renders mobile variant without error', () => {
    expect(component.length).toEqual(1);
  });

  it('renders mobile locked variant', () => {
    wrapper = shallow(
      <RepositoryRow
        keyString="example"
        data={MockRepository.data[3] as unknown as RepositoryRowProps['data']}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        focused={true}
      />,
    );
    component = wrapper.find('[data-test="component-repository-row"]');
    const tooltip = component.find(Tooltip);
    expect(tooltip.props().alignment).toEqual('topRight');
  });

  it('renders without error', () => {
    const unhoveredStatus = component.find('[data-test="unhovered-status"]');
    const hoveredStatus = component.find('[data-test="hovered-status"]');
    expect(unhoveredStatus.length).toEqual(1);
    expect(hoveredStatus.length).toEqual(0);
    expect(component.length).toEqual(1);
  });

  it('fires mouseEnter', () => {
    component.props().onMouseEnter();
    const unhoveredStatus = component.find('[data-test="unhovered-status"]');
    const hoveredStatus = component.find('[data-test="hovered-status"]');
    expect(mockSetHover).toHaveBeenCalledWith(true);
  });

  it('fires mouseLeave', () => {
    component.props().onMouseLeave();
    const hoveredStatus = component.find('[data-test="hovered-status"]');
    expect(hoveredStatus.length).toEqual(0);
    expect(mockSetHover).toHaveBeenCalledWith(false);
  });

  it('renders locked variant', () => {
    wrapper = shallow(
      <RepositoryRow
        keyString="example"
        data={MockRepository.data[3] as unknown as RepositoryRowProps['data']}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        focused={true}
      />,
    );
    component = wrapper.find('[data-test="component-repository-row"]');
  });

  it('renders scheduled instance', () => {
    wrapper = shallow(
      <RepositoryRow
        keyString="example"
        data={MockRepository.data[4] as unknown as RepositoryRowProps['data']}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        focused={true}
      />,
    );
    const time = wrapper.find('[data-test="row-time"]');
    expect(time.props().children.join(' ')).toContain('Scheduled');
  });

  it('renders draft instance', () => {
    wrapper = shallow(
      <RepositoryRow
        keyString="example"
        data={MockRepository.data[1] as unknown as RepositoryRowProps['data']}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        focused={true}
      />,
    );
    const time = wrapper.find('[data-test="row-time"]');
    expect(time.props().children.join(' ')).toContain('Last edited');
  });
});
