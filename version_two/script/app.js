
var app = angular.module('App', ['angular-growl','ngSanitize']);

//global configuration for growl
app.config(['growlProvider', function(growlProvider) {
    'use strict';
    growlProvider.globalEnableHtml(true);    
}]);

/**
 * Directive for chosen.js jquery plug-in
 */
app.directive('chosen',function(){
    'use strict';
    var linker = function(scope,element,attrs){
       
       var list = attrs.chosen;
    
       scope.$watch(list,function(){
	   element.trigger('chosen:updated');
       });
       
       scope.$watch(attrs.ngModel, function() {          
	   element.trigger('chosen:updated');
       });
    
       element.chosen();
    };
    
    return{
     restrict:'A',
     link: linker
    };
});