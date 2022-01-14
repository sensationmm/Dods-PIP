import fetchJson from '../../../lib/fetchJson';
import withSession, { NextIronRequest } from '../../../lib/session';
import { Api } from '../../../utils/api';

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

const getEditorial = async (req: NextIronRequest) =>
  await fetchJson(
    `${process.env.APP_API_URL}${Api.EditorialRecords}`,
    {
      method: 'GET',
    },
    req,
  );

const postEditorial = async (req: NextIronRequest) =>
  await fetchJson(
    `${process.env.APP_API_URL}${Api.EditorialRecords}`,
    {
      method: 'POST',
      body: JSON.stringify({
        documentName: 'testDocument2',
        contentSource: 'string',
        informationType: 'string',
        document: {
          jurisdiction: 'string',
          documentTitle: 'string',
          createdBy: 'string',
          internallyCreated: true,
          schemaType: 'Internal',
          contentSource: 'string',
          informationType: 'string',
          createdDateTime: '2021-08-18T10:29:51.960+01:00',
          version: '1.0',
          feedFormat: 'text/plain',
          taxonomyTerms: [
            {
              tagId: 'sdfsdfsdf',
              facetType: 'Topics',
              inScheme: ['http://www.dods.co.uk/taxonomy/instance/Topics'],
              termLabel: 'Term 4',
              ancestorTerms: [
                {
                  tagId: 'sdfsdfsdf',
                  termLabel: 'Term 2',
                  rank: 1,
                },
                {
                  tagId: 'sdfsdfsdf',
                  termLabel: 'Term 1',
                  rank: 0,
                },
              ],
              alternative_labels: ['Term B', 'Term C'],
            },
          ],
          documentContent: 'html content of the document',
        },
      }),
    },
    req,
  );
