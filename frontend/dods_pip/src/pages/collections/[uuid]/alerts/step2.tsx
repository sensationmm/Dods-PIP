import Spacer from '@dods-ui/components/_layout/Spacer';
import AlertQuery, { AlertQueryProps } from '@dods-ui/components/AlertQuery';
import Badge from '@dods-ui/components/Badge';
import Button from '@dods-ui/components/Button';
import Icon, { IconSize } from '@dods-ui/components/Icon';
import { Icons } from '@dods-ui/components/Icon/assets';
import Popover from '@dods-ui/components/Popover';
import Text from '@dods-ui/components/Text';
import React from 'react';

import { Collection } from '../../index.page';
import { Alert, AlertResultProps, AlertStepProps } from './alert-setup';
import * as Styled from './alert-setup.styles';

interface AlertStep2Props extends AlertStepProps {
  copyQuery: (
    queryId: Alert['uuid'],
    copyCollectionId: Collection['uuid'],
    copyAlertId: Alert['uuid'],
  ) => void;
}
const AlertStep2: React.FC<AlertStep2Props> = ({ alert, editAlert, setActiveStep, copyQuery }) => {
  const query = {
    source: [],
    informationType: [],
    searchTerms: '',
    done: false,
    edit: false,
  } as Omit<AlertQueryProps, 'id' | 'numQueries'>;

  const [queries, setQueries] = React.useState<AlertQueryProps[]>(
    alert.queries && alert.queries.length > 0
      ? (alert.queries as AlertResultProps[]).map(
          (query: AlertResultProps) =>
            ({
              id: query.uuid,
              source: query.contentSources
                .split(',')
                .map((term: string) => ({ value: term, label: term })),
              informationType: query.informationTypes
                .split(',')
                .map((term: string) => ({ value: term, label: term })),
              searchTerms: query.query,
              done: true,
              edit: false,
            } as unknown as AlertQueryProps),
        )
      : [
          {
            id: Date.now(),
            ...query,
          },
        ],
  );
  const firstRun = React.useRef(true);
  const [adding, setAdding] = React.useState<boolean>(!alert.queries || alert.queries.length === 0);
  const [changed, setChanged] = React.useState<boolean>(false);

  const numQueries = adding ? queries.length - 1 : queries.length;

  React.useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    } else {
      setChanged(true);
    }
  }, [numQueries]);

  const addQuery = () => {
    setChanged(true);
    setQueries([
      {
        id: Date.now(),
        ...query,
      },
      ...queries,
    ]);
    setAdding(true);
  };

  const duplicateQuery = (i: number) => {
    setChanged(true);
    const src = queries[i];
    setQueries([{ ...src, id: Date.now(), done: false }, ...queries]);
    setAdding(true);
    window.scrollTo(0, 0);
  };

  const editQuery = (i: number, setEdit = true) => {
    setChanged(true);
    const existing = queries.slice();
    setQueries(
      existing.map((query, count) => {
        if (count === i) {
          return {
            ...query,
            edit: setEdit,
          };
        } else {
          return query;
        }
      }),
    );
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
        .map((query, count) => [
          <AlertQuery
            key={`query-${query.id}`}
            {...query}
            onSave={(query) => {
              const existing = queries.slice();
              setQueries(
                existing.map((ex) => {
                  if (ex.id === query.id) {
                    return query;
                  } else {
                    return ex;
                  }
                }),
              );
              setAdding(false);
            }}
            onCancel={() => {
              setAdding(false);
              query.edit && !query.done ? editQuery(count, false) : setQueries(queries.slice(1));
            }}
            onCancelEdit={() => {
              setAdding(false);
              editQuery(count, false);
            }}
            onDuplicate={() => {
              duplicateQuery(count);
            }}
            onEdit={() => {
              setAdding(true);
              editQuery(count);
            }}
            onDelete={() => {
              setChanged(true);
              setQueries(queries.filter((del) => query.id !== del.id));
            }}
            numQueries={numQueries}
            onCopyQuery={copyQuery}
            isDisabled={adding}
          />,
          <Spacer key={`spacer-${query.id}`} size={6} />,
        ])}

      <Spacer size={15} />

      <Styled.actions>
        <Button
          type="text"
          inline
          label="Back"
          icon={Icons.ChevronLeftBold}
          onClick={() => setActiveStep(1)}
        />
        <Button
          inline
          label={'Next'}
          icon={Icons.ChevronRightBold}
          iconAlignment="right"
          onClick={() => (!changed ? setActiveStep(3) : editAlert(queries))}
          disabled={adding || queries.length === 0}
        />
      </Styled.actions>
    </>
  );
};

export default AlertStep2;
