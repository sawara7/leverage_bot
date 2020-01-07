/* eslint-disable no-await-in-loop */
let oanda      = require("./oanda");
const firebase = require("./firebase");
const logger   = require("./logger");
const utils    = require("./utils");
const sta      = require("simple-statistics");
const FIREBASAE_BOT_BITBANK = "/bot/bitbank_averaging_std/";
let env   = require("./_settings");

let api = new oanda.Api({
    'token'     : env.apiToken,
    'endPoint'  : env.uri
});

let params= {
    'type'          : 'MARKET',
};

exports.doExecute = async(id, instrument, full_leverage, target_leverage) => {
    let res;
    try{
        api.accountID = id;
        let account = await api.getAccount();
        account = account.account;
        
        let balance = Math.floor(account.balance);
        let marginAvailable = Math.floor(account.marginAvailable);
         
        if (marginAvailable < balance/target_leverage){
            return 'not buy';
        }

        let leverage_value = (marginAvailable - balance/target_leverage) * full_leverage;
        logger.console.info(leverage_value);
 
        let price = await api.getPricing({'instruments':instrument});
        price = Number(price.prices[0].closeoutAsk);
        let units = Math.floor(leverage_value/price);
        if (units > 0){
            params["instrument"] = instrument;
            params["units"] = units;
            res = await api.postOrder(params);
        }    
    }catch(e){
        logger.console.error(e);
    }
    logger.console.info(res);
    return 'ok';
}
