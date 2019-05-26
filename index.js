const mongoose = require('mongoose');
const request = require('request');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/productcli', {useNewUrlParser: true});


const Product = require('./models/product');

const addProduct = async (product) => {
    try {
        const newProduct = new Product(product);
        await newProduct.save();
    } catch (e) {
        console.error(e);
    }
};


const getAll = async () => {
    try {
        const produts = await Product.find().sort({date: 1});
        produts.forEach(function (item, i, arr) {
            if (i == 0){
                console.info(`${item.date.getFullYear()}-${("0"+(item.date.getMonth()+1)).slice(-2)}-${("0"+(item.date.getDate())).slice(-2)}`);
                console.info(`${item.productName} ${item.price} ${item.currency}`)
            } else{
                if (item.date - arr[i-1].date == 0){
                    console.info(`${item.productName} ${item.price} ${item.currency}`)
                } else{
                    console.info();
                    console.info(`${item.date.getFullYear()}-${("0"+(item.date.getMonth()+1)).slice(-2)}-${("0"+(item.date.getDate())).slice(-2)}`);
                    console.info(`${item.productName} ${item.price} ${item.currency}`)
                }
            }
        })
    } catch (e) {
        console.error(e);
    }
};


const clearAllByDate = async (date) =>{
    try {
        await Product.deleteMany({date: date});
    } catch (e) {
        console.error(e);
    }
};




const reportByYear = async (year, currency) =>{
    try {
        const products = await Product.find({date: {$gte: `${year}-01-01`, $lte: `${year}-12-31`}}).sort({date: 1});
        const newArray = createArrayOfDatesWithPriceAndCurrency(products);
        countReportPrice(newArray, currency);
    } catch (e) {
        console.error(e);
    }
};


function createArrayOfDatesWithPriceAndCurrency(products){
    const newArray = [];
    products.forEach((item, i, arr) =>{
        if (i == 0){
            newArray.push({date: `${item.date.getFullYear()}-${("0"+(item.date.getMonth()+1)).slice(-2)}-${("0"+(item.date.getDate())).slice(-2)}`,
                arrayOfValues: [{price: item.price, currency: item.currency}]
            });
        } else{
            if (item.date - arr[i-1].date == 0){
                newArray[newArray.length-1].arrayOfValues.push({price: item.price, currency: item.currency});
            } else{
                newArray.push({date: `${item.date.getFullYear()}-${("0"+(item.date.getMonth()+1)).slice(-2)}-${("0"+(item.date.getDate())).slice(-2)}`,
                    arrayOfValues: [{price: item.price, currency: item.currency}]
                });
            }
        }
    });
    return newArray;
}

function countReportPrice(array, currency,){
    let reportPrice = 0;
    let numberOfDates=0;
    array.forEach((item, i, arr) => {
        const ratesArray = [currency];
        item.arrayOfValues.forEach((value) => {
            let n = 0;
            ratesArray.forEach((currency) => {
                if (value.currency == currency){
                    n++;
                }
            });
            if (n==0){
                ratesArray.push(value.currency);
            }
        });

        const promise = new Promise((resolve) => {
            let url = "http://data.fixer.io/api/" + item.date +"?access_key=7234fa5e819bfc3dc7a4b64643f13cd2&symbols=" + ratesArray;
            request(url, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    resolve(JSON.parse(body).rates);
                }
            });
        });

        promise.then(result => {
            reportPrice += item.arrayOfValues.reduce((mainValue, currentValue) =>{
                return mainValue + (currentValue.price / result[currentValue.currency]) * result[currency];
            }, 0);
            numberOfDates++;
        }).then( () =>{
            if (numberOfDates == arr.length){

                console.info(Math.round(reportPrice * 100) / 100);
                process.exit(1);
            }
        })
    });
}

module.exports = {
    addProduct,
    getAll,
    clearAllByDate,
    reportByYear
};
