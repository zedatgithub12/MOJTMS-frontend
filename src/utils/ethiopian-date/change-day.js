//this is a list of ethiopian date and its equivalent date difference in from the gregorian calendar
const daysMap = {
    1: 10,
    2: 10,
    3: 10,
    4: 10,
    5: 9,
    6: 8,
    7: 9,
    8: 8,
    9: 8,
    10: 7,
    11: 7,
    12: 6
};

const ChangeDay = (month) => {
    return daysMap[month];
};

export default ChangeDay;
