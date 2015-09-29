var max_limit = 500, //the maximum limit for ng-repeat to display
    min_limit = 16,  //the minimum limit for ng-repeat to display
    localhost = false, //change this to false on production/staging
    app = angular.module('App', ['angular-growl','ngSanitize']);


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
    return {
	link: function (scope, element, attrs) {
			scope.$on(attrs.scrollToTopWhen, function () {
			    $timeout(function () {
			       angular.element(element)[0].scrollTop = 0;
			    });
			});
	    }
    };
}]).directive("ngWindowPie", function () {
    'use strict';
    /*jslint unparam: true*/
    return function (scope, element, attrs) {
		if (window.PIE) {
		    var el = angular.element(element);				
		    window.PIE.attach(el[0]);
		    el.css({display: "none", visibility: "visible"}).show();			    			    
		} 
    };   
});
/*jslint unparam: false*/