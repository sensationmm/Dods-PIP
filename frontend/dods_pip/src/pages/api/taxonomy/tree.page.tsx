import fetchJson from '../../../lib/fetchJson';
import withSession from '../../../lib/session';
import { Api } from '../../../utils/api';
import { resultTypes } from './[...search].page';

// @TODO remove once correct in API
interface newResultTypes extends resultTypes {
  Geography?: resultTypes['Geographies'];
}

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
    )) as newResultTypes;

    // @TODO remove once correct in API
    if (result.hasOwnProperty('Geography')) {
      result.Geographies = result.Geography;
      delete result.Geography;
    }

    res.json(result);
  } catch (error) {
    const { response: fetchResponse } = error;
    res.status(fetchResponse?.status || 500).json(error.data);
  }
});
