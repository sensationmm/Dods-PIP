import Panel from '@dods-ui/components/_layout/Panel';
import Spacer from '@dods-ui/components/_layout/Spacer';
import Breadcrumbs from '@dods-ui/components/Breadcrumbs';
import { TagsData } from '@dods-ui/components/ContentTagger/TagBrowser';
import StatusBar from '@dods-ui/components/StatusBar';
import TeleportOnScroll from '@dods-ui/components/TeleportOnScroll';
import Text from '@dods-ui/components/Text';
import color from '@dods-ui/globals/color';
import LoadingHOC, { LoadingHOCProps } from '@dods-ui/hoc/LoadingHOC';
import useUser from '@dods-ui/lib/useUser';
import { MetadataSelection } from '@dods-ui/pages/editorial/editorial.models';
import {
  createRecord,
  getMetadataSelections,
  scheduleEditorial,
  setEditorialPublishState,
} from '@dods-ui/pages/editorial/editorial.service';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import EditorialForm, { EditorialFormFields } from './editorial-form';

interface EditorialProps extends LoadingHOCProps {}

export const EDITORIAL_STORAGE_KEY = 'temp_editorial';

export const EditorialCreate: React.FC<EditorialProps> = ({ setLoading, addNotification }) => {
  const router = useRouter();
  const { articleId = [] } = router.query;
  const { user } = useUser();
  const [metadataSelectionValues, setMetadataSelectionValues] = useState<MetadataSelection>({
    contentSources: [],
    informationTypes: [],
    status: [],
  });
  const [tags, setTags] = React.useState<TagsData[]>([]);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [fieldData, setFieldData] = useState<EditorialFormFields>({
    content: '',
    title: '',
    sourceUrl: '',
    sourceName: '',
    informationType: '',
  });
  const [isValidForm, setIsValidForm] = useState<boolean>(false);
  const [errors, setErrors] = useState<Partial<EditorialFormFields>>({});

  const setFieldValue = (field: keyof EditorialFormFields, value: string) => {
    const savedFieldData = JSON.parse(global.localStorage.getItem(EDITORIAL_STORAGE_KEY) || '{}');
    const updatedData = { ...savedFieldData, [field]: value };
    setFieldData(updatedData);
    global.localStorage.setItem(EDITORIAL_STORAGE_KEY, JSON.stringify(updatedData));

    const { title, sourceName, informationType, content } = updatedData;
    const errors = {};
    if (!title) {
      Object.assign(errors, { title });
    }
    if (!sourceName) {
      Object.assign(errors, { sourceName });
    }
    if (!informationType) {
      Object.assign(errors, { informationType });
    }
    if (!content) {
      Object.assign(errors, { content });
    }
    if (Object.keys(errors).length) {
      setErrors(errors);
    }

    setIsValidForm(Object.keys(errors).length < 1);
  };

  useEffect(() => {
    setIsEditMode(router.query.hasOwnProperty('articleId'));
  }, [router.query]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const selections = await getMetadataSelections();
      setMetadataSelectionValues(selections);
      setLoading(false);
    })();
  }, []);

  const onSave = async (publish = false) => {
    const { title, sourceName, sourceUrl, informationType, content } = fieldData;
    if (title?.length && sourceName?.length && informationType?.length && content?.length) {
      setLoading(true);
      await createRecord({
        jurisdiction: 'uk', // TODO: update this based on contentSource (awaiting mapping)
        contentSource: sourceName,
        informationType,
        documentTitle: title,
        sourceReferenceUri: sourceUrl || '',
        createdBy: user.displayName || user.emailAddress || '',
        internallyCreated: true,
        documentContent: content,
        taxonomyTerms: tags.map(
          ({ tagId, facetType, inScheme, termLabel, ancestorTerms, alternative_labels }) => ({
            tagId,
            facetType,
            inScheme: inScheme || [],
            termLabel,
            ancestorTerms:
              ancestorTerms?.map(({ tagId, termLabel, rank }) => ({
                tagId,
                termLabel,
                ...(rank ? { rank } : {}),
              })) || [],
            alternative_labels: alternative_labels || [],
          }),
        ),
      }).then((response) => {
        if (publish) {
          onPublish(response.data.uuid);
        }
      });

      global.localStorage.removeItem(EDITORIAL_STORAGE_KEY);
      setLoading(false);
      addNotification({ title: 'Record added successfully', type: 'confirm' });
      setLoading(false);
      return;
    }
  };

  const onSaveAndExit = async (publish = false) => {
    await onSave(publish).then(() => {
      router.push('/editorial');
    });
  };

  const onPublish = async (documentId: string) => {
    if (!documentId) return;
    setLoading(true);
    await setEditorialPublishState(documentId)
      .then(() => {
        addNotification({ title: 'Document successfully published', type: 'confirm' });
      })
      .then(() => {
        router.push('/editorial');
      });
    setLoading(false);
  };

  const onSaveAndPublish = async () => {
    await onSaveAndExit(true);
  };

  const onSchedule = async () => {
    const date = new Date().toISOString();
    setLoading(true);
    // TODO: populate with data once back end is correct
    await scheduleEditorial({ date, documentId: 'guid-here' });
    setLoading(false);
    addNotification({ title: `Document successfully scheduled for ${date}`, type: 'confirm' });
  };

  const onDelete = async () => {
    const date = new Date().toISOString();
    setLoading(true);
    // TODO: populate with data once back end is correct
    await scheduleEditorial({ date, documentId: 'guid-here' });
    setLoading(false);
    addNotification({ title: `Document successfully deleted`, type: 'confirm' });
    setTimeout(() => {
      router.push('/editorial');
    }, 600);
  };

  return (
    <div data-testid="page-editorial">
      <Head>
        <title>Dods PIP | Editorial Repository | {isEditMode ? 'Edit' : 'Create'}</title>
      </Head>

      <Panel bgColor={color.base.white}>
        <Breadcrumbs
          history={[
            { href: '/', label: 'Dods' },
            { href: '/editorial', label: 'Editorial Repository' },
            {
              href: `/editorial/article${isEditMode ? '/' + articleId[0] : ''}`,
              label: isEditMode ? 'Edit content' : 'Create new content',
            },
          ]}
        />
        <Spacer size={6} />
        <Text type="h1" headingStyle="hero">
          {isEditMode ? 'Edit content' : 'Create new content'}
        </Text>

        <Spacer size={6} />

        <TeleportOnScroll>
          <StatusBar
            saveAndExit
            publish
            publishDisabled={!isValidForm}
            scheduleDisabled={!isValidForm}
            saveAndExitDisabled={!isValidForm}
            onSaveAndExit={() => onSaveAndExit()}
            onPublish={() => onSaveAndPublish()}
            onDelete={onDelete}
            onSchedule={() => onSchedule()}
            onUnschedule={() => onSchedule()}
            onUpdateArticle={() => onSave()}
            onPreview={() => router.push('/editorial/preview')} // Preview active local content or from server??
            onUnpublish={() => {
              console.info('<><><> Not supported');
            }}
            schedule={isEditMode}
          />
        </TeleportOnScroll>
      </Panel>

      <Panel bgColor={color.base.ivory}>
        <main>
          <EditorialForm
            contentSourceValues={metadataSelectionValues.contentSources}
            infoTypeValues={metadataSelectionValues.informationTypes}
            fieldData={fieldData}
            errors={errors}
            setErrors={setErrors}
            onFieldChange={setFieldValue}
            onTagsChange={setTags}
            tags={tags}
          />
        </main>
      </Panel>
    </div>
  );
};

export default LoadingHOC(EditorialCreate);
