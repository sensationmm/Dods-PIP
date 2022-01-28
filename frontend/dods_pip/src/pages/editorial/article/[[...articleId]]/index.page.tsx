import Panel from '@dods-ui/components/_layout/Panel';
import Spacer from '@dods-ui/components/_layout/Spacer';
import Breadcrumbs from '@dods-ui/components/Breadcrumbs';
import { TagsData } from '@dods-ui/components/ContentTagger/TagBrowser';
import StatusBar from '@dods-ui/components/StatusBar';
import TeleportOnScroll from '@dods-ui/components/TeleportOnScroll';
import Text from '@dods-ui/components/Text';
import color from '@dods-ui/globals/color';
import LoadingHOC, { LoadingHOCProps } from '@dods-ui/hoc/LoadingHOC';
import { MetadataSelection } from '@dods-ui/pages/editorial/editorial.models';
import {
  createRecord,
  getMetadataSelections,
  scheduleEditorial,
  setEditorialPublishState,
} from '@dods-ui/pages/editorial/editorial.service';
import dateToCron from '@dods-ui/utils/dateToCron';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import EditorialForm, { EditorialFormFields } from './editorial-form';
import ScheduleModal from './schedule-modal';

interface EditorialProps extends LoadingHOCProps {}

export const EDITORIAL_STORAGE_KEY = 'temp_editorial';

export const EditorialCreate: React.FC<EditorialProps> = ({ setLoading, addNotification }) => {
  let temporaryData;
  const router = useRouter();
  const { articleId = [] } = router.query;

  const [metadataSelectionValues, setMetadataSelectionValues] = useState<MetadataSelection>({
    contentSources: [],
    informationTypes: [],
    status: [],
  });
  const [tags, setTags] = React.useState<TagsData[]>([]);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [fieldData, setFieldData] = useState<EditorialFormFields>({
    ...{
      content: '',
      title: '',
      sourceUrl: '',
      sourceName: '',
      informationType: '',
    },
  });

  const [isValidForm, setIsValidForm] = useState<boolean>(false);
  const [errors, setErrors] = useState<Partial<EditorialFormFields>>({});
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  const setFieldValue = (field: keyof EditorialFormFields, value: string) => {
    const updatedData = { ...fieldData, [field]: value };

    setFieldData(updatedData);
    global.localStorage.setItem(EDITORIAL_STORAGE_KEY, JSON.stringify(updatedData));
    setIsValidForm(Object.keys(errors).length < 1);
  };

  useEffect(() => {
    setIsEditMode(router.query.hasOwnProperty('articleId'));
    temporaryData = global.localStorage.getItem(EDITORIAL_STORAGE_KEY);
    temporaryData = ((temporaryData && JSON.parse(temporaryData)) || {}) as EditorialFormFields;
    // TODO add server data here when available
    setFieldData({ ...fieldData, ...temporaryData });
  }, [router.query]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const selections = await getMetadataSelections();
      setMetadataSelectionValues(selections);
      setLoading(false);
    })();
  }, []);

  const onSave = async () => {
    setLoading(true);
    // TODO complete data curation
    await createRecord({
      documentTitle: fieldData.title,
      createdBy: 'user name', // get user data here
      contentSource: fieldData.sourceName,
      ...(fieldData.sourceUrl && { sourceReferenceUri: fieldData.sourceUrl }),
      informationType: fieldData.informationType,
      documentContent: fieldData.content,
      taxonomyTerms: [], // get aggregated taxonomy terms
    });

    global.localStorage.removeItem(EDITORIAL_STORAGE_KEY);
    setLoading(false);
    addNotification({ title: 'Record added successfully', type: 'confirm' });
  };

  const onPublish = async () => {
    setLoading(true);
    // TODO populate with data once back end is correct
    await setEditorialPublishState({ isPublished: true, documentId: 'guid-here' });
    setLoading(false);
    addNotification({ title: 'Document successfully published', type: 'confirm' });
  };

  const onSchedule = async (dateAndTime: Date) => {
    setLoading(true);
    await scheduleEditorial({ cron: dateToCron(dateAndTime), documentId: articleId[0] });
    setShowScheduleModal(false);
    setLoading(false);
    addNotification({
      title: `Document successfully scheduled for ${dateAndTime}`,
      type: 'confirm',
    });
  };

  const onDelete = async () => {
    // Todo...
    console.warn('Delete not yet implemented');
    // const date = new Date().toISOString();
    // setLoading(true);
    // // TODO populate with data once back end is correct
    // await scheduleEditorial({ date, documentId: 'guid-here' });
    // setLoading(false);
    // addNotification({ title: `Document successfully deleted`, type: 'confirm' });
    // setTimeout(() => {
    //   router.push('/editorial');
    // }, 600);
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
            publishDisabled={isValidForm}
            scheduleDisabled={isValidForm}
            saveAndExitDisabled={isValidForm}
            onSaveAndEdit={() => onSave()}
            onPublish={() => onPublish()}
            onDelete={onDelete}
            onSchedule={() => setShowScheduleModal(true)}
            // onUnschedule={() => onSchedule()}
            onUpdateArticle={() => onSave()}
            onPreview={() => router.push('/editorial/preview')} // Preview active local content or from server??
            onUnpublish={() => onPublish()}
            schedule={isEditMode}
            saveAndExit={true}
            publish={isEditMode}
          />
        </TeleportOnScroll>
      </Panel>

      <Panel bgColor={color.base.ivory}>
        <main>
          <EditorialForm
            {...{
              contentSourceValues: metadataSelectionValues.contentSources,
              infoTypeValues: metadataSelectionValues.informationTypes,
              fieldData,
              errors,
              setErrors,
              onFieldChange: setFieldValue,
              onTagsChange: setTags,
              tags: tags,
            }}
          />
        </main>
      </Panel>

      {showScheduleModal && (
        <ScheduleModal onClose={() => setShowScheduleModal(false)} onSchedule={onSchedule} />
      )}
    </div>
  );
};

export default LoadingHOC(EditorialCreate);
