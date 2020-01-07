'use strict';

const logic = require("./leverage");
const settings = require("./_settings");
const logger = require("./logger");
const cron = require('node-cron');

// # ┌────────────── second (optional)
// # │ ┌──────────── minute
// # │ │ ┌────────── hour
// # │ │ │ ┌──────── day of month
// # │ │ │ │ ┌────── month
// # │ │ │ │ │ ┌──── day of week
// # │ │ │ │ │ │
// # │ │ │ │ │ │
// # * * * * * *
cron.schedule(
    '0 0 * * * *', //毎時
    () => {
        for (let l of settings.LOGIC){
            logger.console.info("Start",l.PAIR);
            logger.system.info("Start",l.PAIR);
            logic.doExecute(
                l.id,
                l.instrument,
                l.full_leverage,
                l.target_leverage);
        }}
    );