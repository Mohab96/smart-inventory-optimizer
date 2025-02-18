import {
  setCredentials,
  setLoading,
  setError,
  logout as logoutUser,
} from "../features/authSlice";

export const login = (credentials) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await fetch(
      "https://smart-inventory-optimizer.vercel.app/api/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      }
    );

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }
    dispatch(
      setCredentials(response.headers.get("Authorization").split(" ")[1])
    );
  } catch (error) {
    dispatch(setError(error.message));
  } finally {
    dispatch(setLoading(false));
  }
};

export const logout = () => (dispatch) => {
  dispatch(logoutUser());
};
