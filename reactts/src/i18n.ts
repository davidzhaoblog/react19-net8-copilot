import i18n from 'i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
//import moment, { unitOfTime } from 'moment';
import dayjs, { Dayjs, UnitTypeLong, OpUnitType, QUnitType } from 'dayjs';

// We are relying on i18next for Translation when display: 
// 1. number
// 2. double
// 3. currency
// 4. DateTime
// TODO: Steps to Add a new language/locales
// 1. Add a new folder in /public/locales with the language/locales name
// 2. Add a new entry in "supportedLngs" field
// 3. Add a new "if" in "getCurrency(language: string)" method to return currency

export const supportedLngs = ['en', 'es', 'fr'];
export const getCurrency = (language: string): string => {
    if(language === 'en') {
        return "CAD";
    }
    if(language === 'es') {
        return "EUR";
    }
    if(language === 'fr') {
        return "CAD";
    }
    return "CAD"
}

i18n
    // load translation using http -> see /public/locales
    // learn more: https://github.com/i18next/i18next-http-backend
    .use(Backend)
    // detect user language
    // learn more: https://github.com/i18next/i18next-browser-languageDetector
    .use(LanguageDetector)
    // pass the i18n instance to react-i18next.
    .use(initReactI18next)
    // init i18next
    // for all options read: https://www.i18next.com/overview/configuration-options
    .init({
        lng: "en",
        supportedLngs: supportedLngs,
        fallbackLng: 'en',
        lowerCaseLng: true,
        debug: false,
        fallbackNS: false,
        interpolation: {
            escapeValue: false, // not needed for react as it escapes by default
        }
    });

// https://www.i18next.com/translation-function/formatting
export const i18nFormats = {
    dateTime: {
        format: "{{val, datetime}}",
        dateShort: {
            dateStyle: 'short',
        },
        dateLong: {
            dateStyle: 'long',
        },
        dateFull: {
            dateStyle: 'full',
        },
        dateTimeShort: {
            dateStyle: 'short', timeStyle: 'short',
        },
        dateTimeLong: {
            dateStyle: 'long', timeStyle: 'long',
        },
        dateTimeFull: {
            dateStyle: 'full', timeStyle: 'full',
        },
        timeShort: {
            timeStyle: "short",
        },
        dateMonthOnly: {
            month: 'long'
        },
        dateYearMonth: {
            year: 'numeric', month: 'long',
        },
        dateDayInMonthOnly: {
            day: 'numeric',
        },
        dateWeekDayOnly: {
            weekday: 'long',
        },
    },
    number: {
        format: "{{val, number}}",
    },
    double: {
        format: "{{val, number(minimumFractionDigits: 2)}}",
    },
    currency: {
        format: "{{val, currency}}",
    },
};

export const getIntlRelativeTimeFormat = (a: string | Dayjs, b: string | Dayjs) : string => {
    const intlRelativeTimeOption = getIntlRelativeTimeOption(a, b);
    //console.log(intlRelativeTimeOption);
    return `{{val, relativetime(${intlRelativeTimeOption})}}`
}

export const getDateTimeDiff = (a: string | Dayjs, b: string | Dayjs) : number => {
    const intlRelativeTimeOption = getIntlRelativeTimeOption(a, b);
    //console.log(intlRelativeTimeOption);
    return dayjs(a).diff(dayjs(b),  intlRelativeTimeOption);
}

//"year", "quarter", "month", "week", "day", "hour", "minute", "second".
export const getIntlRelativeTimeOption = (a: string | Dayjs, b: string | Dayjs) : UnitTypeLong | OpUnitType | QUnitType => {
    const diffByMinutes = dayjs(a).diff(dayjs(b), "minutes");
    //console.log("diffByMinutes", diffByMinutes);
    if(Math.abs(diffByMinutes) <= 60) // minutes when in 1 hour
        return "minute";
    if(Math.abs(diffByMinutes) <= 1440) // hours when in 1 day
        return "hour"
    if(Math.abs(diffByMinutes) <= 10080) // days when in 1 week
        return "day";
    if(Math.abs(diffByMinutes) <= 73200) // weeks when in 1 month/30 days
        return "week";
    if(Math.abs(diffByMinutes) <= 129600) // weeks when in 1 quarter/90 days
        return "month";
    if(Math.abs(diffByMinutes) <= 525600) // weeks when in 1 quarter/90 days
        return "quarter";

    return "year";
}

export default i18n;