angular
    .module('app')
    .config(['CONFIG', '$stateProvider', '$urlRouterProvider', '$ocLazyLoadProvider', '$breadcrumbProvider', '$locationProvider', function (CONFIG, $stateProvider, $urlRouterProvider, $ocLazyLoadProvider, $breadcrumbProvider, $locationProvider) {
        $urlRouterProvider.otherwise('/hiring');

        $locationProvider.html5Mode(CONFIG.Location)
        $locationProvider.hashPrefix('!');

        $ocLazyLoadProvider.config({
            // Set to true if you want to see what and when is dynamically loaded
            debug: false
        });

        $breadcrumbProvider.setOptions({
            prefixStateName: 'app.main',
            includeAbstract: true,
            template: '<li class="breadcrumb-item" ng-repeat="step in steps" ng-class="{active: $last}" ng-switch="$last || !!step.abstract"><a ng-switch-when="false" href="{{step.ncyBreadcrumbLink}}">{{step.ncyBreadcrumbLabel}}</a><span ng-switch-when="true">{{step.ncyBreadcrumbLabel}}</span></li>'
        });

        $stateProvider
            .state('app', {
                abstract: true,
                templateUrl: 'templates/tab.html',
                controller: 'navbarCtrl',

                //page title goes here
                ncyBreadcrumb: {
                    label: 'Root',
                    skip: true
                },
                resolve: {
                    loadCSS: ['$ocLazyLoad', function ($ocLazyLoad) {
                        // you can lazy load CSS files
                        return $ocLazyLoad.load([{
                            serie: true,
                            name: 'Font Awesome',
                            files: ['css/font-awesome.min.css']
                        }, {
                            serie: true,
                            name: 'Simple Line Icons',
                            files: ['css/simple-line-icons.css']
                        }]);
                    }],
                    loadPlugin: ['$ocLazyLoad', function ($ocLazyLoad) {
                        // you can lazy load files for an existing module
                        return $ocLazyLoad.load([{
                            serie: true,
                            name: 'chart.js',
                            files: [
                                'bower_components/chart.js/dist/Chart.min.js',
                                'bower_components/angular-chart.js/dist/angular-chart.min.js'
                            ]
                        }]);
                    }]
                }
            })
            .state('app.link', {
                url: '/l/:queryString',
                templateUrl: 'templates/page/link.html',
                controller: 'shortlinkCtrl'
            })

            .state('signup', {
                url: '/signup/:id?apply&job',
                templateUrl: 'templates/signup.html',
                controller: 'signupCtrl'
            })


            .state('reset', {
                url: '/reset',
                templateUrl: "templates/resetemail.html",
                controller: "resetController"
            })


            .state('intro', {
                url: '/intro',
                templateUrl: "templates/intro.html",
                controller: "introController"
            })

            .state('profile', {
                url: '/profile?admin',
                templateUrl: 'jobseeker/sprofile.html',
                controller: 'sprofileCtrl',
                resolve: {
                    loadPlugin: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            {
                                serie: true,
                                files: ['bower_components/moment/min/moment.min.js']
                            },
                            {
                                serie: true,
                                files: [
                                    'bower_components/bootstrap-daterangepicker/daterangepicker.js',
                                    'bower_components/angular-daterangepicker/js/angular-daterangepicker.min.js'
                                ]
                            },
                            {
                                files: ['bower_components/angular-ui-mask/dist/mask.min.js']
                            },
                            {
                                files: ['bower_components/angular-ui-select/dist/select.min.js']
                            },
                            {
                                files: [
                                    'bower_components/ionrangeslider/js/ion.rangeSlider.min.js',
                                    'bower_components/ionrangeslider.angular/slider.js'
                                ]
                            },
                        ]);
                    }],
                    loadCSS: ['$ocLazyLoad', function ($ocLazyLoad) {
                        // you can lazy load CSS files
                        return $ocLazyLoad.load([{
                            serie: true,
                            name: 'Font Awesome',
                            files: ['css/font-awesome.min.css']
                        }, {
                            serie: true,
                            name: 'Simple Line Icons',
                            files: ['css/simple-line-icons.css']
                        }]);
                    }],
                }

            })
            .state('app.dash', {
                url: '/',
                templateUrl: 'templates/dashboard.html',
                controller: 'dashboardCtrl',

                //page title goes here
                ncyBreadcrumb: {
                    label: 'Root',
                    skip: true
                },
                resolve: {
                    loadCSS: ['$ocLazyLoad', function ($ocLazyLoad) {
                        // you can lazy load CSS files
                        return $ocLazyLoad.load([{
                            serie: true,
                            name: 'Font Awesome',
                            files: ['css/font-awesome.min.css']
                        }, {
                            serie: true,
                            name: 'Simple Line Icons',
                            files: ['css/simple-line-icons.css']
                        }]);
                    }]
                }
            })

            .state('app.hiring', {
                url: '/hiring?job',
                templateUrl: 'templates/hiring.html',
                controller: 'hiringCtrl'
            })
            .state('app.refer', {
                url: '/refer?email',
                templateUrl: 'templates/refer.html',
                controller: 'referCtrl'
            })
            .state('app.findjob', {
                url: '/',
                templateUrl: 'templates/dashboard.html',
                controller: 'dashboardCtrl'
            })
            .state('app.viewprofile', {
                url: '/view/profile/:id?admin',
                templateUrl: 'employer/viewprofile.html',
                controller: 'ViewProfileCtrl'
            })
            .state('app.viewstore', {
                url: '/view/store/:id?admin?job',
                templateUrl: 'jobseeker/viewstore.html',
                controller: 'ViewStoreCtrl'
            })

            .state('app.404', {
                url: '/404',
                templateUrl: 'views/pages/404.html'
            })
            .state('app.500', {
                url: '/500',
                templateUrl: 'views/pages/500.html'
            })

            .state('store', {
                url: '/store/:id?admin',
                templateUrl: 'employer/store.html',
                controller: 'storeCtrl',
                resolve: {
                    loadPlugin: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            {
                                serie: true,
                                files: ['bower_components/moment/min/moment.min.js']
                            },
                            {
                                serie: true,
                                files: [
                                    'bower_components/bootstrap-daterangepicker/daterangepicker.js',
                                    'bower_components/angular-daterangepicker/js/angular-daterangepicker.min.js'
                                ]
                            },
                            {
                                files: ['bower_components/angular-ui-mask/dist/mask.min.js']
                            },
                            {
                                files: ['bower_components/angular-ui-select/dist/select.min.js']
                            },
                            {
                                files: [
                                    'bower_components/ionrangeslider/js/ion.rangeSlider.min.js',
                                    'bower_components/ionrangeslider.angular/slider.js'
                                ]
                            },
                        ]);
                    }],
                    loadCSS: ['$ocLazyLoad', function ($ocLazyLoad) {
                        // you can lazy load CSS files
                        return $ocLazyLoad.load([{
                            serie: true,
                            name: 'Font Awesome',
                            files: ['css/font-awesome.min.css']
                        }, {
                            serie: true,
                            name: 'Simple Line Icons',
                            files: ['css/simple-line-icons.css']
                        }]);
                    }],
                }

            })
            //employer seeker dash

            .state('app.edash', {
                url: '/employer/dash?lat&lng&job',
                templateUrl: 'employer/tab-dash.html',
                controller: 'eDashCtrl'
            })

            .state('app.echats', {
                url: '/employer/chats',
                templateUrl: 'employer/aside.html'
            })
            //job seeker dash
            .state('app.sdash', {
                url: '/jobseeker/dash?add?job',
                templateUrl: 'jobseeker/tab-dash.html',
                controller: 'sDashCtrl'
            })
            .state('app.setting', {
                url: '/setting',
                templateUrl: 'templates/setting.html',
                controller: 'settingCtrl'
            })
            .state('app.schats', {
                url: '/jobseeker/chats/',
                templateUrl: 'jobseeker/aside.html',
            })
            .state('app.pricing', {
                url: '/pricing',
                templateUrl: 'templates/page/pricing.html',
                controller: 'pricingCtrl'
            })
            .state('cart', {
                url: '/cart/:id',
                templateUrl: 'templates/page/cart.html',
                controller: 'cartCtrl'
            })


            // admin
            .state('admin', {
                abstract: true,
                templateUrl: 'templates/admin/full.html',
                controller: 'dashAdminCtrl',

                //page title goes here
                ncyBreadcrumb: {
                    label: 'Root',
                    skip: true
                },
                resolve: {
                    loadCSS: ['$ocLazyLoad', function ($ocLazyLoad) {
                        // you can lazy load CSS files
                        return $ocLazyLoad.load([{
                            serie: true,
                            name: 'Font Awesome',
                            files: ['css/font-awesome.min.css']
                        }, {
                            serie: true,
                            name: 'Simple Line Icons',
                            files: ['css/simple-line-icons.css']
                        }]);
                    }],
                    loadPlugin: ['$ocLazyLoad', function ($ocLazyLoad) {
                        // you can lazy load files for an existing module
                        return $ocLazyLoad.load([{
                            serie: true,
                            name: 'chart.js',
                            files: [
                                'bower_components/chart.js/dist/Chart.min.js',
                                'bower_components/angular-chart.js/dist/angular-chart.min.js'
                            ]
                        }]);
                    }],
                }
            })
            .state('admin.jobseeker', {
                url: '/admin/jobseeker',
                templateUrl: 'templates/admin/jobseeker.html',
                controller: 'jobseekerAdminCtrl'
            })
            .state('admin.dash', {
                url: '/admin',
                templateUrl: 'templates/admin/dash.html',
                controller: 'dashAdminCtrl'
            })
            .state('admin.employer', {
                url: '/admin/employer',
                templateUrl: 'templates/admin/employer.html',
                controller: 'employerAdminCtrl'
            })
            .state('admin.function', {
                url: '/admin/function',
                templateUrl: 'templates/admin/function.html',
                controller: 'functionAdminCtrl'
            })
            .state('admin.working', {
                url: '/admin/working',
                templateUrl: 'templates/admin/working.html',
                controller: 'workingAdminCtrl'
            })
            .state('admin.email', {
                url: '/admin/email',
                templateUrl: 'templates/admin/email.html',
                controller: 'emailCtrl'
            })
            .state('admin.lead', {
                url: '/admin/lead',
                templateUrl: 'templates/admin/lead.html',
                controller: 'leadCtrl'
            })
            .state('admin.schedule', {
                url: '/admin/schedule',
                templateUrl: 'templates/admin/schedule.html',
                controller: 'scheduleCtrl'
            })

        // static


    }]);
