import fetchJson from '../../lib/fetchJson';
import withSession from '../../lib/session';

export default withSession(async (req, res) => {
  try {
    // we check that the user exists on GitHub and store some data in session
    const { accessToken, isDodsUser, clientAccountName, clientAccountId } = await fetchJson(
      `${process.env.APP_API_URL}/signIn`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(req.body),
      },
      req,
    );
    const user = {
      isLoggedIn: true,
      accessToken,
      isDodsUser,
      clientAccountName,
      clientAccountId,
    };

    req.session.set('user', user);
    await req.session.save();
    res.json(user);
  } catch (error) {
    const { response: fetchResponse } = error;
    res.status(fetchResponse?.status || 500).json(error.data);
  }
});
