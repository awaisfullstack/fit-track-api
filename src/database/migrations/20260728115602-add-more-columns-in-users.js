'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("users", "google_id", {
      type: Sequelize.STRING(255),
      allowNull: true
    })

    await queryInterface.addColumn("users", "avatar", {
      type: Sequelize.TEXT,
      allowNull: true
    })

    await queryInterface.addColumn("users", "provider", {
      type: Sequelize.ENUM("local", "google"),
      defaultValue: 'local',
      allowNull: false
    })

    await queryInterface.addColumn("users", "hashed_refresh_token", {
      type: Sequelize.TEXT,
      allowNull: true
    })

    await queryInterface.addConstraint("users", {
      fields: ["google_id"],
      type: "unique",
      name: "uniq_users_google_id",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint(
      "users",
      "uniq_users_google_id"
    );

    await queryInterface.removeColumn("users", "google_id");
    await queryInterface.removeColumn("users", "avatar");
    await queryInterface.removeColumn("users", "provider");
    await queryInterface.removeColumn("users", "hashed_refresh_token");

    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_users_provider";'
    );
  }
};
