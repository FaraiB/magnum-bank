import axios from "axios";

// Base URL for the mock API
const API = axios.create({
  baseURL: "http://localhost:3001",
});

// A simple authentication function
export const login = async (cpf: string, password: string) => {
  try {
    const response = await API.get(`/users?cpf=${cpf}&password=${password}`);
    // Check if the user was found and return a token (in a real app, you'd get this from the server)
    if (response.data.length > 0) {
      return {
        user: response.data[0],
        token: "mock-jwt-token",
      };
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
