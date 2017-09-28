"use strict"

app.controller('dashboardCtrl', function ($scope, $timeout, $sce, toastr, $state, CONFIG, $http, $rootScope) {
        $scope.loading = true
        $rootScope.aside = false
        $scope.showjob = 2;
        $rootScope.og = {
            title: 'Việc làm lương tốt, ứng tuyển dễ dàng'
        }

        if (!$rootScope.UserCard && !$rootScope.StoreCard) {
            $http({
                method: 'GET',
                url: CONFIG.APIURL + '/api/dashboard'
            }).then(function successCallback(response) {
                console.log("respond", response);
                $timeout(function () {
                    $rootScope.UserCard = response.data.jobseeker;
                    $rootScope.StoreCard = response.data.employer
                })
            }, function (error) {
                console.log(error)
            })
            $scope.catalog = {hn: {}, sg: {}}

            $http({
                method: 'GET',
                url: CONFIG.APIURL + '/dash/job?lat=10.779942&lng=106.704354'
            }).then(function successCallback(response) {
                console.log("respond", response);
                $timeout(function () {
                    if (!$rootScope.JobCard) {
                        $rootScope.JobCard = {}
                    }
                    $rootScope.JobCard.sg = response.data;
                    for (var i in $rootScope.JobCard.sg) {
                        var job = $rootScope.JobCard.sg[i]
                        if (!$scope.catalog.sg[job.job]) {
                            $scope.catalog.sg[job.job] = 1
                        } else {
                            $scope.catalog.sg[job.job]++
                        }
                    }
                })
            }, function (error) {
                console.log(error)
            })

            $http({
                method: 'GET',
                url: CONFIG.APIURL + '/dash/job?lat=21.0225499&lng=105.8441781'
            }).then(function successCallback(response) {
                console.log("respond", response);
                $timeout(function () {
                    if (!$rootScope.JobCard) {
                        $rootScope.JobCard = {}
                    }
                    $rootScope.JobCard.hn = response.data;
                    for (var i in $rootScope.JobCard.hn) {
                        var job = $rootScope.JobCard.hn[i]
                        if (!$scope.catalog.hn[job.job]) {
                            $scope.catalog.hn[job.job] = 1
                        } else {
                            $scope.catalog.hn[job.job]++
                        }
                    }
                })
            }, function (error) {
                console.log(error)
            })
            $http({
                method: 'GET',
                url: CONFIG.APIURL + '/api/job?working_type=seasonal'
            }).then(function successCallback(response) {
                console.log("respond", response);
                $timeout(function () {
                    if (!$rootScope.JobCard) {
                        $rootScope.JobCard = {}
                    }
                    $rootScope.JobCard.ss = response.data.data;
                })
            }, function (error) {
                console.log(error)
            })
        }
        $scope.showVideo = function (user) {
            $rootScope.service.Ana('show_video', {watched: user.userId})
            $scope.showVid = user.userId
            $scope.videoTrusted = $sce.trustAsResourceUrl(user.videourl)
        }


        $scope.sortFilter = function (param) {
            $rootScope.newfilter = {
                show: param
            }
            $rootScope.JobCard = {}
            $scope.getUserFiltered($rootScope.newfilter)

        }
        $scope.newfilterFilter = function () {
            toastr.info('Bạn phải đăng nhập để thực hiện tác vụ này!');
            $state.go('intro')

        };
        $scope.changefilter = function () {
            $rootScope.service.Ana('createProfile', {where: 'haytaohoso'})

            console.log('click');
            toastr.info('Hãy đăng ký tài khoản và bắt đầu tạo hồ sơ!');
            $state.go('signup', {id: 2})

        }
        $scope.change = function () {
            console.log('click')
            toastr.info('Bạn phải đăng nhập để thực hiện tác vụ này!');
            $state.go('signup', {id: 1})

        }


        $(window).load(function () {
            $('.post-module').hover(function () {
                $(this).find('.description').stop().animate({
                    height: "toggle",
                    opacity: "toggle"
                }, 300);
            });
        });
    }
)
    .controller('hiringCtrl', function ($scope, $timeout, $sce, toastr, $state, CONFIG, $http, $rootScope, $stateParams) {
        if (!$rootScope.newfilter) {
            $rootScope.newfilter = {}
        }
        if ($stateParams.job) {
            $rootScope.newfilter.job = $stateParams.job
        }

        $scope.loading = true
        $rootScope.aside = false
        $scope.showjob = 2;

        axios({
            method: 'GET',
            url: CONFIG.APIURL + '/api/dashboard'
        }).then(function successCallback(response) {
            console.log("respond", response);
            $timeout(function () {
                $rootScope.UserCard = response.data.jobseeker;
            })
        }, function (error) {
            console.log(error)
        });
        axios({
            method: 'GET',
            url: CONFIG.APIURL + '/googleJob',
            params: $rootScope.newfilter
        }).then(function successCallback(response) {
            console.log("respond", response);
            $timeout(function () {
                $rootScope.StoreCard = response.data
            })
        }, function (error) {
            console.log(error)
        })

        $scope.showVideo = function (user) {
            $rootScope.service.Ana('show_video', {watched: user.userId})
            $scope.showVid = user.userId
            $scope.videoTrusted = $sce.trustAsResourceUrl(user.videourl)
        }


        $scope.sortFilter = function (param) {
            $rootScope.newfilter = {
                show: param
            }
            $rootScope.JobCard = {}
            $scope.getUserFiltered($rootScope.newfilter)

        }
        $scope.newfilterFilter = function () {
            toastr.info('Bạn phải đăng nhập để thực hiện tác vụ này!');
            $state.go('intro')

        };
        $scope.changefilter = function () {
            $rootScope.service.Ana('createProfile', {where: 'haytaohoso'})

            console.log('click');
            toastr.info('Hãy đăng ký tài khoản và bắt đầu tạo hồ sơ!');
            $state.go('signup', {id: 2})

        }
        $scope.change = function () {
            console.log('click')
            toastr.info('Bạn phải đăng nhập để thực hiện tác vụ này!');
            $state.go('signup', {id: 1})

        }


        $(window).load(function () {
            $('.post-module').hover(function () {
                $(this).find('.description').stop().animate({
                    height: "toggle",
                    opacity: "toggle"
                }, 300);
            });
        });

    })
    .controller('referCtrl', function ($scope, $timeout, $sce, toastr, $state, CONFIG, $http, $rootScope) {
            $scope.loading = true
            $rootScope.aside = false
            $scope.showjob = 2;
            $rootScope.og = {
                title: 'Freelance Headhunter - Giới thiệu việc làm cho bạn bè, nhận hoa hồng hấn dẫn'
            }

            $http({
                method: 'GET',
                url: CONFIG.APIURL + '/dash/job?lat=10.779942&lng=106.704354'
            }).then(function successCallback(response) {
                console.log("respond", response);
                $timeout(function () {
                    if (!$rootScope.JobCard) {
                        $rootScope.JobCard = {}
                    }
                    $rootScope.JobCard.sg = response.data;
                    for (var i in $rootScope.JobCard.sg) {
                        var job = $rootScope.JobCard.sg[i]
                        if (!$scope.catalog.sg[job.job]) {
                            $scope.catalog.sg[job.job] = 1
                        } else {
                            $scope.catalog.sg[job.job]++
                        }
                    }
                })
            }, function (error) {
                console.log(error)
            })

            $http({
                method: 'GET',
                url: CONFIG.APIURL + '/dash/job?lat=21.0225499&lng=105.8441781'
            }).then(function successCallback(response) {
                console.log("respond", response);
                $timeout(function () {
                    if (!$rootScope.JobCard) {
                        $rootScope.JobCard = {}
                    }
                    $rootScope.JobCard.hn = response.data;
                    for (var i in $rootScope.JobCard.hn) {
                        var job = $rootScope.JobCard.hn[i]
                        if (!$scope.catalog.hn[job.job]) {
                            $scope.catalog.hn[job.job] = 1
                        } else {
                            $scope.catalog.hn[job.job]++
                        }
                    }
                })
            }, function (error) {
                console.log(error)
            })

            $scope.showVideo = function (user) {
                $rootScope.service.Ana('show_video', {watched: user.userId})
                $scope.showVid = user.userId
                $scope.videoTrusted = $sce.trustAsResourceUrl(user.videourl)
            }


            $scope.sortFilter = function (param) {
                $rootScope.newfilter = {
                    show: param
                }
                $rootScope.JobCard = {}
                $scope.getUserFiltered($rootScope.newfilter)

            }
            $scope.newfilterFilter = function () {
                toastr.info('Bạn phải đăng nhập để thực hiện tác vụ này!');
                $state.go('intro')

            };
            $scope.changefilter = function () {
                $rootScope.service.Ana('createProfile', {where: 'haytaohoso'})

                console.log('click');
                toastr.info('Hãy đăng ký tài khoản và bắt đầu tạo hồ sơ!');
                $state.go('signup', {id: 2})

            }
            $scope.change = function () {
                console.log('click')
                toastr.info('Bạn phải đăng nhập để thực hiện tác vụ này!');
                $state.go('signup', {id: 1})

            }


            $(window).load(function () {
                $('.post-module').hover(function () {
                    $(this).find('.description').stop().animate({
                        height: "toggle",
                        opacity: "toggle"
                    }, 300);
                });
            });
        }
    )

