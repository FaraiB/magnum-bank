import { useTranslation } from "react-i18next";

export const useI18n = () => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(
      i18n.language === "pt-BR" ? "pt-BR" : "en-US",
      {
        style: "currency",
        currency: "BRL",
      }
    ).format(amount);
  };

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return new Intl.DateTimeFormat(
      i18n.language === "pt-BR" ? "pt-BR" : "en-US",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    ).format(dateObj);
  };

  return {
    t,
    i18n,
    changeLanguage,
    formatCurrency,
    formatDate,
    currentLanguage: i18n.language,
    isPortuguese: i18n.language === "pt-BR",
  };
};
