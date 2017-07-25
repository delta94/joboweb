//Default colors
var brandPrimary = '#3DBEEE';
var brandSuccess = '#75C7A8';
var brandInfo = '#67c2ef';
var brandWarning = '#fabb3d';
var brandDanger = '#ff5454';

var grayDark = '#384042';
var gray = '#9faecb';
var grayLight = '#c0cadd';
var grayLighter = '#e1e6ef';
var grayLightest = '#f9f9fa';

var app = angular
    .module('app', [
        'bw.paging',
        '720kb.socialshare',
        'ionSlider',
        'ui.router',
        "com.2fdevs.videogular",
        'toastr',
        'angularModalService',
        'angularSpinner',
        'oc.lazyLoad',
        'pascalprecht.translate',
        'ncy-angular-breadcrumb',
        'angular-loading-bar',
        'ngSanitize',
        'ngAnimate',
        'firebase',
        'starter.configs',
        'starter.services',
        'ngFileUpload',
        'ngImgCrop',
        'datetime',
        'infinite-scroll',
        'chart.js'
    ])
    .config(['cfpLoadingBarProvider', function (cfpLoadingBarProvider) {
        cfpLoadingBarProvider.includeSpinner = false;
        cfpLoadingBarProvider.latencyThreshold = 1;


    }])
    .config(function (toastrConfig) {
        angular.extend(toastrConfig, {
            autoDismiss: false,
            closeButton: true,
            containerId: 'toast-container',
            maxOpened: 0,
            newestOnTop: true,
            positionClass: 'toast-top-left',
            preventDuplicates: true,
            preventOpenDuplicates: false,
            target: 'body',
            progressBar: false,
            tapToDismiss: true

        });
    })

    .run(function ($rootScope, AuthUser, $stateParams, $state) {
        $rootScope.width = window.innerWidth
        $rootScope.service = AuthUser
        firebase.database().ref('config').once('value', function (snap) {
            $rootScope.CONFIG = snap.val();
            $rootScope.dataJob = $rootScope.CONFIG.data.job;
            $rootScope.dataTime = $rootScope.CONFIG.data.time;
            $rootScope.dataIndustry = $rootScope.CONFIG.data.industry;
            $rootScope.dataLanguages = $rootScope.CONFIG.data.languages;
            $rootScope.numberDisplay = {like: 10, liked: 10, match: 10}

            //Industry
            $rootScope.arrayIndustry = [];
            for (var i in $rootScope.dataIndustry) {
                $rootScope.arrayIndustry.push(i);
            }

            //Job
            $rootScope.arrayJob = [];
            for (var i in $rootScope.dataJob) {
                $rootScope.arrayJob.push(i);
            }

            //Language
            $rootScope.arrayLang = [];
            for (var i in $rootScope.dataLanguages) {
                $rootScope.arrayLang.push(i);
            }

            //Time
            $rootScope.arrayTime = [];
            for (var i in $rootScope.dataTime) {
                $rootScope.arrayTime.push(i);
            }
        });

        if (!$rootScope.Lang) {
            $rootScope.lang = window.localStorage.getItem('lang')
            if (!$rootScope.lang) {
                $rootScope.lang = 'vi'
                window.localStorage.setItem('lang', 'vi')
                $rootScope.service.loadLang($rootScope.lang)
            } else {
                console.log('we have,' + $rootScope.lang)
                $rootScope.service.loadLang($rootScope.lang)
            }
        }


        function checkPlatform() {
            var ua = navigator.userAgent.toLowerCase();
            var platforms;
            if (ua.indexOf('mobile') < 0) {
                platforms = "web"
            } else {
                if (ua.indexOf('chrome') > 0 || ua.indexOf('safari') > 0 || ua.indexOf('firefox') > 0 || ua.indexOf('edge') > 0) {
                    platforms = "mobile"
                } else {
                    platforms = "app"
                }
            }
            return platforms
        }

        function checkDevice() {
            var ua = navigator.userAgent.toLowerCase();
            var android = ua.match(/(Android);?[\s\/]+([\d.]+)?/);
            var ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
            var ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/);
            var iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/);
            if (ipad || iphone || ipod) {
                return 'ios'
            }
            if (android) {
                return 'android'
            }

        };

        $rootScope.checkAgent = {
            platform: checkPlatform(),
            device: checkDevice() || ''
        }
        console.log('checkAgent', $rootScope.checkAgent)
        $rootScope.today = new Date().getTime()
        $rootScope.jobOffer = {}


    })


    .controller('navbarCtrl', function ($scope, $rootScope, $timeout, AuthUser, toastr, $state, $stateParams) {
        $rootScope.service.Ana('trackView', {track: $stateParams['#'], state: $state.current.name || 'new'})
        var params = $stateParams['#']
        if (params && params.startsWith("ref")) {
            window.localStorage.setItem('ref', $rootScope.service.getRefer(params))
            console.log('ref', $rootScope.service.getRefer(params))
        }


        AuthUser.user().then(function (data) {
            console.log(data);
            $rootScope.$broadcast('auth', data);

            if (!data.webToken) {
                $rootScope.service.saveWebToken();
            }
            $rootScope.service.JoboApi('initData', {userId: $rootScope.userId}).then(function (res) {
                console.log(res);
                var user = res.data;
                $rootScope.userData = user.userData;
                $rootScope.storeList = user.storeList;
                $rootScope.storeData = user.storeData;
                $rootScope.notification = $rootScope.service.ObjectToArray(user.notification)
                $rootScope.newNoti = $rootScope.service.calNoti($rootScope.notification)
                $rootScope.reactList = user.reactList;
            })


        })

        $scope.setCurrentStore = function (storeId) {
            $rootScope.storeId = storeId;
            var setCurrent = firebase.database().ref('user/' + $rootScope.userId)
            setCurrent.update({currentStore: storeId});
            window.location.reload();
        };
    })

// if (data.type == 2) {
//     loadUserData($rootScope.userId);
//     getNotification($rootScope.userId);
//
//     $timeout(function () {
//         getListReact($rootScope.userId, 'userId');
//         getStoreOnlineList()
//     }, 1000)
// }
// if (data.type == 1) {
//     loadCurrentStore($rootScope.storeId)
//     getNotification($rootScope.userId);
//     loadListStore($rootScope.userId)
//
//     $timeout(function () {
//         getProfileOnlineList()
//         getListReact($rootScope.storeId, 'storeId')
//     }, 1000)
//

//
// }
//
// function getUserOnline(userId) {
//     var userRef = firebase.database().ref('profile/' + userId + '/presence');
//
//     // Add ourselves to presence list when online.
//     var presenceRef = firebase.database().ref('.info/connected');
//     presenceRef.on("value", function (snap) {
//         if (snap.val()) {
//             // Remove ourselves when we disconnect.
//             var off = {
//                 status: 'offline',
//                 at: new Date().getTime()
//             }
//
//             userRef.onDisconnect().set(off);
//             var on = {
//                 status: 'online',
//                 at: new Date().getTime()
//
//             };
//             firebase.database().ref('profile/' + userId + '/name').on('value', function (snap) {
//                 var name = snap.val()
//                 if (name) {
//                     console.log(on);
//                     userRef.set(on)
//                 }
//             })
//
//
//         }
//     });
// }
//
// function loadUserData(userId) {
//     var userRef = firebase.database().ref('profile/' + userId);
//     var firsttime;
//
//     userRef.on('value', function (snap) {
//         $timeout(function () {
//             $rootScope.userData = snap.val()
//
//             if (!firsttime) {
//                 firsttime = true;
//                 if (!$rootScope.userData) {
//                     getUserOnline(userId);
//                 }
//                 $rootScope.$broadcast('handleBroadcast', $rootScope.userData);
//             }
//         })
//     })
// }
//
// function getStoreOnlineList() {
//     var time = new Date().getTime() - 24 * 60 * 60 * 1000
//     var onlinelistRef = firebase.database().ref('store').orderByChild('presence/at').startAt(time);
//     onlinelistRef.on("value", function (snap) {
//         $rootScope.onlineList = snap.val()
//         console.log("# of online users = ", $rootScope.onlineList);
//
//     });
// }
//
//
// function getProfileOnlineList() {
//     var time = new Date().getTime() - 24 * 60 * 60 * 1000
//     var onlinelistRef = firebase.database().ref('profile').orderByChild('presence/at').startAt(time);
//     onlinelistRef.on("value", function (snap) {
//         $rootScope.onlineList = snap.val()
//         console.log("# of online users = ", $rootScope.onlineList);
//     });
// }
//
// function getStoreOnline(storeId) {
//     var userRef = firebase.database().ref('store/' + storeId + '/presence');
//
//     var presenceRef = firebase.database().ref('.info/connected');
//     presenceRef.on("value", function (snap) {
//         if (snap.val()) {
//             // Remove ourselves when we disconnect.
//             var off = {
//                 status: 'offline',
//                 at: new Date().getTime(),
//
//             };
//             userRef.onDisconnect().set(off);
//             var on = {
//                 status: 'online',
//                 at: new Date().getTime()
//
//             }
//             firebase.database().ref('store/' + storeId + '/storeName').on('value', function (snap) {
//                 var storeName = snap.val()
//                 if (storeName) {
//                     console.log(on)
//                     userRef.set(on)
//                 }
//             })
//
//
//         }
//     });
//
//
// }
//
// function loadCurrentStore(storeId) {
//
//     var storeRef = firebase.database().ref('store/' + storeId);
//     var firsttime;
//
//     storeRef.on('value', function (snap) {
//         $timeout(function () {
//             $rootScope.storeData = snap.val()
//
//             if (!firsttime) {
//                 firsttime = true
//                 if ($rootScope.storeData) {
//                     getStoreOnline(storeId)
//                 }
//                 $rootScope.$broadcast('storeListen', $rootScope.storeData);
//             }
//
//         })
//     })
// }
//
// function loadListStore(userId) {
//     var storeListRef = firebase.database().ref('store').orderByChild('createdBy').equalTo(userId);
//     storeListRef.on('value', function (snap) {
//         $timeout(function () {
//             $scope.storeList = snap.val()
//             console.log($scope.storeList)
//
//         })
//     })
// }
//
// function getListReact(pros, type) {
//     if (!$rootScope.reactList) {
//         var reactRef = firebase.database().ref('activity/like').orderByChild(type).equalTo(pros);
//         reactRef.on('value', function (snap) {
//             $timeout(function () {
//                 var reactList = snap.val();
//                 console.log('reactList', reactList)
//                 $rootScope.reactList = {like: [], liked: [], match: []}
//
//                 if (type == 'storeId') {
//                     angular.forEach(reactList, function (card) {
//                         firebase.database().ref('presence/profile/' + card.userId).on('value', function (snap) {
//                             if (snap.val()) {
//                                 card.presence = snap.val().status
//                                 card.at = snap.val().at
//                             }
//                         })
//                         if (card.status == 1) {
//                             $rootScope.reactList.match.push(card)
//                         } else if (card.status == 0 && card.type == 1) {
//                             $rootScope.reactList.like.push(card)
//
//                         } else if (card.status == 0 && card.type == 2) {
//                             $rootScope.reactList.liked.push(card)
//
//                         }
//                     })
//                     console.log($rootScope.reactList)
//                 }
//                 if (type == 'userId') {
//                     angular.forEach(reactList, function (card) {
//                         firebase.database().ref('presence/store/' + card.storeId).on('value', function (snap) {
//                             if (snap.val()) {
//                                 card.presence = snap.val().status
//                                 card.at = snap.val().at
//                             }
//
//
//                         })
//                         if (card.status == 1) {
//                             $rootScope.reactList.match.push(card)
//                         } else if (card.status == 0 && card.type == 2) {
//                             $rootScope.reactList.like.push(card)
//
//                         } else if (card.status == 0 && card.type == 1) {
//                             $rootScope.reactList.liked.push(card)
//
//                         }
//                     })
//                     console.log($rootScope.reactList)
//                 }
//
//
//             })
//         })
//     }
// };
// function getNotification(userId) {
//     firebase.database().ref('notification/' + userId).orderByChild('createdAt')
//         .on('value', function (snap) {
//             $timeout(function () {
//                 $rootScope.notification = $rootScope.service.ObjectToArray(snap.val())
//                 console.log($rootScope.notification)
//                 $rootScope.newNoti = $rootScope.service.calNoti($rootScope.notification)
//             })
//         })
// }
//
// if (data.type == 0) {
//     if ($state.current.name == 'app.viewprofile' || $state.current.name == 'app.viewstore') {
//
//     } else {
//         $state.go('/')
//
//     }
// }