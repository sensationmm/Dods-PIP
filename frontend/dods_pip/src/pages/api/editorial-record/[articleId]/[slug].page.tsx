import fetchJson from '../../../../lib/fetchJson';
import withSession from '../../../../lib/session';
import { Api } from '../../../../utils/api';

export default withSession(async (req, res) => {
  const { query, method } = req;
  const { articleId, slug } = query;
  try {
    const result = await fetchJson(
      `${process.env.APP_API_URL}${Api.EditorialRecords}/${articleId}/${slug}`,
      {
        method,
        ...(slug === 'document' && method === 'PUT' ? { body: JSON.stringify(req.body) } : {}),
      },
      req,
    );
    res.json(result);
  } catch (error) {
    const { response: fetchResponse } = error;
    res.status(fetchResponse?.status || 500).json(error.data);
  }
});
