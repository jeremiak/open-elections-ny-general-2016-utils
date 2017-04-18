const { cities } = require('./shared')
const { writeFile } = require('./fsThen')

const addCandidateColumn = csv => {
  const candidates = Object.keys(candidatesByParty)
  return csv.map(row => {
    const keys = Object.keys(row)
    let candidate
    keys.forEach(key => {
      const value = row[key]
      if (value && candidates.includes(value.toLowerCase())) candidate = value
    })

    return Object.assign({}, row, {
      candidate
    })
  })
}

const addPartyColumn = csv => {
  return csv.map(row => {
    const candidate = row.candidate
    let party
    if (candidate) party = candidatesByParty[candidate.toLowerCase()]
    return Object.assign({}, row, { party })
  })
}

const addVoteCountColumn = csv => {
  return csv.map(row => {
    const total = row['Total'] !== ''
    const k = row['K'] !== ''
    let votes

    if (total) {
      votes = row['Total']
    } else if (k) {
      votes = row['K']
    }

    return Object.assign({}, row, { votes })
  })
}

const breakUpByCity = csv => {
  const cities = getCityCoordinates(csv)
  return cities.map((city, index) => {
    const name = csv[city.row][city.column]
    const previous = (index > 0) ? (cities[index - 1].row + 1) : 0
    const data = csv.slice(previous, city.row)
    return { city: `${name}`, data }
  }).reduce((accum, next) => {
    if (accum[next.city]) {
      let old = accum[next.city]
      accum[next.city] = old.concat(next.data)
    } else {
      accum[next.city] = next.data
    }
    return accum
  }, {})
}

const flattenCitiestoCsv = cities => {
  return Object.keys(cities).map(city => {
    const data = cities[city]
    return data.map(d => {
      return Object.assign({}, d, {
        city,
        county: 'wayne',
        office: 'president'
      })
    })
  }).reduce((accum, next) => (accum.concat(next)), [])
}

const getCityColumn = row => {
  const cityKeys = Object.keys(row).map(key => {
    const value = row[key]
    if (value && cities.includes(value.toLowerCase())) return key
  }).filter(value => value !== undefined)

  return cityKeys.pop()
}

const getCityCoordinates = csv => {
  return cityIndexes = csv.map((row, index) => {
    const cityColumn = getCityColumn(row)
    if (cityColumn) return { column: cityColumn, row: index }
  }).filter(value => value)
}

const removeJunkRows = csv => {
  return csv.filter(row => {
    const value = row['Name Party'].toLowerCase()
    if (value.includes('county election')) return false
    if (value.includes('pos')) return false
    if (value.includes('* * * * * * * * *')) return false
    if (value.includes('column')) return false
    if (value === 'name party') return false
    if (value === 'name') return false

    return true
  })
}

module.exports = (csv) => {
  const data = removeJunkRows(csv)
  const candidates = addCandidateColumn(data)
  const party = addPartyColumn(candidates)
  const votes = addVoteCountColumn(party)

  const cities = breakUpByCity(votes)
  const newCsv = flattenCitiestoCsv(cities)


  return newCsv
}


const candidatesByParty = {
  'buchanan': 'no party',
  'buchanan no pa': 'no party',
  'castle': 'no party',
  'castle no pa': 'no party',
  'clinton/kaine': 'no party',
  'clinton/kaine democ': 'democ',
  'clinton/kaine wome': 'wome',
  'clinton/kaine worki': 'worki',
  'gyurko': 'no party',
  'gyurko no pa': 'no party',
  'hoefling': 'no party',
  'hoefling no pa': 'no party',
  'johnson/weld': 'no party',
  'johnson/weld indep': 'indep',
  'johnson/weld libert': 'libert',
  'kahn': 'no party',
  'kahn no pa': 'no party',
  'keniston': 'no party',
  'keniston no pa': 'no party',
  'maturen': 'no party',
  'maturen no pa': 'no party',
  'mcmullin': 'no party',
  'mcmullin no pa': 'no party',
  'overvotes/voids': 'no party',
  'overvotes/voids voids/': 'no party',
  'scatterings/writ': 'no party',
  'scatterings/writ scatt': 'no party',
  'stein/baraka': 'no party',
  'stein/baraka green': 'green',
  'trump/pence': 'no party',
  'trump/pence conse': 'conse',
  'trump/pence repub': 'repub',
  'undervotes/blank': 'no party',
  'undervotes/blank blank': 'no party'
}
