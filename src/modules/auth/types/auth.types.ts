export interface LoginRequestDto {
  username: string;
  password: string;
}

export interface LoginResponseDto {
  accessToken: string;
  user: User;
}

export interface User {
  id: string;
  username: string;
  email: string;
}
