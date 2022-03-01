import fetchJson from '../../../lib/fetchJson';
import withSession from '../../../lib/session';
import { Api } from '../../../utils/api';
import { resultTypes } from './[...search].page';

export default withSession(async (req, res) => {
  try {
    const result = (await fetchJson(
      `${process.env.APP_TAXONOMY_URL}${process.env.ENVIRONMENT}${Api.TaxonomyTree}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
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
