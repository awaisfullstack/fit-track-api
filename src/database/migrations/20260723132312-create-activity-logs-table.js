'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('activity_logs', {
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
      plan_activity_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'plan_activities',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      log_date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      completion_status: {
        type: Sequelize.ENUM('done', 'partial', 'skipped'),
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

    await queryInterface.addIndex('activity_logs', ['user_id'], {
      name: 'idx_activity_logs_user_id',
    })
    await queryInterface.addConstraint('activity_logs', {
      fields: ['plan_activity_id', 'log_date'],
      type: 'unique',
      name: 'uniq_activity_logs_plan_activity_id_log_date',
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('activity_logs', 'uniq_activity_logs_plan_activity_id_log_date');
    await queryInterface.dropTable('activity_logs')
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_activity_logs_completion_status";');
  }
};
