'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('push_subscriptions', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      endpoint: {
        type: Sequelize.TEXT,
        allowNull: false,
        unique: true,
      },
      keys: {
        type: Sequelize.JSONB,
        allowNull: false
      },
      quiet_hours_enabled: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },

      quiet_start_time: {
        type: Sequelize.TIME,
        allowNull: true,
      },

      quiet_end_time: {
        type: Sequelize.TIME,
        allowNull: true,
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

    await queryInterface.addIndex('push_subscriptions', ['user_id'], {
      name: 'idx_push_subscriptions_user_id',
    });

    await queryInterface.addConstraint('push_subscriptions', {
      fields: ['user_id', 'endpoint'],
      type: 'unique',
      name: 'unique_user_endpoint',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('push_subscriptions', 'unique_user_endpoint');
    await queryInterface.dropTable('push_subscriptions');
  }
};