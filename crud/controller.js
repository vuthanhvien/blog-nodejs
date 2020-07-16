module.exports = (API) => {
    var module = {};
    module.create = function (req, res, next) {
        var data = { ...req.body };
        API.create(data, function (err, r) {
            if (err) res.json(err)
            res.json({
                message: "Record created successfully",
                success: true
            })
        })
    }

    module.list = function (req, res, next) {
        var paging = req.query || {};
        paging.query = {
            ...req.query
        }
        delete paging.query.limit;
        delete paging.query.page;
        delete paging.query.sortBy;
        delete paging.query.sortType;

        API.list(paging, function (err, list, total) {
            if (err) res.json(err)
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
                message: "Record updated successfully",
                success: true
            })
        })
    }

    module.remove = function (req, res, next) {
        API.delete({ _id: req.params.id }, function (err, r) {
            if (err) res.json(err)
            res.json({
                message: "Record deleted successfully"
            })
        })
    }


    module.createOrUpdate = function (req, res, next) {
        var data = { ...req.body };
        API.createOrUpdate(data, function (err, r) {
            if (err) res.json(err)
            if(res){
                res.json({
                    message: "Record deleted successfully"
                })
            }
            
        })
    }


    
    return module
}
