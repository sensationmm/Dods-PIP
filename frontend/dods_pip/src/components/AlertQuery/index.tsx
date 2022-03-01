import color from '@dods-ui/globals/color';
import { DropdownValue } from '@dods-ui/pages/account-management/add-client/type';
import loadAccounts from '@dods-ui/pages/accounts/load-accounts';
import { Alert } from '@dods-ui/pages/collections/[uuid]/alerts/alert-setup';
import { Collection } from '@dods-ui/pages/collections/index.page';
import InformationTypes from '@dods-ui/pages/collections/information-types.json';
import loadAlerts from '@dods-ui/pages/collections/load-alerts';
import loadCollections from '@dods-ui/pages/collections/load-collections';
import ContentSources from '@dods-ui/utils/contentSources.json';
import getContentSources from '@dods-ui/utils/getContentSources';
import validateField from '@dods-ui/utils/validateField';
import React from 'react';

import Checkbox from '../_form/Checkbox';
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
  id: string;
  uuid?: string;
  source: DropdownValue[];
  informationType: DropdownValue[];
  searchTerms: string;
  done: boolean;
  edit: boolean;
}

export type Operators = 'OR' | 'AND' | 'NOT';

type TagTreeKeys = 'Organisations' | 'People' | 'Topics' | 'Geography';

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
  onViewResults: () => void;
  numQueries: number;
  isDisabled: boolean;
  hideButtons?: boolean;
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
  onViewResults,
  onCancel,
  onCopyQuery,
  onCancelEdit,
  numQueries,
  isDisabled = false,
  hideButtons = false,
}) => {
  const firstRun = React.useRef(true);
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
  const [tagsHelper, setTagsHelper] = React.useState<string>('');
  const [requiresSave, setRequiresSave] = React.useState<boolean>(false);
  const [sourceAddUK, setSourceAddUK] = React.useState<boolean>(false);
  const [sourceAddEU, setSourceAddEU] = React.useState<boolean>(false);
  const [infoTypeAddUK, setInfoTypeAddUK] = React.useState<boolean>(false);
  const [infoTypeAddEU, setInfoTypeAddEU] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }

    if (!firstRun.current) {
      setRequiresSave(true);
    }
  }, [sources, infoTypes, terms]);

  React.useEffect(() => {
    const existingTerms = terms;
    let existingKeywords =
      existingTerms.indexOf('keywords(') > -1
        ? existingTerms.substring(existingTerms.indexOf('keywords('))
        : '';

    let countBracket = 0;
    let endChar = 0;
    existingKeywords.split('').forEach((char, count) => {
      if (count >= existingKeywords.indexOf('(') && endChar === 0) {
        if (char === '(') {
          countBracket++;
        } else if (char === ')') {
          countBracket--;
        }

        if (countBracket === 0) {
          endChar = count;
        }
      }
    });

    existingKeywords = existingKeywords.substring(0, endChar + 1);

    if (existingKeywords.length > 0) {
      existingKeywords = ` OR ${existingKeywords}`;
    }

    if (searchTerms === '' || tags.length > 0) {
      const groupedTags = {
        Organisations: [] as TagsData[],
        Topics: [] as TagsData[],
        People: [] as TagsData[],
        Geography: [] as TagsData[],
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
          formattedString += `${tagLabel.toLowerCase()}(${newTags.slice(0, -4)}) ${operator} `;
        }
      });

      if (!edit) {
        setTerms(`${formattedString.slice(0, -4)} ${existingKeywords}`);
      } else {
        setTagsHelper(formattedString.slice(0, -4));
      }
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

  React.useEffect(() => {
    if (sourceAddUK) {
      const addSources: DropdownValue[] = [];
      ContentSources.ukContentSources.forEach((item) => {
        addSources.push({
          value: item.contentSource,
          label: item.contentSource,
        });
      });
      setSources(sources.concat(addSources));
    }
  }, [sourceAddUK]);

  React.useEffect(() => {
    if (sourceAddEU) {
      const addSources: DropdownValue[] = [];
      ContentSources.euContentSoruces.forEach((item) => {
        addSources.push({
          value: item.contentSource,
          label: item.contentSource,
        });
      });
      setSources(sources.concat(addSources));
    }
  }, [sourceAddEU]);

  React.useEffect(() => {
    if (infoTypeAddUK) {
      const addTypeList: string[] = [];
      ContentSources.ukContentSources.forEach((source) => {
        source.informationTypes.forEach((type) => {
          if (
            addTypeList.indexOf(type) === -1 &&
            infoTypes.findIndex((ex) => ex.value === type) === -1
          ) {
            addTypeList.push(type);
          }
        });
      });
      const addTypes = addTypeList.map((type) => ({ value: type, label: type }));
      setInfoTypes(infoTypes.concat(addTypes));
    }
  }, [infoTypeAddUK]);

  React.useEffect(() => {
    if (infoTypeAddEU) {
      const addTypeList: string[] = [];
      ContentSources.euContentSoruces.forEach((source) => {
        source.informationTypes.forEach((type) => {
          if (
            addTypeList.indexOf(type) === -1 &&
            infoTypes.findIndex((ex) => ex.value === type) === -1
          ) {
            addTypeList.push(type);
          }
        });
      });
      const addTypes = addTypeList.map((type) => ({ value: type, label: type }));
      setInfoTypes(infoTypes.concat(addTypes));
    }
  }, [infoTypeAddEU]);

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
    let isMidTerm = false;

    const toggleMidTerms = (quotes: number) => {
      if (quotes === 1 && !isMidTerm) {
        isMidTerm = !isMidTerm;
      } else if (quotes === 1) {
        isMidTerm = !isMidTerm;
      }
    };

    terms.split(' ').forEach((term, count) => {
      const quotes = (term.match(/"/g) || []).length;
      if (term.toLowerCase() === 'or' && !isMidTerm) {
        final.push(
          <Text key={`term-${count}`} bold color={color.theme.blueLight}>
            {term.toUpperCase()}
          </Text>,
        );
      } else if (term.toLowerCase() === 'and' && !isMidTerm) {
        final.push(
          <Text key={`term-${count}`} bold color={color.alert.green}>
            {term.toUpperCase()}
          </Text>,
        );
      } else if (term.toLowerCase() === 'not' && !isMidTerm) {
        final.push(
          <Text key={`term-${count}`} bold color={color.alert.red}>
            {term.toUpperCase()}
          </Text>,
        );
      } else if (
        ['topics', 'geography', 'organisations', 'people', 'keywords'].indexOf(
          term.substring(0, term.indexOf('(')),
        ) > -1
      ) {
        toggleMidTerms(quotes);
        final.push(
          <Text key={`term-${count}`} color={color.accent.orange} bold>
            {term.substring(0, term.indexOf('('))}
          </Text>,
          <Text key={`term-${count}-rest`} color={color.base.greyDark}>
            {term.substring(term.indexOf('('))}
          </Text>,
        );
      } else {
        toggleMidTerms(quotes);
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

  const quickAdd = (
    id: string,
    ukSelected: boolean,
    euSelected: boolean,
    setUK: (val: boolean) => void,
    setEU: (val: boolean) => void,
  ) => (
    <>
      <Spacer size={3} />
      {!ukSelected && (
        <>
          <Checkbox id={`${id}-uk`} label="Add All UK" isChecked={ukSelected} onChange={setUK} />
          <Spacer size={1} />
        </>
      )}
      {!euSelected && (
        <Checkbox id={`${id}-eu`} label="Add All EU" isChecked={euSelected} onChange={setEU} />
      )}
    </>
  );

  return (
    <Styled.wrapper data-test="component-alert-query">
      <Styled.box>
        <div>
          <Text bold>Source:</Text>
          {(!isDone || isEdit) &&
            quickAdd('source', sourceAddUK, sourceAddEU, setSourceAddUK, setSourceAddEU)}
        </div>
        {!isDone || isEdit ? (
          <TagSelector
            id="select-sources"
            isQuery
            title="Added to selection"
            onChange={(vals) => setSources(vals as DropdownValue[])}
            placeholder="Search and add source"
            values={getContentSources().map((item) => ({
              label: item,
              value: item,
            }))}
            selectedValues={sources}
            isFilter
          />
        ) : (
          <Styled.formattedLabels>{formatLabels(sources)}</Styled.formattedLabels>
        )}
      </Styled.box>

      <Spacer size={2} />

      <Styled.box>
        <div>
          <Text bold>Information type:</Text>
          {(!isDone || isEdit) &&
            quickAdd('infoType', infoTypeAddUK, infoTypeAddEU, setInfoTypeAddUK, setInfoTypeAddEU)}
        </div>
        {!isDone || isEdit ? (
          <TagSelector
            id="select-infoTypes"
            isQuery
            title="Added to selection"
            onChange={(vals) => setInfoTypes(vals as DropdownValue[])}
            placeholder="Search and add source"
            values={InformationTypes.sort((a, b) => (a.label > b.label ? 1 : -1)).map((item) => ({
              label: item.label,
              value: item.label,
            }))}
            selectedValues={infoTypes}
            isFilter
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
                  label={edit ? 'Browse' : 'Browse and add'}
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
          <Styled.formattedLabels>{formatTerms()}</Styled.formattedLabels>
        )}
      </Styled.box>

      {tagsHelper !== '' && (
        <>
          <Spacer size={2} />
          <Styled.box>
            <Text bold>Add terms to box above to save:</Text>
            <Styled.preview>{tagsHelper}</Styled.preview>
          </Styled.box>
        </>
      )}

      {!hideButtons && (
        <>
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
                    setTagsHelper('');
                    setIsDone(true);
                    setIsValidated(false);
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
                disabled={numQueries < 2 || isDisabled}
                onClick={() => setShowDelete(true)}
              />
              <Button
                type="secondary"
                label="Duplicate"
                icon={Icons.Duplicate}
                onClick={onDuplicate}
                disabled={isDisabled}
              />
              <Button
                type="secondary"
                label={typeof id !== 'number' && !requiresSave ? 'Copy to' : 'Requires save'}
                icon={Icons.Copy}
                onClick={() => setShowCopy(true)}
                disabled={typeof id === 'number' || requiresSave || isDisabled}
              />
              <Button
                type="secondary"
                label="Edit"
                icon={Icons.Pencil}
                onClick={onEdit}
                disabled={isDisabled}
              />
              <Button
                label={requiresSave ? 'Requires Save' : 'View Results'}
                icon={Icons.ChevronRightBold}
                iconAlignment="right"
                onClick={onViewResults}
                disabled={requiresSave || isDisabled}
              />
            </Styled.actions>
          )}
        </>
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
