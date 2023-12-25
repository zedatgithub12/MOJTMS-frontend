import CheckLeapYear from './check-leap';

const ChangeYear = (givenyear, month) => {
    let year = CheckLeapYear(givenyear);

    //the month is already converted to ethiopian month format so
    //we can directly use the condition as it can be utilized to return the exact ethiopian year
    if (year) {
        if (month >= 1) {
            return (givenyear -= 7);
        } else {
            return (givenyear -= 8);
        }
    } else {
        if (month > 1) {
            return (givenyear -= 7);
        } else {
            return (givenyear -= 8);
        }
    }
};

export default ChangeYear;
