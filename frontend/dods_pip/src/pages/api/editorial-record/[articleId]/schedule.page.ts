import fetchJson from '@dods-ui/lib/fetchJson';
import withSession from '@dods-ui/lib/session';
import { Api } from '@dods-ui/utils/api';

export default withSession(async (req, res) => {
  const { date, documentId } = req.body;

  console.log('!?!?!?!date', date);
  console.log('!?!?!?!documentId', documentId);

  const url = `${process.env.APP_API_URL}${Api.EditorialRecords}/${documentId}/schedule`;

  console.log('url', url);

  try {
    const result = await fetchJson(
      `${process.env.APP_API_URL}${Api.EditorialRecords}/${documentId}/schedule`,
      {
        method: 'POST',
        body: JSON.stringify({
          cron: '0 0 13 26 JAN ? 2022',
        }),
      },
    );
    res.json(result);
  } catch (error) {
    const { response } = error;
    res.status(response?.status || 500).json(error.data);
  }
});
