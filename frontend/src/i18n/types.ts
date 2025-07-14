export type Locale = "pl" | "en";

export interface Translations {
  [key: string]: string;
}

export interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}
