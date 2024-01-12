import ChangeDay from './change-day';
import ChangeMonth from './change-month';
import ChangeYear from './change-year';

const pagumedates = {
    6: 1,
    7: 2,
    8: 3,
    9: 4,
    10: 5,
    11: 6
};

const EtDate = (gc_date) => {
    var year = gc_date.slice(0, 4);
    var checkMonth = gc_date.slice(5, 7);
    var month = checkMonth > 9 ? checkMonth : gc_date.slice(6, 7);
    var checkDay = gc_date.slice(8, 10);
    var day = checkDay > 9 ? checkDay : gc_date.slice(9, 10);
    var et_month = ChangeMonth(year, month, day);

    var et_days;

    if (et_month == 13) {
        et_days = pagumedates[day];
    } else {
        let difference = ChangeDay(et_month);
        et_days = day -= difference; //get the date difference between the GC and EC

        if (et_days < 0) {
            let numsofday = 30;

            if (et_month > 1) {
                et_month = et_month -= 1;
                et_days = numsofday -= Math.abs(et_days);
            } else {
                et_month = 12;
            }
        }
    }

    const et_year = ChangeYear(year, et_month, et_days); // we will convert the ethiopian date after the ethiopian month and day is acquaired

    const formattedDate = `${et_days < 10 ? '0' + et_days : et_days}-${et_month < 10 ? '0' + et_month : et_month}-${et_year}`;
    return formattedDate;
};

export default EtDate;
