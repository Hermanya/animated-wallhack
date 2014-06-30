module.exports = {
  body: document.getElementsByTagName('main')[0]
  byId: (x) -> document.getElementById x
  specimenNumber: document.getElementById 'specimen-number'
  dimensionNumber: document.getElementById 'dimension-number'
  cellNumber: document.getElementById 'cell-number'
  dimensionSize: document.getElementById 'dimension-size'
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
