const model = require('../models/model')

exports.showRegister = function(req, res, next) {
    res.render('register/register');
}

exports.showLogin = function (req,res) {
    if(req.session.user) {
        if(req.session.user.username == 'admin') {
            return res.redirect('/admin')
        }
        else {
            return res.redirect('/home')
        }
    }
    return res.render('login/login');
}

exports.logout = function (req,res) {
    if(req.session.user) {
        res.clearCookie('user_sid')
        console.log('sessionLogoutController = ' + JSON.stringify(req.session))
    }
    return res.redirect('/login')
}

exports.register = async function (req,res) {
    await register(req.body)
    res.redirect('/')
}

exports.login = async function (req,res) {
    const USERNAME_NOT_FOUND = 1
    const PASSWORD_WRONG = 2
    const PASSWORD_TRUE = 3
    const loginResult = await login(req.body)
    console.log(loginResult)
    if(parseInt(loginResult) == parseInt(PASSWORD_TRUE)) {
        req.session.user = req.body
        console.log('sessionController = ' + JSON.stringify(req.session))
        if(req.body.username == 'admin') {
            return res.redirect('/admin')
        }
        else {
            return res.redirect('/home')
        }
    }
    else if(parseInt(loginResult) == parseInt(PASSWORD_WRONG)) {
        var msg = 'Password salah silahkan coba lagi'
        return res.render('login/login',{msg});
    }
    else if(parseInt(loginResult) == parseInt(USERNAME_NOT_FOUND)){
        var msg = 'Anda belum terdaftar'
        return res.render('login/login',{msg});
    }
}

exports.auth = function sessionAuth(user,role) {
    if(user) {
        if(role == 'admin') {
            if(user.username == role) {
                return 1
            }
            else {
                return 2
            }
        }
        else {
            if(user.username != 'admin') {
                return 3
            }
            else {
                return 4
            }
        }
    }
    else {
        return 5
    }
}

exports.forbidden = function(req, res, next) {
    res.render('index', { title: 'Anda dilarang mengakses halaman ini' });
}

async function register(obj) {
    await model.user.sync({force: false}).then(() => {
        return model.user.create({
            firstName: obj.firstName,
            lastName: obj.lastName,
            username: obj.username,
            password: obj.password
        })
    });
}

async function login(obj) {
    var result = 0
    await model.user.findOne({ 
        where: {
            username: obj.username
        } 
    }).then(user => {
        if(user != null) {
            if(user.password == obj.password) {
                result =  3
            }
            else {
                result =  2
            }
        }
        else {
            result = 1
        }
        console.log('result=' + result)
    })
    return result
}