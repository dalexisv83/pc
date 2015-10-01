var max_limit = 500, //the maximum limit for ng-repeat to display
    min_limit = 16,  //the minimum limit for ng-repeat to display
    localhost = false, //change this to false on production/staging
    app = angular.module('App', ['angular-growl','ngSanitize']);


app.config(['growlProvider', function(growlProvider) {
    'use strict';
    growlProvider.globalEnableHtml(true);
    
}]).directive('chosen',['$timeout',function($timeout){
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
       
       if (window.PIE) {
	    $timeout(function () {
		window.PIE.attach(angular.element(element).parent().find(".chosen-single")[0]);	      
		window.PIE.attach(angular.element(element).parent().find(".chosen-drop")[0]);	      
	    });
       }
       
    };
    
    return{
     restrict:'A',
     link: linker
    };
    
}]).directive("scrollToTopWhen", ['$timeout',function ($timeout) {
    'use strict';
    return {
	link: function (scope, element, attrs) {
		scope.$on(attrs.scrollToTopWhen, function () {
		    $timeout(function () {
		       angular.element(element)[0].scrollTop = 0;
		    });
		});
	    }
    };
}]).directive("ngWindowPie", ['$timeout', function ($timeout) {
    'use strict';
    /*jslint unparam: true*/
    return function (scope, element, attrs) {
	if (window.PIE) {
	    $timeout(function () {
		window.PIE.attach(angular.element(element)[0]);	      
	    });
	}
    };   
}]);
/*jslint unparam: false*/


/**
 * Please leave this code commented for now till Ankam and team fix the issue on Tridion parsing incorrectly the > symbol
 */

/*app.directive('whenScrolled', function() {
    'use strict';
    return function(scope, elm, attr) {
        var raw = elm[0];
        elm.bind('scroll', function() {
            if(raw.scrollTop + raw.offsetHeight >= raw.scrollHeight) {
                scope.$apply(attr.whenScrolled);
            }
        });
    };
    
});*/