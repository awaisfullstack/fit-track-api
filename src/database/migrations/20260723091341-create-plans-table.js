'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('plans', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      goal_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'goals',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      week_number: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      calorie_target: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      start_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      end_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('active', 'completed', 'superseded'),
        defaultValue: 'active',
        allowNull: false,
      },
      step_target: {
        type: Sequelize.INTEGER,
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

    await queryInterface.addIndex('plans', ['goal_id'], {
      name: 'idx_plans_goal_id',
    })
    await queryInterface.addConstraint('plans', {
      fields: ['goal_id', 'week_number'],
      type: 'unique',
      name: 'uniq_plans_goal_id_week_number',
    })
    await queryInterface.addConstraint('plans', {
      fields: ['week_number'],
      type: 'check',
      name: 'chk_plans_week_number',
      where: {
        week_number: {
          [Sequelize.Op.gt]: 0,
        }
      }
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('plans', 'uniq_plans_goal_id_week_number');
    await queryInterface.removeConstraint('plans', 'chk_plans_week_number');
    await queryInterface.dropTable('plans');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_plans_status";');
  }
};
