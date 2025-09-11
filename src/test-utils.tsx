import React from "react";
import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import userSlice, { type Transaction } from "./redux/userSlice";

import { I18nextProvider } from "react-i18next";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import testTranslations from "./i18n/locales/test.json";

i18n.use(initReactI18next).init({
  lng: "en",
  fallbackLng: "en",
  resources: {
    en: {
      translation: testTranslations,
    },
  },
});

// Support both store and preloadedState approaches
interface TestRenderOptions {
  store?: any; // For existing tests that create their own stores
  preloadedState?: {
    user?: {
      id: string | null;
      name: string | null;
      balance: number;
      transactions: any[];
    };
  };
}

const createTestStore = (preloadedState?: any) => {
  return configureStore({
    reducer: {
      user: userSlice,
    },
    preloadedState,
  } as any);
};

export const renderWithProviders = (
  component: React.ReactElement,
  options: TestRenderOptions = {}
) => {
  const { store, preloadedState } = options;

  // Use provided store OR create one with preloadedState OR create default empty store
  const testStore = store || createTestStore(preloadedState);

  return render(
    <Provider store={testStore}>
      <I18nextProvider i18n={i18n}>
        <BrowserRouter>{component}</BrowserRouter>
      </I18nextProvider>
    </Provider>
  );
};

// New function to create a store with transactions
export const createStoreWithTransactions = (transactions: Transaction[]) => {
  const preloadedState = {
    user: {
      id: "test-user-id",
      name: "Test User",
      balance: 0, // This value doesn't matter for this test
      transactions: transactions,
    },
  };

  return createTestStore(preloadedState);
};

// Re-export everything from testing-library/react
export * from "@testing-library/react";
