import SearchDropdown from '@dods-ui/components/_form/SearchDropdown';
import { SelectProps } from '@dods-ui/components/_form/Select';
import Spacer from '@dods-ui/components/_layout/Spacer';
import Alert, { AlertData } from '@dods-ui/components/Alert';
import { Icons } from '@dods-ui/components/Icon/assets';
import Modal from '@dods-ui/components/Modal';
import Text from '@dods-ui/components/Text';
import { User } from '@dods-ui/lib/useUser';
import loadAccounts from '@dods-ui/pages/accounts/load-accounts';
import loadCollections from '@dods-ui/pages/collections/load-collections';
import validateField from '@dods-ui/utils/validateField';
import { useRouter } from 'next/router';
import React from 'react';

import * as Styled from './collections.styles';

export interface CollectionAlertProps extends AlertData {
  user: User;
  onDelete: () => Promise<void>;
  onCopy: (collectionId: string) => Promise<void>;
}

type Errors = {
  account?: string;
  collection?: string;
};

const CollectionAlert: React.FC<CollectionAlertProps> = ({
  uuid,
  deliveryTimes,
  collectionId,
  user,
  onDelete,
  onCopy,
  ...rest
}) => {
  const router = useRouter();
  const [showDelete, setShowDelete] = React.useState<boolean>(false);
  const [showCopy, setShowCopy] = React.useState<boolean>(false);
  const [accounts, setAccounts] = React.useState<SelectProps['options']>([]);
  const [collections, setCollections] = React.useState<SelectProps['options']>([]);
  const [copyAccount, setCopyAccount] = React.useState<string>('');
  const [copyCollection, setCopyCollection] = React.useState<string>('');
  const [errors, setErrors] = React.useState<Errors>({});
  const [loadingCollections, setLoadingCollections] = React.useState<boolean>(false);

  const deleteAlert = () => {
    setShowDelete(false);
    onDelete();
  };

  const copyAlert = () => {
    onCopy(copyCollection);
    resetCopy();
  };

  const resetCopy = () => {
    setShowCopy(false);
    setCopyAccount('');
    setCopyCollection('');
    setCollections([]);
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

  const isComplete = copyAccount !== '' && copyCollection !== '';

  return (
    <>
      <Alert
        key={`alert-${uuid}`}
        uuid={uuid}
        collectionId={collectionId}
        {...rest}
        deliveryTimes={deliveryTimes?.sort((a, b) => (a > b ? 1 : -1))}
        isConsultant={user.isDodsUser}
        onDelete={() => setShowDelete(true)}
        onCopy={() => setShowCopy(true)}
        onViewResults={() => router.push(`/collections/${collectionId}`)}
        onViewSettings={(step?: string) =>
          router.push(`/collections/${collectionId}/alerts/${uuid}/edit${step}`)
        }
      />

      {showDelete && (
        <Modal
          title="Do you wish to delete this alert?"
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
              onClick: deleteAlert,
            },
          ]}
          buttonAlignment="right"
        >
          <Text>This alert will be permanently deleted from the database.</Text>
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
              onClick: copyAlert,
              disabled: !isComplete,
            },
          ]}
          buttonAlignment="right"
          bodyOverflow
        >
          <Text>Search for a destination where to paste a copy of this alert</Text>
          <Spacer size={4} />

          <Styled.addCollectionContent stacked={!user?.isDodsUser}>
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
                validateField('account', 'Account', value, errors, setErrors);
              }}
              required
              label="Collection"
              error={errors.collection}
              onBlur={() =>
                validateField('collection', 'Collection', copyAccount, errors, setErrors)
              }
              onKeyPressHasSearch
              isDisabled={collections.length === 0 || loadingCollections}
            />
          </Styled.addCollectionContent>
        </Modal>
      )}
    </>
  );
};

export default CollectionAlert;
