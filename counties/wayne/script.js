const path = require('path')

const d3 = require('d3')

const writeJsonToCsv = require('./src/csv')
const { readFile } = require('./src/fsThen')
const processPresidentRows = require('./src/presidents')
const { cities } = require('./src/shared')

const lastPresidentIndex = 1654

const srcFile = path.join(__dirname, './csvs/all-named-columns.csv')
readFile(srcFile)
  .then(str => d3.csvParse(str))
  .then(csv => {
    console.log(`file has ${csv.length} rows`)

    const presidentRows = csv.slice(0, lastPresidentIndex)
    const presidentCsvPath = path.join(__dirname, './clean/data-president.csv')
    const data = processPresidentRows(presidentRows)
    writeJsonToCsv(presidentCsvPath, data).then(() => (
      console.log(`done writing to ${presidentCsvPath}`)
    ))

    return csv
  })
  .catch(e => console.error(e))
