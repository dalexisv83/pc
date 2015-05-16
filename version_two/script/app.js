var app = angular.module('App', []);

/**
 * Directive for chosen.js jquery plug-in
 */
app.directive('chosen',function(){
   var linker = function(scope,element,attrs){
       
       var list = attrs['chosen'];
    
       scope.$watch(list,function(){
	   element.trigger('chosen:updated');
       });
       
       scope.$watch(attrs['ngModel'], function() {          
           element.trigger('chosen:updated');
       });

       element.chosen();
   };
   
   return{
     restrict:'A',
     link: linker
   };
});