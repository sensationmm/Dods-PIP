import fetchJson from '../../lib/fetchJson';
import withSession from '../../lib/session';

export default withSession(async (req, res) => {
  const { slug } = req.query;
  try {
    // we check that the user exists on GitHub and store some data in session
    const result = await fetchJson(
      `${process.env.APP_API_URL}/${slug}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(req.body),
      },
      req,
    );
    res.json(result);
  } catch (error) {
    const { response: fetchResponse } = error;
    res.status(fetchResponse?.status || 500).json(error.data);
  }
});
