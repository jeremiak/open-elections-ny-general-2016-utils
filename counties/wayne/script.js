const path = require('path')

const d3 = require('d3')

const writeJsonToCsv = require('./src/csv')
const { readFile } = require('./src/fsThen')
const processPresidentRows = require('./src/president')
const processSenatorRows = require('./src/senator')
const { cities } = require('./src/shared')

const indexes = {
  'president': [0, 1654],
  'senator': [1658, 2700],
}
const lastPresidentIndex = 1654

const srcFile = path.join(__dirname, './csvs/all-named-columns.csv')
readFile(srcFile)
  .then(str => d3.csvParse(str))
  .then(csv => {
    console.log(`file has ${csv.length} rows`)
    return csv
  })
  .then(csv => {
    // console.log('president')
    // const start = indexes.president[0]
    // const end = indexes.president[1]
    //
    // const presidentRows = csv.slice(start, end)
    // const presidentCsvPath = path.join(__dirname, './clean/data-president.csv')
    // const data = processPresidentRows(presidentRows)
    // writeJsonToCsv(presidentCsvPath, data).then(() => (
    //   console.log(`done writing to ${presidentCsvPath}`)
    // ))

    return csv
  })
  .then(csv => {
    console.log('us senator')
    const start = indexes.senator[0]
    const end = indexes.senator[1]

    const senatorRows = csv.slice(start, end)
    const senatorCsvPath = path.join(__dirname, './clean/data-senator.csv')
    const data = processSenatorRows(senatorRows)
    writeJsonToCsv(senatorCsvPath, data).then(() => (
      console.log(`done writing to ${senatorCsvPath}`)
    ))

    return csv
  })
  .catch(e => console.error(e))
