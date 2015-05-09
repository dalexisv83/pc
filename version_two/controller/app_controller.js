
app.controller('AppController', function ($scope) {
    
    $scope.current_pkg = null; //holds the selected current package object
    $scope.requested_pkg = null; //holds the selected requested package object    
    
    $scope.current_pkgs = []; //holds the collection of packages on the current package dropdown
    $scope.requested_pkgs = []; //holds the collection of packages on the requested package dropdown
    
    $scope.current_channels = [];  //holds the collection of current packages's channels
    $scope.requested_channels = []; //holds the collection of requested package's channels
    
    $scope.gained_channels = []; //holds the gained channels
    $scope.lost_channels = []; //holds the lost channels
    
    $scope.dataStore = new dataStore(data); //initiate class dataStore
    
    $scope.init = function(){
       var requested_pkg_ids = data.package_compare.requested;
       var current_pkg_ids = data.package_compare.current;
       //fill the packages dropdowns
       $scope.requested_pkgs = $scope.dataStore.getPackages(requested_pkg_ids); 
       $scope.current_pkgs = $scope.dataStore.getPackages(current_pkg_ids);
    };
    
    
    /**
     * Fires when a package is selected from current or requested dropdown
     * @param {mixed} pkg the package object selected
     * @param {boolean} is_current determines if selecting from current or requested packages
     */
    $scope.selectPackage = function(pkg,is_current) {
        var channels = [];
        $scope.gained_channels = [];
        $scope.lost_channels = [];
        
        if (pkg)
             channels = $scope.dataStore.getChannels(pkg.channels);
             
        (is_current) ? ($scope.current_channels = channels):($scope.requested_channels = channels);
       
        var diff = $scope.dataStore.getPackageDiff($scope.current_pkg,$scope.requested_pkg);
        if (!jQuery.isEmptyObject(diff)) {
            $scope.gained_channels = $scope.dataStore.getChannels(diff.gained_channels);
            $scope.lost_channels = $scope.dataStore.getChannels(diff.lost_channels);
        }
    };
    
    
  
});