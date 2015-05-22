app.controller('AppController', function ($scope, $filter, growl) {
    
    var orderBy = $filter('orderBy');
    var localhost = true; //change to false on production
    
    $scope.current_pkg = null; //holds the selected current package object
    $scope.requested_pkg = null; //holds the selected requested package object    
    
    $scope.current_pkgs = []; //holds the collection of packages on the current package dropdown
    $scope.requested_pkgs = []; //holds the collection of packages on the requested package dropdown
    
    $scope.current_channels = [];  //holds the collection of current packages's channels
    $scope.requested_channels = []; //holds the collection of requested package's channels
    
    $scope.gained_channels = []; //holds the gained channels
    $scope.lost_channels = []; //holds the lost channels
    
    $scope.dataStore = new dataStore(data); //expose the datasource class to the view
    $scope.UrlFormatter = new UrlFormatter(localhost); //expose the urlformatter class to the view
    $scope.Utility = new Utility(); //expose the utility class to the view
    
    $scope.sorted_column = ''; //holds the column currently sorted
    
    $scope.show_current_channels = true; //determine to show/hide the current channels
    $scope.show_requested_channels = true; //determine to show/hide the requested channels
    $scope.show_gained_channels = true; //determine to show/hide the gained channels
    $scope.show_lost_channels = true; //determine to show/hide the lost channels
    
    $scope.saved_amt = 0; //amount being saved
    $scope.pay_more_amt = 0; //amount that will pay more
   
    
    /**
     * Called on page load
     */
    $scope.init = function(){
       //identify the collection of requested package ids
       var requested_pkg_ids = data.package_compare.requested;
       //identify the collection of current package ids
       var current_pkg_ids = data.package_compare.current;
       //fill the packages dropdowns
       $scope.requested_pkgs = $scope.dataStore.getPackages(requested_pkg_ids); 
       $scope.current_pkgs = $scope.dataStore.getPackages(current_pkg_ids);       
    };
   
    
    /**
     * Call your jquery functionality here 
     */
    angular.element(document).ready(function () {
        //initialize tooltip
        var tool_tip_btn = $('#genreLegend');
        var tooltip = new toolTip(tool_tip_btn);
        //activate the genre codes tooltip
        var genre_codes_container = $('#genreCodes');
        tooltip.genreToolTip(genre_codes_container);    
    });
    
    
    //watch for a change in current package
    $scope.$watchCollection('current_pkg', function() {        
        if ($scope.current_pkg) {
            $scope.saved_amt = 0;
            $scope.pay_more_amt = 0;
            
            //get the current channels out of the selected current package of the customer 
            $scope.current_channels = $scope.dataStore.getChannels($scope.current_pkg.channels);
           
            //get the difference between the current and requested package
            var diff = $scope.dataStore.getPackageDiff($scope.current_pkg,$scope.requested_pkg);
            if (!jQuery.isEmptyObject(diff)) {
                $scope.gained_channels = $scope.dataStore.getChannels(diff.gained_channels, false);
                $scope.lost_channels = $scope.dataStore.getChannels(diff.lost_channels, false);
            }
            
            //get the price diff. to determine if customer will save or pay more
            var price_diff = $scope.dataStore.getPriceDiff($scope.current_pkg,$scope.requested_pkg);
            if (!jQuery.isEmptyObject(price_diff)) {
                $scope.saved_amt = price_diff.saved_amt;
                $scope.pay_more_amt = price_diff.pay_more_amt;
            }
            //show package tip
            growl.addInfoMessage($scope.current_pkg.tip);   
        }       
    });
    
    //watch for a change in requested package
    $scope.$watchCollection('requested_pkg', function() {        
        if ($scope.requested_pkg) {            
            $scope.saved_amt = 0;
            $scope.pay_more_amt = 0;
            
            //get the requested channels out of the selected requested package of the customer
            $scope.requested_channels = $scope.dataStore.getChannels($scope.requested_pkg.channels);
            
            //get the difference between the current and requested package
            var diff = $scope.dataStore.getPackageDiff($scope.current_pkg,$scope.requested_pkg);
            if (!jQuery.isEmptyObject(diff)) {
                $scope.gained_channels = $scope.dataStore.getChannels(diff.gained_channels, false);
                $scope.lost_channels = $scope.dataStore.getChannels(diff.lost_channels, false);                
            }
            
             //get the price diff. to determine if customer will save or pay more
            var price_diff = $scope.dataStore.getPriceDiff($scope.current_pkg,$scope.requested_pkg);
            if (!jQuery.isEmptyObject(price_diff)) {
                $scope.saved_amt = price_diff.saved_amt;
                $scope.pay_more_amt = price_diff.pay_more_amt;
            }           
        }        
    });
   
    /**
     * Sort functionality for channels
     * @param {string} dataset the name of the current data set being sorted
     * @param {mixed} channels collection of channel objects
     * @param {string} predicate the property to sort
     * @param {boolean} reverse 
     */
    $scope.sort = function(data_set ,channels, predicate, reverse) {
        channels = orderBy(channels, predicate, reverse);        
        //assign the selected class to the scope
        $scope.sorted_column = $scope.Utility.selectedClass(data_set + ' ' + predicate,reverse);       
        return channels;
    };    
    
   
});