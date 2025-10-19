/* eslint-disable @typescript-eslint/no-explicit-any */
import { t } from '../../utils/i18n';
import { isFeatureEnabled } from '../../config/featureFlags';

type Props = { region?: string; locale?: any };

export default function LegalDisclosure({ region, locale }: Props) {
  const cryptoAllowed = isFeatureEnabled('crypto', region);
  return (
    <div className="p-4 text-sm text-gray-600">
      <h3 className="font-semibold">{t('legal_disclosure_title', locale)}</h3>
      <p className="mt-2">{t('legal_disclosure_text', locale)}</p>
      {!cryptoAllowed && (
        <div className="mt-2 text-red-600">{t('crypto_restricted', locale)}</div>
      )}
    </div>
  );
}
