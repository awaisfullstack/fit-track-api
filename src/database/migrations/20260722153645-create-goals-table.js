'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('goals', {
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
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      target_weight: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
      },
      target_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      weekly_loss_rate: {
        type: Sequelize.DECIMAL(3, 2),
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('active', 'achieved', 'abandoned'),
        defaultValue: 'active',
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

    await queryInterface.addIndex('goals', ['user_id'], {
      name: 'idx_goals_user_id',
    })

    await queryInterface.addConstraint('goals', {
      fields: ['weekly_loss_rate'],
      type: 'check',
      name: 'chk_goals_weekly_loss_rate',
      where: {
        weekly_loss_rate: {
          [Sequelize.Op.between]: [0.5, 1.0],
        }
      }
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('goals', 'chk_goals_weekly_loss_rate');
    await queryInterface.dropTable('goals');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_goals_status";');
  }
};
