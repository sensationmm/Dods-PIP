import fetchJson from '../../../lib/fetchJson';
import withSession from '../../../lib/session';
import { Api } from '../../../utils/api';

export default withSession(async (req, res) => {
  const { uuid } = req.query;
  try {
    const response = await fetchJson(`${process.env.APP_API_URL}${Api.ClientAccount}/${uuid}`, {
      method: 'PUT',
      body: JSON.stringify(req.body),
    });

    res.json(response);
  } catch (error) {
    const { response: fetchResponse } = error;
    res.status(fetchResponse?.status || 500).json(error.data);
  }
});
