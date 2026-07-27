'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('weekly_summaries', {
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
      average_weight: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true
      },
      week_start_date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      week_end_date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      streak: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      summary_text: {
        type: Sequelize.TEXT,
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

    await queryInterface.addIndex('weekly_summaries', ['user_id'], {
      name: 'idx_weekly_summaries_user_id',
    });

    await queryInterface.addConstraint('weekly_summaries', {
      fields: ['user_id', 'week_start_date'],
      type: 'unique',
      name: 'uniq_weekly_summaries_user_week',
    });

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('weekly_summaries', 'uniq_weekly_summaries_user_week');
    await queryInterface.dropTable('weekly_summaries');
  }
};