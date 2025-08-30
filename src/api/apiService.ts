import axios from "axios";

// Base URL for the mock API
const API = axios.create({
  baseURL: "http://localhost:3001",
});

// A simple authentication function
export const login = async (cpf: string, password: string) => {
  try {
    const response = await API.get(`/users?cpf=${cpf}&password=${password}`);
    if (response.data.length > 0) {
      const user = response.data[0];
      const token = `mock-jwt-token-for-${user.id}`; // Simulate a unique token
      // Store token for subsequent requests
      API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      return { user, token };
    }
    throw new Error("Invalid credentials");
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

// Function to get user data by ID
export const getUserData = async (userId: string) => {
  const response = await API.get(`/users/${userId}`);
  return response.data;
};

// Function to handle transactions
export const createTransaction = async (transactionData: any) => {
  const response = await API.post("/transactions", transactionData);
  return response.data;
};

// Function to set the auth token for initial app load
export const setAuthToken = (token: string | null) => {
  if (token) {
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete API.defaults.headers.common["Authorization"];
  }
};
