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
    },
  });
};

interface RenderOptions {
  store?: ReturnType<typeof createTestStore>;
}

export const renderWithProviders = (
  component: React.ReactElement,
  options: RenderOptions = {}
) => {
  const { store = createTestStore() } = options;

  return render(
    <Provider store={store}>
      <BrowserRouter>{component}</BrowserRouter>
    </Provider>
  );
};

// Re-export everything from testing-library/react
export * from "@testing-library/react";
