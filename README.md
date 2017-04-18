## README

county, precinct, office, district, party, candidate, votes

## Wayne county

`npm run wayne`

### Data process

0. Use Tabula to extract all the tables
0. Import into Google Spreadsheets to name unnamed columns
0. Export as `.csv` (this is `counties/wayne/csvs/all-named-columns.csv`)

### Exploration notes

0. index of js array is 2 less than the row number in the csv
0. 6627 rows in general
0. 1130 rows have city names in them
  - cities are found in the following columns: `{ Code: 361, '': 760, 'Name Party': 9 }`
0. 1656 is the index of the last president row
