(function() {
  define(["jquery", "stageGenerator"], function($, generateStage) {
    var stage;
    $('body').append('jQuery ' + $.fn.jquery + ' loaded!');
    stage = generateStage(2, 8, 4);
    return console.log(stage);
  });

}).call(this);

//# sourceMappingURL=main.js.map
