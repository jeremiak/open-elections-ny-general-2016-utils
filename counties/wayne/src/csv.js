const { json2csv } = require('json-2-csv')

const { writeFile } = require('./fsThen')

const jsonToCsv = json => {
  const headers = Object.keys(json[0])

  const rows = json.map(row => {
    const values = headers.map(key => row[key])
    return values.join(',')
  })

  return [headers.join(',')].concat(rows)
}

const writeToFile = (filePath, data) => {
  return new Promise((resolve, reject) => {
    const csv = jsonToCsv(data)
    writeFile(filePath, csv.join('\n')).then(() => {
      console.log(`saved ${data.length} rows to ${filePath}`)
      resolve()
    })
  })
}

module.exports = writeToFile
