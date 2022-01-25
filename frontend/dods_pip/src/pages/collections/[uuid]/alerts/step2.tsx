import Spacer from '@dods-ui/components/_layout/Spacer';
import AlertQuery, { AlertQueryProps } from '@dods-ui/components/AlertQuery';
import Badge from '@dods-ui/components/Badge';
import Button from '@dods-ui/components/Button';
import Icon, { IconSize } from '@dods-ui/components/Icon';
import { Icons } from '@dods-ui/components/Icon/assets';
import Popover from '@dods-ui/components/Popover';
import Text from '@dods-ui/components/Text';
import React from 'react';

import { AlertStepProps } from './alert-setup';
import * as Styled from './alert-setup.styles';

const AlertStep2: React.FC<AlertStepProps> = () => {
  const query = {
    source: [],
    informationType: [],
    searchTerms: '',
  } as Omit<AlertQueryProps, 'id' | 'numQueries'>;

  const [queries, setQueries] = React.useState<AlertQueryProps[]>([
    {
      id: Date.now(),
      ...query,
    },
  ]);
  const [adding, setAdding] = React.useState<boolean>(true);

  const numQueries = adding ? queries.length - 1 : queries.length;

  const addQuery = () => {
    setQueries([
      {
        id: Date.now(),
        ...query,
      },
      ...queries,
    ]);
    setAdding(true);
  };

  return (
    <>
      <Styled.sectionHeaderContainer>
        <Styled.sectionHeader>
          <Icon src={Icons.Search} size={IconSize.xlarge} />
          <Text type="h2" headingStyle="title">
            Search queries
          </Text>
          <Badge number={numQueries} label="Search queries" size="small" />
        </Styled.sectionHeader>

        <Styled.sectionHeader>
          <Popover
            title="Queries Keys"
            body={
              <>
                <Styled.keyOr>Or</Styled.keyOr>
                <Styled.keyAnd>And</Styled.keyAnd>
                <Styled.keyNot>Not</Styled.keyNot>
                <Styled.keyKeywords>Keywords</Styled.keyKeywords>
              </>
            }
          />
          <Button
            type="secondary"
            label="Add Search Query"
            icon={Icons.Add}
            iconAlignment="right"
            onClick={addQuery}
            disabled={adding}
          />
        </Styled.sectionHeader>
      </Styled.sectionHeaderContainer>

      <Spacer size={8} />

      {queries
        .sort((a, b) => (a.id < b.id ? 1 : -1))
        .map((query) => [
          <AlertQuery
            key={`query-${query.id}`}
            {...query}
            onSave={(query) => {
              setQueries([query, ...queries.slice(1)]);
              setAdding(false);
            }}
            onCancel={() => {
              setAdding(false);
              setQueries(queries.slice(1));
            }}
            numQueries={numQueries}
          />,
          <Spacer key={`spacer-${query.id}`} size={6} />,
        ])}
    </>
  );
};

export default AlertStep2;
