import fetchJson from '../../../../../lib/fetchJson';
import withSession from '../../../../../lib/session';
import { Api } from '../../../../../utils/api';

export default withSession(async (req, res) => {
  const { uuid } = req.query;
  try {
    const result = await fetchJson(
      `${process.env.APP_API_URL}${Api.ClientAccount}/${uuid}${Api.TeamMemberCreate}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(req.body),
      },
    );
    res.json(result);
  } catch (error) {
    const { response: fetchResponse } = error;
    res.status(fetchResponse?.status || 500).json(error.data);
  }
});
