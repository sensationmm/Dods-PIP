import color from '@dods-ui/globals/color';
import { ISourceData } from '@dods-ui/pages/library';
import { ILibraryProps, TAXONOMY_TERMS_LENGTH } from '@dods-ui/pages/library/index.page';
import { format } from 'date-fns';
import Link from 'next/link';
import React from 'react';

import * as Styled from '../../pages/library/library.styles';
import Box from '../_layout/Box';
import Chips from '../Chips';
import Icon, { IconSize } from '../Icon';
import { Icons } from '../Icon/assets';
import IconContentSource from '../IconContentSource';

export interface LibraryItemProps {
  parsedQuery: ILibraryProps['parsedQuery'];
  documentTitle: ISourceData['documentTitle'];
  documentContent: ISourceData['documentContent'];
  contentDateTime: ISourceData['contentDateTime'];
  organisationName: ISourceData['organisationName'];
  informationType: ISourceData['informationType'];
  taxonomyTerms: ISourceData['taxonomyTerms'];
  documentId: ISourceData['documentId'];
  contentSource: ISourceData['contentSource'];
}

const LibraryItem: React.FC<LibraryItemProps> = ({
  parsedQuery,
  documentTitle,
  documentContent,
  contentDateTime,
  organisationName,
  informationType,
  taxonomyTerms,
  documentId,
  contentSource,
}) => {
  const formattedTime =
    contentDateTime && format(new Date(contentDateTime), "d MMMM yyyy 'at' hh:mm");

  return (
    <Styled.searchResult data-test="library-item">
      <Box size={'extraSmall'}>
        <Styled.boxContent>
          <Styled.topRow>
            <Styled.imageContainer>
              <IconContentSource icon={contentSource} width={40} height={40} />
            </Styled.imageContainer>
            <Styled.searchResultHeader>
              <Styled.searchResultHeading>
                <h2>
                  <Link href={`/library/document/${documentId}`} passHref>
                    <Styled.titleLink>{documentTitle}</Styled.titleLink>
                  </Link>
                </h2>
                <Styled.date className={'mobileOnly'}>{formattedTime}</Styled.date>
                <Styled.contentSource>
                  <Icon src={Icons.Document} size={IconSize.medium} color={color.theme.blue} />
                  <Styled.contentSourceText>
                    {informationType} {organisationName && ` / ${organisationName}`}
                  </Styled.contentSourceText>
                </Styled.contentSource>
              </Styled.searchResultHeading>
            </Styled.searchResultHeader>
            <Styled.date>{formattedTime}</Styled.date>
          </Styled.topRow>
          {documentContent && (
            <Styled.contentPreview>
              <div dangerouslySetInnerHTML={{ __html: documentContent }} />
            </Styled.contentPreview>
          )}
          <Styled.bottomRow>
            <Styled.tagsWrapper>
              {taxonomyTerms
                ?.slice(0, TAXONOMY_TERMS_LENGTH - 1)
                .map((term: { tagId: string; termLabel: string }, i: number) => {
                  if (i > 5) {
                    return;
                  }

                  const selectedIndex =
                    parsedQuery?.nestedFilters?.findIndex(
                      ({ value, path }) => path === 'taxonomyTerms' && value === term.termLabel,
                    ) ?? -1;

                  return (
                    <Chips
                      key={`chip-${i}-${term.termLabel}`}
                      label={term.termLabel}
                      chipsSize={'dense'}
                      theme={selectedIndex > -1 ? 'dark' : 'light'}
                      bold={selectedIndex > -1}
                    />
                  );
                })}
              <div>
                {taxonomyTerms && taxonomyTerms.length > TAXONOMY_TERMS_LENGTH && (
                  <span className={'extraChipsCount'}>
                    +{taxonomyTerms.length - TAXONOMY_TERMS_LENGTH}
                  </span>
                )}
              </div>
            </Styled.tagsWrapper>
            <Link href={`/library/document/${documentId}`} passHref>
              <Styled.readMore>
                <span>Read more</span>
                <Icon src={Icons.ChevronRightBold} size={IconSize.small} color={color.theme.blue} />
              </Styled.readMore>
            </Link>
          </Styled.bottomRow>
        </Styled.boxContent>
      </Box>
    </Styled.searchResult>
  );
};

export default LibraryItem;
