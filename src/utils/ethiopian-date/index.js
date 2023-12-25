import ChangeDay from './change-day';
import ChangeMonth from './change-month';
import ChangeYear from './change-year';

const EtDate = (gc_date) => {
    var year = gc_date.slice(0, 4);
    var month = gc_date.slice(5, 7);
    var day = gc_date.slice(8, 10);

    let et_month = ChangeMonth(year, month, day);
    const et_year = ChangeYear(year, et_month);
    let difference = ChangeDay(year, et_month, day);

    let et_day = (day -= difference);

    if (et_day < 0) {
        let numsofday = 30;
        et_day = numsofday -= Math.abs(et_day);

        if (et_month > 1) {
            et_month = et_month -= 1;
        } else {
            et_month = 12;
        }
    }

    const formattedDate = `${et_day < 10 ? '0' + et_day : et_day}-${et_month < 10 ? '0' + et_month : et_month}-${et_year}`;
    return formattedDate;
};

export default EtDate;
