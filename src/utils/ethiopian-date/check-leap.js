const CheckLeapYear = (year) => {
    if (year % 4 === 0) {
        if (year % 100 === 0) {
            if (year % 400 === 0) {
                return true; // Leap year if divisible by 400
            } else {
                return false; // Not a leap year if divisible by 100 but not by 400
            }
        } else {
            return true; // Leap year if divisible by 4 but not by 100
        }
    } else {
        return false; // Not a leap year if not divisible by 4
    }
};

export default CheckLeapYear;
