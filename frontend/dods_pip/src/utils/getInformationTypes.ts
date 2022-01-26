import { EditorialRecord } from '@dods-ui/pages/editorial/editorial.models';

import contentSources from './contentSources.json';

const getInformationTypes = (
  document: Pick<EditorialRecord, 'contentSource' | 'informationType'>,
): string[] => {
  const informationTypes = [...contentSources.ukContentSources, ...contentSources.euContentSoruces]
    .filter(({ contentSource }) => contentSource === document.contentSource)
    .flatMap(({ informationTypes }) => informationTypes);
  return informationTypes;
};

export default getInformationTypes;
