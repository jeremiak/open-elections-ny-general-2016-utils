const {
  addCandidateColumn,
  addPartyColumn,
  removeJunkRows,
} = require('./shared')


module.exports = csv => {
  const cleaned = removeJunkRows(csv)
  const candidateNames = Object.keys(candidatesByParty)
  const candidates = addCandidateColumn(cleaned, candidateNames)
  const party = addPartyColumn(candidates, candidatesByParty)

  party.forEach((row, index) => {
    console.log(`${index}: ${JSON.stringify(row)}`)
  })
  return {}
}

const candidatesByParty = {
  'schumer': 'no party',
  'schumer democ': 'democ',
  'schumer indep': 'indep',
  'schumer wome': 'wome',
  'schumer worki': 'worki',
  'long': 'no party',
  'long refor': 'refor',
  'long repub': 'repub',
  'long conse': 'conse',
  'merced': 'no party',
  'merced libert': 'libert',
  'overvotes/voids voids/': 'no party',
  'overvotes/voids': 'no party',
  'undervotes/blank blank': 'no party',
  'wilson': 'no party',
  'wilson green': 'green',
  'write ins scatt': 'no party',
  'write ins': 'no party',
}
