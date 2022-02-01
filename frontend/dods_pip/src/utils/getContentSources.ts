import contentSources from './contentSources.json';

const getContentSources = (): string[] => {
  const validContentSources = [
    ...contentSources.ukContentSources,
    ...contentSources.euContentSoruces,
  ].flatMap(({ contentSource }) => contentSource);
  return validContentSources;
};

export default getContentSources;
