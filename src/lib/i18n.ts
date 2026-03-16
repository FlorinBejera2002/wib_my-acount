import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from '@/locales/en.json'
import ro from '@/locales/ro.json'

function getInitialLanguage(): string {
  try {
    const raw = localStorage.getItem('asigurari-auth')
    if (raw) {
      const parsed = JSON.parse(raw)
      const lang = parsed?.state?.user?.preferences?.language
      if (lang === 'ro' || lang === 'en') return lang
    }
  } catch {
    // ignore
  }
  return 'ro'
}

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ro: { translation: ro }
  },
  lng: getInitialLanguage(),
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false
  }
})

export default i18n
