const model = require('../models/model')
var registrationController = require('../controllers/registration.controller')

exports.addKeranjang = async function (req,res) {
    var state = registrationController.auth(req.session.user,'user')
    if(state == 3) {
        if(!req.session.barang) {
            req.session.barang = []
            req.session.barang.push({
                id: req.body.id,
                qty: req.body.qty,
                username: req.session.user.username,
                nama: req.body.nama,
                harga: req.body.harga
            })
            console.log(JSON.stringify(req.session))
        }
        else {
            var found = false
            req.session.barang.forEach(function(barang) {
                if(!found) {
                    if(barang.id == req.body.id && barang.username == req.session.user.username) {
                        console.log('barang sama')
                        barang.qty = parseInt(req.body.qty)
                        found = true
                    }
                }
            })
            if(!found) {
                req.session.barang.push({
                    id: req.body.id,
                    qty: req.body.qty,
                    username: req.session.user.username,
                    nama: req.body.nama,
                    harga: req.body.harga
                })
                console.log(JSON.stringify(req.session))
            }
        }
        res.redirect('/home')
    }
    else if(state == 4) {
        res.redirect('/forbidden-access')
    }
    else if(state == 5) {
        res.redirect('/login')
    }
}

exports.homepage = async function (req,res) {
    var state = registrationController.auth(req.session.user,'user')
    console.log(state)
    if(state == 3) {
        var obj = await readObat()
        var name = req.session.user.username
        res.render('user/daftar-obat', { obj,name });
    }
    else if(state == 4) {
        res.redirect('/forbidden-access')
    }
    else if(state == 5) {
        res.redirect('/login')
    }
}

exports.buyObat = async function (req,res) {
    var state = registrationController.auth(req.session.user,'user')
    if(state == 3) {
        await addToTr(req.session.barang,req.session.user.username)
        req.session.barang = []
        res.redirect('/home')
    }
    else if(state == 4) {
        res.redirect('/forbidden-access')
    }
    else if(state == 5) {
        res.redirect('/login')
    }
}

exports.keranjang = async function (req,res) {
    var state = registrationController.auth(req.session.user,'user')
    if(state == 3) {
        var obj = []
        var barangs = req.session.barang
        var i = 0
        if(barangs == undefined || barangs.length == 0) {
            res.render('user/keranjang', { obj });
        }
        else {
            barangs.forEach(async function(barang) {
                if(barang.username == req.session.user.username) {
                    obj.push({
                        nama: barang.nama,
                        harga: barang.harga,
                        qty: barang.qty
                    })
                }
                i++
                if(i == barangs.length) {
                    console.log(obj)
                    res.render('user/keranjang', { obj });
                }
            })
        }
    }
    else if(state == 4) {
        res.redirect('/forbidden-access')
    }
    else if(state == 5) {
        res.redirect('/login')
    }
}

exports.historiTr = async function (req,res) {
    var state = registrationController.auth(req.session.user,'user')
    if(state == 3) {
        var obj = []
        var trs = await readTr()
        var i = 0
        trs.forEach(async function(tr) {
            console.log(JSON.stringify(tr))
            if(tr.status == 'verified' && tr.username == req.session.user.username) {
                obj.push({
                    nama: tr.nama,
                    harga: tr.harga,
                    jumlah: tr.jumlah,
                    waktu: tr.updatedAt
                })
            }
            i++
            if(i == trs.length) {
                res.render('user/histori-transaksi', { obj });
            }
        })
    }
    else if(state == 4) {
        res.redirect('/forbidden-access')
    }
    else if(state == 5) {
        res.redirect('/login')
    }
}

exports.deleteKeranjang = function(req,res) {
    var indeks = 0
    for(var i = 0;i < req.session.barang;i++) {
        if(req.session.barang[i].id == req.body.id && req.session.user.username == req.session.barang[i].username) {
            indeks = i
            break
        }
    }
    req.session.barang.splice(indeks,1)
    console.log(JSON.stringify(req.session))
    res.redirect('/keranjang')
}

async function readObat() {
    var obj
    await model.obat.findAll().then(obats => {
        obj = obats
    })
    return obj
}

async function addToTr(barangs,username) {
    barangs.forEach(async function(barang) {
        if(barang.username == username) {
            await model.transaksi.sync({force: false}).then(() => {
                return model.transaksi.create({
                    idObat: barang.id,
                    jumlah: barang.qty,
                    username: barang.username,
                    status: 'not verified',
                    nama: barang.nama,
                    harga: barang.harga
                })
            });
        }
    })
}

async function findObat(id) {
    var obj
    await model.obat.findOne({ 
        where: {
            id: id
        } 
    }).then(obat => {
        obj = obat
    })
    return obj
}

async function readTr() {
    var obj
    await model.transaksi.findAll().then(tr => {
        obj = tr
    })
    return obj
}