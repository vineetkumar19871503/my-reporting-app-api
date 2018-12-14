//array of routes that are not required to be authenticated or permitted 
module.exports = {
    auth: {
        '/users/login': 1,
        '/users/logout': 1,
        '/truckers/login': 1
    },
    permissions: {
        '/users/login': 1,
        '/users/logout': 1,
        '/truckers/login': 1,
        '/jobs/getSubJobById': 1,
        '/jobs/getJobById': 1,
        '/dispatches/getJobs': 1,
        '/dispatches/getDispatchDetailByJobId': 1,
        '/assigned_jobs/getAssignDetailByJobId': 1,
        '/drivers/getDriversByTruckType': 1,
        '/pullers/getPullersByTruckType': 1,
        '/subhaulers/getSubhaulersByTruckType': 1,
        '/drivers/getUnoccupiedDriversByTruckType': 1,
        '/pullers/getUnoccupiedPullersByTruckType': 1,
        '/subhaulers/getUnoccupiedSubhaulersByTruckType': 1,
        '/quotes/getQuotesCountByCustomer': 1,
        '/quotes/getAllQuotesByCustomerId': 1,
        '/quotes/getQuoteById': 1,
        '/customers/addCustomer_logs': 1,
        '/quotes/getJobsCountByCustomer': 1,
        '/sub_jobs/getAllSubJobById': 1,
        '/sub_jobs/getSubJobById': 1,
        '/jobs/getNextId': 1,
        '/jobs/updateFields': 1,
        '/assigned_jobs/getAllTagidGeneratedSubJob': 1,
         '/assigned_jobs/getTagidGeneratedBySingleSubJob': 1,
         '/assigned_jobs/getAllJobIdUniqueCustomerId':1,
         '/assigned_jobs/getAllDataByTagId':1,

        // for mobileApi
        '/assigned_jobs/truckerLogin': 1,
        '/assigned_jobs/setDeviceInfo': 1,
        '/assigned_jobs/setGeoLocation': 1,
        '/assigned_jobs/createTrip': 1,
    }
}

