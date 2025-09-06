import { api, setAuthToken } from "@/lib/api";
import { User, ApiResponse, LoginRequest } from "@/types";

export const authService = {
  async login(credentials: LoginRequest) {
    const response = await api.post<ApiResponse<User>>("/login", credentials);
    
    // localStorage.setItem('access_token', response.data.access_token);
    // localStorage.setItem('refresh_token', response.data.refresh_token);
    setAuthToken(response.data.access_token);

    localStorage.setItem('user', JSON.stringify(response.data.user));
    return response.data.user;
  },

  async logout(): Promise<void> {
    await api.post("/logout");
    setAuthToken();
  },

  async me(): Promise<User> {
    const response = await api.get<ApiResponse<User>>("/me");
    console.log(response)
    return response.data.data;
  },
};
