module.exports = function (req, res, next, cb) {
    if (req.authError) {
        return res.rest.unauthorized({
            'message': req.authError
        });
    }
    cb();
}