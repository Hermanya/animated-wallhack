# to depend on a bower installed component:
# define(['bower_components/componentName/file'])

define(["jquery",
"stageGenerator"], ($, generateStage)->
  $('body').append('jQuery ' + $.fn.jquery + ' loaded!')
  stage = generateStage(2, 8, 4);
  console.log stage
)
