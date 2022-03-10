import fetchJson from '@dods-ui/lib/fetchJson';
import withSession from '@dods-ui/lib/session';
import { Api } from '@dods-ui/utils/api';

export default withSession(async (req, res) => {
  const { method } = req;

  try {
    const config: RequestInit = {
      method,
    };

    if (method === 'POST') {
      config.body = JSON.stringify({
        cron: req.body.cron,
      });
    }

    const documentId = req.body.documentId || req.query.articleId;

    const result = await fetchJson(
      `${process.env.APP_API_URL}${Api.EditorialRecords}/${documentId}/schedule`,
      config,
      req,
    );

    res.json(result);
  } catch (error) {
    const { response } = error;
    res.status(response?.status || 500).json(error.data);
  }
});
