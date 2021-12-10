import fetchJson from '../../lib/fetchJson';
import withSession from '../../lib/session';
import { Api } from '../../utils/api';

export default withSession(async (req, res) => {
  try {
    const result = await fetchJson(
      `${process.env.APP_API_URL}${Api.ForgotPassword}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(req.body),
      },
      req,
    );
    if (result.status === 200) {
      res.json({ success: true });
    } else {
      res.json({ success: false, message: 'Request limit exceeded' });
    }
  } catch (error) {
    const { response: fetchResponse } = error;
    console.log('forgotPassword FAIL', error);
    res.status(fetchResponse?.status || 500).json(error.data);
  }
});
