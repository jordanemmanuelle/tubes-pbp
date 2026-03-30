"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("promo", {
      promo_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      kode_promo: { // MCDTERBAIK, HEMAT50, IDULFITRI
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      nilai_promo: { // POTONGAN HARGANYA BERAPA CONTOH: 20rb, 25rb, dll
        type: Sequelize.INTEGER,
        allowNull: false
      },
      minimal_belanja: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0 // Default 0 berarti tidak ada minimal belanja
      },
      maksimal_diskon: {
        type: Sequelize.INTEGER,
        allowNull: true // Bisa dikosongkan jika tipe promonya 'nominal'
      },
      stok: {
        type: Sequelize.INTEGER,
        allowNull: true // Bisa dikosongkan jika promo unlimited
      },
      tanggal_mulai: {
        type: Sequelize.DATE,
        allowNull: false
      },
      tanggal_berakhir: {
        type: Sequelize.DATE,
        allowNull: false
      },
      deskripsi: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("promo");
  },
};
