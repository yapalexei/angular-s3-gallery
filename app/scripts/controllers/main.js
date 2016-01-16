'use strict';

/**
 * @ngdoc function
 * @name s3XmlParseApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the s3XmlParseApp
 */
angular.module('s3XmlParseApp')
    .controller('MainCtrl', ['$scope', '$http', '$timeout', 'lodash', 'ImageList', '$mdDialog', function ($scope, $http, $timeout, lodash, ImageList, $mdDialog) {
        var me = this,
            tempImageList;

        me.getImage = ImageList.getImage;

        me.getThumb = ImageList.getThumb;

        function init () {
            me.imageList  = [];
            tempImageList = ImageList.getCachedImages();

            if (angular.isArray(tempImageList) && tempImageList.length) {
                addItems(tempImageList);
            } else {
                ImageList.getImagesFromApi().then(function (response) {
                    addItems(response);
                });
            }

        }

        function addItems (list) {
            lodash.forEach(list, addItem);
        }

        function addItem (item, i) {
            me.imageList.push(item);
        }

        me.showFullImage = function(index, $event) {

            var parentEl = angular.element(document.body);
            $mdDialog.show({
                parent:      parentEl,
                targetEvent: $event,
                templateUrl: 'views/dialog-preview-image.html',
                clickOutsideToClose: true,
                locals:      {
                    items: $scope.items
                },
                controller:  ['$scope', '$mdDialog', function ($scope, $mdDialog) {
                    $scope.imageEl = null;
                    $scope.rotation = 0;
                    $scope.thumb = {
                        ready: false,
                        src: '',
                        height: 0,
                        width:  0,
                        el: null,
                        reset: function () {
                            this.ready  = false;
                            this.src    = '';
                            //this.height = 0;
                            //this.width  = 0;
                        }
                    };
                    $scope.image = {
                        ready: false,
                        src:   '',
                        height: 0,
                        width:  0,
                        el: null,
                        reset: function() {
                            this.ready = false;
                            this.src = '';
                            //this.height = 0;
                            //this.width = 0;
                        }
                    };

                    $scope.close = function() {
                        $mdDialog.cancel();
                    };

                    $scope.$watch('rotation', function(newVal) {
                        var status = Math.abs((newVal / 90) % 2);
                        setVars();
                        if(status && $scope.image.el) {
                            $scope.image.height && $scope.image.el.prop('width', $scope.image.height);
                        } else {
                            $scope.image.width && $scope.image.el.prop('width', $scope.image.width);
                        }

                    });

                    $scope.rotateImage = function (val) {
                        $scope.rotation += val;
                        me.imageList[index].rotation = $scope.rotation;
                    };

                    function setVars() {
                        $scope.image.el = angular.element(document.querySelectorAll('#imageObj'));
                        $scope.thumb.el = angular.element(document.querySelectorAll('#thumbObj'));
                        if (!$scope.thumb.width) $scope.thumb.width = $scope.thumb.el.prop('width');
                        if (!$scope.thumb.height) $scope.thumb.height = $scope.thumb.el.prop('height');
                        if (!$scope.image.width) $scope.image.width = $scope.image.el.prop('width');
                        if (!$scope.image.height) $scope.image.height = $scope.image.el.prop('height');
                    }

                    function changeSlide(event) {
                        if(event.keyCode === 37){
                            index ? index-- : 0;
                            resetPreview(index);
                        }

                        if (event.keyCode === 39) {
                            index < me.imageList.length-1 ? index++ : index;
                            resetPreview(index);
                        }

                    }

                    function resetPreview(index) {
                        $scope.thumb.reset();
                        $scope.image.reset();
                        //$scope.rotation = 0;
                        loadImages(index);
                        if(me.imageList[index].rotation === undefined) {
                            me.imageList[index].rotation = 0;
                            $scope.rotation = 0;
                        } else {
                            $scope.rotation = me.imageList[index].rotation;
                        }
                    }

                    function preloadImage(path, dst) {
                        var img = new Image();
                        img.onload = function () {
                            $scope[dst].src = this.src;
                            $scope[dst].ready = true;
                            $scope.$apply();
                            img = null;
                            if(dst === 'image') {
                                $scope.thumb.src = '';
                                setVars();
                                $scope.thumb.reset();
                                console.log('thumb reset');
                            }
                        };
                        img.src = path;
                    }

                    function loadImages(index) {
                        preloadImage(me.getThumb(me.imageList[index].Key), 'thumb');
                        preloadImage(me.getImage(me.imageList[index].orig), 'image');

                    }

                    loadImages(index);

                    parentEl.on('keydown', changeSlide);

                }],
                onRemoving: function() {
                    parentEl.off();
                }
            });
        };


        init();

    }]);
