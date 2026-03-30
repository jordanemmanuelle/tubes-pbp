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
      harga: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      kategori: { 
        type: Sequelize.ENUM("sarapan pagi", "daging sapi", "ayam", "minuman", "makanan penutup", "happy meal", "camilan"), // MASIH HARUS DIPIKIRIN LAGI KARENA KEBANYAKAN
        allowNull: false,
      },
      gambar: { 
        type: Sequelize.STRING,
        allowNull: false,
      },
      stok: {
        type: Sequelize.INTEGER,
        allowNull: true
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("menu");
  },
};
