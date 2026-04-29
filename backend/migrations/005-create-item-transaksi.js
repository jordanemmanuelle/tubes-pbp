"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("item_transaksi", {
      id: { // DIPERBAIKI: Disesuaikan dengan model (bukan item_transaksi_id)
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      transaksi_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "transaksi", key: "transaksi_id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE" // Sangat bagus! Jika transaksi dihapus, itemnya ikut terhapus
      },
      menu_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "menu", key: "id" }, // Pastikan ini sesuai dengan Primary Key tabel menu-mu
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      kuantitas: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
      },
      harga_satuan: { // DIPERBAIKI: Disesuaikan dengan controller yang memanggil 'harga_satuan'
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("item_transaksi");
  },
};