'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("activities", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      activity_name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      activity_type: {
        type: Sequelize.ENUM('cardio', 'strength'),
        allowNull: false,
      },
      default_duratiexon_minutes: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      intensity: {
        type: Sequelize.ENUM('low', 'medium', 'high'),
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('activities');
  }
};
