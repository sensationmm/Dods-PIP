import fetchJson from '@dods-ui/lib/fetchJson';
import withSession from '@dods-ui/lib/session';
import { Api } from '@dods-ui/utils/api';

export default withSession(async (req, res) => {
  const { cron, documentId } = req.body;

  try {
    const result = await fetchJson(
      `${process.env.APP_API_URL}${Api.EditorialRecords}/${documentId}/schedule`,
      {
        method: 'POST',
        body: JSON.stringify({
          cron,
        }),
      },
    );

    res.json(result);
  } catch (error) {
    const { response } = error;
    res.status(response?.status || 500).json(error.data);
  }
});
