import InputText from '@dods-ui/components/_form/InputText';
import Box from '@dods-ui/components/_layout/Box';
import Panel from '@dods-ui/components/_layout/Panel';
import Spacer from '@dods-ui/components/_layout/Spacer';
import { AlertData } from '@dods-ui/components/Alert';
import Avatar from '@dods-ui/components/Avatar';
import Badge from '@dods-ui/components/Badge';
import Breadcrumbs from '@dods-ui/components/Breadcrumbs';
import Button from '@dods-ui/components/Button';
import Icon, { IconSize } from '@dods-ui/components/Icon';
import { Icons } from '@dods-ui/components/Icon/assets';
import Modal from '@dods-ui/components/Modal';
import Pagination from '@dods-ui/components/Pagination';
import SectionAccordion from '@dods-ui/components/SectionAccordion';
import Text from '@dods-ui/components/Text';
import color from '@dods-ui/globals/color';
import LoadingHOC, { LoadingHOCProps } from '@dods-ui/hoc/LoadingHOC';
import fetchJson, { CustomResponse } from '@dods-ui/lib/fetchJson';
import useUser from '@dods-ui/lib/useUser';
import { Api, BASE_URI, toQueryString } from '@dods-ui/utils/api';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';

import { Alert } from './[uuid]/alerts/alert-setup';
import CollectionAlert from './collection-alert';
import * as Styled from './collections-details.styles';
import { Collection, FilterParams } from './index.page';

type Errors = {
  editTitle?: string;
};

interface CollectionDetailsProps extends LoadingHOCProps {}

export const CollectionDetails: React.FC<CollectionDetailsProps> = ({
  setLoading,
  addNotification,
}) => {
  const { user } = useUser({ redirectTo: '/' });
  const router = useRouter();
  const { uuid: collectionId = '' } = router.query;
  const [collection, setCollection] = React.useState<Collection>();
  const [showEdit, setShowEdit] = React.useState<boolean>(false);
  const [editTitle, setEditTitle] = React.useState<string>('');
  const [errors, setErrors] = React.useState<Errors>({});
  const [showDelete, setShowDelete] = React.useState<boolean>(false);
  const [alerts, setAlerts] = React.useState<AlertData[]>();
  const [totalAlerts, setTotalAlerts] = React.useState<number>();

  const getFilterQueryString = () => {
    const params: FilterParams = {
      limit: numPerPage,
      offset: activePage * numPerPage,
    };

    return toQueryString(params);
  };

  const loadAlerts = async (collectionId: Collection['uuid']) => {
    setLoading(true);
    const queryString = getFilterQueryString();
    try {
      const result = await fetchJson<CustomResponse>(
        `${BASE_URI}${Api.Collections}/${collectionId}/alerts${queryString}`,
        {
          method: 'GET',
        },
      );
      const { alerts = [], totalRecords = 0 } = result;
      setAlerts(alerts as AlertData[]);
      setTotalAlerts(totalRecords);
      setLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  const loadCollection = async (id: Collection['uuid']) => {
    setLoading(true);
    try {
      const result = await fetchJson<CustomResponse>(`${BASE_URI}${Api.CollectionDetails}/${id}`, {
        method: 'GET',
      });
      const { data = {} } = result;

      setCollection(data as Collection);
      setEditTitle(data.name as Collection['name']);
      await loadAlerts(id as Collection['uuid']);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };

  React.useEffect(() => {
    collectionId !== '' && loadCollection(collectionId as Collection['uuid']);
  }, [collectionId]);

  const { activePage, numPerPage, PaginationButtons, PaginationStats } = Pagination(
    totalAlerts || 0,
    '5',
  );

  React.useEffect(() => {
    (async () => {
      collectionId !== '' && (await loadAlerts(collectionId as Collection['uuid']));
    })();
  }, [activePage, numPerPage]);

  if (!collection) return null;

  const editCollection = async () => {
    setLoading(true);
    try {
      const result = await fetchJson<CustomResponse>(
        `${BASE_URI}${Api.CollectionDetails}/${collection.uuid}`,
        {
          method: 'PUT',
          body: JSON.stringify({ name: editTitle, updatedBy: user.id }),
        },
      );
      const { data = {} } = result;

      setCollection(data as Collection);

      setLoading(false);
      addNotification({ title: 'Collection edited sucessfully', type: 'confirm' });
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };

  const deleteCollection = async () => {
    setLoading(true);
    try {
      await fetchJson(`${BASE_URI}${Api.CollectionDetails}/${collection.uuid}`, {
        method: 'DELETE',
      });
      router.push('/collections');
      setLoading(false);
      addNotification({ title: 'Collection deleted sucessfully', type: 'confirm' });
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };

  const deleteAlert = async (id: Alert['uuid']) => {
    setLoading(true);
    try {
      await fetchJson(`${BASE_URI}${Api.Collections}/${collection.uuid}${Api.Alerts}/${id}`, {
        method: 'DELETE',
      });
      setLoading(false);
      await loadAlerts(collection.uuid);
      addNotification({ title: 'Alert deleted sucessfully', type: 'confirm' });
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };

  const copyAlert = async (alertId: Alert['uuid'], copyCollectionId: Collection['uuid']) => {
    setLoading(true);
    try {
      await fetchJson(
        `${BASE_URI}${Api.Collections}/${collection.uuid}${Api.Alerts}/${alertId}/copyto`,
        {
          method: 'POST',
          body: JSON.stringify({
            destinationCollectionId: copyCollectionId,
            createdBy: user.id,
          }),
        },
      );
      setLoading(false);
      addNotification({
        title: 'Alert copied sucessfully',
        text: 'Copied to new collection',
        type: 'confirm',
        action: () => router.push(`/collections/${copyCollectionId}`),
        actionLabel: 'View Collection',
      });
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };

  const validateTitle = () => {
    const formErrors = { ...errors };
    if (editTitle === '') {
      formErrors.editTitle = 'Collection title is required';
    } else {
      delete formErrors.editTitle;
    }
    setErrors(formErrors);
  };

  return (
    <div data-test="page-people">
      <Head>
        <title>Dods | Collection Details</title>
      </Head>

      <main>
        <Panel>
          <Styled.actions>
            {user?.isDodsUser && (
              <Button
                inline
                isSmall
                type="text"
                label="Delete"
                icon={Icons.Bin}
                onClick={() => setShowDelete(true)}
              />
            )}
            <Button
              inline
              isSmall
              label="Rename"
              icon={Icons.Edit}
              onClick={() => setShowEdit(true)}
            />
          </Styled.actions>

          <Breadcrumbs
            history={[
              {
                href: '/collections',
                label: `${collection.clientAccount.name} Collections`,
              },
              { href: `/collections/${collection.uuid}`, label: collection.name },
            ]}
          />

          <Spacer size={6} />

          <Text type={'h1'} headingStyle="heroExtraLarge">
            {collection?.name}
          </Text>

          <Spacer size={12} />

          <Box size="small">
            <SectionAccordion
              header={
                <Styled.alertsHeader>
                  <Styled.alertsHeaderTitle>
                    <Icon src={Icons.Alert} size={IconSize.xlarge} />
                    <Text type="h2" headingStyle="titleLarge">
                      Alerts
                    </Text>
                    <Badge number={totalAlerts} label="Alerts" size="small" />
                  </Styled.alertsHeaderTitle>
                  {user?.isDodsUser && (
                    <Button
                      isSmall
                      type="secondary"
                      label="Add Alert"
                      icon={Icons.Add}
                      iconAlignment="right"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/collections/${collectionId}/alerts/create`);
                      }}
                    />
                  )}
                </Styled.alertsHeader>
              }
              isOpen
            >
              {alerts && alerts.length > 0 ? (
                alerts.map((alert, count) => [
                  <CollectionAlert
                    key={`alert-${alert.uuid}`}
                    {...alert}
                    collectionId={collectionId as string}
                    user={user}
                    onDelete={() => deleteAlert(alert.uuid)}
                    onCopy={(copyCollectionId) => copyAlert(alert.uuid, copyCollectionId)}
                  />,
                  count + 1 !== alerts.length && <Spacer key={`spacer-${alert.uuid}`} size={4} />,
                ])
              ) : (
                <Styled.noAlertsMessage>
                  <Text color={color.base.grey}>No alert has been added</Text>
                  {user?.isDodsUser && (
                    <Button
                      isSmall
                      type="text"
                      label="Add Alert"
                      icon={Icons.Add}
                      iconAlignment="right"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/collections/${collectionId}/alerts/create`);
                      }}
                    />
                  )}
                </Styled.noAlertsMessage>
              )}
              <Spacer size={8} />
              {alerts && alerts.length > 0 && (
                <PaginationStats>
                  <PaginationButtons />
                </PaginationStats>
              )}
            </SectionAccordion>
          </Box>
        </Panel>
      </main>

      {showEdit && (
        <Modal
          size="large"
          title="Edit Collection"
          titleAside={
            collection?.createdBy && (
              <>
                <Text type="labelSmall">Created by:</Text>
                <Avatar
                  type={collection?.createdBy.isDodsUser ? 'consultant' : 'client'}
                  size="small"
                />
                <Text type="labelSmall" bold>
                  {collection?.createdBy.name}
                </Text>
              </>
            )
          }
          onClose={() => {
            setEditTitle(collection.name);
            setErrors({});
            setShowEdit(false);
          }}
          buttons={[
            {
              isSmall: true,
              type: 'secondary',
              label: 'Cancel',
              onClick: () => setShowEdit(false),
            },
            {
              isSmall: true,
              type: 'primary',
              label: 'Apply',
              icon: Icons.Tick,
              disabled: editTitle === '' || editTitle === collection.name,
              onClick: editCollection,
            },
          ]}
          buttonAlignment="right"
          bodyOverflow
        >
          <InputText
            id="edit-collection-title"
            required
            label="Collection title"
            placeholder="Type a collection title"
            value={editTitle}
            onChange={setEditTitle}
            error={errors.editTitle}
            onBlur={validateTitle}
          />
        </Modal>
      )}

      {showDelete && (
        <Modal
          title="Do you wish to delete this collection?"
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
              onClick: deleteCollection,
            },
          ]}
          buttonAlignment="right"
        >
          <Text>This collection will be permanently deleted from the database.</Text>
        </Modal>
      )}
    </div>
  );
};

export default LoadingHOC(CollectionDetails);
