const config = require('../../config'),
  filterAuthUrls = require('./filterAuth'),
  jwt = require('jsonwebtoken'),
  objectId = require('mongoose').Types.ObjectId,
  userModel = require('../db/models/UserModel'),
  verifyToken = require('./verifyToken');

module.exports = {
  //gets the token from headers and filters it
  extractToken: function (req) {
    const authorizationHeader = req.get('Authorization');
    var token = null;
    if (authorizationHeader) {
      token = authorizationHeader.replace('Bearer ', '');
    }
    return token;
  },
  //verify the token for apis
  verifyToken: function (req) {
    var response = {
      status: 403,
      message: 'Unauthorized',
      data: []
    },
      self = this,
      token = this.extractToken(req);
    return new Promise(function (resolve, reject) {
      if (config.enableAuth && !self._checkAuthAndPermissionsUrl(req, 'auth')) {
        verifyToken(token, (err, claims) => {
          if (err) {
            switch (err.name) {
              case "TokenExpiredError": err.message = 'User session expired'; break;
              case "JsonWebTokenError": err.message = 'API token must be provided'; break;
            }
            response.message = err.message;
            reject(response);
          } else {
            resolve();
          }
        });
      } else {
        resolve();
      }
    });
  },

  //check current user's permission for the current url
  checkRolePermissions: function (req) {
    const self = this;
    return new Promise(function (resolve, reject) {
      if (config.enableCheckPermissions && !self._checkAuthAndPermissionsUrl(req, 'permissions')) {
        const token = self.extractToken(req),
          userId = jwt.decode(token).data.id;
        //check user data in cookies first else fetch user details from db.
        if (req.session.userData) {
          self._checkPermissions(req, req.session.userData) ? resolve() : reject({
            'message': 'You are not authorized to perform this action.'
          });
        } else {
          userModel.getUsers({
            "_id": objectId(userId)
          })
            .then(function (user) {
              if (user.length) {
                self._checkPermissions(req, user[0]) ? resolve() : reject({
                  'message': 'You are not authorized to perform this action.'
                });
              } else {
                reject({
                  'message': 'User not found'
                });
              }
            })
            .catch(function (err) {
              reject(err.message);
            });
        }
      } else {
        resolve();
      }
    });
  },

  _checkPermissions: function (req, user) {
    const permissions = user.role.permissions;
    apiUrlArr = this._simplifyUrl(req, 'array'),
      hasPermission = false;
    permissions.forEach(function (permission) {
      if (permission.module == [apiUrlArr[0]] && permission[apiUrlArr[1]] == 1) {
        hasPermission = true;
        return false;
      }
    });
    return hasPermission;
  },

  //check which urls don't require to be checked for Auth or Role Permissions
  _checkAuthAndPermissionsUrl: function (req, type) {
    const authUrls = filterAuthUrls.auth,
      permissionUrls = filterAuthUrls.permissions;
    var url = this._simplifyUrl(req);
    if (url.charAt(url.length - 1) == '/') {
      url = url.substr(0, url.length - 1);
    }
    var allActionsUrl = url.split('/')[0] + '/*';
    if (type == 'auth') {
      return (authUrls[url] || authUrls['/' + url] || authUrls[allActionsUrl] || authUrls['/' + allActionsUrl]);
    } else if (type == 'permissions') {
      return (permissionUrls[url] || permissionUrls['/' + url] || permissionUrls[allActionsUrl] || permissionUrls['/' + allActionsUrl]);
    }
    return true;
  },

  //simplify the current url to determine the controller and action names
  _simplifyUrl: function (req, format) {
    var url = req.originalUrl.replace(config.apiPrefix, '');
    // removing query parameters from url
    if (url.indexOf('?') > -1) {
      url = url.substring(0, url.indexOf('?'));
    }
    //trimming url upto 2 parts (for eg : a/b/c/d/e will become a/b) for url checking
    url = url.split('/').slice(1, 3).join('/');
    if (url.charAt(url.length - 1) != '/') {
      url += '/';
    }
    //if action name not found then add list in the last
    if (!url.split('/')[1].length) {
      url += 'list';
    }
    if (format == 'array') {
      return url.split('/');
    }
    return url;
  }
}