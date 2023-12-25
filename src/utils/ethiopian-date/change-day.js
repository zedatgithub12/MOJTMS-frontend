import CheckLeapYear from './check-leap';

//this is a list of ethiopian date and its equivalent date difference in from the gregorian calendar
const daysMap = {
    1: 10,
    2: 10,
    3: 10,
    4: 10,
    5: 8,
    6: 7,
    7: 9,
    8: 8,
    9: 8,
    10: 7,
    11: 7,
    12: 6
};

const pagumedates = {
    6: 1,
    7: 2,
    8: 3,
    9: 4,
    10: 5,
    11: 6
};
const ChangeDay = (givenyear, month, day) => {
    let isLeap = CheckLeapYear(givenyear);

    let etday = 0;
    if (month === 13 && isLeap) {
        etday = pagumedates[day];
        return etday;
    } else {
        return daysMap[month];
    }
};

export default ChangeDay;
