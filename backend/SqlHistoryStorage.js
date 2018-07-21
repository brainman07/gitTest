const mysql = require('mysql');

module.exports = class SqlHistoryStorage {
    constructor(db) {
        this.db = db;
    }

    createConnection() {
        this.con = mysql.createConnection(this.db);

        this.con.connect((err) => {
            if (err) {
                console.log('Error connecting to the db.');
            };
        });
    }

    async saveHistoryEntry(entry) {
        this.createConnection();
        const query =  `INSERT INTO history 
                        (Operation, Number1, Number2, Result, Time_stamp) 
                        VALUES ('${entry.operation}', ${entry.number1}, ${entry.number2}, ${entry.result}, 
                        '${entry.timestamp.getFullYear()}-${entry.timestamp.getMonth()+1}-${entry.timestamp.getDate()} ${entry.timestamp.getHours()}:${entry.timestamp.getMinutes()}:${entry.timestamp.getSeconds()}')`;
        return new Promise( (resolve, reject) => {
            try {
                await this.con.query(query);
            }
            catch {
                console.log("Error executing saveHistoryEntry query.");
            }
            this.con.end();
            resolve();
        });
    }

    async getHistory() {
        this.createConnection();
        const query = "SELECT * FROM history";
        var history;

        return new Promise( (resolve, reject) => {
            this.con.query(query, (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    history = result;
                };
            });
            this.con.end();
            resolve(history);
        });
    }
}