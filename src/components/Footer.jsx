import React from 'react';
import { useTranslation } from 'react-i18next';
import FooterHasarasoft from './FooterHasarasoft';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <>
      <footer className="text-center p-6 sm:p-8 text-[#A89885] text-xs sm:text-sm bg-[#FDFAF6]">
        <FooterHasarasoft />
        <p>{t('footer.copyright', '© 2026 TERRA TILE CO. — Warm floors, beautiful walls. All rights reserved.')}</p>
      </footer>
    </>
  );
}
