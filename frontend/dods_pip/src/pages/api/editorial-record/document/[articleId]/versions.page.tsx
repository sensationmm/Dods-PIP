import fetchJson from '../../../../../lib/fetchJson';
import withSession from '../../../../../lib/session';
import { Api } from '../../../../../utils/api';

export default withSession(async (req, res) => {
  const { query, method, body } = req;
  const { articleId } = query;
  try {
    const result = await fetchJson(
      `${process.env.APP_API_URL}${Api.EditorialRecords}/document/${articleId}/versions`,
      {
        method,
        body: JSON.stringify(body),
      },
      req,
    );
    res.json(result);
  } catch (error) {
    const { response: fetchResponse } = error;
    res.status(fetchResponse?.status || 500).json(error.data);
  }
});
