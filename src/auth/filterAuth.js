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
        '/users/checkSession': 1
    }
}

