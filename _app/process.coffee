module.exports = (specimen) ->
  list = specimen.list
  specimen.cellsToToggle = []
  dimensionSize = specimen.parameters.numberOfCellsPerDimension
  dimensionNum = specimen.parameters.numberOfDimensions
# Number of adjacent cells = 3 ^ numberOfDimensions - 1
  numberOfAdjacentCells = Math.pow(3, dimensionNum) - 1
  k = 1 / 8 * numberOfAdjacentCells
  for group in list
    counter = 0
    for i in [1..numberOfAdjacentCells]
      if group[i].isLive
        counter++
    givenCell = group[0]
    if givenCell.isLive
      if counter < 2 or counter > 3
        specimen.cellsToToggle.push givenCell
    else
      if counter > 2 and counter < 4
        specimen.cellsToToggle.push givenCell

  for cell in specimen.cellsToToggle
    cell.isLive = ! cell.isLive

  string = list.toString()
  if specimen.cellsToToggle.length is 0
    specimen.status = 'empty'
    if (string.indexOf '1') isnt -1
      specimen.status = 'still'
  else
    for previous, index in specimen.states
      if string is previous
        specimen.status = 'period ' + (specimen.states.length - index)
  specimen.states.push string
  specimen.age++
