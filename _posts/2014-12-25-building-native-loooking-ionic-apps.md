---
title: Building Native Looking Ionic Apps
cover: http://photos-c.ak.instagram.com/hphotos-ak-xfp1/t51.2885-15/1515957_481759285277090_108579368_n.jpg
layout: post
tags: [ionic, framework, mobile, ios, android, cordova]
---
Ionic is a wonderful framework for building multiplatform hybrid applications for mobile. It strives to blur the lines between native and hybrid apps. The framework has improved greatly on its promise to bring near-native functionality and fluidity to its apps. However, on the design front some things have to be considered in order to truly achieve the native look for each platform.

First of all, each mobile platform has its own layout structure. Apple's iOS tends to concentrate its navigational elements in the bottom of the screen (for tabs) or the top (for header buttons). On the other hand, Android mainly displays navigation components on top of the app's content.

<!--excerpt-->

Second, animations. With the introduciton of iOS 7 and more recently Android Lollipop, a lot of attention has been given to how an application's content flows on screen. Each platform strives to give a coherent user experience, and to keep in touch with the different design ethics, your hybrid apps should abide by the same standards.

Finally, each platform has its own set of iconset. These icons are used throughout the operating system rendering them familiar to the user. In order to remain coherent within the platform, it is wise to use these same icons the user has become accustomed to in your apps.

In this blog post, we will see how Ionic allows you to develop apps that achieve near-native look on both iOS and Android platforms, sealing the design gap between native and hybrid apps.

####Ionic Lab

A new addition to the Ionic CLI comes in the form of the _Ionic Lab_. This feature allows you to develop for both iOS and Android platforms side-by-side in your browser of choice.

![Ionic Lab](http://ionicframework.com/img/blog/year-lab.png "Ionic Lab")

Running the following command will trigger the Ionic Lab functionality:

```bash
$ ionic serve --lab
```

Since this feature is enabled through the `serve` command, you get all the benefits you have come to expect, including _livereload_ and `gulp sass` watches (if you've setup the project to use Sass).

####Beta 14

With the introduction of the [14th beta](http://ionicframework.com/blog/the-final-beta/ "Ionic Beta 14") of Ionic framework, the layout structure of your apps automatically adjust depending on the targeted platform. Moreover, since animations on iOS and Android Lollipop are intrinsically different, the team behind the framework created new animation types dedicated for both platforms.

![Google's Material Design](http://blog.webbb.be/assets/posts/2014/material-design/material-design-ehsan-rahimi.gif "Google's Material Design")

Improved performance due to the upgrades of [AngularJS 1.3](http://angularjs.blogspot.ca/2014/10/angularjs-130-superluminal-nudge.html "More info on AngularJS 1.3"), template caching and greater attention towards view transitions and animations are all welcome additions to the framework.

####Icons

As we saw, Ionic does a great job at handling most of the default functionality, animation and layout of our apps components. It seems like we're all set to create hybrid mobile apps that can achieve the native look of each platform we target. But what about icons? Ionic comes with an immense iconset targeted at both iOS and Android platforms. However, there is no easy way to integrate icons that change automatically depending on the platform.

_This is where [`ionic-contrib-icon`](https://github.com/antonshevchenko/ionic-contrib-icon "Visit the GitHub repo") comes in._

In essence, `ionic-contrib-icon` consists of an AngularJS directive conveniently named `icon` which handles the display of icons for each platform using Ionic's built-in `ionic.Platform` service. After specifying the default icon to use, you have the possibility of defining equivalent icons to be displayed on other platforms.

An example of an icon that will display its native counterparts for both iOS and Android would look something like this:

```html
<icon default="ion-heart" ios="ion-ios-heart" android="ion-android-heart"></icon>
```

Using this directive in conjunction with Ionic Lab is a great way to seamlessly view the output of your app's design on each platform without having to run your app on the physical devices.

A nice addition to `icon` directive's core functionality is the possibility of specifying your own icon mappings in order to avoid specifying iOS and Android equivalents for each icon you use in your markup. As such, defining the default icon will be the only thing required. For instance, recreating the last example with the _heart_ icon, we will define our icon mapping:

```javascript
angular.module('app', ['ionic', 'ionic.contrib.icon'])

.constant('$ionicIconConfig', {
  map: {
    'ion-heart': {
      ios: 'ion-ios-heart',
      android: 'ion-android-heart'
    }
  }
});
```

In your app's templates, using the following markup will suffice:

```html
<icon default="ion-heart"></icon>
```

---

Integration with other icon libraries such as [Font Awesome](https://fortawesome.github.io/Font-Awesome/icons/) is a breeze.

The first approach is to set the default iconset by specifying the library's icon class in the `$ionicIconConfig()` constant. For Font Awesome, it will look like so:

```javascript
angular.module('app', ['ionic', 'ionic.contrib.icon'])

.constant('$ionicIconConfig', {
  type: 'fa'
});
```

Another option is to explicitly specify the library's class on each `icon` directive:

```html
<icon class="fa" default="fa-heart"></icon>
```

---

Finally, the directive works with all platforms supported by Ionic, meaning `ios`, `ipad`, `android` and `windows` are all valid attributes.

####Recap

As of the latest stable beta release, Ionic gives developers the tools they need to adapt their hybrid apps for the different platforms they are going to run on. The framework handles the changes to the app layout's design automatically and includes animations that behave coherently within their native platforms. Integrating platform-dependent icons in Ionic apps has been facilitated with the use of the `ionic-contrib-icon` project, which you can check out [here](https://github.com/antonshevchenko/ionic-contrib-icon "View GitHub repo").