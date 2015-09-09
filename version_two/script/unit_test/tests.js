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


function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

//customized assertion
QUnit.assert.contains = function( needle, haystack, message ) {
  var actual = haystack.indexOf(needle) > -1;
  this.push(actual, actual, needle, message);
};


QUnit.test( "Testing the \"getPackageById\" function.", function( assert ) {
   var store_ctrl = ctrlScope.dataStore;
   var id = 21;
   var pkg = store_ctrl.getPackageById(id);
   assert.deepEqual(pkg.id, id.toString(), 'Testing with a valid id ' + id +'.' + ' Asserted that function return a package object w/ package_id of 21.');
   
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
        
        property = 'id';
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
  
QUnit.test( "Testing the \"getPackageDiff\" function.", function( assert ) {
    
    var store_ctrl = ctrlScope.dataStore;
    
    var id = 2;
    var current_pkg = store_ctrl.getPackageById(id);
    
    id = 23;
    var requested_pkg = store_ctrl.getPackageById(id);
    
    var diff = store_ctrl.getPackageDiff(current_pkg,requested_pkg);
   
    assert.ok( jQuery.isEmptyObject(diff) === false, 'Asserting that function returns an object and not empty.' );
    assert.ok( diff.gained_channels.length !== 196, 'Asserting that function returns a correct gained channel count of '+diff.gained_channels.length+'.' );
    assert.ok( diff.lost_channels.length !== 10, 'Asserting that function returns a correct lost channel count of '+diff.lost_channels.length+'.' );
    
    diff = store_ctrl.getPackageDiff(current_pkg,null);
    assert.ok( jQuery.isEmptyObject(diff) === true, 'Asserting that function returns an empty object if one of the package is null.' );
    
});



QUnit.test( "Testing the \"getPriceDiff\" function.", function( assert ) {
    
    var store_ctrl = ctrlScope.dataStore;
    
    var id = 2;
    var current_pkg = store_ctrl.getPackageById(id);
    
    id = 23;
    var requested_pkg = store_ctrl.getPackageById(id);
    
    var diff = store_ctrl.getPriceDiff(current_pkg,requested_pkg);
   
    assert.ok( jQuery.isEmptyObject(diff) === false, 'Asserting that function returns an object and not empty.' );
    
    //make sure we're only testing packages with available price
    if (current_pkg.price && requested_pkg.price) {
        if (diff.saved_amt !== 0 && !jQuery.isEmptyObject(diff)) {
           assert.ok( isNumeric(diff.saved_amt), 'Asserting that function returns a correct saved amount of '+diff.saved_amt+' in dollars.' );
           assert.ok( diff.pay_more_amt === 0, 'Asserting that function returns a correct pay more amount of '+diff.pay_more_amt+' in dollars.' );
        }
        
        if (diff.pay_more_amt !== 0 && !jQuery.isEmptyObject(diff)) {
           assert.ok( isNumeric(diff.pay_more_amt), 'Asserting that function returns a correct pay more amount of '+diff.pay_more_amt+' in dollars.' );
           assert.ok( diff.saved_amt === 0, 'Asserting that function returns a correct saved amount of '+diff.saved_amt+' in dollars.' );
        }
    }    
   
});


QUnit.test( "Testing the \"getVolumes\" function.", function( assert ) {
    
    var store_ctrl = ctrlScope.dataStore;
    var volumes;
    
    //commercial version test
    if (store_ctrl.data.package_compare.volumes) {
       volumes = store_ctrl.data.package_compare.volumes;
       
        //check volumes property
       $.each(volumes, function(i, v) {
           property = 'v';
           assert.contains( property, Object.keys(v), "Asserted that volume \""+ (i + 1) +"\" contains "+property+" key." );
       });
       
       var displayed_volumes = store_ctrl.getVolumes (volumes);
       assert.ok( jQuery.isArray(displayed_volumes), 'Asserting that function returns an array.' );
       var len = volumes.length;
       assert.ok( displayed_volumes.length == len, 'Asserting that the length of the returned array is the same as the input array.' );
       
        //check display volumes 
       $.each(displayed_volumes, function(i, v) {          
           assert.ok( v.length > 0, "Asserted that display volume \""+ (i + 1) +"\" is valid." );
       });
      
    }
    else{ //residential
       volumes = [];
       var result = store_ctrl.getVolumes (volumes);
       assert.ok( jQuery.isArray(result) && result.length === 0, 'Asserting that function returns an empty array.' );
    } 
    
   
});


QUnit.test( "Testing the \"getPriceByVolume\" function.", function( assert ) {
    
    var store_ctrl = ctrlScope.dataStore;
    
    //test each current packages
    var current_pkgs = store_ctrl.getPackages(data.package_compare.current);
    $.each(current_pkgs, function(i, pkg) {
        ctrlScope.current_pkg = pkg;
        var prices = ctrlScope.current_pkg.price;
        if (jQuery.isArray(prices)) {
            $.each(store_ctrl.data.package_compare.volumes, function(i, v) {
               var expected_price = prices[i].p;
               ctrlScope.volume = store_ctrl.data.package_compare.volumes[i].v;              
               var price_from_function = store_ctrl.getPriceByVolume(prices,ctrlScope.volume);
               assert.deepEqual( expected_price, price_from_function, 'Asserting that the current pkg. resulting price "$'+price_from_function+'" is the same from the expected price "$'+expected_price+'".' );
            });
        }
        else{
            assert.throws(function(){ store_ctrl.getPriceByVolume( prices, ctrlScope.volume) },/Invalid prices. Prices should be an array./,'Testing with an invalid prices. Asserted that function throws an exception if prices param for current pkg. is not an array.');
        }
    });
    
    //test each requested packages
    var requested_pkgs = store_ctrl.getPackages(data.package_compare.requested);
    $.each(requested_pkgs, function(i, pkg) {
        ctrlScope.requested_pkg = pkg;
        var prices = ctrlScope.requested_pkg.price;
        if (jQuery.isArray(prices)) {
            $.each(store_ctrl.data.package_compare.volumes, function(i, v) {
               var expected_price = prices[i].p;
               ctrlScope.volume = store_ctrl.data.package_compare.volumes[i].v;              
               var price_from_function = store_ctrl.getPriceByVolume(prices,ctrlScope.volume);
               assert.deepEqual( expected_price, price_from_function, 'Asserting that the requested pkg. resulting price "$'+price_from_function+'" is the same from the expected price "$'+expected_price+'".' );
            });
        }
        else{
            assert.throws(function(){ store_ctrl.getPriceByVolume( prices, ctrlScope.volume) },/Invalid prices. Prices should be an array./,'Testing with an invalid prices. Asserted that function throws an exception if prices param for requested pkg. is not an array.');
        }
    });
 
});


QUnit.test( "Testing the \"getPrice\" function.", function( assert ) {
    
    var store_ctrl = ctrlScope.dataStore;
    ctrlScope.volume = "51 - 100"; //assign the second biggest volume
    
    //test current packages
    var current_pkgs = store_ctrl.getPackages(data.package_compare.current);
    $.each(current_pkgs, function(i, pkg) {
        ctrlScope.current_pkg = pkg;
        var price_obj = ctrlScope.current_pkg.price;       
        if (!store_ctrl.data.package_compare.volumes) // if residential
           ctrlScope.volume = null;
        var price_from_function = store_ctrl.getPrice(price_obj,ctrlScope.volume);
        if (price_from_function)
            assert.ok( isNumeric(price_from_function), 'Asserting that the resulting price for current package is of expected numeric value.' );     
        if (!price_obj) //if no price object available
            assert.ok( _.isNull(price_from_function), 'Asserting that the resulting price  for current package is of expected null value.' );
    });
    
     //test requested packages
    var requested_pkgs = store_ctrl.getPackages(data.package_compare.requested);
    $.each(requested_pkgs, function(i, pkg) {
        ctrlScope.requested_pkg = pkg;
        var price_obj = ctrlScope.requested_pkg.price;        
        if (!store_ctrl.data.package_compare.volumes) // if residential
           ctrlScope.volume = null;
        var price_from_function = store_ctrl.getPrice(price_obj,ctrlScope.volume);
        if (price_from_function)
            assert.ok( isNumeric(price_from_function), 'Asserting that the resulting price for requested package is of expected numeric value.' );     
        if (!price_obj) //if no price object available
            assert.ok( _.isNull(price_from_function), 'Asserting that the resulting price for requested package is of expected  null value.' );
    });
        
});


QUnit.test( "Testing the \"getDisplayPrice\" function.", function( assert ) {
    
    var store_ctrl = ctrlScope.dataStore;
    ctrlScope.volume = "51 - 100"; //assign the second biggest volume
    
    //test current packages
    var current_pkgs = store_ctrl.getPackages(data.package_compare.current);
    $.each(current_pkgs, function(i, pkg) {
        ctrlScope.current_pkg = pkg;
        var price_obj = ctrlScope.current_pkg.price;        
        if (!store_ctrl.data.package_compare.volumes) // if residential
           ctrlScope.volume = null;           
        var price_from_function = jQuery.trim(store_ctrl.getDisplayPrice(price_obj,ctrlScope.volume));        
        if (price_obj){
           assert.ok(price_from_function.length > 0, 'Asserting that the resulting display price for current package is valid.' );
        }
        else{
           assert.ok(price_from_function.length == 0, 'Asserting that the resulting display price for current package is a valid empty string.' ); 
        }
    });
    
    //test requested packages
    var requested_pkgs = store_ctrl.getPackages(data.package_compare.requested);
    $.each(requested_pkgs, function(i, pkg) {
        ctrlScope.requested_pkg = pkg;
        var price_obj = ctrlScope.requested_pkg.price;        
        if (!store_ctrl.data.package_compare.volumes) // if residential
           ctrlScope.volume = null;           
        var price_from_function = jQuery.trim(store_ctrl.getDisplayPrice(price_obj,ctrlScope.volume));        
        if (price_obj){
           assert.ok(price_from_function.length > 0, 'Asserting that the resulting display price for requested package is valid.' );
        }
        else{
           assert.ok(price_from_function.length == 0, 'Asserting that the resulting display price for requested package is a valid empty string.' ); 
        }
    });
    
});










