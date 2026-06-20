// modules/home/services/home.service.ts
import { publicApiInstance } from "@/core/api/instance";
import { executeRequest, type ApiResult } from "@/core/operation";
import { logger } from "@/shared/common/utils/logger";

export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

export const homeService = {
  // Get single post from JSONPlaceholder
  getPost: async (id: number = 1): Promise<Post> => {
    try {
      logger.apiRequest("GET", `/posts/${id}`);
      const response = await publicApiInstance.get<Post>(
        `https://jsonplaceholder.typicode.com/posts/${id}`,
      );
      logger.apiResponse(response.status, `/posts/${id}`, response.data);
      return response.data;
    } catch (error) {
      logger.apiError(500, `/posts/${id}`, error as Error);
      throw error;
    }
  },

  // Get posts with Result pattern
  getPostWithResult: async (id: number = 1): Promise<ApiResult<Post>> => {
    return executeRequest<Post>(() =>
      publicApiInstance.get(`https://jsonplaceholder.typicode.com/posts/${id}`),
    );
  },

  // Get todo list
  getTodo: async (id: number = 1): Promise<Todo> => {
    try {
      logger.apiRequest("GET", `/todos/${id}`);
      const response = await publicApiInstance.get<Todo>(
        `https://jsonplaceholder.typicode.com/todos/${id}`,
      );
      logger.apiResponse(response.status, `/todos/${id}`, response.data);
      return response.data;
    } catch (error) {
      logger.apiError(500, `/todos/${id}`, error as Error);
      throw error;
    }
  },

  // Get multiple posts
  getMultiplePosts: async (ids: number[]): Promise<Post[]> => {
    const promises = ids.map((id) => homeService.getPost(id));
    const results = await Promise.all(promises);
    logger.info("Multiple posts fetched", { count: results.length, ids });
    return results;
  },
};
