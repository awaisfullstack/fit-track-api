'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('notifications', {
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
        onUpdate: 'CASCADE',
      },
      type: {
        type: Sequelize.ENUM(
          'plan_update', 'weekly_summary', 'missed_log_nudge', 'weigh_in_reminder'
        ),
        allowNull: false,
      },
      title: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      message: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      read_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      entity_id: {
        type: Sequelize.UUID,
        allowNull: true
      },
      entity_type: {
        type: Sequelize.STRING(50),
        allowNull: true
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

    await queryInterface.addIndex('notifications', ['user_id'], {
      name: 'idx_notification_user_id'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('notifications');
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_notifications_type";'
    );
  }
};