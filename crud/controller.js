module.exports = (API) => {
    var module = {};
    module.create = function (req, res, next) {
        var data = { ...req.body };
        API.create(data, function (err, r) {
            if (err) res.json(err)
            else
                res.json({
                    msg: "Record created successfully",
                    success: true
                })
        })
    }

    module.list = function (req, res, next) {
        var paging = req.query || {};
        paging.query = {
            ...req.query
        }
        if (paging.query.s) {
            paging.query.$text = { $search: '\"' + paging.query.s.toLowerCase() + '\"' };
            delete paging.query.s;
        }
        var fields = paging.query.fields;
        delete paging.query.limit;
        delete paging.query.page;
        delete paging.query.sortBy;
        delete paging.query.sortType;
        delete paging.query.fields;
        var query = {};
        Object.keys(paging.query).map(key => {
            var keys = key.split('_');
            if (keys[1]) {
                query[keys[0]] = { ['$' + keys[1]]: paging.query[key] }
            } else {
                query[keys[0]] = paging.query[key]
            }
        })
        paging.fields = fields;
        paging.query = query;
        API.list(paging, function (err, list, total) {
            if (err) res.json(err)
            else
                res.json({
                    list: list,
                    success: true,
                    total: total
                })
        })
    }
    module.listAll = function (req, res, next) {
        var paging = req.query || {};
        paging.query = {
            ...req.query
        }
        delete paging.query.limit;
        delete paging.query.page;
        delete paging.query.sortBy;
        delete paging.query.sortType;

        API.listAll(paging, function (err, list, total) {
            if (err) res.json(err)
            else
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
            else
                res.json(r)
        })
    }

    module.update = function (req, res, next) {
        var data = { ...req.body };

        API.update({ _id: req.params.id }, data, function (err, r) {
            if (err) res.json(err)
            else
                res.json({
                    msg: "Record updated successfully",
                    success: true
                })
        })
    }

    module.remove = function (req, res, next) {
        API.delete({ _id: req.params.id }, function (err, r) {
            if (err) res.json(err)
            else
                res.json({
                    msg: "Record deleted successfully"
                })
        })
    }


    module.createOrUpdate = function (req, res, next) {
        var data = { ...req.body };
        API.createOrUpdate(data, function (err, r) {
            if (err) res.json(err)
            else
                if (res) {
                    res.json({
                        msg: "Record deleted successfully"
                    })
                }
        })
    }


    return module
}
