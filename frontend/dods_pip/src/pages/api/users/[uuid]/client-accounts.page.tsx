import fetchJson from '../../../../lib/fetchJson';
import withSession from '../../../../lib/session';
import { Api } from '../../../../utils/api';

export default withSession(async (req, res) => {
  console.log('api client-accounts');
  try {
    const { uuid } = req.query;
    const result = await fetchJson(
      `${process.env.APP_API_URL}${Api.Users}/${uuid}${Api.ClientAccounts}`,
      {
        method: 'GET',
      },
      req,
    );
    res.json(result);
  } catch (error) {
    const { response: fetchResponse } = error;
    res.status(fetchResponse?.status || 500).json(error.data);
  }
});
