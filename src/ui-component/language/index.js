import React from 'react';
import { Select, MenuItem } from '@mui/material';
import { useTranslation } from 'react-i18next';

const Language = () => {
    let active_lang = localStorage.getItem('lang');
    const { t, i18n } = useTranslation();

    const changeLanguage = (language) => {
        i18n.changeLanguage(language);
    };

    const changeLang = (country, title) => {
        changeLanguage(country);
        localStorage.setItem('lang', country);
    };

    return (
        <Select value={active_lang} sx={{ border: 'none', marginRight: 4 }}>
            <MenuItem value="am" onClick={() => changeLang('am', '🇪🇹 Amharic')}>
                🇪🇹 {t('Amharic')}
            </MenuItem>
            <MenuItem value="en" onClick={() => changeLang('en', '🇺🇸 English')}>
                🇺🇸 {t('English')}
            </MenuItem>
        </Select>
    );
};

export default Language;
