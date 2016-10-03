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
    var  DataStore = function(data,att_channels){
        'use strict';
        this.data = data;
        this.att_channels = att_channels;
        this.util = new Utility();       
    };
    
    
    /**
     * This will find the package by package id from
     * the package compare data source
     * @param {integer} id the id of the package to retrieve
     * @returns {Boolean|pkg}
     */
     DataStore.prototype.getPackageById = function(id){
        'use strict';
        
        var match_pkg = false,
        pkgs = this.data.package_compare.datasource,
        i,
        len = pkgs.length,
        pkg;
        
        for (i = 0; i < len; i = i + 1) {
            pkg = pkgs[i];
            if (pkg.id === id){
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
     * @param {mixed} channels the data source for channels
     * @returns {Boolean|pkg}
     */
     DataStore.prototype.getChannelById = function(id,channels){
        'use strict';        
        if (!id || undefined === id){          
           return false;          
        }        
        
        var match_ch = false,
        chs = this.data.channels,
        i,
        len = chs.length,
        ch;

        for (i = 0; i < len; i = i + 1) {
            ch = chs[i];
            if (ch.id === id){
                match_ch = ch;
                break;
            }
        }
        return match_ch;
        
    };
    
    /**
     * Returns a collection of packages
     * @param {mixed} pkg_ids collection of package id objects
     * @return {mixed} pkgs collection of package objects
     */
     DataStore.prototype.getPackages = function(pkg_ids){
        'use strict';
       
        var pkgs = [],
        that = this,
        i,
        max = pkg_ids.length,
        pkg_id,
        pkg;
        
        for (i = 0; i < max; i = i + 1) {
            pkg_id = pkg_ids[i];           
            pkg = that.getPackageById(pkg_id.id);
            if (pkg){
               pkgs.push(pkg);
            }
        }
        
        return pkgs;
    };
    
     /**
     * Returns a collection of channels
     * @param {mixed} channel_ids collection of channel id objects
     * @param {string} type determines if package is att or directv
     * @param {boolean} are_objects determines if the parameter channel_ids are collection of objects or not
     * @return {mixed} channels collection of channel objects
     */
     DataStore.prototype.getChannels = function(channel_ids,type,are_objects){
        'use strict';
        
        var channels = [],
        channels_data = (type !== 'att' ? this.data.channels : this.att_channels.channels),
        that = this,
        i,
        max = channel_ids.length,
        channel_id,
        id,
        counter = 0,
        channel,
        channels_unmapped,
        channels_mapped;

        //if are_objects param is not provided then assume true
        if (undefined === are_objects){ 
           are_objects = true;       
        }
        
        for (i = 0;  i < max; i = i + 1) {
            channel_id = channel_ids[i];
            id = are_objects ? channel_id.id : channel_id;
            channel = that.getChannelById(id,channels_data);            
            if (channel){
               channels[counter] = channel;
               counter = counter + 1;
            }
        }
        if (type === 'att') {
            channels_unmapped = _.filter(channels, function(channel){
                if (channel.dtv_id === "0") {
                    return channel;
                }
            });
            channels_mapped = _.filter(channels, function(channel){
                if (channel.dtv_id !== "0") {
                    return channel;
                }
            });
            channels_mapped = _.uniq(channels_mapped, function(channel){
                return channel.dtv_id;
            });
            channels = channels_mapped.concat(channels_unmapped);
        }
        return channels;
    };
    
    
    
    
    /**
     * Computes the difference between the current package to requested package
     * @param {object} current_pkg the current package of the customer
     * @param {object} requested_pkg the requested package of the customer
     * @return {object} diff
     */
     DataStore.prototype.getPackageDiff = function(current_pkg, requested_pkg){
        'use strict';
        var diff = {},
        is_same_provider = true,        
        unique_ids, //true if we are comparing dtv to dtv or at&t to at&t else false 
        unique;
        
        if (current_pkg && requested_pkg) {
            is_same_provider = (current_pkg.type === requested_pkg.type);
            unique_ids = this.getUniqueIds(is_same_provider,requested_pkg,current_pkg);           
            
            //combine and get the unique ids for both collections
            unique = _([unique_ids.current_channels,unique_ids.requested_channels]).chain().flatten().unique().value();
            
            //channels not found on current channels        
            diff.gained_channels = _.difference(unique, unique_ids.current_channels); //collection of gained channel ids
            //channels not found on the requested(new package)
            diff.lost_channels = _.difference(unique, unique_ids.requested_channels); //collection of lost channel ids 
            
            diff.is_same_provider = is_same_provider;
        }       
        
        return diff;       
    };
    
    /**
     * Return the actual channels gained and lost between pkgs. used in the controller
     * @param {type} current_pkg
     * @param {type} requested_pkg
     * @param {type} diff
     * @returns {DataStore.prototype.diffChannelsByProvider.channels_diff}
     */
    DataStore.prototype.diffChannelsByProvider = function(current_pkg,requested_pkg,diff){
        'use strict';        
        var channels_diff = {};        
        if(diff.is_same_provider){ 
            //if same provider, just do normal stuff
            channels_diff.gained_channels = this.getChannels(diff.gained_channels,current_pkg.type,false);
            channels_diff.lost_channels = this.getChannels(diff.lost_channels,requested_pkg.type,false);           
        } 
        else {           
            //comparing Uverse with Directv or vice versa            
            channels_diff.gained_channels = this.diffChannels(current_pkg,requested_pkg,diff.gained_channels);
            channels_diff.lost_channels = this.diffChannels(requested_pkg,current_pkg,diff.lost_channels);
        }        
        return channels_diff;
    };
    
    /**
     * Returns an array of channel ids when comparing 2 diff. providers
     * @param {type} main_pkg
     * @param {type} alt_pkg
     * @param {type} diff_channel_ids
     * @returns {Function|Number|underscore_L6._.foldl_.inject|lodash.foldl_.inject|_.foldl_.inject|underscore_L1.underscore.foldl_.inject|underscore.foldl_.inject|util._@call;require.foldl_.inject|es5-shim_L27.reduce|DataStore.prototype.diffChannels.diff_channels}
     */
    DataStore.prototype.diffChannels = function(main_pkg,alt_pkg,diff_channel_ids){
        'use strict';
        var diff_channels;
        if(main_pkg.type === 'att'){         
            //query the current_current_pkg by dtv_id                       
            diff_channels = this.getChannelsByDtvIdCollections(main_pkg.channels,diff_channel_ids,'att');    
        }
        else{
            diff_channels = this.getChannels(diff_channel_ids,main_pkg.type,false);
            //dtv_id with 0 value, query the requested current_pkg
            if(_.indexOf(diff_channel_ids, "0") !== -1){                           
               diff_channels = _.flatten([this.getChannelsByDtvIdCollections(alt_pkg.channels,["0"],'att'),diff_channels]);
            }
        }
        return diff_channels;
    };
    
    /**
     * Get the unique ids of channels between requested pkg and current pkg 
     * @param {type} is_same_provider
     * @param {type} requested_pkg
     * @param {type} current_pkg
     * @returns {DataStore.prototype.getUniqueIds.channel_ids}
     */
    DataStore.prototype.getUniqueIds = function(is_same_provider,requested_pkg,current_pkg){
        'use strict';
        var channel_ids = {};
        if(is_same_provider){
            channel_ids.current_channels = _.map(current_pkg.channels, _.iteratee('id'));
            channel_ids.requested_channels = _.map(requested_pkg.channels, _.iteratee('id')); 
        }
        else{
            if(current_pkg.type === 'att'){              
               channel_ids.current_channels = _.map(current_pkg.channels, _.iteratee('dtv_id'));              
               channel_ids.requested_channels = _.map(requested_pkg.channels, _.iteratee('id'));
            }
            if(requested_pkg.type === 'att'){
              channel_ids.requested_channels = _.map(requested_pkg.channels, _.iteratee('dtv_id')); 
              channel_ids.current_channels = _.map(current_pkg.channels, _.iteratee('id'));
            }
        }
        
        return channel_ids;
    };
    
    /**
     * Get channels using the dtv id collections
     * @param {type} channels
     * @param {type} dtv_ids
     * @param {type} type
     * @returns {Function|Number|underscore_L6._.foldl_.inject|lodash.foldl_.inject|_.foldl_.inject|underscore_L1.underscore.foldl_.inject|underscore.foldl_.inject|util._@call;require.foldl_.inject|es5-shim_L27.reduce}
     */
    DataStore.prototype.getChannelsByDtvIdCollections = function(channels,dtv_ids,type){
        'use strict'; 
        var that = this,
        result,
        results = _.map(dtv_ids, function(dtv_id){ 
            result = that.getChannelsByDtvId(channels,dtv_id,type); 
            if(result.length === 0){
                //get channel from directv data
                result = that.getChannels([dtv_id],'dtv',false);
            }
            return result;
        });        
        return _.flatten(results);
    };
    
    
    
    /**
     * Get a channel by single dtv id
     * @param {mixed} channels the channels data source
     * @param {string} dtv_id the dtv id
     * @param {string} type either att or dtv 
     * @returns {Array|DataStore.prototype.getChannels.channels|mixed}
     */
    DataStore.prototype.getChannelsByDtvId = function(channels,dtv_id,type){
        'use strict';
       
        var ids = _.map(channels,function(obj){
            if(obj.dtv_id === dtv_id){
                return obj.id;
            }
        });
        
        return this.getChannels(ids,type,false);
    };
    
    
    /**
     * This will calculate the price difference either the customer saved money or pay more money
     * @param {object} current_pkg the current package of the customer
     * @param {object} requested_pkg the requested package of the customer
     * @return {object} diff
     */
     DataStore.prototype.getPriceDiff = function(current_pkg, requested_pkg, volume){
        'use strict';
        
        var diff = {},
        current_package_price,
        requested_package_price,
        saved_amt_str,
        pay_more_amt_str;
        
        if (current_pkg && requested_pkg) {
          
          current_package_price = parseFloat(this.getPrice(current_pkg.price,volume));
          requested_package_price = parseFloat(this.getPrice(requested_pkg.price,volume));
          
          if ( current_package_price > requested_package_price ) { //saving money
            
            diff.saved_amt = current_package_price - requested_package_price;
            diff.saved_amt = Math.round(diff.saved_amt * 100) / 100;
            saved_amt_str = diff.saved_amt.toString();
            
            if(saved_amt_str.length >= 3 && saved_amt_str.indexOf('.') !== -1){
                diff.saved_amt = parseFloat(Math.round(diff.saved_amt * 100) / 100).toFixed(2);             
            }
            
            diff.pay_more_amt = 0;
          }
          else{
            
            diff.saved_amt = 0;
            diff.pay_more_amt = requested_package_price - current_package_price; //paying more money
            diff.pay_more_amt = Math.round(diff.pay_more_amt * 100) / 100;
            pay_more_amt_str = diff.pay_more_amt.toString();
            
            if(pay_more_amt_str.length >= 3 && pay_more_amt_str.indexOf('.') !== -1){
                diff.pay_more_amt = parseFloat(Math.round(diff.pay_more_amt * 100) / 100).toFixed(2);  
            }
          }
        }       
        return diff;    
    };
    
    /**
     * Retrieve the price from the price array against the volume selected
     * @param {array} prices collection of price objects for a specific package
     * @param {volume} volume the selected volume
     */
     DataStore.prototype.getPriceByVolume = function(prices,volume){
        'use strict';
        var matched_price = false,
        i,
        max,
        price;
        
        if (!jQuery.isArray(prices)){
            throw new Error('Invalid prices. Prices should be an array.');   
        }
        
        max = prices.length;        
        for (i = 0;  i < max; i = i + 1) {
            price = prices[i];
            //if no volume provided, return the first price on the array
            if (i === 0 && (_.isNull(volume) || undefined === volume)) { //if no volume, return the first property
                matched_price = price.p;
                break;
            }
            
            if (price.v === volume) {
                matched_price = price.p;
                break;
            }           
        }
        return matched_price;
    };
    
    /**
     * Get all the volumes from the data source and return an array
     * @param {array} vols collection of different volume objects from the data source
     * @return {array} collection of volumes to be selected
     */
     DataStore.prototype.getVolumes = function(vols){
        'use strict';
        
        var volumes = [],
        i,
        vol,
        max = vols.length;
        
        for (i = 0; i < max; i = i + 1) {
            vol = vols[i];
            volumes.push(vol.v);
        }
        return volumes;
    };
    
    /**
     * Assigns the proper price for selected current or requested package per chosen volume
     * @param {mixed} price the price property of each package and could be an array, integer or null.
     * @param {string} volume the selected volume of an establishment defaults to null
     * @return {mixed} 
     */
     DataStore.prototype.getPrice = function(price,volume){
       'use strict';
       
       var volume_price = null;
       
       if (!_.isNull(price)) {
         if (jQuery.isArray(price)) {
            volume_price = this.getPriceByVolume(price,volume);            
         }
         else{
           volume_price = price;
         }
       }
     
       return volume_price;
    };
    
    /**
     * Forms the display price on the select price control
     * @param {mixed} price the price property of each package and could be an array, integer or null.
     * @param {string} volume the selected volume of an establishment defaults to null
     *
     * @return {string}
     */
     DataStore.prototype.getDisplayPrice = function(price,volume){
       'use strict';
        
        var str = '';
        
        price = this.getPrice(price,volume);
        
        if (price) {
            str = ' - $' + price;
        }
       
        return str;
    };
    
    
    
    
    /**
     * Start for tooltip class
     *
     * @param {object} obj the DOM object element to attach tooltip
     */
    var ToolTip = function(obj){
        'use strict';
         
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
                },
                show: {
                  solo: true
                },
                hide: {
                  fixed: true
                }
            });
            this.self.show();
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
        'use strict';
        
        this.localhost = localhost;
        this.getServerPath = function(){
            if (!this.localhost) {
                return '%%pub%%';
            }
            return 'http://agentanswercenterstg.directv.com/en-us/res/';            
        };
        this.formatUrl = function(url){
            if (typeof url !== 'string'){
                throw new Error('Enter a valid url.');
            }
            url = url.replace(/\s/g, ''); //remove spaces
            
            var base = "href='",
            index = url.indexOf(base);
            
            if (-1 === index){
               return this.adjustUrl(url.replace(/["']/g, ""));
            }
    
            url = url.replace(/http:\/\/agentanswercenterstg.directv.com/g, "");
            url = url.substring(index + base.length,url.length - 1);
            return this.adjustUrl(url.replace(/["']/g, ""));
        };
        /**
         * Adjust url to relative server location
         */
        this.adjustUrl = function(url){
                if (this.localhost && url){
                   //replace %%pub%% to \/en-us\/res\/ on actual server
                   url = url.replace(/\/en-us\/res\//g, this.getServerPath(true));
                }
                return url;
        };       
    };
    
    
   
    
    /**
     * Helper class that contains some clean-up functions
     */
    var Utility = function(){
        'use strict';
        //checks if the number is an integer
        this.isInteger = function(n){
           return parseInt(n,10) === n;
        };       
        this.isIE = function() {
            var ua = window.navigator.userAgent,
            msie = ua.indexOf("MSIE ");
            if (msie > 0){
                return true;
            }
            
            return false;
        };
        this.show = function(is_visible){
             return is_visible ? false : true;
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
        'use strict';
        this.message = message;
    };
    
    Error.prototype.toString = function(){
        'use strict';
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
    var CommentBtn = function(container, class_name, root_url){
         'use strict';
        this.self = container;    
        this.class_name = class_name;
        this.root_url = root_url;
        var that = this;
        /**
         * Initialize function
         * @param {object} tool_author DOM element that holds the name of the tool's author
         */
        this.init = function(tool_author){
            if (!tool_author || null === tool_author){
               tool_author = $('#tool-author-id');
            }
            var feedback_btn = '<div class='+this.class_name+'><span class="btn-feedback btns" shape="rect" title="Provide Feedback">Provide Feedback</span></div>';
            this.self.append(feedback_btn); //append to itself      
            $('.'+this.class_name+' span.btn-feedback').click(function(){
                
                var url = window.top.location.pathname,
                aID = tool_author.val(),
                w = 375,
                h = 375,
                winl = (screen.width-w)/2,
                wint = ((screen.height-h)/2) - (h/2),
                feedbackForm;
                
                feedbackForm = window.open (that.root_url + 'system/scripts/add-feedback-tools.jsp?pid=' + url + '&aid=' + aID,'feedbackForm','location=0,status=0,scrollbars=0,width=' + w +',height=' + h);
                
                feedbackForm.moveTo(winl, wint);
                feedbackForm.focus();                
            });
        };    
    };




