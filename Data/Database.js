import { Alert } from 'react-native';
import { openDatabase } from 'react-native-sqlite-storage';

class Database {
  constructor() {
    this.db = openDatabase(
      { name: 'tahmoor.db' },
      () => console.log('db created'),
      error => console.log(error),
    );
    this.cars = [];
    this.initTables();
  }
  initTables() {
    this.db.transaction(tx => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS VEHICLES (
            ID INTEGER PRIMARY KEY AUTOINCREMENT,
            NAME TEXT,
            CURRENT_READING REAL DEFAULT 0,
            INITIAL_READING REAL DEFAULT 0,
            TYPE TEXT,
            IS_ACTIVE INTEGER DEFAULT 0
        )`,
        [],
        () => console.log('Vehicle Table Done'),
        error => console.log(error),
      );

      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS PETROL_LOGS (
            ID INTEGER PRIMARY KEY AUTOINCREMENT,
            VEHICLE_ID INTEGER,
            DATE TEXT,
            PREVIOUS_READING REAL,
            CURRENT_READING REAL,
            LITERS REAL,
            TOTAL_COST REAL,
            PRICE_PER_LITER REAL,
            MILEAGE REAL
        )`,
        [],
        () => console.log('Petrol logs table done'),
        error => console.log(error),
      );
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS OIL_LOGS (
            ID INTEGER PRIMARY KEY AUTOINCREMENT,
            VEHICLE_ID INTEGER,
            DATE TEXT,
            METER_READING REAL,
            INTERVAL_KM REAL,
            NEXT_DUE_READING REAL
        )`,
        [],
        () => console.log('Oil logs table done'),
        error => console.log(error),
      );
    });
  }

  getVehicles(callback) {
    this.db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM VEHICLES',
        [],
        (tx, result) => {
          let tempArr = [];
          for (let i = 0; i < result.rows.length; i++) {
            tempArr.push(result.rows.item(i));
          }
          callback(tempArr);
        },
        error => console.log(error),
      );
    });
  }

  addVehicle(name, type, callback) {
    this.db.transaction(tx => {
      tx.executeSql(
        `INSERT INTO VEHICLES (name, type) VALUES (?,?) `,
        [name, type],
        () =>
          this.getVehicles(v => {
            callback(v);
          }),
      );
    });
  }
  getPetrolLog(id, callback) {
    this.db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM PETROL_LOGS WHERE VEHICLE_ID=?',
        [id],
        (_, results) => {
          if (results.rows.length < 1) {
            callback([]);
          } else {
            let tempArr = [];
            for (let i = 0; i < results.rows.length; i++) {
              tempArr.push(results.rows.item(i));
            }
            callback(tempArr);
          }
        },
        error => console.log(error),
      );
    });
  }
  saveInitialReading(id, reading, callback) {
    this.db.transaction(tx => {
      tx.executeSql(
        `UPDATE VEHICLES SET CURRENT_READING=? WHERE ID=?`,
        [reading, id],
        () => {
          callback();
        },
      );
    });
  }
}

const db = new Database();

export default db;
