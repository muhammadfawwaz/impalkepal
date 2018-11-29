const Sequelize = require('sequelize');
const sequelize = new Sequelize('database', 'username', 'password', {
  host: 'localhost',
  dialect: 'sqlite',
  operatorsAliases: false,

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },

  // SQLite only
  storage: './database.sqlite'
});

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