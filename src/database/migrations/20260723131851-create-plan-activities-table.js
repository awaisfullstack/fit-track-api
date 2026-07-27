'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('plan_activities', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      plan_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'plans',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      activity_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'activities',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      day_of_week: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      duration_minutes: {
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
    await queryInterface.addIndex('plan_activities', ['plan_id'], {
      name: 'idx_plan_activities_plan_id',
    })

    await queryInterface.addIndex('plan_activities', ['activity_id'], {
      name: 'idx_plan_activities_activity_id',
    })

    await queryInterface.addConstraint('plan_activities', {
      fields: ['plan_id', 'day_of_week'],
      type: 'unique',
      name: 'uk_plan_day_activity',
    });

    await queryInterface.addConstraint('plan_activities', {
      fields: ['day_of_week'],
      type: 'check',
      name: 'chk_plan_activities_day_of_week',
      where: {
        day_of_week: {
          [Sequelize.Op.between]: [1, 7],
        },
      },
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('plan_activities', 'uk_plan_day_activity');
    await queryInterface.removeConstraint('plan_activities', 'chk_plan_activities_day_of_week');
    await queryInterface.dropTable('plan_activities');
  }
};
