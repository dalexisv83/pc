    /**
     * Initiate the main class to interact with datasource
     * @param {object} data the main data source
     */    
    var dataStore = function(data){
        this.data = data;       
    };
    
    /**
     * This will find the package by package id from
     * the package compare data source
     * @param {integer} id the id of the package to retrieve
     * @returns {Boolean|pkg}
     */
    dataStore.prototype.getPackageById = function(id){
        var match_pkg = false;
        var pkgs = this.data.package_compare.datasource;
        var util = new Utility();
        if (!util.isInteger(id))
           throw new Error('Invalid package id.');
        angular.forEach(pkgs, function(pkg,index){
            if (parseInt(pkg.package_id) === id){
                match_pkg = pkg;
                return;
            }
        });
        return match_pkg;
    };
    
    /**
     * This will find the channel by channel id from
     * the channels data source     * 
     * @param {integer} id the id of the channel to retrieve
     * @returns {Boolean|pkg}
     */
    dataStore.prototype.getChannelById = function(id){
        var match_channel = false;
        var channels = this.data.channels;
    
        var util = new Utility();
        if (!util.isInteger(id))
           throw new Error('Invalid channel id.');
        angular.forEach(channels, function(channel,index){
            if (parseInt(channel.id) === id){
                match_channel = channel;
                return;
            }
        });
        
        return match_channel;
    };
    
    /**
     * Returns a collection of packages
     * @param {mixed} pkg_ids collection of package id objects
     * @return {mixed} pkgs collection of package objects
     */
    dataStore.prototype.getPackages = function(pkg_ids){
        var pkgs = [];
        var that = this;
        angular.forEach(pkg_ids, function(pkg_id,index){
            var pkg = that.getPackageById(parseInt(pkg_id.package_id));
            if (pkg)
               pkgs.push(pkg);
        });
        return pkgs;
    };
    
     /**
     * Returns a collection of channels
     * @param {mixed} channel_ids collection of channel id objects
     * @return {mixed} channels collection of channel objects
     */
    dataStore.prototype.getChannels = function(channel_ids){
        var channels = [];
        var that = this;
        angular.forEach(channel_ids, function(channel_id,index){
            var channel = that.getChannelById(parseInt(channel_id.channel_id));           
            if (channel)
               channels.push(channel);
        });
        return channels;
    };
    
    /**
     * Computes the difference between the current package to requested package
     * @param {object} current_pkg the current package of the customer
     * @param {object} requested_pkg the requested package of the customer
     * @return {object} diff
     */
    dataStore.prototype.getPackageDiff = function(current_pkg, requested_pkg){
       var diff = {};
       
       if (current_pkg && requested_pkg) {
          var current_channels = _.map(current_pkg.channels, _.iteratee('channel_id'));
          var requested_channels = _.map(requested_pkg.channels, _.iteratee('channel_id'));
          
          //combine and get the unique ids for both collections
          var unique = _([current_channels,requested_channels]).chain().flatten().unique().value();
          
          //channels not found on current channels        
          diff.gained_channels = _.map(_.difference(unique, current_channels), function(channel_id){
                var obj = {};
                obj.channel_id = channel_id;
                return obj;
          });
          
          //channels not found on the requested(new package)
          diff.lost_channels = _.map(_.difference(unique, requested_channels), function(channel_id){
                var obj = {};
                obj.channel_id = channel_id;
                return obj;
          });
       }
       
       return diff;       
    };
    
    
    /**
     * Start for tooltip class
     *
     * @param {object} obj the DOM object element to attach tooltip
     */
    var toolTip = function(obj){
        this.self = obj;
        /**
         * activates genre codes tool tip
         * @param {object} data_temp_holder the object that holds the tooltip content
         */
        this.genreToolTip = function(data_temp_holder){
            var html = data_temp_holder.html();       
            this.self.qtip({
                content: {
                  text: html
                },
                position:{
                  my: 'left top',  
                  at: 'bottom left',
                  target: this
                },
                style: {
                  classes: 'qtip-bootstrap'
                }
            });
            this.self.show()
        };        
    };
    /**
     * End for Genre tooltip class 
     */

    
   
  
    /**
     * Helper class that contains some url formatting functions
     *
     * @param {boolean} localhost determines if we're running on localhost or on actual remote server
     */
    var UrlFormatter = function(localhost){
        this.localhost = localhost;
        this.getServerPath = function(){
            if (!this.localhost) {
                return '%%pub%%';
            }
            else
                return 'http://agentanswercenterstg.directv.com/en-us/res/';
        };
        this.formatUrl = function(url){
            if (typeof url != 'string')
                throw new Error('Enter a valid url.');
            url = url.replace(/\s/g, ''); //remove spaces
            var base = "href='";
            var index = url.indexOf(base);
            if (-1 === index)
               return this.adjustUrl(url.replace(/["']/g, ""));
    
            url = url.replace(/http:\/\/agentanswercenterstg.directv.com/g, "");
            url = url.substring(index + base.length,url.length - 1);
            return this.adjustUrl(url.replace(/["']/g, ""));
        };
        /**
         * Adjust url to relative server location
         */
        this.adjustUrl = function(url){
                if (this.localhost && url)
                   //replace %%pub%% to \/en-us\/res\/ on actual server
                   url = url.replace(/%%pub%%/g, this.getServerPath(true)); 
                return url;
        };       
    };
    
    
   
    
    /**
     * Helper class that contains some clean-up functions
     */
    var Utility = function(){
        //checks if the number is an integer
        this.isInteger = function(n){
           return parseInt(n) === n;
        };       
        this.isIE = function() {
            var ua = window.navigator.userAgent;
            var msie = ua.indexOf("MSIE ");
    
            if (msie > 0)
                return true;
            else
              return false;
        };
        this.show = function(is_visible){
             return ((is_visible) ? false : true);
        };
        /**
        * Returns the proper selected class name for the targeted column
        * @param {string} key_str the key string that identifies the particular column
        * @param {boolean} reverse returns the sort direction
        */
        this.selectedClass = function(key_str, reverse) {
           return  key_str + ' sort-' + reverse;
        }; 
    };

    
    /**
    * The Error class
    */
    var Error = function(message){
        this.message = message;
    };
    
    Error.prototype.toString = function(){
        return this.message;
    };
    /**
    * End of Error class
    */