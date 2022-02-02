import fetchJson from '@dods-ui/lib/fetchJson';
import withSession from '@dods-ui/lib/session';
import { Api } from '@dods-ui/utils/api';

export default withSession(async (req, res) => {
  const { query, method, body } = req;
  const { uuid, alertId, queryId } = query;
  try {
    const url = `${process.env.APP_API_URL}${Api.Collections}/${uuid}/alerts/${alertId}/queries/${queryId}/copyto`;
    console.log('CopyQuery', url, body);
    const result = await fetchJson(
      url,
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
