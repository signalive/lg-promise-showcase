
/* Load Power and Configuration API normally */
var SCAPPower = cordova.require('cordova/plugin/power');
var SCAPConfguration = cordova.require('cordova/plugin/configuration');

/* Wrap methods with promise api */
var Power = {};
var Configuration = {};

Power.addOffTimer = function(options) {
    return new Promise(function(resolve, reject) {
        new SCAPPower().addOffTimer(resolve, reject, options);
    });
}

Power.deleteOffTimer = function(options) {
    return new Promise(function(resolve, reject) {
        new SCAPPower().deleteOffTimer(resolve, reject, options);
    });
}

Power.getOffTimerList = function(options) {
    return new Promise(function(resolve, reject) {
        new SCAPPower().getOffTimerList(resolve, reject, options);
    });
}

Power.deleteOnTimer = function(options) {
    return new Promise(function(resolve, reject) {
        new SCAPPower().deleteOnTimer(resolve, reject, options);
    });
}

Power.getOnTimerList = function(options) {
    return new Promise(function(resolve, reject) {
        new SCAPPower().getOnTimerList(resolve, reject, options);
    });
}

Configuration.getTimeZone = function(options) {
    return new Promise(function(resolve, reject) {
        new SCAPConfiguration().getTimeZone(resolve, reject, options);
    });
}

/* Use Scap with Promises */

Power
    .addOffTimer({hour: 1, minute: 10, week: 10})
    .then(function() {
        return Power.getOffTimerList();
    })
    .then(function(response) {
        var tasks = response.timerList.map(function(timer) {
            return Power.deleteOffTimer(timer);
        });

        return Promise.all(tasks)
    })
    .then(function() {
        return Power.getOnTimerList();
    })
    .then(function(response) {
        /* If map is unfamiliar to you, you can also use standard for loop as follows */
        var tasks = [];

        for (var i = 0; i < response.timerList.length; i++)
            tasks.push(Power.deleteOnTimer(response.timerList[i]));

        return Promise.all(tasks);
    })
    .then(function() {
        /* Promises can be nested if necessary */
        return Configuration.getTimeZone()
            .then(function(response) {
                /* It's OK to return inside `then`. Javascript engine wraps returns inside Promise */
                if (response.timeZone.city == 'Istanbul')
                    return;
                else
                    return Configuration.setTimeZone({timeZone: {
                            city: 'Istanbul',
                            country: 'Turkey',
                            continent: 'Europe'
                        }})
                        .then(function() {
                            console.log('TimeZone was invalid, but corrected now');
                        });
                    /* Nested Promises are discouraged unless it is really required, because it hinders readability */
            })
            .catch(function(err) {
                /* This error is handled now, it will not propagate to outside */
                console.log('Error occured while getting timezone', err);
            })
            .then(function() {
                /* This will ALWAYS be executed */
                console.log('TimeZone OK');
            })
    })
    .then(function() {
        console.log('Everything is OK!');
    })
    .catch(function(err) {
        console.log('An error occured', err);
    });