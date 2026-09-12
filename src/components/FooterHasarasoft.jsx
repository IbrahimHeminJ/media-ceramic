import React from 'react';
import { useTranslation } from 'react-i18next';
import Hasarasoft from "../assets/HasaraSoft.svg";

const Footer = () => {
    const { t } = useTranslation();
    return (
        <footer className='text-[#A89885] flex flex-col items-center bg-[#FDFAF6]'>
            <p className="text-sm">{t('footer.poweredBy', 'Powered By')}</p>
            <a href="https://t.me/ibrahim_hemin" className='w-40 md:w-48 h-auto my-2'><img src={Hasarasoft} alt="HasaraSoft" className="w-full h-auto" /></a>
        </footer>
    );
}

export default Footer;