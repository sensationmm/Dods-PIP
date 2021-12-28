import {
  CreateEditorialRecordParametersV2,
  EditorialRecordOutput,
} from '@dods-services/editorial-workflow/src/domain';
import fetchJson from '@dods-ui/lib/fetchJson';
import { Api, BASE_URI } from '@dods-ui/utils/api';

export type metadataSelectionKey = 'contentSources' | 'informationTypes' | 'status';
export type MetadataSelection = Record<metadataSelectionKey, { label: string; value: string }[]>;

export const createRecord = async (
  payload: CreateEditorialRecordParametersV2,
): Promise<EditorialRecordOutput> => {
  const results = await fetchJson(`${BASE_URI}${Api.EditorialRecords}`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  return results.data as unknown as EditorialRecordOutput;
};

export const getMetadataSelections = async (): Promise<MetadataSelection> => {
  const dataSources = await Promise.all([
    fetchJson(`${BASE_URI}${Api.EditorialContentSources}`, { method: 'GET' }),
    fetchJson(`${BASE_URI}${Api.EditorialInfoTypes}`, { method: 'GET' }),
    fetchJson(`${BASE_URI}${Api.EditorialStatus}`, { method: 'GET' }),
  ]);

  const selections = ['contentSources', 'informationTypes', 'status'].map((type) => {
    const valuesFromDataSource: Record<string, any> | undefined = dataSources.find((value) =>
      value.hasOwnProperty(type),
    );

    if (!valuesFromDataSource) return { [type]: [] } as unknown as MetadataSelection;

    return {
      [type]: valuesFromDataSource[type].map((data: Record<string, string>) => {
        // inconsistent id prop naming convention on backend
        return { label: data.name, value: data.uuid || data.id };
      }) as MetadataSelection,
    };
  }) as MetadataSelection[];

  return selections.reduce((acc, curr) => ({ ...acc, ...curr }), {}) as MetadataSelection;
};
