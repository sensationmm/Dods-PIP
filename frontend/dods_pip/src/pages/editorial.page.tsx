import React from 'react';

import Panel from '../components/_layout/Panel';
import RepositoryTable, { RepositoryTableProps } from '../components/RepositoryTable';
import LoadingHOC, { LoadingHOCProps } from '../hoc/LoadingHOC';
import MockEditorialData from '../mocks/data/repository.json';

interface EditorialProps extends LoadingHOCProps {}

export const Editorial: React.FC<EditorialProps> = () => {
  const editorialData = MockEditorialData.data as unknown as RepositoryTableProps['data'];

  return (
    <div data-test="page-home">
      <main>
        <Panel isNarrow>
          <RepositoryTable data={editorialData} onDelete={console.log} onEdit={console.log} />
        </Panel>
      </main>
    </div>
  );
};

export default LoadingHOC(Editorial);
