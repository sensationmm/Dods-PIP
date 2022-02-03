import color from '@dods-ui/globals/color';
import { DropdownValue } from '@dods-ui/pages/account-management/add-client/type';
import loadAccounts from '@dods-ui/pages/accounts/load-accounts';
import { Alert } from '@dods-ui/pages/collections/[uuid]/alerts/alert-setup';
import ContentSources from '@dods-ui/pages/collections/content-sources.json';
import { Collection } from '@dods-ui/pages/collections/index.page';
import InformationTypes from '@dods-ui/pages/collections/information-types.json';
import loadAlerts from '@dods-ui/pages/collections/load-alerts';
import loadCollections from '@dods-ui/pages/collections/load-collections';
import validateField from '@dods-ui/utils/validateField';
import React from 'react';

import SearchDropdown from '../_form/SearchDropdown';
import { SelectProps } from '../_form/Select';
import TextArea from '../_form/TextArea';
import Spacer from '../_layout/Spacer';
import Button from '../Button';
import TagBrowser, { TagsData } from '../ContentTagger/TagBrowser';
import Icon, { IconSize } from '../Icon';
import { Icons } from '../Icon/assets';
import Modal from '../Modal';
import TagSelector from '../TagSelector';
import Text from '../Text';
import * as Styled from './AlertQuery.styles';

export interface AlertQueryProps {
  id: number;
  source: DropdownValue[];
  informationType: DropdownValue[];
  searchTerms: string;
  done: boolean;
  edit: boolean;
}

export type Operators = 'OR' | 'AND' | 'NOT';

type TagTreeKeys = 'Organisations' | 'People' | 'Topics' | 'Geographies';

export interface AlertQueryScreenProps extends AlertQueryProps {
  onSave: (query: AlertQueryProps) => void;
  onDuplicate: () => void;
  onEdit: () => void;
  onCancel: () => void;
  onCancelEdit: () => void;
  onCopyQuery: (
    queryId: Alert['uuid'],
    copyCollectionId: Collection['uuid'],
    copyAlertId: Alert['uuid'],
  ) => void;
  onDelete: () => void;
  numQueries: number;
}

type Errors = {
  account?: string;
  collection?: string;
  alert?: string;
};

const AlertQuery: React.FC<AlertQueryScreenProps> = ({
  id,
  source,
  informationType,
  searchTerms,
  done,
  edit,
  onSave,
  onDuplicate,
  onEdit,
  onDelete,
  onCancel,
  onCopyQuery,
  onCancelEdit,
  numQueries,
}) => {
  const [sources, setSources] = React.useState<DropdownValue[]>(source || []);
  const [infoTypes, setInfoTypes] = React.useState<DropdownValue[]>(informationType || []);
  const [terms, setTerms] = React.useState<string>(searchTerms !== '' ? searchTerms : '');
  const [showBrowser, setShowBrowser] = React.useState<boolean>(false);
  const [tags, setTags] = React.useState<TagsData[]>([]);
  const [addedTags, setAddedTags] = React.useState<TagsData[]>([]);
  const [addedTagsToSave, setAddedTagsToSave] = React.useState<TagsData[]>([]);
  const [operator, setOperator] = React.useState<Operators>('OR');
  const [isValidated, setIsValidated] = React.useState<boolean>(false);
  const [isDone, setIsDone] = React.useState<boolean>(done);
  const [isEdit, setIsEdit] = React.useState<boolean>(edit);
  const [preview, setPreview] = React.useState<JSX.Element[]>([]);
  const [accounts, setAccounts] = React.useState<SelectProps['options']>([]);
  const [collections, setCollections] = React.useState<SelectProps['options']>([]);
  const [alerts, setAlerts] = React.useState<SelectProps['options']>([]);
  const [showDelete, setShowDelete] = React.useState<boolean>(false);
  const [showCopy, setShowCopy] = React.useState<boolean>(false);
  const [copyAccount, setCopyAccount] = React.useState<string>('');
  const [copyCollection, setCopyCollection] = React.useState<string>('');
  const [copyAlert, setCopyAlert] = React.useState<string>('');
  const [loadingCollections, setLoadingCollections] = React.useState<boolean>(false);
  const [loadingAlerts, setLoadingAlerts] = React.useState<boolean>(false);
  const [errors, setErrors] = React.useState<Errors>({});

  React.useEffect(() => {
    if (searchTerms === '') {
      const groupedTags = {
        Organisations: [] as TagsData[],
        Topics: [] as TagsData[],
        People: [] as TagsData[],
        Geographies: [] as TagsData[],
      };
      tags.forEach((tag: TagsData) => {
        groupedTags[tag.type as TagTreeKeys].push(tag as TagsData);
      });

      let formattedString = '';
      Object.keys(groupedTags).forEach((tagLabel) => {
        const hasTags = (groupedTags[tagLabel as TagTreeKeys] as TagsData[]).length > 0;

        if (hasTags) {
          const newTags = groupedTags[tagLabel as TagTreeKeys]
            .map((tag: TagsData) => `"${tag.termLabel}" ${operator} `)
            .join('');
          formattedString += `${tagLabel.toLowerCase()} (${newTags.slice(0, -4)}) ${operator} `;
        }
      });

      setTerms(formattedString.slice(0, -4));
    }
  }, [tags]);

  React.useEffect(() => {
    setIsValidated(false);
    setPreview([]);
  }, [terms]);

  React.useEffect(() => {
    setIsDone(done);
  }, [done]);

  React.useEffect(() => {
    setIsEdit(edit);
  }, [edit]);

  const formatLabels = (selectedLabels: DropdownValue[]) => {
    const final: Array<JSX.Element> = [];

    selectedLabels.forEach((selected, count) => {
      final.push(
        <Text key={`label-${selected.value}`} color={color.base.greyDark}>
          {selected.label}
        </Text>,
      );
      if (count + 1 < selectedLabels.length) {
        final.push(
          <Text key={`label-${selected.value}-or`} bold color={color.theme.blueLight}>
            {' OR '}
          </Text>,
        );
      }
    });
    return final;
  };

  const formatTerms = () => {
    const final: Array<JSX.Element> = [];

    terms.split(' ').forEach((term, count) => {
      if (term.toLowerCase() === 'or') {
        final.push(
          <Text key={`term-${count}`} bold color={color.theme.blueLight}>
            {term.toUpperCase()}
          </Text>,
        );
      } else if (term.toLowerCase() === 'and') {
        final.push(
          <Text key={`term-${count}`} bold color={color.alert.green}>
            {term.toUpperCase()}
          </Text>,
        );
      } else if (term.toLowerCase() === 'not') {
        final.push(
          <Text key={`term-${count}`} bold color={color.alert.red}>
            {term.toUpperCase()}
          </Text>,
        );
      } else if (
        ['topics', 'geographies', 'organisations', 'people', 'keywords'].indexOf(term) > -1
      ) {
        final.push(
          <Text key={`term-${count}`} color={color.accent.orange}>
            {term}
          </Text>,
        );
      } else {
        final.push(
          <Text key={`term-${count}`} color={color.base.greyDark}>
            {term}
          </Text>,
        );
      }
    });

    return final;
  };

  const copyQuery = () => {
    onCopyQuery(id as unknown as string, copyCollection, copyAlert);
    resetCopy();
  };

  const resetCopy = () => {
    setShowCopy(false);
    setCopyAccount('');
    setCopyCollection('');
    setCopyAlert('');
    setCollections([]);
    setAlerts([]);
  };

  React.useEffect(() => {
    const getAccountCollections = async () => {
      setCollections([]);
      setLoadingCollections(true);
      await loadCollections(setCollections, copyAccount);
      setLoadingCollections(false);
    };
    if (copyAccount !== '') {
      getAccountCollections();
    }
  }, [copyAccount]);

  React.useEffect(() => {
    const getAccountCollectionAlerts = async () => {
      setAlerts([]);
      setLoadingAlerts(true);
      await loadAlerts(setAlerts, copyCollection);
      setLoadingAlerts(false);
    };
    if (copyCollection !== '') {
      getAccountCollectionAlerts();
    }
  }, [copyCollection]);

  const isComplete = sources.length > 0 && infoTypes.length > 0 && terms !== '';
  const isCopyComplete = copyAccount !== '' && copyCollection !== '' && copyAlert !== '';

  return (
    <Styled.wrapper data-test="component-alert-query">
      <Styled.box>
        <Text bold>Source:</Text>
        {!isDone || isEdit ? (
          <TagSelector
            id="select-sources"
            isQuery
            title="Added to selection"
            onChange={(vals) => setSources(vals as DropdownValue[])}
            placeholder="Search and add source"
            values={ContentSources.map((item) => ({
              label: item.label,
              value: item.id,
            }))}
            selectedValues={sources}
          />
        ) : (
          <Styled.formattedLabels>{formatLabels(sources)}</Styled.formattedLabels>
        )}
      </Styled.box>

      <Spacer size={2} />

      <Styled.box>
        <Text bold>Information type:</Text>
        {!isDone || isEdit ? (
          <TagSelector
            id="select-infoTypes"
            isQuery
            title="Added to selection"
            onChange={(vals) => setInfoTypes(vals as DropdownValue[])}
            placeholder="Search and add source"
            values={InformationTypes.map((item) => ({
              label: item.label,
              value: item.id,
            }))}
            selectedValues={infoTypes}
          />
        ) : (
          <Styled.formattedLabels>{formatLabels(infoTypes)}</Styled.formattedLabels>
        )}
      </Styled.box>

      <Spacer size={2} />

      <Styled.box>
        <Text bold>Search terms:</Text>
        {!isDone || isEdit ? (
          <Styled.terms>
            <div>
              <Styled.termsHeader>
                <Text>Query:</Text>
                <Button
                  isSmall
                  type="secondary"
                  label="Browse and add"
                  icon={Icons.Search}
                  onClick={() => setShowBrowser(true)}
                />
              </Styled.termsHeader>
              <Spacer size={2} />
              <TextArea
                value={terms}
                onChange={setTerms}
                helperText={`NOTE: For non-tags use 'keywords ("first" OR "second")'`}
              />
            </div>

            <div>
              <Styled.termsHeader>
                <Text>Preview:</Text>
                {isValidated && (
                  <Styled.valid>
                    <Icon src={Icons.TickBold} size={IconSize.large} color={color.accent.green} />
                    <Text color={color.alert.green}>Validation successfully done</Text>
                  </Styled.valid>
                )}
              </Styled.termsHeader>
              <Spacer size={2} />
              <Styled.preview>
                <Styled.formattedLabels>{preview}</Styled.formattedLabels>
              </Styled.preview>
            </div>
          </Styled.terms>
        ) : (
          <Styled.formattedLabels>
            <Text>{formatTerms()}</Text>
          </Styled.formattedLabels>
        )}
      </Styled.box>

      <Spacer size={4} />

      {!isDone || isEdit ? (
        <Styled.actions>
          <Button
            type="text"
            label="Cancel"
            icon={Icons.CrossBold}
            onClick={!isDone ? onCancel : onCancelEdit}
            disabled={numQueries === 0 && !isEdit}
          />
          {!isValidated ? (
            <Button
              label="Validate"
              icon={Icons.Validate}
              onClick={() => {
                setPreview(formatTerms());
                setIsValidated(true);
              }}
              disabled={terms === ''}
            />
          ) : (
            <Button
              label="Done"
              icon={Icons.Tick}
              disabled={!isComplete}
              onClick={() => {
                setIsDone(true);
                onSave({
                  id,
                  source: sources,
                  informationType: infoTypes,
                  searchTerms: terms,
                  done: true,
                  edit: false,
                });
              }}
            />
          )}
        </Styled.actions>
      ) : (
        <Styled.actions>
          <Button
            type="text"
            label="Delete"
            icon={Icons.Bin}
            disabled={numQueries < 2}
            onClick={() => setShowDelete(true)}
          />
          <Button type="secondary" label="Duplicate" icon={Icons.Duplicate} onClick={onDuplicate} />
          <Button
            type="secondary"
            label={typeof id !== 'number' ? 'Copy to' : 'Requires save'}
            icon={Icons.Copy}
            onClick={() => setShowCopy(true)}
            disabled={typeof id === 'number'}
          />
          <Button type="secondary" label="Edit" icon={Icons.Pencil} onClick={onEdit} />
          <Button
            label="View Results"
            icon={Icons.ChevronRightBold}
            iconAlignment="right"
            disabled
          />
        </Styled.actions>
      )}

      {showBrowser && (
        <TagBrowser
          active
          setActive={setShowBrowser}
          tags={tags}
          setTags={setTags}
          addedTags={addedTags}
          setAddedTags={setAddedTags}
          addedTagsToSave={addedTagsToSave}
          setAddedTagsToSave={setAddedTagsToSave}
          operator={operator}
          setOperator={setOperator}
        />
      )}

      {showDelete && (
        <Modal
          title="Do you wish to delete this query?"
          titleIcon={Icons.Bin}
          size="large"
          onClose={() => {
            setShowDelete(false);
          }}
          buttons={[
            {
              isSmall: true,
              type: 'secondary',
              label: 'Back',
              onClick: () => setShowDelete(false),
            },
            {
              isSmall: true,
              type: 'primary',
              label: 'Confirm and delete',
              icon: Icons.Bin,
              onClick: onDelete,
            },
          ]}
          buttonAlignment="right"
        >
          <Text>This query will be permanently removed</Text>
        </Modal>
      )}

      {showCopy && (
        <Modal
          title="Where do you want to copy to?"
          size="large"
          onClose={resetCopy}
          buttons={[
            {
              isSmall: true,
              type: 'secondary',
              label: 'Cancel',
              onClick: resetCopy,
            },
            {
              isSmall: true,
              type: 'primary',
              label: 'Confirm and copy',
              icon: Icons.Copy,
              iconAlignment: 'right',
              onClick: copyQuery,
              disabled: !isCopyComplete,
            },
          ]}
          buttonAlignment="right"
          bodyOverflow
        >
          <Text>Search for a destination where to paste a copy of this query</Text>
          <Spacer size={4} />

          <div>
            <SearchDropdown
              isFilter
              id="account"
              testId={'account'}
              value={copyAccount}
              values={accounts}
              placeholder="Select an account"
              onChange={(value: string) => {
                setCopyAccount(value);
                validateField('account', 'Account', value, errors, setErrors);
              }}
              required
              label="Account"
              error={errors.account}
              onBlur={() => validateField('account', 'Account', copyAccount, errors, setErrors)}
              onKeyPress={(val, search?: string) => loadAccounts(setAccounts, search)}
              onKeyPressHasSearch
            />
            <SearchDropdown
              isFilter
              id="collection"
              testId={'collection'}
              value={copyCollection}
              values={collections}
              placeholder="Select a collection"
              onChange={(value: string) => {
                setCopyCollection(value);
                validateField('collection', 'Collection', value, errors, setErrors);
              }}
              required
              label="Collection"
              error={errors.collection}
              onBlur={() =>
                validateField('collection', 'Collection', copyCollection, errors, setErrors)
              }
              onKeyPressHasSearch
              isDisabled={collections.length === 0 || loadingCollections}
            />
            <SearchDropdown
              isFilter
              id="alert"
              testId={'alert'}
              value={copyAlert}
              values={alerts}
              placeholder="Select an alert"
              onChange={(value: string) => {
                setCopyAlert(value);
                validateField('alert', 'Alert', value, errors, setErrors);
              }}
              required
              label="Alert"
              error={errors.alert}
              onBlur={() => validateField('alert', 'Alert', copyAlert, errors, setErrors)}
              onKeyPressHasSearch
              isDisabled={alerts.length === 0 || loadingCollections || loadingAlerts}
            />
          </div>
        </Modal>
      )}
    </Styled.wrapper>
  );
};

export default AlertQuery;
