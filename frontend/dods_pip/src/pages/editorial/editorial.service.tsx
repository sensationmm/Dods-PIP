import fetchJson from '@dods-ui/lib/fetchJson';
import {
  CreateEditorialRecordResponse,
  DeleteEditorialRecordResponse,
  EditorialContentSourcesResponse,
  EditorialInformationTypesResponse,
  EditorialRecord,
  EditorialRecordListResponse,
  EditorialRecordPreviewResponse,
  EditorialRecordResponse,
  EditorialRecordStatuses,
  MetadataSelection,
  PublishEditorialRecordResponse,
  UpdateEditorialRecordResponse,
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

export const updateRecord = async (
  documentID: string,
  payload: EditorialRecord,
): Promise<UpdateEditorialRecordResponse> => {
  const response = await fetchJson<UpdateEditorialRecordResponse>(
    `${BASE_URI}${Api.EditorialRecords}/${documentID}/document`,
    {
      method: 'PUT',
      body: JSON.stringify(payload),
    },
  );

  return response as UpdateEditorialRecordResponse;
};

export const getEditorialPreview = async (
  documentID: string,
): Promise<EditorialRecordPreviewResponse> => {
  const response = await fetchJson<EditorialRecordPreviewResponse>(
    `${BASE_URI}${Api.EditorialRecords}/${documentID}/document`,
    {
      method: 'GET',
    },
  );
  return response as EditorialRecordPreviewResponse;
};

export const setEditorialPublishState = async (
  documentId: string,
): Promise<PublishEditorialRecordResponse> => {
  const response = await fetchJson<PublishEditorialRecordResponse>(
    `${BASE_URI}${Api.EditorialRecords}/${documentId}/publish`,
    {
      method: 'POST',
    },
  );
  return response as PublishEditorialRecordResponse;
};

export const deleteEditorialRecord = async (
  documentID: string,
): Promise<DeleteEditorialRecordResponse> => {
  const response = await fetchJson<DeleteEditorialRecordResponse>(
    `${BASE_URI}${Api.EditorialRecords}/${documentID}`,
    {
      method: 'DELETE',
    },
  );
  return response as DeleteEditorialRecordResponse;
};

export const scheduleEditorial = async (payload: {
  // Payload contract not confirmed
  cron: string;
  documentId: string;
}): Promise<EditorialRecordResponse> => {
  const result = await fetchJson(
    `${BASE_URI}${Api.EditorialRecords}/${payload.documentId}/schedule`,
    {
      method: 'POST',
      body: JSON.stringify(payload),
    },
  );

  return result as unknown as EditorialRecordResponse; // No idea what the response is yet
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
