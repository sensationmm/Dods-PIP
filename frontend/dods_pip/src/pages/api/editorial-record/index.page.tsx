import fetchJson from '../../../lib/fetchJson';
import withSession, { NextIronRequest } from '../../../lib/session';
import { Api, toQueryString } from '../../../utils/api';

export default withSession(async (req, res) => {
  try {
    const { method } = req;
    let result;

    if (method === 'GET') result = await getEditorial(req);
    if (method === 'POST') result = await postEditorial(req);

    res.json(result);
  } catch (error: any) {
    const { response } = error;
    res.status(response?.status || 500).json(error.data);
  }
});

const getEditorial = async (req: NextIronRequest) => {
  const { query } = req;
  return await fetchJson(
    `${process.env.APP_API_URL}${Api.EditorialRecords}${toQueryString(query)}`,
    {
      method: 'GET',
    },
    req,
  );
};

const postEditorial = async (req: NextIronRequest) =>
  await fetchJson(
    `${process.env.APP_API_URL}${Api.EditorialRecords}`,
    {
      method: 'POST',
      body: JSON.stringify(req.body),
    },
    req,
  );
