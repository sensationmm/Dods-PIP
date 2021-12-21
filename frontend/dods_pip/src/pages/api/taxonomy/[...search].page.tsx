import fetchJson from '../../../lib/fetchJson';
import withSession from '../../../lib/session';
import { Api } from '../../../utils/api';

export type resultTypes = {
  Geographies?: Record<string, unknown>;
  Topics?: Record<string, unknown>;
  People?: Record<string, unknown>;
  Organisations?: Record<string, unknown>;
};

export default withSession(async (req, res) => {
  const { search } = req.query;
  try {
    const result = await fetchJson(
      `${process.env.APP_API_URL}${Api.Taxonomies}?tags=${search}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
      req,
    );

    const transformedResult: resultTypes = {};
    Array.isArray(result) &&
      result.forEach((result) => {
        const label = result.taxonomy != 'Grographies' ? result.taxonomy : 'Geographies';
        delete result.taxonomy;

        transformedResult[label as keyof resultTypes] = result;
      });
    res.json(transformedResult);
  } catch (error) {
    const { response: fetchResponse } = error;
    res.status(fetchResponse?.status || 500).json(error.data);
  }
});
