'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('intakes', {
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
      age: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      sex: {
        type: Sequelize.ENUM('male', 'female'),
        allowNull: false,
      },
      unit_preference: {
        type: Sequelize.ENUM('metric', 'imperial'),
        allowNull: false,
        defaultValue: 'metric',
      },
      height: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
      },
      weight: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
      },
      activity_level: {
        type: Sequelize.ENUM('sedentary', 'light', 'moderate', 'active', 'very_active'),
        allowNull: false,
      },
      occupation: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      sleep_hours: {
        type: Sequelize.DECIMAL(4, 2),
        allowNull: false,
      },
      dietary_preference: {
        type: Sequelize.ENUM('none', 'vegetarian', 'halal'),
        allowNull: false,
      },
      has_hypertension: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      has_diabetes: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      has_joint_issues: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      is_pregnant: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      bmi: {
        type: Sequelize.DECIMAL(4, 1),
        allowNull: false,
      },
      bmr: {
        type: Sequelize.DECIMAL(6, 1),
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
    await queryInterface.addIndex('intakes', ['user_id'], {
      name: 'idx_intakes_user_id',
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('intakes');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_intakes_sex"');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_intakes_unit_preference"');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_intakes_activity_level"');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_intakes_dietary_preference"');
  }
};
