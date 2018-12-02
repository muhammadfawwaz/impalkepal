const model = require('../models/model')
var registrationController = require('../controllers/registration.controller')

exports.create = async function (req,res) {
    var state = registrationController.auth(req.session.user,'admin')
    if(state == 1) {
        await createObat(req.body)
        res.redirect('/admin')
    }
    else if(state == 2) {
        res.redirect('/forbidden-access')
    }
    else if(state == 5) {
        res.redirect('/login')
    }
}

exports.read = async function (req,res) {
    var state = registrationController.auth(req.session.user,'admin')
    // if(state == 1) {
    //     await model.obat.findAll().then(readObat => {
    //         res.render('admin/dashboard',{readObat});
    //     })
    // }
    // else if(state == 2) {
    //     res.redirect('/forbidden-access')
    // }
    // else if(state == 5) {
    //     res.redirect('/login')
    // }
    var readObat = 0
    res.render('admin/dashboard',{readObat});
}

exports.delete = async function (req,res) {
    var state = registrationController.auth(req.session.user,'admin')
    if(state == 1) {
        await deleteObat(req.body.id)
        res.redirect('/admin')
    }
    else if(state == 2) {
        res.redirect('/forbidden-access')
    }
    else if(state == 5) {
        res.redirect('/login')
    }
}

exports.update = async function (req,res) {
    var state = registrationController.auth(req.session.user,'admin')
    if(state == 1) {
        await updateObat(req.body)
        res.redirect('/admin')
    }
    else if(state == 2) {
        res.redirect('/forbidden-access')
    }
    else if(state == 5) {
        res.redirect('/login')
    }
}

exports.find = async function (req,res) {
    var state = registrationController.auth(req.session.user,'admin')
    if(state == 1) {
        var obj = await findObat(req.params.id)
        res.render('admin/update', { obj });
    }
    else if(state == 2) {
        res.redirect('/forbidden-access')
    }
    else if(state == 5) {
        res.redirect('/login')
    }
}

exports.daftarBarang = async function (req,res) {
    var state = registrationController.auth(req.session.user,'admin')
    if(state == 1) {
        var obj = []
        var trs = await readTr()
        var i = 0
        trs.forEach(async function(tr) {
            console.log(JSON.stringify(tr))
            if(tr.status == 'not verified') {
                obj.push({
                    id: tr.id,
                    nama: tr.nama,
                    harga: tr.harga,
                    jumlah: tr.jumlah,
                    idObat: tr.idObat
                })
            }
            i++
            if(i == trs.length) {
                res.render('admin/daftar-order', { obj });
            }
        })
    }
    else if(state == 2) {
        res.redirect('/forbidden-access')
    }
    else if(state == 5) {
        res.redirect('/login')
    }
}

exports.daftarPenjualan = async function (req,res) {
    var state = registrationController.auth(req.session.user,'admin')
    if(state == 1) {
        var obj = []
        var trs = await readTr()
        var i = 0
        trs.forEach(async function(tr) {
            console.log(JSON.stringify(tr))
            if(tr.status == 'verified') {
                obj.push({
                    nama: tr.nama,
                    harga: tr.harga,
                    jumlah: tr.jumlah,
                    waktu: tr.updatedAt
                })
            }
            i++
            if(i == trs.length) {
                res.render('admin/daftar-penjualan', { obj });
            }
        })
    }
    else if(state == 2) {
        res.redirect('/forbidden-access')
    }
    else if(state == 5) {
        res.redirect('/login')
    }
}

exports.verification = async function (req,res) {
    var state = registrationController.auth(req.session.user,'admin')
    if(state == 1) {
        console.log(req.body)
        await updateTr(req.body.id)
        await decrementObat(req.body.idObat,req.body.jumlah)
        res.redirect('/daftar-order')
    }
    else if(state == 2) {
        res.redirect('/forbidden-access')
    }
    else if(state == 5) {
        res.redirect('/login')
    }
}

async function createObat(obj) {
    await model.obat.sync({force: false}).then(() => {
        return model.obat.create({
            nama: obj.nama,
            jumlah: obj.jumlah,
            harga: obj.harga
        })
    });
}

async function deleteObat(id) {
    console.log('id: ' + id)
    await model.obat.destroy({
        where: {
            id: id
        }
    });
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

async function updateObat(obj) {
    await model.obat.update(
        { 
            nama: obj.nama,
            harga: obj.harga,
            jumlah: obj.jumlah
        }, /* set attributes' value */
        { where: { id: obj.id }} /* where criteria */
      )
}

async function readTr() {
    var obj
    await model.transaksi.findAll().then(tr => {
        obj = tr
    })
    return obj
}

async function updateTr(id) {
    await model.transaksi.update(
        { 
            status: 'verified',
        }, /* set attributes' value */
        { where: { id: id }} /* where criteria */
      )
}

async function decrementObat(id,jumlah) {
    await model.obat.findOne({ 
        where: {
            id: id
        } 
    }).then(async result => {
        await model.obat.update(
            { 
                jumlah: parseInt(result.jumlah) - parseInt(jumlah)
            }, /* set attributes' value */
            { where: { id: id }} /* where criteria */
        )
    })
}