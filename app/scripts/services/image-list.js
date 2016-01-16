'use strict';

/**
 * @ngdoc service
 * @name s3XmlParseApp.imageList
 * @description
 * # imageList
 * Service in the s3XmlParseApp.
 */
angular.module('s3XmlParseApp')
  .service('ImageList', ['$http', 'lodash', function ($http, lodash)    {
      	var me = this,
      		rootPath = 'https://s3-us-west-2.amazonaws.com/', ///'https://yapics-prod.s3.amazonaws.com/',
            _bucket = 'yapics-prod/', // used with separateThumbsAndOriginals()
            _fullSizeBucket = 'yapics/',
            _thumbSizeBucket = 'yapics-thumbs/',
            _thumbPrefix = 'thmb-',
            _allImages = [],
            _thumbs = [],
            _thumbsByName = [],
            _largeImages = [],
            _largeImagesByName = [],
            method = {
                a: {
                    fnc: separateThumbsAndOriginals,
                    path: rootPath + _bucket,
                    thumb: rootPath + _bucket
                },
                b: {
                    fnc: getFullFromThumbs,
                    path: rootPath + _fullSizeBucket,
                    thumb: rootPath + _thumbSizeBucket
                }
            },
            useMethod = 'b';

      	me.getImagesFromApi = function () {
      		return $http.get(method[useMethod].thumb).then(function(response) {
				_allImages = response.data.ListBucketResult.Contents;
                return method[useMethod].fnc(_allImages);
			});
      	};

      	me.getCachedImages = function () {
      		return _thumbs;
      	};

      	me.getImage = function(name) {
			return method[useMethod].path + name;
		};

        me.getThumb = function (name) {
            return method[useMethod].thumb + name;
        };

        /**
         * This approach uses two buckets; a thumbs and full size image bucket.
         * @param images
         * @returns {Array}
         */
        function getFullFromThumbs(images){
            lodash.forEach(images, function (obj) {
                obj.orig = obj.Key.slice(_thumbPrefix.length, obj.Key.length);  //add original name to obj for easy access
                _thumbsByName[obj.Key.slice(_thumbPrefix.length, obj.Key.length)] = obj;
                _thumbs.push(obj);
            });

            return _thumbs;
        }

        /**
         * This approach uses one bucket with a thumbs folder
         * @param images
         * @returns {Array}
         */
        function separateThumbsAndOriginals(images) {
            var _prefix = 'thumbs/' + _thumbPrefix;
            lodash.forEach(images, function(obj) {
                if(obj.Key.indexOf(_prefix) === 0) {
                    obj.orig = obj.Key.slice(_prefix.length, obj.Key.length);  //add original name to obj for easy access
                    _thumbsByName[obj.Key.slice(_prefix.length, obj.Key.length)] = obj;
                    _thumbs.push(obj);
                }
            });

            return _thumbs;
        }

    }]);
