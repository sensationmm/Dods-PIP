import color from '@dods-ui/globals/color';
import { DropdownValue } from '@dods-ui/pages/account-management/add-client/type';
import ContentSources from '@dods-ui/pages/collections/content-sources.json';
import InformationTypes from '@dods-ui/pages/collections/information-types.json';
import React from 'react';

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

export interface AlertQueryScreenProps extends AlertQueryProps {
  onSave: (query: AlertQueryProps) => void;
  onDuplicate: () => void;
  onEdit: () => void;
  onCancel: () => void;
  onCancelEdit: () => void;
  onDelete: () => void;
  numQueries: number;
}

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
  const [showDelete, setShowDelete] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (searchTerms === '') {
      const formattedTags = tags.map((tag) => `${tag.termLabel} ${operator} `).join('');
      setTerms(formattedTags.slice(0, -4));
    }
  }, [tags]);

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

    terms.split(' ').forEach((term) => {
      if (term.toLowerCase() === 'or') {
        final.push(
          <Text bold color={color.theme.blueLight}>
            {term.toUpperCase()}
          </Text>,
        );
      } else if (term.toLowerCase() === 'and') {
        final.push(
          <Text bold color={color.alert.green}>
            {term.toUpperCase()}
          </Text>,
        );
      } else if (term.toLowerCase() === 'not') {
        final.push(
          <Text bold color={color.alert.red}>
            {term.toUpperCase()}
          </Text>,
        );
      } else if (term.slice(0, 1) === '"' || term.slice(-1) === '"') {
        final.push(<Text color={color.accent.orange}>{term.replaceAll('"', '')}</Text>);
      } else {
        final.push(<Text color={color.base.greyDark}>{term}</Text>);
      }
    });

    return final;
  };

  const isComplete = sources.length > 0 && infoTypes.length > 0 && terms !== '';

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
              <TextArea value={terms} onChange={setTerms} />
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
          <Button type="secondary" label="Copy to" icon={Icons.Copy} disabled />
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
    </Styled.wrapper>
  );
};

export default AlertQuery;
