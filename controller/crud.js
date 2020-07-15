module.exports = (API) => {
    var module = {};
    module.create = function (req, res, next) {
        var data = { ...req.body };
        API.create(data, function (err, r) {
            if (err) res.json(err)
            res.json({
                message: "data created successfully",
                success: true
            })
        })
    }

    module.list = function (req, res, next) {
        API.list(req.query, function (err, list, total) {
            if (err) res.json(err)
            res.json({
                list: list,
                success: true,
                total: total
            })
        })
    }

    module.detail = function (req, res, next) {
        API.detail({ _id: req.params.id }, function (err, r) {
            if (err) res.json(err)
            res.json(r)
        })
    }

    module.update = function (req, res, next) {
        var data = { ...req.body };

        API.update({ _id: req.params.id }, data, function (err, r) {
            if (err) res.json(err)
            res.json({
                message: "r updated successfully",
                success: true
            })
        })
    }

    module.remove = function (req, res, next) {
        API.delete({ _id: req.params.id }, function (err, r) {
            if (err)
                res.json(err)
            res.json({
                message: "r deleted successfully"
            })
        })
    }

    return module
}
