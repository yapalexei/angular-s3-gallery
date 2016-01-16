'use strict';

/**
 * @ngdoc overview
 * @name s3XmlParseApp
 * @description
 * # s3XmlParseApp
 *
 * Main module of the application.
 */
angular
    .module('s3XmlParseApp', [
        'ngAnimate',
        'ngCookies',
        'ngResource',
        'ngRoute',
        'ngSanitize',
        'ngTouch',
        'xml',
        'ngLodash',
        'ngFx',
        'afkl.lazyImage',
        'angularSpinner',
        'ngMaterial'
    ])
    .config(['$routeProvider', '$httpProvider', function ($routeProvider, $httpProvider) {
        $httpProvider.interceptors.push('xmlHttpInterceptor');
        $routeProvider
            .when('/', {
                templateUrl:  'views/main.html',
                controller:   'MainCtrl',
                controllerAs: 'Main'
            })
            .otherwise({
                redirectTo: '/'
            });
    }]);
