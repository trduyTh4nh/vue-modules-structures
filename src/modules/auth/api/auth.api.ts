import type { LoginRequestDto, LoginResponseDto, User } from "../types";
// import { http } from "@/core/api/http";

export const authApi = {
  login(payload: LoginRequestDto): Promise<LoginResponseDto> {
    console.log(payload);
    return Promise.resolve({
      accessToken: "token",
      user: { id: "1", username: "admin", email: "[EMAIL_ADDRESS]" },
    });
    // return http.post<LoginResponseDto>("/auth/login", payload);
  },

  profile(): Promise<User> {
    return Promise.resolve({
      id: "1",
      username: "admin",
      email: "[EMAIL_ADDRESS]",
    });
    // return http.get("/auth/me");
  },
};
