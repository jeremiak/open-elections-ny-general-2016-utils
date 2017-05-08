const {
  addCandidateColumn,
  addPartyColumn,
  cities,
  removeJunkRows
} = require('./shared')

const addDistrictColumn = csv => {
  return csv.map((row, index) => {
    const Code = row['Code']
    const C = row['C']
    let district = ''
    let precinct = ''

    Object.keys(row).forEach(key => {
      const value = row[key]
      if (value && value.match(/\d+\/\d+\/2017$/)) {
        let date = new Date(value)
        district = `${date.getMonth() + 1}`
        precinct = `${date.getDate()}`
      }
    })

    if (Code.match(/^\d+/) && C.match(/^\d+/) && district === '') {
      district = Code
      precinct = C
    } else if (Code.match(/\d+\s\d+/)) {
      district = Code.split(' ')[0]
      precinct = Code.split(' ')[1]
    } else if (C.match(/\d+\s\d+/)) {
      district = C.split(' ')[0]
      precinct = C.split(' ')[1]
    }

    return Object.assign({}, row, { district, precinct })
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
    return { city: `${name.toLowerCase()}`, data }
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

const cleanCandidateNames = csv => {
  return csv.map(row => {
    const rawCandidate = row['candidate']
    if (!rawCandidate) return row
    const candidate = candidatesCleanNames[rawCandidate.toLowerCase()]
    return Object.assign({}, row, { candidate })
  })
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

const removeRawCols = csv => {
  const cols = [
    'candidate',
    'district',
    'precinct',
    'party',
    'votes',
    'city',
    'county',
    'office',
  ]

  return csv.map(row => {
    const newRow = cols.map(col => ({
      key: col,
      value: row[col],
    })).reduce((accum, next) => {
      return Object.assign({}, accum, {
        [next.key]: next.value
      })
    }, {})

    return newRow
  })
}

module.exports = csv => {
  const data = removeJunkRows(csv)
  const candidateNames = Object.keys(candidatesByParty)
  const candidates = addCandidateColumn(data, candidateNames)
  const districts = addDistrictColumn(candidates)
  const party = addPartyColumn(districts, candidatesByParty)
  const votes = addVoteCountColumn(party)
  const cleaned = cleanCandidateNames(votes)

  const cities = breakUpByCity(cleaned)
  const newCsv = flattenCitiestoCsv(cities)

  return removeRawCols(newCsv)
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

const candidatesCleanNames = {
  'buchanan': 'buchanan',
  'buchanan no pa': 'buchanan',
  'castle': 'castle',
  'castle no pa': 'castle',
  'clinton/kaine': 'clinton',
  'clinton/kaine democ': 'clinton',
  'clinton/kaine wome': 'clinton',
  'clinton/kaine worki': 'clinton',
  'gyurko': 'gyurko',
  'gyurko no pa': 'gyurko',
  'hoefling': 'hoefling',
  'hoefling no pa': 'hoefling',
  'johnson/weld': 'johnson',
  'johnson/weld indep': 'johnson',
  'johnson/weld libert': 'johnson',
  'kahn': 'kahn',
  'kahn no pa': 'kahn',
  'keniston': 'keniston',
  'keniston no pa': 'keniston',
  'maturen': 'maturen',
  'maturen no pa': 'maturen',
  'mcmullin': 'mcmullin',
  'mcmullin no pa': 'mcmullin',
  'overvotes/voids': 'no party',
  'overvotes/voids voids/': 'no party',
  'scatterings/writ': 'no party',
  'scatterings/writ scatt': 'no party',
  'stein/baraka': 'stein',
  'stein/baraka green': 'stein',
  'trump/pence': 'trump',
  'trump/pence conse': 'trump',
  'trump/pence repub': 'trump',
  'undervotes/blank': 'undervotes/blank',
  'undervotes/blank blank': 'undervotes/blank'
}
