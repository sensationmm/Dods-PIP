import Loader from '@dods-ui/components/Loader';
import Modal from '@dods-ui/components/Modal';
import useUser, { User } from '@dods-ui/lib/useUser';
import React from 'react';

import LoadingHOC, { LoadingHOCProps } from '../../hoc/LoadingHOC';
import { ClientAccount } from '../account-management/accounts.page';
import CollectionsAdmin from './collections-admin';
import CollectionsUser from './collections-user';

export type Collection = {
  uuid: string;
  name: string;
  clientAccount: Pick<ClientAccount, 'uuid' | 'name'>;
  createdAt: Date;
  updatedAt: Date;
  alertsCount: number;
  queriesCount: number;
  documentsCount: number;
};

export type Collections = Collection[];

export type FilterParams = {
  limit?: number;
  offset?: number;
  searchTerm?: string;
};

interface CollectionsProps extends LoadingHOCProps {}

export interface CollectionsScreenProps extends LoadingHOCProps {
  setShowAdd: (val: boolean) => void;
  user: User;
}

export const Collections: React.FC<CollectionsProps> = ({
  isLoading,
  setLoading,
  addNotification,
}) => {
  const { user } = useUser({ redirectTo: '/' });
  const [showAdd, setShowAdd] = React.useState<boolean>(false);
  const HOCProps = {
    isLoading,
    setLoading,
    addNotification,
  };

  if (!user) {
    return <Loader data-test="loader" inline />;
  }

  return (
    <>
      {user && user.isDodsUser && (
        <CollectionsAdmin user={user} {...HOCProps} setShowAdd={setShowAdd} />
      )}

      {user && !user.isDodsUser && (
        <CollectionsUser user={user} {...HOCProps} setShowAdd={setShowAdd} />
      )}

      {showAdd && <Modal title="Add Collection" onClose={() => setShowAdd(false)} />}
    </>
  );
};

export default LoadingHOC(Collections);
