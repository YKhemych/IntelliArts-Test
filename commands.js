const program = require('commander');

const {
    addProduct,
    getAll,
    clearAllByDate,
    reportByYear
} = require('./index');

const {
    validateDate,
    validatePrice,
    validateCurrency
} = require('./validators');

const findAll = require('./index').getAll;

program
    .version('1.0.0')
    .description('Products manager');

program
    .command('purchase <date> <price> <currency> <productName>')
    .description('Purchase a product')
    .action(async (date, price, currency, productName) => {
        await validateDate(date);
        await validatePrice(price);
        await validateCurrency(currency);
        await addProduct({productName, date, price, currency});
        await getAll();
        process.exit(1);
    });

program
    .command('all')
    .description('All products')
    .action(async () => {
        await getAll();
        process.exit(1);
    });

program
    .command('clear <date>')
    .description('Delete all products by date')
    .action(async (date) => {
        await validateDate(date);
        await clearAllByDate(date);
        await getAll();
        process.exit(1);
    });

program
    .command('report <year> <currency>')
    .description('Report by year')
    .action(async (year, currency) => {
        await validateCurrency(currency);
        await reportByYear(year, currency);
    });

program.parse(process.argv);