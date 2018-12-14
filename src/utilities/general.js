module.exports = {
    getFormatTime: function(inputDate, isDateTime, onlyTime) {
        onlyTime = (onlyTime == true) ? true : false;
        if (inputDate != null) {
            outputDate = new Date(inputDate).toISOString(inputDate).replace(/T/, ' ').replace(/\..+/, '');
            var formattedDate = new Date(outputDate);
            if (!isDateTime) {
                return formattedDate.getHours() + ":" + formattedDate.getMinutes() + ":" + formattedDate.getSeconds();
            } else {
                return module.exports.formatAMPM(formattedDate, onlyTime);
            }
        } else {
            return "";
        }
    },
    formatAMPM: function(date, onlyTime) {
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var dateToShow = date.getUTCDate();
        var monthToShow = date.getUTCMonth() + 1;
        var yearToShow = date.getUTCFullYear();
        var dmyDate = dateToShow + "/" + monthToShow + "/" + yearToShow;
        var ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        if (onlyTime == true) {
            var strTime = hours + ':' + minutes + ' ' + ampm;
        } else {
            var strTime = dmyDate + " " + hours + ':' + minutes + ' ' + ampm;
        }

        return strTime;
    },

    getTagIdStatus: function(jobTagId, driversArr, callback) {
        var tag_id_status = "active";
        if (driversArr.length > 0) {
            driversArr.forEach(function(o) {
                if (o.tag_id == jobTagId) {
                    tag_id_status = o.tag_id_status;
                }
            });
        }
        //return tag_id_status;
        callback(tag_id_status);
    },
    getDaywisetime: function(inputDate, includeAmPm) {
        if (inputDate != null) {
            outputDate = new Date(inputDate).toISOString(inputDate).replace(/T/, ' ').replace(/\..+/, '');
            var formattedDate = new Date(outputDate);
            //return formattedDate;
            var dateToShow = formattedDate.getUTCDate();
            var monthToShow = formattedDate.getUTCMonth() + 1;
            var yearToShow = formattedDate.getUTCFullYear();
            var dmyDate = dateToShow + "/" + monthToShow + "/" + yearToShow;

            var weekday = new Array();
            weekday[0] = "Sunday";
            weekday[1] = "Monday";
            weekday[2] = "Tuesday";
            weekday[3] = "Wednesday";
            weekday[4] = "Thursday";
            weekday[5] = "Friday";
            weekday[6] = "Saturday";
            var day = weekday[formattedDate.getUTCDay()];

            var month = new Array();
            month[0] = "January";
            month[1] = "February";
            month[2] = "March";
            month[3] = "April";
            month[4] = "May";
            month[5] = "June";
            month[6] = "July";
            month[7] = "August";
            month[8] = "September";
            month[9] = "October";
            month[10] = "November";
            month[11] = "December";
            var month = month[formattedDate.getMonth()];

            var strTime = "";
            if (includeAmPm == true) {
                var ampm = module.exports.formatAMPM(formattedDate, true);
                strTime = day + ", " + month + " " + dateToShow + ", " + yearToShow + " " + ampm;
            } else {
                strTime = day + ", " + month + " " + dateToShow + ", " + yearToShow;
            }
            return strTime;
        } else {
            return "";
        }
    },
    makeid: function() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < 5; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }
}