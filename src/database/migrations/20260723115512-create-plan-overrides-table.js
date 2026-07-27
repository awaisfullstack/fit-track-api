'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('plan_overrides', {
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
      coach_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      changed_field: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      old_value: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      new_value: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      reason: {
        type: Sequelize.TEXT,
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
    await queryInterface.addIndex('plan_overrides', ['plan_id'], {
      name: 'idx_plan_overrides_plan_id',
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('plan_overrides');
  }
};
