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
            IS_ACTIVE INTEGER DEFAULT 0,
            MILEAGE REAL DEFAULT 0,
            TOTAL_PETROL_LITERS REAL DEFAULT 0,
            TOTAL_PETROL_COST REAL DEFAULT 0
        )`,
        [],
        () => console.log('Vehicle Table Done'),
        error => console.log('Error creating VEHICLES table:', error),
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
            PRICE_PER_LITER REAL
        )`,
        [],
        () => console.log('Petrol logs table done'),
        error => console.log('Error creating PETROL_LOGS table:', error),
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
        error => console.log('Error creating OIL_LOGS table:', error),
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
          if (callback) callback(tempArr);
        },
        error => console.log('Error fetching vehicles:', error),
      );
    });
  }

  addVehicle(name, type, initialReading, callback) {
    const numReading = Number(initialReading) || 0;
    this.db.transaction(tx => {
      tx.executeSql(
        `INSERT INTO VEHICLES (name, type, CURRENT_READING, INITIAL_READING) VALUES (?,?,?,?)`,
        [name, type, numReading, numReading],
        () => {
          this.getVehicles(v => {
            if (callback) callback(v);
          });
        },
        error => console.log('Error adding vehicle:', error),
      );
    });
  }

  getPetrolLog(id, callback) {
    this.db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM PETROL_LOGS WHERE VEHICLE_ID=? ORDER BY ID DESC',
        [id],
        (_, results) => {
          let tempArr = [];
          for (let i = 0; i < results.rows.length; i++) {
            tempArr.push(results.rows.item(i));
          }
          if (callback) callback(tempArr);
        },
        error => console.log('Error fetching petrol logs:', error),
      );
    });
  }

  saveInitialReading(id, reading, callback) {
    const numReading = Number(reading) || 0;
    this.db.transaction(tx => {
      tx.executeSql(
        `UPDATE VEHICLES SET CURRENT_READING=?, INITIAL_READING=? WHERE ID=?`,
        [numReading, numReading, id],
        () => {
          if (callback) callback();
        },
        error => console.log('Error saving initial reading:', error),
      );
    });
  }

  addPetrolLog(
    id,
    date,
    prev,
    curr,
    liters,
    totalcost,
    ppl,
    vehicle,
    callback,
  ) {
    const numPrev = Number(prev) || 0;
    const numCurr = Number(curr) || 0;
    const numLiters = Number(liters) || 0;
    const numTotalCost = Number(totalcost) || 0;
    const numPpl = Number(ppl) || 0;

    const currentTotalCost = Number(vehicle.TOTAL_PETROL_COST) || 0;
    const currentTotalLiters = Number(vehicle.TOTAL_PETROL_LITERS) || 0;

    const newtotalcost = currentTotalCost + numTotalCost;
    const newpls = currentTotalLiters + numLiters;

    const distance = numCurr - numPrev;
    const mileage = numLiters > 0 ? distance / numLiters : 0;

    this.db.transaction(tx => {
      tx.executeSql(
        `INSERT INTO PETROL_LOGS (
          VEHICLE_ID,
          DATE,
          PREVIOUS_READING,
          CURRENT_READING,
          LITERS,
          TOTAL_COST,
          PRICE_PER_LITER
      ) VALUES (?,?,?,?,?,?,?)`,
        [id, date, numPrev, numCurr, numLiters, numTotalCost, numPpl],
        () => console.log('Petrol log added successfully'),
        error => console.log('Error adding petrol log:', error),
      );

      tx.executeSql(
        `UPDATE VEHICLES 
       SET TOTAL_PETROL_COST=?, TOTAL_PETROL_LITERS=?, MILEAGE=?, CURRENT_READING=? 
       WHERE ID=?`,
        [newtotalcost, newpls, mileage, numCurr, id],
        () => console.log('Vehicle updated successfully'),
        error => console.log('Error updating vehicle:', error),
      );

      tx.executeSql(
        `UPDATE OIL_LOGS SET METER_READING=? WHERE ID=(SELECT MAX(ID) FROM OIL_LOGS WHERE VEHICLE_ID=?)`,
        [numCurr, id],
        () => {
          console.log('Latest oil log meter reading synced');
          if (callback) callback();
        },
        error => console.log('Error syncing oil log meter reading:', error),
      );
    });
  }

  updateCurrentReading(vehicleId, newReading, callback) {
    const numId = Number(vehicleId) || 0;
    const numReading = Number(newReading) || 0;

    this.db.transaction(tx => {
      tx.executeSql(
        `UPDATE VEHICLES SET CURRENT_READING=? WHERE ID=?`,
        [numReading, numId],
        () => console.log('Vehicle reading updated'),
        error => console.log('Error updating vehicle reading:', error),
      );

      tx.executeSql(
        `UPDATE PETROL_LOGS SET CURRENT_READING=? WHERE ID=(SELECT MAX(ID) FROM PETROL_LOGS WHERE VEHICLE_ID=?)`,
        [numReading, numId],
        () => console.log('Latest petrol log reading updated'),
        error => console.log('Error updating latest petrol log:', error),
      );

      tx.executeSql(
        `UPDATE OIL_LOGS SET METER_READING=? WHERE ID=(SELECT MAX(ID) FROM OIL_LOGS WHERE VEHICLE_ID=?)`,
        [numReading, numId],
        () => {
          console.log('Latest oil log reading updated');
          if (callback) callback();
        },
        error => console.log('Error updating latest oil log:', error),
      );
    });
  }

  addOilLog(vehicleId, date, currentReading, intervalKm, callback) {
    const numReading = Number(currentReading) || 0;
    const numInterval = Number(intervalKm) || 0;
    const nextDue = numReading + numInterval;

    this.db.transaction(tx => {
      tx.executeSql(
        `INSERT INTO OIL_LOGS (VEHICLE_ID, DATE, METER_READING, INTERVAL_KM, NEXT_DUE_READING) VALUES (?,?,?,?,?)`,
        [vehicleId, date, numReading, numInterval, nextDue],
        () => console.log('Oil log added successfully'),
        error => console.log('Error adding oil log:', error),
      );

      tx.executeSql(
        `UPDATE VEHICLES SET CURRENT_READING=? WHERE ID=?`,
        [numReading, vehicleId],
        () => {
          if (callback) callback();
        },
        error =>
          console.log('Error updating vehicle meter for oil log:', error),
      );
    });
  }

  getOilLog(id, callback) {
    this.db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM OIL_LOGS WHERE VEHICLE_ID=? ORDER BY ID DESC',
        [id],
        (_, results) => {
          let tempArr = [];
          for (let i = 0; i < results.rows.length; i++) {
            tempArr.push(results.rows.item(i));
          }
          if (callback) callback(tempArr);
        },
        error => console.log('Error fetching oil logs:', error),
      );
    });
  }
  addOilLog(vehicleId, date, currentReading, intervalKm, callback) {
    const numId = Number(vehicleId) || 0;
    const numReading = Number(currentReading) || 0;
    const numInterval = Number(intervalKm) || 0;
    const nextDue = numReading + numInterval;

    this.db.transaction(tx => {
      tx.executeSql(
        `INSERT INTO OIL_LOGS (
          VEHICLE_ID,
          DATE,
          METER_READING,
          INTERVAL_KM,
          NEXT_DUE_READING
      ) VALUES (?,?,?,?,?)`,
        [numId, date, numReading, numInterval, nextDue],
        () => {
          console.log('Oil log added successfully');
          if (callback) callback();
        },
        error => console.log('Error adding oil log:', error),
      );
    });
  }
  getLatestOilLog(vehicleId, callback) {
    this.db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM OIL_LOGS WHERE VEHICLE_ID=? ORDER BY ID DESC LIMIT 1',
        [vehicleId],
        (_, results) => {
          if (results.rows.length > 0) {
            if (callback) callback(results.rows.item(0));
          } else {
            if (callback) callback(null);
          }
        },
        error => console.log('Error fetching latest oil log:', error),
      );
    });
  }

  getAllLogs(vehicleId, callback) {
    this.db.transaction(tx => {
      tx.executeSql(
        'SELECT *, "PETROL" as type FROM PETROL_LOGS WHERE VEHICLE_ID=?',
        [vehicleId],
        (_, petrolResult) => {
          let petrolLogs = [];
          for (let i = 0; i < petrolResult.rows.length; i++) {
            petrolLogs.push(petrolResult.rows.item(i));
          }

          tx.executeSql(
            'SELECT *, "OIL" as type FROM OIL_LOGS WHERE VEHICLE_ID=?',
            [vehicleId],
            (_, oilResult) => {
              let oilLogs = [];
              for (let j = 0; j < oilResult.rows.length; j++) {
                oilLogs.push(oilResult.rows.item(j));
              }

              let combined = [...petrolLogs, ...oilLogs];

              // Convert DD-MM-YYYY string to Date timestamp for accurate chronological sorting
              combined.sort((a, b) => {
                const parseDate = dateStr => {
                  if (!dateStr) return 0;
                  const parts = dateStr.split('-');
                  if (parts.length !== 3) return 0;
                  const day = parseInt(parts[0], 10);
                  const month = parseInt(parts[1], 10) - 1;
                  const year = parseInt(parts[2], 10);
                  return new Date(year, month, day).getTime();
                };

                return parseDate(b.DATE) - parseDate(a.DATE);
              });

              if (callback) callback(combined);
            },
            error => console.log('Error fetching oil logs for history:', error),
          );
        },
        error => console.log('Error fetching petrol logs for history:', error),
      );
    });
  }
  deleteVehicle(vehicleId, callback) {
    const numId = Number(vehicleId) || 0;

    this.db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM PETROL_LOGS WHERE VEHICLE_ID=?',
        [numId],
        () => console.log('Petrol logs deleted for vehicle'),
        error => console.log('Error deleting petrol logs:', error),
      );

      tx.executeSql(
        'DELETE FROM OIL_LOGS WHERE VEHICLE_ID=?',
        [numId],
        () => console.log('Oil logs deleted for vehicle'),
        error => console.log('Error deleting oil logs:', error),
      );

      tx.executeSql(
        'DELETE FROM VEHICLES WHERE ID=?',
        [numId],
        () => {
          console.log('Vehicle deleted successfully');
          if (callback) callback();
        },
        error => console.log('Error deleting vehicle:', error),
      );
    });
  }
}

const db = new Database();

export default db;
