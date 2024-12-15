export interface LanguageOption {
  value: 'en' | 'id';
  label: string;
}

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  { value: 'en', label: 'English' },
  { value: 'id', label: 'Indonesia' }
];

export const CATEGORY_TRANSLATIONS = {
  en: {
    IF: 'If',
    BOOLEAN: 'Boolean',
    LOOPS: 'Loops',
    MATH: 'Math',
    TEXT: 'Text',
    LISTS: 'Lists',
    VARIABLES: 'Variables',
    FUNCTIONS: 'Functions'
  },
  id: {
    IF: 'Percabangan',
    BOOLEAN: 'Boolean',
    LOOPS: 'Perulangan',
    MATH: 'Matematika',
    TEXT: 'Teks',
    LISTS: 'Array',
    VARIABLES: 'Variabel',
    FUNCTIONS: 'Fungsi'
  }
};