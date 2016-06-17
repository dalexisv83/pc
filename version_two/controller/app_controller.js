app.controller('AppController', ['$scope','growl',function ($scope, growl) {
    'use strict';    
    $scope.current_pkg = null; //holds the selected current package object
    $scope.requested_pkg = null; //holds the selected requested package object    
    
    $scope.current_pkgs = []; //holds the collection of packages on the current package dropdown
    $scope.requested_pkgs = []; //holds the collection of packages on the requested package dropdown
    
    $scope.current_channels = [];  //holds the collection of current packages's channels
    $scope.requested_channels = []; //holds the collection of requested package's channels
    
    $scope.gained_channels = []; //holds the gained channels
    $scope.lost_channels = []; //holds the lost channels
    
    $scope.dataStore = new DataStore(data,att_channels); //expose the datasource class to the view
    $scope.UrlFormatter = new UrlFormatter(localhost); //expose the urlformatter class to the view
    $scope.Utility = new Utility(); //expose the utility class to the view
    
    $scope.sorted_column = ''; //holds the column currently sorted
    
    $scope.show_current_channels = true; //determine to show/hide the current channels
    $scope.show_requested_channels = true; //determine to show/hide the requested channels
    $scope.show_gained_channels = false; //determine to show/hide the gained channels
    $scope.show_lost_channels = false; //determine to show/hide the lost channels
    
    $scope.saved_amt = 0; //amount being saved
    $scope.pay_more_amt = 0; //amount that will pay more
    
    $scope.volumes = []; //hold the collection of volumes
    $scope.volume = null; //hold the value for the selected volume
   
    $scope.sortType = 'channelname';
    
    $scope.current_pkg_limit = min_limit;
    $scope.requested_pkg_limit = min_limit;
    $scope.gained_channels_limit = min_limit;
    $scope.lost_channels_limit = min_limit;
    
    /**
     * Increases the limit initially set for ng-repeat everytime the user scrolls a dynamic channel
     */
    $scope.loadMore = function(limit) {
        if (limit <= max_limit) {
          limit = limit + min_limit;
        } 
        return limit;
    };
    
    $scope.resetLimit = function(){
        $scope.current_pkg_limit = min_limit;
        $scope.requested_pkg_limit = min_limit;
        $scope.gained_channels_limit = min_limit;
        $scope.lost_channels_limit = min_limit;
        $scope.$broadcast("items_changed");
    };
   
    /**
     * Called on page load
     */
    $scope.init = function(){
       var requested_pkg_ids = data.package_compare.requested, current_pkg_ids = data.package_compare.current;
       
       //fill the packages dropdowns
       $scope.requested_pkgs = $scope.dataStore.getPackages(requested_pkg_ids); 
       $scope.current_pkgs = $scope.dataStore.getPackages(current_pkg_ids);
       //if there is a volume property and only it is still empty
       if (data.package_compare.volumes && $scope.volumes.length === 0){
         $scope.volumes = $scope.dataStore.getVolumes(data.package_compare.volumes);
       }
       
    };
   
    
    /**
     * Call your jquery functionality here 
     */
    angular.element(document).ready(function () {
        var tool_tip_btn = $('#genreLegend'),
        tooltip = new ToolTip(tool_tip_btn),
        genre_codes_container = $('#genreCodes'),
        btn = $('#comment_btn'),
        root_url = '%%pub%%',
        class_name = 'comment-btn', //add a class of comment-btn
        comment_btn = new CommentBtn(btn,class_name,root_url);
        
        //initialize tooltip
        tooltip.genreToolTip(genre_codes_container);
        
        //initiate the comment btn
        comment_btn.init();        
    });
    
   
    //watch change in selected volume
    $scope.$watchCollection('volume', function() {        
        $scope.init();
        if ($scope.current_pkg && $scope.requested_pkg) {
            //get the price diff. to determine if customer will save or pay more
            var price_diff = $scope.dataStore.getPriceDiff($scope.current_pkg,$scope.requested_pkg,$scope.volume);
            if (!jQuery.isEmptyObject(price_diff)) {
             $scope.saved_amt = price_diff.saved_amt;
             $scope.pay_more_amt = price_diff.pay_more_amt;
            }         
        }     
    });
    
    //watch for a change in current package
    $scope.$watchCollection('current_pkg', function() {       
        if ($scope.current_pkg) {    
            
            try{
               dcsMultiTrack("DCSext.tool_package_compare_selected_user_packages","Current package change");
            }catch (ignore) { }


            $scope.current_pkg_limit = min_limit; //reset the limit for current package to minimum            

            $scope.saved_amt = 0;
            $scope.pay_more_amt = 0;
            
            //get the current channels out of the selected current package of the customer 
            $scope.current_channels = $scope.dataStore.getChannels($scope.current_pkg.channels,$scope.current_pkg.type);
            $scope.current_channels2 = $scope.dataStore.getChannels($scope.current_pkg.channels,$scope.current_pkg.type);

            //get the difference between the current and requested package
            var diff = $scope.dataStore.getPackageDiff($scope.current_pkg,$scope.requested_pkg),
            channels_provider_diff,
            //get the price diff. to determine if customer will save or pay more
            price_diff = $scope.dataStore.getPriceDiff($scope.current_pkg,$scope.requested_pkg,$scope.volume);            
            
            if (!$.isEmptyObject(diff)) {                
                $scope.gained_channels_limit = min_limit;
                $scope.lost_channels_limit = min_limit;               
                channels_provider_diff = $scope.dataStore.diffChannelsByProvider($scope.current_pkg,$scope.requested_pkg,diff);
                $scope.gained_channels = channels_provider_diff.gained_channels;
                $scope.lost_channels = channels_provider_diff.lost_channels;                              
            }     
            
            if (!$.isEmptyObject(price_diff)) {
                $scope.saved_amt = price_diff.saved_amt;
                $scope.pay_more_amt = price_diff.pay_more_amt;
            }
            
            $scope.$broadcast("items_changed");
        }
      
    });
    
    //watch for a change in requested package
    $scope.$watchCollection('requested_pkg', function() {        
        
        if ($scope.requested_pkg) {
            
            try{
               dcsMultiTrack("DCSext.tool_package_compare_selected_user_packages","Current package change");
            }catch (ignore) { }
            
            $scope.requested_pkg_limit = min_limit;
            
            $scope.saved_amt = 0;
            $scope.pay_more_amt = 0;
            
            //get the requested channels out of the selected requested package of the customer
            $scope.requested_channels = $scope.dataStore.getChannels($scope.requested_pkg.channels,$scope.requested_pkg.type);
            
            //get the difference between the current and requested package
            var diff = $scope.dataStore.getPackageDiff($scope.current_pkg,$scope.requested_pkg),
            channels_provider_diff,
            //get the price diff. to determine if customer will save or pay more
            price_diff = $scope.dataStore.getPriceDiff($scope.current_pkg,$scope.requested_pkg,$scope.volume);
            
            if (!$.isEmptyObject(diff)) {
                $scope.gained_channels_limit = min_limit;
                $scope.lost_channels_limit = min_limit;
                channels_provider_diff = $scope.dataStore.diffChannelsByProvider($scope.current_pkg,$scope.requested_pkg,diff);
                $scope.gained_channels = channels_provider_diff.gained_channels;
                $scope.lost_channels = channels_provider_diff.lost_channels;   
            }
            
            if (!$.isEmptyObject(price_diff)) {
                $scope.saved_amt = price_diff.saved_amt;
                $scope.pay_more_amt = price_diff.pay_more_amt;
            }
            
            $scope.$broadcast("items_changed");

            //show package tip
            if($scope.requested_pkg.tip){
               growl.addInfoMessage($scope.requested_pkg.tip); 
            }
            else{
               growl.addInfoMessage('');  
            }
        }        
    });
   
    /**
     * Sort functionality for channels
     *
     * @param {mixed} channels collection of channel objects
     * @param {string} predicate the property to sort
     * @param {boolean} reverse 
     */
    $scope.sort = function(predicate,reverse) {
        //assign the selected class to the scope
        $scope.sorted_column = $scope.Utility.selectedClass(predicate,reverse);
        $scope.sortType = predicate;       
    };
    
    
    /**
     * Resets the whole datascopes as if the page just loaded
     */
    $scope.reset = function(){
        //reset current package
        $scope.current_pkg = null; 
        $scope.requested_pkg = null;   
    
        //reset the collection of current and requested packages's channels
        $scope.current_channels = [];  
        $scope.requested_channels = []; 
        
        //reset the gained and lost channels
        $scope.gained_channels = []; 
        $scope.lost_channels = []; 
        
        //reset the sorted column
        $scope.sorted_column = '';
        
        //reset all the show/hide pointers back to original values
        $scope.show_current_channels = true; 
        $scope.show_requested_channels = true; 
        $scope.show_gained_channels = false; 
        $scope.show_lost_channels = false;
        
        //reset the saved and pay more amts
        $scope.saved_amt = 0; 
        $scope.pay_more_amt = 0; 
        
        //remove the growl message
        growl.addInfoMessage('');
        
        //reset volume
        $scope.volume = null;
        
        $scope.sortType = 'channelname';
        
        $scope.resetLimit();
    };
    
    $scope.reloadit =  function(){
        $scope.$watchCollection('current_pkg');
        $scope.$apply();
    };
    
}]);