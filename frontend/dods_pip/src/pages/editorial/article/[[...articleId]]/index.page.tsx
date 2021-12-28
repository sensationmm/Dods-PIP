import { CreateEditorialRecordParametersV2 } from '@dods-services/editorial-workflow/src/domain';
import Panel from '@dods-ui/components/_layout/Panel';
import Spacer from '@dods-ui/components/_layout/Spacer';
import Breadcrumbs from '@dods-ui/components/Breadcrumbs';
import StatusBar from '@dods-ui/components/StatusBar';
import TeleportOnScroll from '@dods-ui/components/TeleportOnScroll';
import Text from '@dods-ui/components/Text';
import color from '@dods-ui/globals/color';
import LoadingHOC, { LoadingHOCProps } from '@dods-ui/hoc/LoadingHOC';
import {
  createRecord,
  getMetadataSelections,
  MetadataSelection,
} from '@dods-ui/pages/editorial/editorial.service';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import EditorialForm, { EditorialFormFields } from './editorial-form';

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
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [fieldData, setFieldData] = useState<EditorialFormFields>({
    ...{
      content: '',
      title: '',
      sourceUrl: '',
      sourceName: '',
      informationType: '',
      originator: '',
    },
  });
  // const [staticEditorContent, setStaticEditorContent] = useState<
  //   HTMLCollection | HTMLElement | null
  // >(null);
  const [isValidForm, setIsValidForm] = useState<boolean>(false);
  const [errors, setErrors] = useState<Partial<EditorialFormFields>>({});

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

  // useEffect(() => {
  //   const div = document.createElement('div');
  //   div.innerHTML = fieldData.content;
  //
  //   setStaticEditorContent(div.children);
  // }, []);

  const onSave = async () => {
    setLoading(true);
    // TODO populate with data once back end is correct
    await createRecord({} as CreateEditorialRecordParametersV2);
    setLoading(false);
    addNotification({ title: 'Record added successfully', type: 'confirm' });
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
            onSaveAndEdit={onSave}
            schedule={true}
            saveAndExit={true}
            publish={true}
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
            }}
          />
        </main>
      </Panel>
    </div>
  );
};

export default LoadingHOC(EditorialCreate);
