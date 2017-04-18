const fs = require('fs')

const readFile = path => {
  console.log('path', path)
  console.log(__dirname)
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', (err, data) => {
      if (err) return reject(err)
      resolve(data)
    })
  })
}

const writeFile = (path, content) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, content, err => {
      if (err) return reject(err)
      resolve()
    })
  })
}

module.exports = { readFile, writeFile }
