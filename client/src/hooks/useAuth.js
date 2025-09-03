import { useRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";
import { userState } from "../state/atoms";
import ApiService from "../services/apiService";
import { toast } from "react-hot-toast";

export const useAuth = () => {
  const [user, setUser] = useRecoilState(userState);
  const navigate = useNavigate();

  const login = async (credentials) => {
    try {
      setUser((prev) => ({ ...prev, loading: true }));

      const response = await ApiService.login(credentials);

      setUser({
        isAuthenticated: true,
        user: response.user,
        token: response.token,
        loading: false,
      });

      localStorage.setItem("eduvi_token", response.token);
      localStorage.setItem("eduvi_user", JSON.stringify(response.user));

      toast.success("Login successful!");
      return response;
    } catch (error) {
      setUser((prev) => ({ ...prev, loading: false }));
      toast.error(error.message || "Login failed");
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      setUser((prev) => ({ ...prev, loading: true }));

      const response = await ApiService.register(userData);

      setUser({
        isAuthenticated: true,
        user: response.user,
        token: response.token,
        loading: false,
      });

      localStorage.setItem("eduvi_token", response.token);
      localStorage.setItem("eduvi_user", JSON.stringify(response.user));

      toast.success("Registration successful!");
      return response;
    } catch (error) {
      setUser((prev) => ({ ...prev, loading: false }));
      toast.error(error.message || "Registration failed");
      throw error;
    }
  };

  const logout = async () => {
    try {
      await ApiService.logout();
    } catch (error) {
      console.error("Logout API call failed:", error);
    } finally {
      setUser({
        isAuthenticated: false,
        user: null,
        token: null,
        loading: false,
      });

      localStorage.removeItem("eduvi_token");
      localStorage.removeItem("eduvi_user");

      toast.success("Logged out successfully");
      navigate("/");
    }
  };

  const updateProfile = async (userData) => {
    try {
      const response = await ApiService.updateProfile(userData);

      setUser((prev) => ({
        ...prev,
        user: { ...prev.user, ...response.user },
      }));

      localStorage.setItem("eduvi_user", JSON.stringify(response.user));
      toast.success("Profile updated successfully");

      return response;
    } catch (error) {
      toast.error(error.message || "Failed to update profile");
      throw error;
    }
  };

  const checkAuthStatus = async () => {
    const token = localStorage.getItem("eduvi_token");
    const userData = localStorage.getItem("eduvi_user");

    if (token && userData) {
      try {
        // Verify token is still valid
        const profile = await ApiService.getProfile();

        setUser({
          isAuthenticated: true,
          user: profile.user,
          token: token,
          loading: false,
        });
      } catch (error) {
        // Token is invalid, clear storage
        localStorage.removeItem("eduvi_token");
        localStorage.removeItem("eduvi_user");

        setUser({
          isAuthenticated: false,
          user: null,
          token: null,
          loading: false,
        });
      }
    }
  };

  return {
    user: user.user,
    isAuthenticated: user.isAuthenticated,
    loading: user.loading,
    login,
    register,
    logout,
    updateProfile,
    checkAuthStatus,
  };
};
