interface AlertEmail {
    date: string;
    headline: string;
}

export interface Section {
    title: string;
    icon: string;
}

export interface Article {
    id: string;
    title: string;
    informationType: {
        icon: string;
        name: string;
    };
    contentSource: {
        icon: string;
        name: string;
    };
    date: string;
    url: string;
    content: string;
}

export interface ArticleSource extends Article {
    source: string
}

export interface SingleArticleSection extends Section {
    article: Article;
}

export interface MultipleArticleSection extends Section {
    articles: Article[];
}

export interface MultipleEmailTemplateInput extends AlertEmail {
    sections: MultipleArticleSection[];
    url: string;
}

export interface SingleEmailTemplateInput extends AlertEmail {
    section: SingleArticleSection;
    url: string;
}
