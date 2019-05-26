function validateDate(date){
    let regular = /^([0-9]{4})-([0-9]{2})-([0-9]{2})$/;
    if (date == null || date == "" || !regular.test(date)) {
        console.error("Invalid date, correct form: YYYY-MM-DD");
        process.exit(1);
    }
}

function validateCurrency(currency) {
    let regular = /^[A-Z]{3}$/;
    if (!regular.test(currency)){
        console.error("Invalid currency, all chars must be in Uppercase and contains 3 chars");
        process.exit(1);
    }
}

function validatePrice(price) {
    if (isNaN(parseFloat(price)) || price == 0){
        console.error("Invalid price");
        process.exit(1);
    }
}

module.exports = {
    validateDate,
    validateCurrency,
    validatePrice
}
