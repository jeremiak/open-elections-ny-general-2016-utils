const { json2csv } = require('json-2-csv')

const { writeFile } = require('./fsThen')

const writeToFile = (filePath, data) => {
  return new Promise((resolve, reject) => {
    json2csv(data, (err, csv) => {
      if (err) return reject(err)
      writeFile(filePath, csv).then(() => {
        console.log(`saved ${data.length} rows to ${filePath}`)
        resolve()
      })
    })
  })
}

module.exports = writeToFile
