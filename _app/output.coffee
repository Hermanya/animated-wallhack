module.exports = (specimen) ->
  state = specimen.tree
  element = specimen.element
  size = specimen.parameters.numberOfCellsPerDimension
  projectionNum = specimen.parameters.numberOfDimensions
  cellsToToggle = specimen.cellsToToggle
  switch projectionNum
    when 1
      element.innerHTML = 'This state is unrenderable! See console output.'
    when 2
      for cell in cellsToToggle
        x = element.childNodes[0]
        x = x.childNodes[0]
        x = x.childNodes[cell.path[0]]
        x = x.childNodes[cell.path[1]]
        x.classList.toggle 'alive'
    else
      project = (state, index) ->
        for row in [0...size]
          for column in [0...size]
            x = element.childNodes[~~(index / 2)]
            x = x.childNodes[index % 2]
            x = x.childNodes[row]
            x = x.childNodes[column]
            if state[row][column].isLive
              x.classList.add 'alive'
            else
              x.classList.remove 'alive'
      reduce = (state, index) ->
        mergeBranchesOfLeaves = (array) ->
          for j in [0...size]
            array[0][j].path.splice(-2,1)
            for k in [1...size]
              if array[0][j].isLive
                break
              else
                array[0][j].isLive = array[k][j].isLive
          return array[0]
        mergeBranchesOfBranches = (array) ->
          for i in [0...size]
            for j in [0...size]
              array[0][i][j].path.splice(-3,1)
              for k in [1...size]
                if (array[0][i][j].isLive)
                  break
                else
                  array[0][i][j].isLive = array[k][i][j].isLive
          return array[0]
        mergeLeaves = (array) ->
          value = array.reduce ((a, c) -> if c.isLive then a + 1 else a), 0
          array[0].path.pop()
          reducedCell = isLive: !!value, path: array[0].path
          return reducedCell
        iter = (dimensions, level) ->
          if dimensions.path # is last dimension
            return dimensions
          else
            array = []
            for i in [0...size]
              array.push iter dimensions[i], level + 1
            if level is index or level is (index + 1) % projectionNum
              return array
            if array[0].path
              return mergeLeaves array
            if array[0][0].path
              return mergeBranchesOfLeaves array
            if array[0][0][0].path
              return mergeBranchesOfBranches array
        iter state, 0
      for i in [0...projectionNum]
        _state = JSON.parse JSON.stringify state
        project (reduce _state, i), i
    #element.innerHTML = 'This state is unrenderable! See console output.'
###
    Project multi-dimensional states to 2D
    e.g. state[i][j][reduced]..[states]
###
