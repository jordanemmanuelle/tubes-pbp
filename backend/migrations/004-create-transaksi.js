'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('transaksi', {
      transaksi_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },

      nama_pelanggan: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: 'Guest'
      },
      nomor_meja: {
        type: Sequelize.STRING, 
        allowNull: true, 
      },
      tipe_pesanan: {
        type: Sequelize.ENUM('dine-in', 'takeaway'),
        defaultValue: 'dine-in',
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('pending', 'diproses', 'selesai'),
        defaultValue: 'pending',
        allowNull: false,
      },
      total_harga: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('transaksi');
  }
};