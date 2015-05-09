var ctrl, ctrlScope, injector;
module("Testing controller", {
    setup: function () {
        angular.module('App');
        injector = angular.injector(['ng', 'App']);

        ctrlScope = injector.get('$rootScope').$new();
        //instantiate 
        ctrl = injector.get('$controller')('AppController', { $scope: ctrlScope });
        
        ctrlScope.model = {
            //model object
        };
    },
    teardown: function () {
        
    }
});

//customized assertion
QUnit.assert.contains = function( needle, haystack, message ) {
  var actual = haystack.indexOf(needle) > -1;
  this.push(actual, actual, needle, message);
};


QUnit.test( "Testing the \"getPackageById\" function.", function( assert ) {
   var store_ctrl = ctrlScope.dataStore;
   var id = 21;
   var pkg = store_ctrl.getPackageById(id);
   assert.deepEqual(pkg.package_id, id.toString(), 'Testing with a valid id ' + id +'.' + ' Asserted that function return a package object w/ package_id of 21.');
   
   id = '21';
   assert.throws(function(){ store_ctrl.getPackageById(id) },/Invalid package id./,'Testing with an invalid id. Asserted that function throws an exception.');
   
   id = 2100;
   assert.deepEqual(store_ctrl.getPackageById(id), false, 'Testing with a valid non-existing id ' + id +'.' + ' Asserted that function return false.');
});

QUnit.test( "Testing the \"getChannelById\" function.", function( assert ) {
   var store_ctrl = ctrlScope.dataStore;
   var id = 21;
   var channel = store_ctrl.getChannelById(id);
   assert.deepEqual(channel.id, id.toString(), 'Testing with a valid id ' + id +'.' + ' Asserted that function return a channel object w/ id of 21.');
   
   id = 'invalid21';
   assert.throws(function(){ store_ctrl.getChannelById(id) },/Invalid channel id./,'Testing with an invalid id "'+id+'". Asserted that function throws an exception.');
   
   id = 2100;
   assert.deepEqual(store_ctrl.getChannelById(id), false, 'Testing with a valid non-existing id ' + id +'.' + ' Asserted that function return false.');
});

QUnit.test( "Testing the \"getPackages\" function.", function( assert ) {
    var store_ctrl = ctrlScope.dataStore;
    var pkgs = store_ctrl.getPackages(data.package_compare.requested);
    assert.ok( pkgs.length === data.package_compare.requested.length, 'Asserting that function returns correct count of packages.' );
    
    $.each(pkgs, function(i, v) {
        var pkg = pkgs[i];
        
        var property = 'name';
        assert.contains( property, Object.keys(pkg), "Asserted that package \""+pkg.name+"\" contains "+property+" key." );
        
        property = 'channels';        
        assert.contains( property, Object.keys(pkg), "Asserted that package \""+pkg.name+"\" contains "+property+" key." );
        
        property = 'package_id';
        assert.contains( property, Object.keys(pkg), "Asserted that package \""+pkg.name+"\" contains "+property+" key." );
        
        property = 'channel_count';
        assert.contains( property, Object.keys(pkg), "Asserted that package \""+pkg.name+"\" contains "+property+" key." );
        
        assert.ok( pkg.channels.length === pkg.channel_count, "Asserted that package \""+pkg.name+"\" contains "+pkg.channel_count+" channels."); 
    });   
    
});


QUnit.test( "Testing the \"getChannels\" function.", function( assert ) {
    
    var store_ctrl = ctrlScope.dataStore;
    var id = 21;
    var pkg = store_ctrl.getPackageById(id);
   
    var channels = store_ctrl.getChannels(pkg.channels);
    assert.ok( channels.length === pkg.channels.length, 'Asserting that function returns correct count of channels for package "'+pkg.name+'".' );
    
    $.each(channels, function(i, v) {
        var channel = channels[i];
        
        var property = 'channelname';
        assert.contains( property, Object.keys(channel), "Asserted that channel \""+channel.channelname+"\" contains "+property+" key." );
        
        property = 'channelnumber';
        assert.contains( property, Object.keys(channel), "Asserted that channel \""+channel.channelname+"\" contains "+property+" key." );
        
        property = 'id';
        assert.contains( property, Object.keys(channel), "Asserted that channel \""+channel.channelname+"\" contains "+property+" key." );
       
        property = 'url';
        assert.contains( property, Object.keys(channel), "Asserted that channel \""+channel.channelname+"\" contains "+property+" key." );
    });   
    
});



QUnit.test( "Testing the \"selectPackage\" function.", function( assert ) {
    //initialize
    ctrlScope.init();
    
    var current_pkgs = ctrlScope.current_pkgs;
    var requested_pkgs = ctrlScope.requested_pkgs;
    
    var util = new Utility();    
    if (!util.isIE()) {        
        $.each(current_pkgs, function(i, v) {
            var pkg = current_pkgs[i];
            ctrlScope.current_pkg = pkg;
            //fire the selectPackage on the current package dropdown
            ctrlScope.selectPackage(pkg,true);
            assert.deepEqual( ctrlScope.current_channels.length, pkg.channel_count, "Asserted that scope \"current_channels\" contains correct count of "+pkg.channel_count+" channels when current package \""+pkg.name+"\" is selected.");
            
            var channels = ctrlScope.current_channels;
            $.each(channels, function(i, v) {
                var channel = channels[i];            
                var property = 'channelname';
                assert.contains( property, Object.keys(channel), "Asserted that channel \""+channel.channelname+"\" contains "+property+" key." );
            });       
        });
        
        $.each(requested_pkgs, function(i, v) {
            var pkg = requested_pkgs[i];
            ctrlScope.requested_pkg = pkg;
            //fire the selectPackage on the current package dropdown
            ctrlScope.selectPackage(pkg,false);
            assert.deepEqual( ctrlScope.requested_channels.length, pkg.channel_count, "Asserted that scope \"requested_channels\" contains correct count of "+pkg.channel_count+" channels when requested package \""+pkg.name+"\" is selected.");
            
            var channels = ctrlScope.requested_channels;
            $.each(channels, function(i, v) {
                var channel = channels[i];            
                var property = 'channelname';
                assert.contains( property, Object.keys(channel), "Asserted that channel \""+channel.channelname+"\" contains "+property+" key." );
            });
        });
    }
    else{
            var pkg = current_pkgs[0];
            //fire the selectPackage on the current package dropdown
            ctrlScope.current_pkg = pkg;
            ctrlScope.selectPackage(pkg,true);
            assert.deepEqual( ctrlScope.current_channels.length, pkg.channel_count, "Asserted that scope \"current_channels\" contains correct count of "+pkg.channel_count+" channels when current package \""+pkg.name+"\" is selected.");
            
            pkg = requested_pkgs[2];
            ctrlScope.requested_pkg = pkg;
            //fire the selectPackage on the current package dropdown
            ctrlScope.selectPackage(pkg,false);
           
            assert.deepEqual( ctrlScope.requested_channels.length, pkg.channel_count, "Asserted that scope \"requested_channels\" contains correct count of "+pkg.channel_count+" channels when requested package \""+pkg.name+"\" is selected.");
    }
    
    assert.ok( ctrlScope.current_pkg != null && ctrlScope.requested_pkg != null, 'Asserting that there is a selected current '+ctrlScope.current_pkg.name+' and requested pkg '+ctrlScope.requested_pkg.name+'.' );
    
    if (ctrlScope.current_pkg.package_id !== ctrlScope.requested_pkg.package_id) {
       assert.ok( ctrlScope.gained_channels.length > 0, 'Asserting that gained channel is > 0 and gained count is '+ctrlScope.gained_channels.length+'.' );
       assert.ok( ctrlScope.lost_channels.length > 0, 'Asserting that lost channel is > 0 and lost count is '+ctrlScope.lost_channels.length+'.' );
    }
    else{
        assert.ok( ctrlScope.gained_channels.length === 0, 'Asserting that gained channel is equal to 0 and gained count is '+ctrlScope.gained_channels.length+'.' );
        assert.ok( ctrlScope.lost_channels.length === 0, 'Asserting that lost channel is equal to 0 and lost count is '+ctrlScope.lost_channels.length+'.' );
    }
});

  
QUnit.test( "Testing the \"getPackageDiff\" function.", function( assert ) {
    
    var store_ctrl = ctrlScope.dataStore;
    
    var id = 2;
    var current_pkg = store_ctrl.getPackageById(id);
    
    id = 23;
    var requested_pkg = store_ctrl.getPackageById(id);
    
    var diff = store_ctrl.getPackageDiff(current_pkg,requested_pkg);
    
    assert.ok( jQuery.isEmptyObject(diff) === false, 'Asserting that function returns an object and not empty.' );
    assert.ok( diff.gained_channels.length === 196, 'Asserting that function returns a correct gained channel count of '+diff.gained_channels.length+'.' );
    assert.ok( diff.lost_channels.length === 10, 'Asserting that function returns a correct lost channel count of '+diff.lost_channels.length+'.' );
    
    diff = store_ctrl.getPackageDiff(current_pkg,null);
    assert.ok( jQuery.isEmptyObject(diff) === true, 'Asserting that function returns an empty object if one of the package is null.' );
    
});