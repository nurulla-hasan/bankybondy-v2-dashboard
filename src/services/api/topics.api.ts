import { apiClient } from "@/lib/api-client";
import type {
  ApiResponse,
  CreateTopicPayload,
  Topic,
  TopicsPage,
  TopicsQuery,
  UpdateTopicPayload,
} from "@/types";

/** Drop empty params so ofetch never sends `?searchTerm=undefined`. */
function toQueryParams(query: TopicsQuery) {
  return Object.fromEntries(
    Object.entries(query).filter(([, value]) => value !== undefined && value !== ""),
  );
}

/** The topic listing returns `totalCount`; DataTable expects `total`. */
interface RawTopicsPage {
  meta: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
  };
  result: Topic[];
}

/** Multipart shape required by `uploadFile` + `parseMultipartData`. */
function buildTopicFormData(name: string, image?: File | null) {
  const formData = new FormData();
  formData.append("data", JSON.stringify({ name }));
  if (image) formData.append("topic_image", image);
  return formData;
}

/** GET /topic/all-topics — paginated, searchable topic catalog (staff). */
export async function getTopics(query: TopicsQuery) {
  const response = await apiClient<ApiResponse<RawTopicsPage>>(
    "/topic/all-topics",
    { query: toQueryParams(query) },
  );
  const { meta, result } = response.data;
  const data: TopicsPage = {
    result,
    meta: {
      page: meta.page,
      limit: meta.limit,
      total: meta.totalCount,
      totalPages: meta.totalPages,
    },
  };

  return { ...response, data };
}

/** POST /topic/create-topic — multipart with `data` JSON + `topic_image`. */
export function createTopic({ name, image }: CreateTopicPayload) {
  return apiClient<ApiResponse<Topic>>("/topic/create-topic", {
    method: "POST",
    body: buildTopicFormData(name, image),
  });
}

/** PATCH /topic/update-topic/:topicId — image is optional on update. */
export function updateTopic(topicId: string, { name, image }: UpdateTopicPayload) {
  return apiClient<ApiResponse<Topic>>(`/topic/update-topic/${topicId}`, {
    method: "PATCH",
    body: buildTopicFormData(name, image),
  });
}

/** DELETE /topic/delete-topic/:topicId — soft delete on the server. */
export function deleteTopic(topicId: string) {
  return apiClient<ApiResponse<Topic>>(`/topic/delete-topic/${topicId}`, {
    method: "DELETE",
  });
}
