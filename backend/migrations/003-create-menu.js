"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("menu", {
      menu_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      nama_menu: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      ukuran: { 
        type: Sequelize.STRING, // Contoh isi: 'Regular', 'Large', atau dibiarkan kosong (NULL)
        allowNull: true, // WAJIB true, karena ada menu yang tidak punya ukuran (contoh: Burger, Es Krim)
      },
      harga: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      kategori_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "kategori", key: "kategori_id" },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT" // mencegah kategori dihapus jika masih ada menunya
      },
      gambar: { 
        type: Sequelize.STRING,
        allowNull: false,
      },
      stok: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      createdAt: { // Ingat, gunakan camelCase agar tidak bentrok dengan bawaan Sequelize
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
    await queryInterface.dropTable("menu");
  },
};