import { EditorialRecord } from '@dods-ui/pages/editorial/editorial.models';

import contentSources from './contentSources.json';

type Jurisdiction = 'uk' | 'eu' | 'uk,eu';

const getJurisdiction = (document: Pick<EditorialRecord, 'contentSource'>): Jurisdiction => {
  const uk = contentSources.ukContentSources.some(
    ({ contentSource }) => contentSource === document.contentSource,
  );
  const eu = contentSources.euContentSoruces.some(
    ({ contentSource }) => contentSource === document.contentSource,
  );
  if (uk && !eu) {
    return 'uk';
  } else if (!uk && eu) {
    return 'eu';
  }
  return 'uk,eu';
};

export default getJurisdiction;
