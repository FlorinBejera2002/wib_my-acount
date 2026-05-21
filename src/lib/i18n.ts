import de from '@/locales/de.json'
import en from '@/locales/en.json'
import fr from '@/locales/fr.json'
import hu from '@/locales/hu.json'
import ro from '@/locales/ro.json'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const SUPPORTED = ['ro', 'en', 'hu', 'fr', 'de']

function getInitialLanguage(): string {
  try {
    const raw = localStorage.getItem('asigurari-auth')
    if (raw) {
      const parsed = JSON.parse(raw)
      const lang = parsed?.state?.user?.preferences?.language
      if (SUPPORTED.includes(lang)) return lang
    }
  } catch {
    // ignore
  }
  return 'ro'
}

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    hu: { translation: hu },
    ro: { translation: ro },
    fr: { translation: fr },
    de: { translation: de }
  },
  lng: getInitialLanguage(),
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false
  }
})

export default i18n
