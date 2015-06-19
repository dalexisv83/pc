    /**************************************************************
    *               Package Compare Library                       *
    *                                                             *
    *               Contains functions to query a                 *
    *               package by id, a channel by id,               *
    *               compare two packages by price, etc.           *
    *                                                             *
    *               @author: jcapillo@directv.com                 *
    **************************************************************/
    
    
    /**
     * Initiate the main class to interact with datasource
     * @param {object} data the main data source
     */    
    var dataStore = function(data){
        this.data = data;
        this.util = new Utility();
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
        if (!this.util.isInteger(id))
           throw new Error('Invalid package id.');       
        for (var i = 0, len = pkgs.length; i < len; i++) {
            var pkg = pkgs[i];
            if (parseInt(pkg.id) === id){
                match_pkg = pkg;
                break;
            }
        }
        return match_pkg;
    };
    
    /**
     * This will find the channel by channel id from
     * the channels data source
     * @param {integer} id the id of the channel to retrieve
     * @returns {Boolean|pkg}
     */
    dataStore.prototype.getChannelById = function(id){
        var match_channel = false;
        var channels = this.data.channels;
        if (!this.util.isInteger(id))
           throw new Error('Invalid channel id.');
        for (var i = 0, len = channels.length; i < len; i++) {
            var channel = channels[i];
            if (parseInt(channel.id) === id){
                match_channel = channel;
                break;
            }
        }
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
        for (var i = 0, max = pkg_ids.length; i < max; i++) {
            var pkg_id = pkg_ids[i];
            var pkg = that.getPackageById(parseInt(pkg_id.id));
            if (pkg)
               pkgs.push(pkg);
        }
        return pkgs;
    };
    
     /**
     * Returns a collection of channels
     * @param {mixed} channel_ids collection of channel id objects
     * @param {boolean} are_objects determines if the parameter channel_ids are collection of objects or not
     * @return {mixed} channels collection of channel objects
     */
    dataStore.prototype.getChannels = function(channel_ids,are_objects){
        var channels = [];
        var that = this;       
        if (undefined === are_objects) //if are_objects param is not provided then assume true
           are_objects = true;       
        for (var i = 0, max = channel_ids.length;  i < max; i++) {
            var channel_id = channel_ids[i];
            var id = (are_objects) ? channel_id.id : channel_id;
            var channel = that.getChannelById(parseInt(id));           
            if (channel)
               channels.push(channel);
        }
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
          var current_channels = _.map(current_pkg.channels, _.iteratee('id'));
          var requested_channels = _.map(requested_pkg.channels, _.iteratee('id'));
          
          //combine and get the unique ids for both collections
          var unique = _([current_channels,requested_channels]).chain().flatten().unique().value();
          
          //channels not found on current channels        
          diff.gained_channels = _.difference(unique, current_channels); //collection of gained channel ids
          //channels not found on the requested(new package)
          diff.lost_channels = _.difference(unique, requested_channels); //collection of lost channel ids          
        }
        return diff;       
    };
    
    
    /**
     * This will calculate the price difference either the customer saved money or pay more money
     * @param {object} current_pkg the current package of the customer
     * @param {object} requested_pkg the requested package of the customer
     * @return {object} diff
     */
    dataStore.prototype.getPriceDiff = function(current_pkg, requested_pkg){
        var diff = {};       
        if (current_pkg && requested_pkg) {
          var current_package_price = parseFloat(current_pkg.price);
          var requested_package_price = parseFloat(requested_pkg.price);
          if ( current_package_price > requested_package_price ) { //saving money
            diff.saved_amt = current_package_price - requested_package_price;
            diff.saved_amt = Math.round(diff.saved_amt * 100) / 100;
            var saved_amt_str = diff.saved_amt.toString();
            if(saved_amt_str.length >= 3 && saved_amt_str.indexOf('.') !== -1)
                diff.saved_amt = parseFloat(Math.round(diff.saved_amt * 100) / 100).toFixed(2);             
            diff.pay_more_amt = 0;
          }
          else{
            diff.saved_amt = 0;
            diff.pay_more_amt = requested_package_price - current_package_price //paying more money
            diff.pay_more_amt = Math.round(diff.pay_more_amt * 100) / 100;
            var pay_more_amt_str = diff.pay_more_amt.toString();
            if(pay_more_amt_str.length >= 3 && pay_more_amt_str.indexOf('.') !== -1)
                diff.pay_more_amt = parseFloat(Math.round(diff.pay_more_amt * 100) / 100).toFixed(2);  
          }
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
                   url = url.replace(/\/en-us\/res\//g, this.getServerPath(true)); 
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
    
    
    /**
    * Creates the comment button
    *
    * @param {object} container the main container object that will hold the comment button
    * @param {string} class_name preferred class name for the inner container
    * @param {string} root_url the root url to call
    */
    var commentBtn = function(container, class_name, root_url){
        this.self = container;    
        this.class_name = class_name;
        this.root_url = root_url;
        var that = this;
        /**
         * Initialize function
         * @param {object} tool_author DOM element that holds the name of the tool's author
         */
        this.init = function(tool_author){
            if (!tool_author || null === tool_author)
               tool_author = $('#tool-author-id');
            var feedback_btn = '<div class='+this.class_name+'><span class="btn-feedback btns" shape="rect" title="Provide Feedback">Provide Feedback</span></div>';
            this.self.append(feedback_btn); //append to itself      
            $('.'+this.class_name+' span.btn-feedback').click(function(e){
                var url = window.top.location.pathname;
                var aID = tool_author.val();
                var w = 375;
                var h = 375;
                var winl = (screen.width-w)/2;
                var wint = ((screen.height-h)/2) - (h/2);  
                var feedbackForm = window.open (that.root_url + 'system/scripts/add-feedback-tools.jsp?pid=' + url + '&aid=' + aID + '','feedbackForm','location=0,status=0,scrollbars=0,  width=' + w +',height=' + h + '');
                feedbackForm.moveTo(winl, wint);
                feedbackForm.focus();                
            });
        };    
    };




