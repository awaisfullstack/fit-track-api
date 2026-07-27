'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('audit_logs', {
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
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      action: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },

      entity_type: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },

      entity_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },

      metadata: {
        type: Sequelize.JSONB,
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
    });

    await queryInterface.addIndex('audit_logs', ['user_id'], {
      name: 'idx_audit_logs_user',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('audit_logs');
  },
};