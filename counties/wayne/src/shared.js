
const addCandidateColumn = (csv, candidates) => {
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

const addPartyColumn = (csv, candidatesByParty) => {
  return csv.map(row => {
    const candidate = row.candidate
    let party
    if (candidate) party = candidatesByParty[candidate.toLowerCase()]
    return Object.assign({}, row, { party })
  })
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

module.exports = {
  addCandidateColumn,
  addPartyColumn,
  removeJunkRows,
  cities: [
    'arcadia',
    'butler',
    'galen',
    'huron',
    'lyons',
    'macedon',
    'marion',
    'ontario',
    'palmyra',
    'rose',
    'savannah',
    'sodus',
    'walworth',
    'williamson',
    'wolcott'
  ]
}
