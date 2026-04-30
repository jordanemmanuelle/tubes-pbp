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
      kode_promo: { 
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      nilai_promo: { 
        type: Sequelize.INTEGER,
        allowNull: false
      },
      minimal_belanja: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0 
      },
      maksimal_diskon: {
        type: Sequelize.INTEGER,
        allowNull: true 
      },
      stok: {
        type: Sequelize.INTEGER,
        allowNull: true 
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
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("promo");
  },
};
