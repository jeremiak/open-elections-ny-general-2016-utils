// BUCHANAN
// BUCHANAN NO PA
// CASTLE
// CASTLE NO PA
// CLINTON/KAINE
// CLINTON/KAINE DEMOC
// CLINTON/KAINE WOME
// CLINTON/KAINE WORKI
// GYURKO
// GYURKO NO PA
// HOEFLING
// HOEFLING NO PA
// JOHNSON/WELD
// JOHNSON/WELD INDEP
// JOHNSON/WELD LIBERT
// KAHN
// KAHN NO PA
// KENISTON
// KENISTON NO PA
// MATUREN
// MATUREN NO PA
// MCMULLIN
// MCMULLIN NO PA
// OVERVOTES/VOIDS
// OVERVOTES/VOIDS VOIDS/
// SCATTERINGS/WRIT
// SCATTERINGS/WRIT SCATT
// STEIN/BARAKA
// STEIN/BARAKA GREEN
// TRUMP/PENCE
// TRUMP/PENCE CONSE
// TRUMP/PENCE REPUB
// UNDERVOTES/BLANK
// UNDERVOTES/BLANK BLANK

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

const processPresidentRows = (csv) => {
  const data = removeJunkRows(csv)

  return data
}

module.exports = processPresidentRows
