---
title: Leveraging Caching In Ionic Apps
cover: http://distilleryimage6.ak.instagram.com/9f9d13a6f5fc11e2b8f522000a1fbce9_7.jpg
description: Improve the performance of your connected Ionic mobile apps by caching your resources and downloaded images.
layout: post
tags: [ionic, framework, mobile, ios, android, cordova]
---
[Ionic](http://ionicframework.com "Ionic Framework") is a great framework for building apps for iOS and Android. It is built on [Angular](http://angularjs.org "AngularJS") and uses [Cordova](http://cordova.apache.org "Cordova Apache") for running on mobile devices.

The thing I like most about the framework is its clear [documentation](http://ionicframework.com/docs "Ionic Framework Docs") and vibrant [developer community](http://forum.ionicframework.com "Ionic Forum"). Another great aspect of Ionic is its focus on achieving near-native performance. Finally, apps built with Ionic just [look good](http://showcase.ionicframework.com "Ionic App Showcase")!

####What's Missing

Having built multiple apps with Ionic, I was met with some performance challenges: particularly in the area of caching data coming from backend services.

<!--excerpt-->

####Get Your $Resource Cache On

If you're working with a RESTful API, a great solution for caching the responses is to use [ngCachedResource](https://github.com/goodeggs/angular-cached-resource "ngCachedResource (angular-cached-resource)"). This Angular module caches all resource actions and will execute these actions repeatedly until they succeed (even POST and DELETE actions) if the connection is lost. It uses the same Angular [$resource](https://docs.angularjs.org/api/ngResource/service/$resource "$resource documentation") syntax with an added string identifcation for caching the resource in local storage.

```javascript
services.factory('NewsResource', function($cachedResource) {
  return $cachedResource('news', 'http://www.website.com/api/news/:id', {id: '@id'});
});
```

####Cache Images

One of the biggest struggles I had when working with loading external images was the frequency at which the images would have to be re-downloaded from the server. Each Ionic [$state](https://github.com/angular-ui/ui-router "AngularUI Router") change would result in a new request for each image in the template. This would significantly decrease the "near-native" appeal of the app.

After searching around for a solution, a great library came up: [ImgCache](https://github.com/chrisben/imgcache.js "ImgCache for Cordova"). With version 0.7.3, it is now very easy to include image caching in your Ionic apps. Simply include the imgcache.js script, initialize ImgCache and add the 2 necessary Cordova plugins to your project: [File](https://github.com/apache/cordova-plugin-file "Cordova File plugin") and [File-Transfer](https://github.com/apache/cordova-plugin-file-transfer "Cordova File-Transfer plugin").

For simple integration in your app, I have created a directive specifically leveraging the performance boosts associated with ImgCache:

```javascript
directives.directive('cachedImage', function() {
    return {
        restrict: 'E',
        scope: {
            class: '@',
            image: '@',
            transclude: '@',
        },
        link: function($scope, $element, $attr) {
            var inside = angular.element($element.children()[0]);

            $scope.$watch('image', function(newValue, oldValue) {
                if (newValue) {
                    if (ImgCache.ready) {
                        // Check if image is cached
                        ImgCache.isCached($scope.image, function(path, success) {
                            if (success) {
                                // Remove spinner
                                removeLoadingIndicator();

                                inside.css('background-image', 'url("' + $scope.image + '")');

                                ImgCache.useCachedBackground(inside);
                            } else {
                                download();
                            }
                        });
                    } else {
                        download();
                    }
                }
            });

            function download() {
                // Add loading indicator
                if (!$scope.transclude)
                    inside.html('<i class="icon icon-md ion-ios7-reloading"></i>');

                if (ImgCache.ready) {
                    inside.css('background-image', 'url("' + $scope.image + '")');
                    ImgCache.cacheBackground(inside, function() {
                        // Use cached image
                        removeLoadingIndicator();
                        ImgCache.useCachedBackground(inside);
                    }, function() {
                        console.error('Could not download image (ImgCache).');
                        removeLoadingIndicator();
                    });
                } else {
                    var img = new Image();
                    img.src = $scope.image;

                    img.onload = function() {
                        removeLoadingIndicator();
                        inside.css('background-image', 'url("' + $scope.image + '")');
                    };

                    img.onerror = function() {
                        console.error('Could not download image.');
                        removeLoadingIndicator();
                    };
                }
            }

            function removeLoadingIndicator() {
                if (!$scope.transclude)
                    inside.html('');
            }
        },
        transclude: true,
        template: '<div class="{{class}}" ng-transclude></div>',
    };
});
```
And in your views, simply add the following:

```html
<cached-image image="https://www.google.ca/images/srpr/logo11w.png" transclude="true">
  <h1>Title</h1>
  <p>Description</p>
</cached-image>
```

> Use the `transclude` attribute if you want to put content inside the element.

In essence, this directive checks if ImgCache has been initialized and is ready to be used. It then checks if the image has already been cached. Otherwise, it downloads the image and then attempts to cache it.

####Up Your Game

By using a combination of these caching techniques you should see tangible performance increases in your Ionic apps, further blurring the distinction between native and hybrid apps.
