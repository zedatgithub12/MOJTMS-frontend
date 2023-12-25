import CheckLeapYear from './check-leap';
const monthsMap = {
    9: 1,
    10: 2,
    11: 3,
    12: 4,
    1: 5,
    2: 6,
    3: 7,
    4: 8,
    5: 9,
    6: 10,
    7: 11,
    8: 12
};

const ChangeMonth = (givenyear, month, day) => {
    let year = CheckLeapYear(givenyear);

    if (year) {
        if (month === 9 && day >= 6 && day < 12) {
            const etmonth = 13;
            return etmonth;
        } else {
            const etmonth = monthsMap[month];
            return etmonth;
        }
    } else {
        if (month === 9 && day >= 6 && day < 11) {
            const etmonth = 13;
            return etmonth;
        } else {
            const etmonth = monthsMap[month];
            return etmonth;
        }
    }
};

export default ChangeMonth;
