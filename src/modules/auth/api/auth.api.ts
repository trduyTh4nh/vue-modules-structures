import type { LoginRequestDto, LoginResponseDto, User } from "../types";

// modules/auth/api/auth.api.ts
import { apiInstance, publicApiInstance } from "@/core/api/instance";
// import type { LoginRequestDto, LoginResponseDto, User } from "../types";
import { executeRequest, type ApiResult } from "@/core/operation";
import { logger } from "@/shared/common/utils/logger";

// Mock data for development (remove when real API is ready)
const MOCK_USER = {
  id: "1",
  username: "admin",
  email: "admin@example.com",
};

const MOCK_TOKEN = "mock-jwt-token-12345";

export const authApi = {
  login: async (credentials: LoginRequestDto): Promise<LoginResponseDto> => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    // Mock validation
    if (
      credentials.username === "admin" &&
      credentials.password === "admin123"
    ) {
      return {
        accessToken: MOCK_TOKEN,
        user: MOCK_USER,
      };
    }

    logger.warn("Login failed (MOCK)", { username: credentials.username });
    throw new Error("Invalid credentials");

    // try {
    //   const response = await publicApiInstance.post<LoginResponseDto>('/auth/login', credentials)
    //   logger.apiResponse(response.status, '/auth/login', { user: response.data.user })
    //   return response.data
    // } catch (error) {
    //   logger.apiError(500, '/auth/login', error as Error, { credentials: { username: credentials.username } })
    //   throw error
    // }
  },

  profile: async (): Promise<User> => {
    // Mock implementation
    await new Promise((resolve) => setTimeout(resolve, 300));
    return MOCK_USER;

    // const response = await apiInstance.get<User>('/auth/profile')
    // return response.data
  },
};
