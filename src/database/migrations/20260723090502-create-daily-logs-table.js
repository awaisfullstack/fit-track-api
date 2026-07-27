'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('daily_logs', {
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

      log_date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      weight: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true
      },
      mood_rating: {
        type: Sequelize.INTEGER,
        allowNull: false
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

    await queryInterface.addIndex('daily_logs', ['user_id'], {
      name: 'idx_daily_logs_user_id',
    })
    await queryInterface.addConstraint('daily_logs', {
      fields: ['mood_rating'],
      type: 'check',
      name: 'chk_daily_logs_mood_rating',
      where: {
        mood_rating: {
          [Sequelize.Op.between]: [1, 5],
        },
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('daily_logs', 'chk_daily_logs_mood_rating');
    await queryInterface.dropTable('daily_logs');
  }
};