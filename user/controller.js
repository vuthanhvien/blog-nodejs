
var API = require('./api');

var jwtHelper = require('./auth');
var bcrypt = require('bcrypt');

var crud = require('./../crud/controller')


module.exports = {
    ...crud,
    login: function (req, res, next) {
        var query = {
            $or: [
                { username: req.body.username },
                { email: req.body.username },
                { phone: req.body.username },
            ]
        }

        API.findOne(query, async (e, data) => {
            try {

                if (e) {
                    res.json({
                        success: false,
                        msg: 'User sai vcl'
                    })
                } else {

                    const userData = {
                        _id: data._id,
                        name: data.username,
                        email: data.email,
                    };

                    var isValid = bcrypt.compareSync(req.body.password, data.password);
                    if (!isValid) {
                        res.json({
                            success: false,
                            msg: "Password sai vcl",
                        });
                    } else {

                        const accessToken = await jwtHelper.generateToken(userData, jwtHelper.accessTokenSecret, jwtHelper.accessTokenLife);
                        const refreshToken = await jwtHelper.generateToken(userData, jwtHelper.refreshTokenSecret, jwtHelper.refreshTokenLife);
                        delete data.password

                        res.json({ success: true, jwt: { accessToken, refreshToken }, data: data });
                    }
                }
            } catch (e) {
                res.json({
                    success: false,
                    msg: 'User sai vcl'
                })
            }
        })
    },
    register: function (req, res, next) {
        if (req.body.username && req.body.password && req.body.email) {
            var passwordHash = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8), null);
            const userData = {
                password: passwordHash,
                email: req.body.email,
                username: req.body.username || req.body.email,
            }
            API.create(userData, async function (err, user) {
                if (err) {
                    res.json({
                        ...err,
                        success: false
                    })
                } else {
                    const userData = {
                        _id: user._id,
                        name: user.username,
                        email: user.email,
                    };

                    const accessToken = await jwtHelper.generateToken(userData, jwtHelper.accessTokenSecret, jwtHelper.accessTokenLife);
                    const refreshToken = await jwtHelper.generateToken(userData, jwtHelper.refreshTokenSecret, jwtHelper.refreshTokenLife);

                    res.json({ success: true, jwt: { accessToken, refreshToken }, data: user });
                }
            });
        } else {
            res.json({
                msg: "Thieeus",
                success: false

            })
        }


    },
    profile: function (req, res, next) {
        const tokenFromClient = req.headers["authorization"];
        var user = jwtHelper.getInfo(tokenFromClient);
        var data = { ...req.body };
        var id = user.data._id;

        API.findById(id, (e, data) => {
            console.log(data)
            res.json({
                data: data,
                success: true
            });

        })
    },

    update: function (req, res, next) {
        const tokenFromClient = req.headers["authorization"];
        var user = jwtHelper.getInfo(tokenFromClient);
        var id = user.data._id;
        const dataUser = { ...req.body };

        delete dataUser.password;
        delete dataUser.username;
        delete dataUser.email;
        console.log(dataUser)


        API.update({ _id: id }, dataUser, (e, data) => {
            res.json({
                data: data,
                success: true
            });

        })
    },


    sendcode: function (req, res, next) {
        res.json({});
    },
    resetpassword: function (req, res, next) {
        res.json({});
    },
    forgotpassword: function (req, res, next) {
        res.json({});
    },
    refreshtoken: function (res, res, next) {

    }
}