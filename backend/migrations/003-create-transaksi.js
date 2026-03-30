"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("transaksi", {
      transaksi_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "user", key: "user_id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      total_harga: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      status: { 
        type: Sequelize.ENUM("pending", "berhasil", "gagal"),
        defaultValue: "pending",
        allowNull: false,
      },
      payment_method: {
        type: Sequelize.STRING,
        allowNull: true // Bisa diisi 'Gopay', 'BCA', 'Credit Card' nanti
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("transaksi");
  },
};
