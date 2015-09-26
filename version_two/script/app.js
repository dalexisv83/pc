
var app = angular.module('App', ['angular-growl','ngSanitize']);


app.config(['growlProvider', function(growlProvider) {
    'use strict';
    growlProvider.globalEnableHtml(true);
    
}]).directive('chosen',function(){
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
    
}).directive('whenScrolled', function() {
    'use strict';
    return function(scope, elm, attr) {
        var raw = elm[0];
        elm.bind('scroll', function() {
            if (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight) {
                scope.$apply(attr.whenScrolled);
            }
        });
    };
    
}).directive("scrollToTopWhen", ['$timeout',function ($timeout) {
    'use strict';
    return { link: function (scope, element, attrs) {
			scope.$on(attrs.scrollToTopWhen, function () {
			    $timeout(function () {
			       angular.element(element)[0].scrollTop = 0;
			    });
			});
		    }
    };
}]);