'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      'CREATE EXTENSION IF NOT EXISTS postgis;'
    );

    await queryInterface.createTable('medical_facilities', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      type: {
        type: Sequelize.ENUM('Hospital', 'Clinic', 'Field Medical Station'),
        allowNull: false,
      },
      position: {
        type: 'GEOGRAPHY(POINT, 4326)',
        allowNull: true,
      },
      total_beds: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      available_beds: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
    });

    await queryInterface.createTable('ambulance_vehicles', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      plate_number: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      location: {
        type: 'GEOGRAPHY(POINT, 4326)',
        allowNull: true,
      },
      is_busy: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
    });

    await queryInterface.createTable('ambulance_vehicles_actions', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      vehicle_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'ambulance_vehicles',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      command: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
    });

    await queryInterface.createTable('ambulance_vehicles_history_logs', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      vehicle_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'ambulance_vehicles',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      is_busy_state: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      location_state: {
        type: 'GEOGRAPHY(POINT, 4326)',
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
    });

    await queryInterface.createTable('medical_facilities_history_logs', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      medical_facility_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'medical_facilities',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      available_beds_state: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
    });

    await queryInterface.addIndex('ambulance_vehicles_actions', ['vehicle_id']);
    await queryInterface.addIndex('ambulance_vehicles_history_logs', ['vehicle_id']);
    await queryInterface.addIndex('medical_facilities_history_logs', ['medical_facility_id']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('medical_facilities_history_logs');
    await queryInterface.dropTable('ambulance_vehicles_history_logs');
    await queryInterface.dropTable('ambulance_vehicles_actions');
    await queryInterface.dropTable('ambulance_vehicles');
    await queryInterface.dropTable('medical_facilities');
  },
};
