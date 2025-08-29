import React from "react";
import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./redux/userSlice";

const createTestStore = () => {
  return configureStore({
    reducer: {
      user: userSlice,
      // Add other slices as needed
    },
  });
};

export const renderWithProviders = (component: React.ReactElement) => {
  const testStore = createTestStore();

  return render(
    <Provider store={testStore}>
      <BrowserRouter>{component}</BrowserRouter>
    </Provider>
  );
};

// Re-export everything from testing-library/react
export * from "@testing-library/react";
