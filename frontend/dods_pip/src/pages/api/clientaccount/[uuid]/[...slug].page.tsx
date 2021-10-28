import fetchJson from '../../../../lib/fetchJson';
import withSession from '../../../../lib/session';
import { Api } from '../../../../utils/api';

export default withSession(async (req, res) => {
  const { uuid, slug } = req.query;
  const validSlugs = ['header', 'subscription', 'teammember'];
  try {
    if (!validSlugs.includes(slug[0])) {
      throw {
        data: {
          code: 500,
          message: `Incorrect slug for PUT client account. Correct slug values are ${validSlugs.join(
            ', ',
          )}`,
        },
      };
    }

    const response = await fetchJson(
      `${process.env.APP_API_URL}${Api.ClientAccount}/${uuid}/${slug[0]}`,
      {
        method: 'PUT',
        body: JSON.stringify(req.body),
      },
    );

    res.json(response);
  } catch (error) {
    const { response: fetchResponse } = error;
    res.status(fetchResponse?.status || 500).json(error.data);
  }
});
