const db = require("../data");
const ret = require("../return");

exports.getAllUsers = (req, res) => {
    db.User.findAll().then((users) => {
        ret.json(users, res);
    })
};

exports.createUser = (req, res) => {
    db.User.create({
        email: req.body.email,
        password: req.body.password,
        nick: req.body.nick,
        wins: 0,
        loses: 0
    }).then((user) => {
        ret.json(user, res);
    });
};

exports.loginUser = (req, res) => {
    db.User.findOne({where: {email: req.body.email, password: req.body.password}})
        .then((user) => {
            ret.json(user, res);
        });
};

exports.getUser = (req, res) => {
    db.User.findByPk(req.params.id).then((user) => {
        if (user) {
            ret.json(user, res);
        } else {
            res.end();
        }
    });
};

exports.updateUser = (req, res) => {
    db.User.findByPk(req.params.id).then((user) => {
        if (user) {
            (user.email = req.body.email),
                (user.password = req.body.password),
                (user.nick = req.body.nick),
                user.save().then((user) => {
                    ret.json(user, res);
                });
        } else {
            res.end();
        }
    });
};

exports.deleteUser = (req, res) => {
    db.User.findByPk(req.params.id)
        .then((user) => {
            if (user) {
                return user.destroy();
            } else {
                res.end();
            }
        })
        .then(() => {
            res.end();
        });
};

exports.changeUserStats = (req, res) => {
    db.User.findByPk(req.params.id).then((user) => {
        if (user) {
            if (req.body.wins) {
                (user.wins = req.body.wins),
                    user.save().then((user) => {
                        ret.json(user, res);
                    });
            } else if (req.body.loses) {
                (user.loses = req.body.loses),
                    user.save().then((user) => {
                        ret.json(user, res);
                    });
            } else {
                res.end();
            }
        }
    });
};