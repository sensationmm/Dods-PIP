import { SelectItem } from '@dods-ui/components/_form/Select';
import Panel from '@dods-ui/components/_layout/Panel';
import Spacer from '@dods-ui/components/_layout/Spacer';
import Breadcrumbs from '@dods-ui/components/Breadcrumbs';
import { TagsData } from '@dods-ui/components/ContentTagger/TagBrowser';
import StatusBar from '@dods-ui/components/StatusBar';
import TeleportOnScroll from '@dods-ui/components/TeleportOnScroll';
import Text from '@dods-ui/components/Text';
import color from '@dods-ui/globals/color';
import LoadingHOC, { LoadingHOCProps } from '@dods-ui/hoc/LoadingHOC';
import fetchJson from '@dods-ui/lib/fetchJson';
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
import { Api, BASE_URI } from '@dods-ui/utils/api';
import dateToCron from '@dods-ui/utils/dateToCron';
import getContentSources from '@dods-ui/utils/getContentSources';
import getInformationTypes from '@dods-ui/utils/getInformationTypes';
import getJurisdiction from '@dods-ui/utils/getJurisdiction';
import useStateWithCallback from '@dods-ui/utils/useStateWithCallback';
import { format } from 'date-fns';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import Modal from '../../../../components/Modal';
import EditorialForm, { EditorialFormFields } from './editorial-form';
import ScheduleModal from './schedule-modal';

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
  const [isAskPublish, setIsAskPublish] = useState<boolean>(false);
  const [fieldData, setFieldData] = useState<EditorialFormFields>({
    content: '',
    title: '',
    sourceUrl: '',
    sourceName: '',
    informationType: '',
    originator: '',
    contentDateTime: format(new Date(), 'yyyy-MM-dd'),
  });
  const [isValidForm, setIsValidForm] = useState<boolean>(false);
  const [errors, setErrors] = useState<Partial<EditorialFormFields>>({});
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [savedDocumentContent, setSavedDocumentContent] = useStateWithCallback<string | undefined>(
    undefined,
  );
  const [jurisdiction, setJurisdiction] = useState<string>();
  const [validContentSources, setValidContentSources] = useState<string[] | undefined>();
  const [validInfoTypes, setValidInfoTypes] = useState<string[] | undefined>();
  const [originatorValues, setOriginatorValues] = React.useState<SelectItem[]>([]);

  const setFieldValue = (field: keyof EditorialFormFields, value: string) => {
    const savedFieldData = JSON.parse(global.localStorage.getItem(EDITORIAL_STORAGE_KEY) || '{}');
    const updatedData = { ...savedFieldData, [field]: value };
    setFieldData(updatedData);
    global.localStorage.setItem(EDITORIAL_STORAGE_KEY, JSON.stringify(updatedData));

    const { title, sourceName, informationType, content, contentDateTime } = updatedData;
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
    if (!contentDateTime) {
      Object.assign(errors, { contentDateTime });
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
            contentDateTime,
            originator,
            sourceReferenceUri,
            taxonomyTerms,
          } = response.document;
          const fieldData = {
            title: documentTitle,
            content: documentContent,
            informationType,
            sourceName: contentSource,
            sourceUrl: sourceReferenceUri || '',
            originator: originator,
            contentDateTime: contentDateTime,
          };
          setSavedDocumentContent(
            documentContent,
            (content: string) => content.length && setLoading(false),
          );
          setTags((taxonomyTerms || []).map((tag) => ({ ...tag, type: tag.facetType })));
          setJurisdiction(getJurisdiction({ contentSource }));
          setValidInfoTypes(getInformationTypes({ contentSource, informationType }));
          setFieldData(fieldData);
          global.localStorage.setItem(EDITORIAL_STORAGE_KEY, JSON.stringify(fieldData));
          setIsValidForm(true);
          window.scrollTo(0, 0);
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

  const originatorValuesList: SelectItem[] = [];

  const addTag = (term: TagsData) => {
    if (term.childTerms && term.childTerms?.length > 0) {
      term.childTerms?.forEach((child) => {
        addTag(child);
      });
    } else {
      originatorValuesList.push({
        value: term.termLabel,
        label: term.termLabel,
      });
    }
  };

  const loadOriginators = async () => {
    try {
      const originators: any = await fetchJson(
        `${BASE_URI}${Api.TaxonomySearch}/organisations/tree`,
      );

      originators.forEach((term: any) => {
        addTag(term);
      });

      setOriginatorValues(
        originatorValuesList.sort((a: SelectItem, b: SelectItem) => (a.label > b.label ? 1 : -1)),
      );
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      const selections = await getMetadataSelections();
      setMetadataSelectionValues(selections);
      setValidContentSources(getContentSources());
      setLoading(false);
    })();

    loadOriginators();
    global.localStorage.setItem(
      EDITORIAL_STORAGE_KEY,
      JSON.stringify({ contentDateTime: fieldData.contentDateTime }),
    ); // renitialise any existing save
  }, []);

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

  const onSave = async (
    publish = false,
    preview = false,
    schedule = false,
    scheduleDate: Date | undefined = undefined,
  ) => {
    const { title, sourceName, sourceUrl, informationType, content, originator, contentDateTime } =
      fieldData;
    if (title?.length && sourceName?.length && informationType?.length && content?.length) {
      setLoading(true);
      await createRecord({
        jurisdiction: jurisdiction || '',
        contentSource: sourceName,
        contentDateTime,
        originator: originator,
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
          !preview &&
            !schedule &&
            addNotification({ title: 'Record added successfully', type: 'confirm' });
          if (publish) {
            onPublish(response.data.uuid);
          }
          if (preview) {
            router.push(`/library/document/${response.data.uuid}?preview=true`);
          }

          if (schedule && scheduleDate) {
            onSchedule(scheduleDate, response.data.uuid);
          }
        })
        .finally(() => {
          if (!publish) {
            setLoading(false);
          }
        });

      return;
    }
  };

  const onSaveAndExit = async (publish = false) => {
    await onSave(publish).then(() => {
      !publish && router.push('/editorial');
    });
  };

  const onUpdate = async (publish = false, preview = false) => {
    const { title, sourceName, sourceUrl, informationType, content, originator, contentDateTime } =
      fieldData;
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
        contentDateTime,
        informationType,
        originator: originator,
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
          !preview && addNotification({ title: 'Record updated successfully', type: 'confirm' });
          if (publish) {
            onPublish(response.data.uuid);
          }
          if (preview) {
            router.push(`/library/document/${response.data.uuid}?preview=true`);
          }
        })
        .finally(() => {
          if (!publish) {
            setLoading(false);
          }
        });

      return;
    }
  };

  const onUpdateAndExit = async (publish = false) => {
    await onUpdate(publish).then(() => {
      !publish && router.push('/editorial');
    });
  };

  const onSchedule = async (dateAndTime: Date, documentId: string) => {
    setLoading(true);

    await scheduleEditorial({
      cron: dateToCron(dateAndTime),
      documentId: documentId,
    });
    global.localStorage.removeItem(EDITORIAL_STORAGE_KEY);
    setShowScheduleModal(false);
    setLoading(false);
    addNotification({
      title: `Document successfully scheduled for ${dateAndTime}`,
      type: 'confirm',
    });

    setTimeout(() => {
      router.push('/editorial');
    }, 600);
  };

  const onSaveAndSchedule = async (dateAndTime: Date) => {
    if (isEditMode) {
      await onSchedule(dateAndTime, articleId[0]);
    } else {
      await onSave(false, false, true, dateAndTime);
    }
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
      let routeChangeTimer: ReturnType<typeof setTimeout>;
      setLoading(true);
      await deleteEditorialRecord(articleId[0])
        .then((response) => {
          if (response.success) {
            addNotification({ title: `Document successfully deleted`, type: 'confirm' });
            routeChangeTimer = setTimeout(() => {
              router.push('/editorial');
            }, 600);
          }
        })
        .finally(() => {
          setLoading(false);
          clearTimeout(routeChangeTimer);
        });
    }
  };

  return (
    <div data-testid="page-editorial">
      <Head>
        <title>Dods | Editorial Repository | {isEditMode ? 'Edit' : 'Create'}</title>
      </Head>

      {isAskPublish && (
        <Modal
          title="Do you want to publish this article?"
          size="large"
          buttons={[
            { label: 'Cancel', type: 'secondary', onClick: () => setIsAskPublish(false) },
            {
              label: 'Publish now',
              type: 'primary',
              onClick: isEditMode ? onUpdateAndPublish : onSaveAndPublish,
            },
          ]}
          buttonAlignment="right"
          onClose={() => setIsAskPublish(false)}
          isDismissible={true}
        >
          <Text type="bodyLarge">The article will be published and visible to all clients.</Text>
        </Modal>
      )}

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
            isValidForm={isValidForm}
            isFutureContentDate={new Date(fieldData.contentDateTime) > new Date()}
            onSaveAndExit={() => (isEditMode ? onUpdateAndExit() : onSaveAndExit())}
            onPublish={() => setIsAskPublish(true)}
            onPreview={isEditMode ? onPreviewUpdate : onPreview}
            onDelete={onDelete}
            onSchedule={() => setShowScheduleModal(true)}
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
            originatorValues={originatorValues}
            fieldData={fieldData}
            errors={errors}
            setErrors={setErrors}
            onFieldChange={setFieldValue}
            onTagsChange={setTags}
            tags={tags}
            articleId={articleId.length ? articleId[0] : undefined}
            savedContent={savedDocumentContent}
          />
        </main>
      </Panel>

      {showScheduleModal && (
        <ScheduleModal onClose={() => setShowScheduleModal(false)} onSchedule={onSaveAndSchedule} />
      )}
    </div>
  );
};

export default LoadingHOC(EditorialCreate);
