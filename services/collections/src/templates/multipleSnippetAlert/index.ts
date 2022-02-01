import { Article, MultipleArticleSection, MultipleEmailTemplateInput } from '../../domain';
import { readFile, writeFile } from 'fs/promises';

import HandleBars from 'handlebars';

const date = new Date().toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
});

const articleGenerator = (): Article => {
    const id = (Math.random() * 10000).toString(10);
    return {
        id,
        date,
        title: `Test Article #${id}`,
        contentSource: {
            icon: './images/image-placeholder-2.png',
            name: 'HM Revenue & Custom',
        },
        informationType: {
            icon: './images/icon-sm-document.png',
            name: 'Press Release',
        },
        content:
            'Mary Kelly Foy (City of Durham): To ask the Secretary of State for Education, whether he plans to provide schools in (a) City of Durham and (b) England with extra funding to meet increased heating costs during the 2021-22 academic year. [59057]',
        url: 'http://www.google.com/',
    };
};

const section1: MultipleArticleSection = {
    title: 'Section #1',
    icon: './images/image-placeholder.png',
    articles: [
        articleGenerator(),
        articleGenerator(),
        articleGenerator(),
        articleGenerator(),
        articleGenerator(),
        articleGenerator(),
        articleGenerator(),
    ],
};

const section2: MultipleArticleSection = {
    title: 'Section #2',
    icon: './images/image-placeholder.png',
    articles: [
        articleGenerator(),
        articleGenerator(),
        articleGenerator(),
        articleGenerator(),
        articleGenerator(),
        articleGenerator(),
        articleGenerator(),
        articleGenerator(),
        articleGenerator(),
        articleGenerator(),
    ],
};

const alertInput: MultipleEmailTemplateInput = {
    date,
    headline: 'The Alert',
    sections: [section1, section2],
};

//* Function to test template
const generateHTMLFile = async (filePath: string) => {
    try {
        const body = await getMultipleSnippetEmailBody(alertInput);
        await writeFile(filePath, body);
    } catch (error: any) {
        console.error(error);
    }
};

//* Reduce array into mx2 size matrix to fill double column template
const reduceArticleMatrix = (rows: Article[][], article: Article, index: number) => {
    index % 2 == 0 ? rows.push([article]) : rows[rows.length - 1].push(article);
    return rows;
};

export const getMultipleSnippetEmailBody = async (
    alertInput: MultipleEmailTemplateInput
): Promise<string> => {
    const templateSource = (await readFile(__dirname + '/template.handlebars')).toString();
    const template = HandleBars.compile(templateSource);
    return template({
        ...alertInput,
        sections: alertInput.sections.map((section) => ({
            ...section,
            articles: section.articles.reduce(reduceArticleMatrix, []),
        })),
    });
};

generateHTMLFile(
    '/Users/Juan.Riano/dev-dods/dodsmlp/services/email-templates/generated-multipleSnippet.html'
);
