import fetchJson from '@dods-ui/lib/fetchJson';
import {
  CreateEditorialRecordResponse,
  EditorialContentSourcesResponse,
  EditorialInformationTypesResponse,
  EditorialRecord,
  EditorialRecordListResponse,
  EditorialRecordResponse,
  EditorialRecordStatuses,
  MetadataSelection,
} from '@dods-ui/pages/editorial/editorial.models';
import { Api, BASE_URI } from '@dods-ui/utils/api';

export const getRecords = async (): Promise<EditorialRecordListResponse | undefined> => {
  const response = await fetchJson<EditorialRecordListResponse>(
    `${BASE_URI}${Api.EditorialRecords}`,
    {
      method: 'GET',
    },
  );
  if (response.data?.results) {
    return response as EditorialRecordListResponse;
  }
};

export const createRecord = async (
  payload: EditorialRecord,
): Promise<CreateEditorialRecordResponse> => {
  const response = await fetchJson<CreateEditorialRecordResponse>(
    `${BASE_URI}${Api.EditorialRecords}`,
    {
      method: 'POST',
      body: JSON.stringify(payload),
    },
  );

  return response as CreateEditorialRecordResponse;
};

export const getEditorialPreview = async (documentID: string): Promise<EditorialRecordResponse> => {
  // not sure if this should come from the local data or server
  const response = await fetchJson(`${BASE_URI}${Api.EditorialRecords}`, {
    method: 'GET',
    body: documentID,
  });

  return response as unknown as EditorialRecordResponse;
};

export const deleteEditorialRecord = async (
  documentID: string,
): Promise<EditorialRecordResponse> => {
  const response = await fetchJson(`${BASE_URI}${Api.EditorialRecords}/${documentID}`, {
    method: 'DELETE',
  });

  return response as unknown as EditorialRecordResponse;
};

export const setEditorialPublishState = async (
  documentId: string,
): Promise<EditorialRecordResponse> => {
  // TODO: call publish API
  const response = await fetchJson(`${BASE_URI}${Api.EditorialRecords}/${documentId}`, {
    method: 'POST',
  });

  return response as unknown as EditorialRecordResponse; // No idea what the response is yet
};

export const scheduleEditorial = async (payload: {
  // Payload contract not confirmed
  date: string;
  documentId: string;
}): Promise<EditorialRecordResponse> => {
  const response = await fetchJson(`${BASE_URI}${Api.EditorialRecords}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });

  return response as unknown as EditorialRecordResponse; // No idea what the response is yet
};

export const getMetadataSelections = async (): Promise<MetadataSelection> => {
  const dataSources = await Promise.all([
    fetchJson<EditorialContentSourcesResponse>(`${BASE_URI}${Api.EditorialContentSources}`, {
      method: 'GET',
    }),
    fetchJson<EditorialInformationTypesResponse>(`${BASE_URI}${Api.EditorialInfoTypes}`, {
      method: 'GET',
    }),
    fetchJson<EditorialRecordStatuses>(`${BASE_URI}${Api.EditorialStatus}`, { method: 'GET' }),
  ]);

  const selections = ['contentSources', 'informationTypes', 'status'].map((type) => {
    const valuesFromDataSource: Record<string, any> | undefined = dataSources.find((value) =>
      (value || {}).hasOwnProperty(type),
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
