import { api, csrf } from "@/lib/api";
import { User, ApiResponse, LoginRequest } from "@/types";

export const authService = {
  async login(credentials: LoginRequest) {
    const response = await api.post<ApiResponse<User>>("/login", credentials);
    
    localStorage.setItem('access_token', response.data.access_token);
    localStorage.setItem('refresh_token', response.data.refresh_token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    console.log(response.data.user)
    return response.data.user;
  },

  async logout(): Promise<void> {
    await api.post("/logout");
  },

  // async me(): Promise<User> {
  //   const response = await api.get<ApiResponse<User>>("/me");
  //   return response.data.data;
  // },
};
