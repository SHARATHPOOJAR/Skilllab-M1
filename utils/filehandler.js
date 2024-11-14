const fs = require('fs');
const path = require('path');

// Function to write data to a JSON file
function writeJSON(filePath, data) {
    return new Promise((resolve, reject) => {
        fs.writeFile(filePath, JSON.stringify(data, null, 4), (err) => {
            if (err) {
                return reject(err);
            }
            resolve('File written successfully!');
        });
    });
}

// Function to read data from a JSON file
function readJSON(filePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                return reject(err);
            }
            resolve(JSON.parse(data));
        });
    });
}

// Function to append data to a JSON file (for logs)
function appendJSON(filePath, newData) {
    return new Promise(async (resolve, reject) => {
        try {
            let data = [];
            if (fs.existsSync(filePath)) {
                data = await readJSON(filePath);
            }
            data.push(newData);
            await writeJSON(filePath, data);
            resolve('Data appended successfully!');
        } catch (err) {
            reject(err);
        }
    });
}

// Function to write data to a CSV file
function writeCSV(filePath, data) {
    return new Promise((resolve, reject) => {
        const header = Object.keys(data[0]).join(',') + '\\n';
        const rows = data.map(row => Object.values(row).join(',')).join('\\n');
        const csv = header + rows;

        fs.writeFile(filePath, csv, (err) => {
            if (err) {
                return reject(err);
            }
            resolve('CSV file written successfully!');
        });
    });
}

module.exports = { writeJSON, readJSON, appendJSON, writeCSV };
