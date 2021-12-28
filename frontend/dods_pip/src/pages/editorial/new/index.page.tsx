import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

import Panel from '../../../components/_layout/Panel';
import Spacer from '../../../components/_layout/Spacer';
import Breadcrumbs from '../../../components/Breadcrumbs';
import StatusBar from '../../../components/StatusBar';
import TeleportOnScroll from '../../../components/TeleportOnScroll';
import Text from '../../../components/Text';
import color from '../../../globals/color';
import LoadingHOC, { LoadingHOCProps } from '../../../hoc/LoadingHOC';
import EditorialForm, { EditorialFormFields } from '../editorial-form';

interface EditorialProps extends LoadingHOCProps {}

export const EditorialCreate: React.FC<EditorialProps> = ({ setLoading }) => {
  const router = useRouter();
  const [fieldData, setFieldData] = useState<EditorialFormFields>({
    content: '',
    title: '',
    sourceUrl: '',
    sourceName: '',
    informationType: '',
    originator: '',
  });

  const [isValidForm, setIsValidForm] = useState<boolean>(false);
  const [errors, setErrors] = useState<Partial<EditorialFormFields>>({});

  const setFieldValue = (field: keyof EditorialFormFields, value: string) => {
    setFieldData({ ...fieldData, [field]: value });
    setIsValidForm(Object.keys(errors).length < 1);
  };

  return (
    <div data-testid="page-editorial">
      <Head>
        <title>Dods PIP | Editorial Repository | Create</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Panel bgColor={color.base.white}>
        <Breadcrumbs
          history={[
            { href: '/', label: 'Dods' },
            { href: '/editorial', label: 'Editorial Repository' },
            { href: '/editorial/new', label: 'Create new content' },
          ]}
        />
        <Spacer size={6} />
        <Text type="h1" headingStyle="hero">
          Create new content
        </Text>
        <Spacer size={6} />

        <TeleportOnScroll>
          <StatusBar
            publishDisabled={!isValidForm}
            scheduleDisabled={!isValidForm}
            saveAndExitDisabled={!isValidForm}
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
