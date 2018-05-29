var mySpider = require("./mySpider"),
    schedule = require('node-schedule'),
    sillydate = require('silly-datetime');

var rule1     = new schedule.RecurrenceRule();
var times1    = [8,11,13,17,20];
rule1.hour  = times1;rule1.minute = 30;rule1.second = 0;
schedule.scheduleJob(rule1, function(){
    
    console.log(sillydate.format(new Date(),'YYYY-MM-DD HH:mm:ss'));
    mySpider.myStart();
});

