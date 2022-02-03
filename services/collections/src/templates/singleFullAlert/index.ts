import HandleBars from 'handlebars';
import { SingleEmailTemplateInput } from '../../domain';
import { readFile } from 'fs/promises';

// const date = new Date().toLocaleDateString('en-GB', {
//     year: 'numeric',
//     month: 'long',
//     day: 'numeric',
//     hour: '2-digit',
//     minute: '2-digit',
// });

// const articleGenerator = (): Article => {
//     const id = (Math.random() * 10000).toString(10);
//     return {
//         id,
//         date,
//         title: `Test Article #${id}`,
//         contentSource: {
//             icon: './images/image-placeholder-2.png',
//             name: 'HM Revenue & Custom',
//         },
//         informationType: {
//             icon: './images/icon-sm-document.png',
//             name: 'Press Release',
//         },
//         content:
//             'Mary Kelly Foy (City of Durham): To ask the Secretary of State for Education, whether he plans to provide schools in (a) City of Durham and (b) England with extra funding to meet increased heating costs during the 2021-22 academic year. [59057]',
//         url: 'http://www.google.com/',
//     };
// };

// const section: SingleArticleSection = {
//     title: 'Section #1',
//     icon: './images/image-placeholder.png',
//     article: articleGenerator(),
// };

// const alertInput: SingleEmailTemplateInput = {
//     date,
//     headline: 'The Alert',
//     section,
//     url: ''
// };

//* Function to test template
// export const generateHTMLFile = async (filePath: string) => {
//     try {
//         const body = await getSingleEmailBody(alertInput);
//         await writeFile(filePath, body);
//     } catch (error: any) {
//         console.error(error);
//     }
// };

export const singleEmailBodyHandler = async (alertInput: SingleEmailTemplateInput): Promise<string> => {
    return await getSingleEmailBody(alertInput)
}

export const getSingleEmailBody = async (alertInput: SingleEmailTemplateInput): Promise<string> => {
    const templateSource = (await readFile(__dirname + '/template.handlebars')).toString();
    const template = HandleBars.compile(templateSource);
    return template(alertInput);
};

// generateHTMLFile(
//     '/Users/Juan.Riano/dev-dods/dodsmlp/services/email-templates/generated-single.html'
// );
