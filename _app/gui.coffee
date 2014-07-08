module.exports = {
  body: document.getElementsByTagName('main')[0]
  byId: (x) -> document.getElementById x
  specimenNumber: document.getElementById 'specimen-number'
  dimensionNumber: document.getElementById 'dimension-number'
  cellNumber: document.getElementById 'cell-number'
  dimensionSize: document.getElementById 'dimension-size'
  clear: ->
    @body.innerHTML = ''
  numberOfElementsCreated: 0
  createElement: (specimen) ->
    element = document.createElement 'div'
    @body.appendChild element
    element.setAttribute 'id', 'specimen' + @numberOfElementsCreated
    @numberOfElementsCreated++
    element.setAttribute 'class', 'population'
    element.createProjections = ->
      str = ''
      projectionNum = specimen.parameters.numberOfDimensions
      projectionNum = 1 if projectionNum is 2
      for j in [0...projectionNum]
        if (j % 2 is 0)
          str += '<div class="dimension-pair">'
        str += '<div class="dimension">'
        for k in [0...specimen.parameters.numberOfCellsPerDimension]
          str += '<div class="row">'
          for l in [0...specimen.parameters.numberOfCellsPerDimension]
            str += '<div class="cell"></div>'
          str += '</div>'
        str += '</div>'
        if (j % 2 is 1)
          str += '</div>'
      @innerHTML += str

    element.createProjections()
    return element
  setStatus: (specimen) ->
    specimen.element.innerHTML = '<div class="status"><h1>' +
      specimen.status +
      '</h1><h3>age: '+
      specimen.age+
      '</h3></div>'+
      specimen.element.innerHTML
  addEventHandlers: (interval) ->
    @byId('apply').addEventListener 'click', ->
      window.clearInterval interval.id
      interval.init()
    @byId('stop').addEventListener 'click', ->
      if interval.id
        window.clearInterval interval.id
        this.innerHTML = 'continue'
        interval.id = undefined
      else
        interval.id = window.setInterval interval.repeat, 100
        this.innerHTML = 'stop'
}
