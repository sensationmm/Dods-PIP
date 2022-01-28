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
  deleteEditorialRecord,
  getEditorialPreview,
  getMetadataSelections,
  scheduleEditorial,
  setEditorialPublishState,
  updateRecord,
} from '@dods-ui/pages/editorial/editorial.service';
import getContentSources from '@dods-ui/utils/getContentSources';
import getInformationTypes from '@dods-ui/utils/getInformationTypes';
import getJurisdiction from '@dods-ui/utils/getJurisdiction';
import useStateWithCallback from '@dods-ui/utils/useStateWithCallback';
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
  const [savedDocumentContent, setSavedDocumentContent] = useStateWithCallback<string | undefined>(
    undefined,
  );
  const [savedDocumentTags, setSavedDocumentTags] = useState<TagsData[] | undefined>();
  const [jurisdiction, setJurisdiction] = useState<string>();
  const [validContentSources, setValidContentSources] = useState<string[] | undefined>();
  const [validInfoTypes, setValidInfoTypes] = useState<string[] | undefined>();

  const setFieldValue = (field: keyof EditorialFormFields, value: string) => {
    const savedFieldData = JSON.parse(global.localStorage.getItem(EDITORIAL_STORAGE_KEY) || '{}');
    const updatedData = { ...savedFieldData, [field]: value };
    setFieldData(updatedData);
    global.localStorage.setItem(EDITORIAL_STORAGE_KEY, JSON.stringify(updatedData));

    const { title, sourceName, informationType, content } = updatedData;
    setJurisdiction(getJurisdiction({ contentSource: sourceName }));
    setValidInfoTypes(getInformationTypes({ contentSource: sourceName, informationType }));

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
    const getDocData = async (uuid: string) => {
      setLoading(true);
      await getEditorialPreview(uuid).then((response) => {
        if (response.success) {
          const {
            documentTitle,
            documentContent,
            informationType,
            contentSource,
            sourceReferenceUri,
            taxonomyTerms,
          } = response.document;
          const fieldData = {
            title: documentTitle,
            content: documentContent,
            informationType,
            sourceName: contentSource,
            sourceUrl: sourceReferenceUri || '',
          };
          setSavedDocumentContent(
            documentContent,
            (content: string) => content.length && setLoading(false),
          );
          setSavedDocumentTags(taxonomyTerms);
          setJurisdiction(getJurisdiction({ contentSource }));
          setValidInfoTypes(getInformationTypes({ contentSource, informationType }));
          setFieldData(fieldData);
          global.localStorage.setItem(EDITORIAL_STORAGE_KEY, JSON.stringify(fieldData));
        } else {
          setLoading(false);
          addNotification({
            type: 'warn',
            title: 'Error - Failed to load document',
            text: response.message,
          });
        }
      });
    };
    if (isEditMode && articleId.length) {
      getDocData(articleId[0]);
    }
  }, [isEditMode, articleId]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const selections = await getMetadataSelections();
      setMetadataSelectionValues(selections);
      setValidContentSources(getContentSources());
      setLoading(false);
    })();
  }, []);

  const onSave = async (publish = false, preview = false) => {
    const { title, sourceName, sourceUrl, informationType, content } = fieldData;
    if (title?.length && sourceName?.length && informationType?.length && content?.length) {
      setLoading(true);
      await createRecord({
        jurisdiction: jurisdiction || '',
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
      })
        .then((response) => {
          global.localStorage.removeItem(EDITORIAL_STORAGE_KEY);
          addNotification({ title: 'Record added successfully', type: 'confirm' });
          if (publish) {
            onPublish(response.data.uuid);
          }
          if (preview) {
            router.push(`/library/document/${response.data.uuid}?preview=true`);
          }
        })
        .finally(() => {
          setLoading(false);
        });

      return;
    }
  };

  const onSaveAndExit = async (publish = false) => {
    await onSave(publish).then(() => {
      router.push('/editorial');
    });
  };

  const onUpdate = async (publish = false, preview = false) => {
    const { title, sourceName, sourceUrl, informationType, content } = fieldData;
    if (
      articleId?.length &&
      title?.length &&
      sourceName?.length &&
      informationType?.length &&
      content?.length
    ) {
      setLoading(true);
      await updateRecord(articleId[0], {
        jurisdiction: jurisdiction || '',
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
      })
        .then((response) => {
          global.localStorage.removeItem(EDITORIAL_STORAGE_KEY);
          addNotification({ title: 'Record updated successfully', type: 'confirm' });
          if (publish) {
            onPublish(response.data.uuid);
          }
          if (preview) {
            router.push(`/library/document/${response.data.uuid}?preview=true`);
          }
        })
        .finally(() => {
          setLoading(false);
        });

      return;
    }
  };

  const onUpdateAndExit = async (publish = false) => {
    await onUpdate(publish).then(() => {
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

  const onUpdateAndPublish = async () => {
    await onUpdateAndExit(true);
  };

  const onPreview = async () => {
    await onSave(false, true);
  };

  const onPreviewUpdate = async () => {
    await onUpdate(false, true);
  };

  const onDelete = async () => {
    if (!isEditMode) return;
    if (articleId.length) {
      setLoading(true);
      await deleteEditorialRecord(articleId[0])
        .then((response) => {
          if (response.success) {
            addNotification({ title: `Document successfully deleted`, type: 'confirm' });
            setTimeout(() => {
              router.push('/editorial');
            }, 600);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const onSchedule = async () => {
    const date = new Date().toISOString();
    setLoading(true);
    // TODO: populate with data once back end is correct
    await scheduleEditorial({ date, documentId: 'guid-here' });
    setLoading(false);
    addNotification({ title: `Document successfully scheduled for ${date}`, type: 'confirm' });
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
            schedule
            showDeleteButton={isEditMode}
            publishDisabled={!isValidForm}
            scheduleDisabled={!isValidForm}
            saveAndExitDisabled={!isValidForm}
            onSaveAndExit={isEditMode ? onUpdateAndExit : onSaveAndExit}
            onPublish={isEditMode ? onUpdateAndPublish : onSaveAndPublish}
            onPreview={isEditMode ? onPreviewUpdate : onPreview}
            onDelete={onDelete}
            onSchedule={onSchedule}
            onUnschedule={() => {
              console.info('<><><> Not supported');
            }}
            onUnpublish={() => {
              console.info('<><><> Not supported');
            }}
          />
        </TeleportOnScroll>
      </Panel>

      <Panel bgColor={color.base.ivory}>
        <main>
          <EditorialForm
            contentSourceValues={
              validContentSources?.map((val) => ({ label: val, value: val })) ||
              metadataSelectionValues.contentSources
            }
            infoTypeValues={
              validInfoTypes?.map((val) => ({ label: val, value: val })) ||
              metadataSelectionValues.informationTypes
            }
            fieldData={fieldData}
            errors={errors}
            setErrors={setErrors}
            onFieldChange={setFieldValue}
            onTagsChange={setTags}
            tags={tags}
            articleId={articleId.length ? articleId[0] : undefined}
            savedContent={savedDocumentContent}
            savedDocumentTags={savedDocumentTags}
          />
        </main>
      </Panel>
    </div>
  );
};

export default LoadingHOC(EditorialCreate);
