type Locale = 'en' | 'fr' | 'ar';

export const defaultLocale: Locale = (process.env.NEXT_PUBLIC_LOCALE as Locale) || 'en';

const messages: Record<Locale, Record<string, string>> = {
  en: {
    legal_disclosure_title: 'Legal & Privacy',
    legal_disclosure_text: 'Investing involves risk. This platform is for informational purposes only.',
    crypto_restricted: 'Cryptocurrency investment features are disabled in your region.',
  },
  fr: {
    legal_disclosure_title: 'Mentions légales et confidentialité',
    legal_disclosure_text: 'Investir comporte des risques. Cette plateforme est fournie à titre informatif.',
    crypto_restricted: "Les fonctionnalités liées aux cryptomonnaies sont désactivées dans votre région.",
  },
  ar: {
    legal_disclosure_title: 'القانونية والخصوصية',
    legal_disclosure_text: 'الاستثمار ينطوي على مخاطر. هذه المنصة للغرض الإعلامي فقط.',
    crypto_restricted: 'ميزات العملات المشفرة معطلة في منطقتك.',
  },
};

export function t(key: string, locale: Locale = defaultLocale) {
  return messages[locale]?.[key] || messages.en[key] || key;
}

export type { Locale };
