const Sequelize = require('sequelize');
const sequelize = new Sequelize('postgres://fgoqwlaudvklby:5c76acbb83906ee5d405d4c5e0faccfcc00f34e26fe83a932ddf1056b854c770@ec2-54-243-150-10.compute-1.amazonaws.com:5432/d5ar2nhd60t84r')

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

  const User = sequelize.define('user', {
    firstName: {
        type: Sequelize.STRING
    },
    lastName: {
        type: Sequelize.STRING
    },
    username: {
        type: Sequelize.STRING
    },
    password: {
        type: Sequelize.STRING
    }
});

const Obat = sequelize.define('obat', {
  nama: {
      type: Sequelize.STRING
  },
  jumlah: {
      type: Sequelize.STRING
  },
  harga: {
      type: Sequelize.STRING
  }
});

const Transaksi = sequelize.define('transaksi', {
  idObat: {
      type: Sequelize.STRING
  },
  jumlah: {
      type: Sequelize.STRING
  },
  username: {
      type: Sequelize.STRING
  },
  status: {
      type: Sequelize.STRING
  },
  nama: {
      type: Sequelize.STRING
  },
  harga: {
      type: Sequelize.STRING
  }
});

exports.user = User
exports.obat = Obat
exports.transaksi = Transaksi