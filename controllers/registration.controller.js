const model = require('../models/model')

exports.showRegister = function(req, res, next) {
    if(req.session.user) {
        if(req.session.user.username == 'admin') {
            return res.redirect('/admin')
        }
        else {
            return res.redirect('/home')
        }
    }
    var msg = ''
    return res.render('register/register',{msg});
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
    var msgLogin = ''
    var msgLogout = ''
    return res.render('login/login',{msgLogin,msgLogout});
}

exports.logout = function (req,res) {
    if(req.session.user) {
        res.clearCookie('user_sid')
        console.log('sessionLogoutController = ' + JSON.stringify(req.session))
    }
    var msgLogin = ''
    var msgLogout = 'Anda telah keluar'
    return res.render('login/login',{msgLogin,msgLogout});
}

exports.register = async function (req,res) {
    var msgLogin = ''
    var msgLogout = ''
    var found = await findUsername(req.body.username)
    if(!found) {
        msgLogout = 'Anda telah berhasil registrasi. Silahkan login'
        await register(req.body)
        return res.render('login/login',{msgLogin,msgLogout});
    }
    var msg = 'Username telah terpakai. Silahkan coba lagi'
    return res.render('register/register',{msg});
}

exports.login = async function (req,res) {
    const USERNAME_NOT_FOUND = 1
    const PASSWORD_WRONG = 2
    const PASSWORD_TRUE = 3
    if(req.body.username.length > 3 && req.body.password.length > 5) {
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
            var msgLogin = 'Password salah silahkan coba lagi'
            var msgLogout = ''
            return res.render('login/login',{msgLogin,msgLogout});
        }
        else if(parseInt(loginResult) == parseInt(USERNAME_NOT_FOUND)){
            var msgLogin = 'Anda belum terdaftar'
            var msgLogout = ''
            return res.render('login/login',{msgLogin,msgLogout});
        }
    }
    else {
        var msgLogin = 'Username atau password terlalu pendek'
        var msgLogout = ''
        return res.render('login/login',{msgLogin,msgLogout});
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
            password: obj.password,
            phone: obj.phone
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

async function findUsername(username) {
    var result
    await model.user.findOne({ 
        where: {
            username: username
        } 
    }).then(user => {
        if(user) {
            result = true
        }
        else {
            result = false
        }
    })
    return result
}