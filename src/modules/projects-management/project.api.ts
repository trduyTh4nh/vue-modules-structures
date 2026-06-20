import { apiInstance } from "@/core/api";

interface ProjectParams {
  offset: number;
  limit: number;
}

export const projectApi = {
  getProjects: async (params: ProjectParams) => {
    try {
      const response = await apiInstance.get("/post/test", { params: params });
      return response.data.metadata
    } catch (error) {
      console.error("Error API: ", error);
    }
  },
};
