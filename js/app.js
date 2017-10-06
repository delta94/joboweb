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
        'chart.js',
        'froala'
    ])
    .value('froalaConfig', {
        toolbarInline: false,
        placeholderText: 'Edit Your Content Here!'
    })
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
            target: 'body',
            progressBar: false,
            tapToDismiss: true

        });
    })

    .run(function ($rootScope, AuthUser, CONFIG) {
        $rootScope.searchName = ''

        $rootScope.width = window.innerWidth;
        $rootScope.service = AuthUser;
        $rootScope.CONFIG = CONFIG;
        $rootScope.service.JoboApi('config').then(function (res) {
            $rootScope.CONFIG = res.data;
            $rootScope.CONFIG.APIURL = CONFIG.APIURL;
            $rootScope.CONFIG.hour = CONFIG.hour;
            $rootScope.CONFIG.day = CONFIG.day;
            console.log('$rootScope.CONFIG.APIURL', $rootScope.CONFIG.APIURL)
            $rootScope.service.loadLang('vi');
            $rootScope.dataJob = $rootScope.CONFIG.data.job;
            $rootScope.dataTime = $rootScope.CONFIG.data.time;
            $rootScope.dataIndustry = $rootScope.CONFIG.data.industry;
            $rootScope.dataLanguages = $rootScope.CONFIG.data.languages;
            $rootScope.numberDisplay = {like: 10, liked: 10, match: 10};


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

        }

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

        $scope.$watch('$rootScope.type', function () {
            if ($rootScope.type == 1) {
                console.log('employer go to');

                $state.go('app.edash')
            }
            if ($rootScope.type == 2) {
                console.log('jobseeker go to');

                $state.go('app.sdash')
            }
        });

        AuthUser.user().then(function (data) {
            console.log(data);
            if($rootScope.userId){
                $rootScope.service.JoboApi('initData', {userId: $rootScope.userId}).then(function (res) {
                    var user = res.data;
                    console.log('user', user);
                    $rootScope.userData = user.userData;
                    if ($rootScope.userData) {
                        $timeout(function () {
                            if (!$rootScope.userData.webToken) {
                                $rootScope.service.saveWebToken();
                            }
                            $rootScope.type = $rootScope.userData.type;
                            if ($rootScope.userData.currentStore) {
                                $rootScope.storeId = $rootScope.userData.currentStore
                            }
                            $rootScope.storeList = user.storeList;
                            $rootScope.storeData = user.storeData;
                            $rootScope.notification = $rootScope.service.ObjectToArray(user.notification)
                            $rootScope.newNoti = $rootScope.service.calNoti($rootScope.notification)
                            $rootScope.reactList = user.reactList;


                        })

                    } else {
                        toastr.info('Chúng tôi đang kiểm tra lại thông tin người dùng')
                    }
                })
            }


        })

        $scope.setCurrentStore = function (storeId) {
            $rootScope.storeId = storeId;
            $rootScope.service.JoboApi('update/user', {
                userId: $rootScope.userId,
                user: {
                    currentStore: storeId
                }
            });
            AuthUser.user()
        };
    })
    .controller('shortlinkCtrl', function (CONFIG, $stateParams) {
        axios.get(`${CONFIG.AnaURL}/l/${$stateParams.queryString}`)
            .then(result => window.location.href = result.data.url)
            .catch(err => console.log(err));
    })
    .controller('unsubscribeCtrl', function ($scope, CONFIG, $stateParams, toastr) {
        const { id, email } = $stateParams;
        $scope.unsubscribe = function (reason) {
            axios.post(`${CONFIG.APIURL}/unsubscribe`, {
                notiId: id,
                email,
                reason
            })
                .then(result => toastr.success(result.data.message))
                .catch(err => toastr.error(err.data.message));
        }
    })