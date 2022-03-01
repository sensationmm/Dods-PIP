import fetchJson from '../../../../lib/fetchJson';
import withSession from '../../../../lib/session';
import { Api } from '../../../../utils/api';
import { resultTypes } from '../[...search].page';

export default withSession(async (req, res) => {
  const { slug } = req.query;
  try {
    const url = `${process.env.APP_TAXONOMY_URL}${process.env.ENVIRONMENT}${Api.TaxonomySearch}/${slug}/tree`;
    const result = (await fetchJson(
      url,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          accept: 'application/json',
          'accept-encoding': 'gzip',
        },
      },
      req,
    )) as resultTypes;

    res.json(result);
  } catch (error) {
    const { response: fetchResponse } = error;
    res.status(fetchResponse?.status || 500).json(error.data);
  }
});
