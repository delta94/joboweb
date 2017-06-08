"use strict";

app.controller('sDashCtrl', function ($scope, $state, $http,$stateParams
    , CONFIG
    , AuthUser
    , $window
    , $log
    , $rootScope
    , toastr
    , $timeout
    , ModalService) {

    $rootScope.og = {
        title: '('+ $rootScope.newNoti +') Jobo' || 'Jobo'
    }

    $rootScope.$watch('onlineList', function (newvlue) {
        if (newvlue) {
            $rootScope.aside = true
        }
    })
    $scope.init = function () {
        if ($rootScope.userData && $rootScope.userData.location) {
            $scope.initData()
        } else {
            $scope.$on('handleBroadcast', function (event, message) {
                console.log('Init data', message);
                $scope.initData()
            });
        }
    };

    $scope.initData = function () {

        if (!$rootScope.userData) {
            toastr.info('Bạn cần cập nhật hồ sơ trước!')
            $state.go('profile')
        } else if (!$rootScope.userData.location) {
            ModalService.showModal({
                templateUrl: 'templates/modals/address.html',
                controller: 'ModalAddressCtrl'
            }).then(function (modal) {
                modal.element.modal();
                modal.close.then(function (result) {
                    if (result.location) {
                        $rootScope.userData.location = result.location;
                        $rootScope.userData.address = result.address;
                        var userRef = firebase.database().ref('profile/' + $rootScope.userId);
                        console.log(result);
                        userRef.update($rootScope.userData)
                        $scope.initData()
                    }
                });
            });

            //init filter


        } else if (!$rootScope.newfilter) {
            $rootScope.newfilter = {
                userId: $rootScope.userId,
                type: 'job',
                p: 1,
                job: $rootScope.service.getfirst($rootScope.userData.job),

            }
            $scope.getUserFiltered($rootScope.newfilter)
        }

        if ($rootScope.newfilter && $rootScope.newfilter == 'job' && !$rootScope.jobCard) {
            $scope.getUserFiltered($rootScope.newfilter)
        }
        if ($rootScope.newfilter && $rootScope.newfilter == 'store' && !$rootScope.storeCard) {
            $scope.getUserFiltered($rootScope.newfilter)
        }


    }
    $scope.setSalary = function () {
        $scope.salary = true

    }

    $scope.salary = false
    $rootScope.newfilterFilter = function (type, key) {
        $rootScope.jobCard = []
        $rootScope.storeCard = []
        $rootScope.newfilter.p = 1
        $rootScope.newfilter[type] = key
        console.log($rootScope.newfilter)
        $scope.getUserFiltered($rootScope.newfilter)
        if (type == 'expect_salary') {
            $scope.salary = false
        }

    }
    $scope.selectFilter = function (card) {
        console.log('$rootScope.newfilter',$rootScope.newfilter)
        $rootScope.newfilter = card;
        $scope.getUserFiltered($rootScope.newfilter)
    };

    $rootScope.maxMatchJob = 0
    $rootScope.maxMatchStore = 0

    $scope.getUserFiltered = function (newfilter) {
        console.log('filtering..', newfilter)
        $scope.loading = true
        if (newfilter.type == 'store') {

            $http({
                method: 'GET',
                url: CONFIG.APIURL + '/api/employer',
                params: newfilter
            }).then(function successCallback(response) {
                console.log("response", response);
                $scope.response = response.data;
                if($rootScope.maxMatchStore == 0){
                    $rootScope.maxMatchStore = $scope.response.data[0].match
                    console.log($rootScope.maxMatchStore)
                }
                $timeout(function () {
                    if (!$rootScope.storeCard) {
                        $rootScope.storeCard = []
                    }
                    for (var i in $scope.response.data) {
                        var storeData = $scope.response.data[i]
                        $scope.response.data[i].matchPer = Math.round($scope.response.data[i].match *100/ $rootScope.maxMatchStore)


                        if (storeData.act) {
                            var ref = 'activity/like/' + storeData.storeId + ':' + $rootScope.userId
                            firebase.database().ref(ref).on('value', function (snap) {
                                $scope.response.data[i].act = snap.val()
                            })
                        }
                        firebase.database().ref('presence/store/' + storeData.storeId + 'status').on('value', function (snap) {
                           if(snap.val()){
                               $scope.response.data[i].presence = snap.val()
                               console.log(snap.val())

                           }
                        })


                    }
                    $rootScope.storeCard = $rootScope.storeCard.concat($scope.response.data);
                    console.log($rootScope.storeCard)
                    $scope.loading = false

                })
            }, function (error) {
                console.log(error)

                $scope.loading = false

            })


        } else {
            $http({
                method: 'GET',
                url: CONFIG.APIURL + '/api/job',
                params: newfilter
            }).then(function successCallback(response) {
                console.log("respond", response);
                $scope.response = response.data;
                if($rootScope.maxMatchJob == 0){
                    $rootScope.maxMatchJob = $scope.response.data[0].match
                    console.log($rootScope.maxMatchJob)
                }
                $timeout(function () {
                    if (!$rootScope.jobCard) {
                        $rootScope.jobCard = []
                    }
                    for (var i in $scope.response.data) {


                        var jobData = $scope.response.data[i]
                        $scope.response.data[i].matchPer = Math.round($scope.response.data[i].match *100/ $rootScope.maxMatchJob)

                        if (jobData.act) {
                            var ref = 'activity/like/' + jobData.storeId + ':' + $rootScope.userId
                            firebase.database().ref(ref).on('value', function (snap) {
                                $scope.response.data[i].act = snap.val()
                            })
                        }
                        firebase.database().ref('presence/store/' + jobData.storeId + '/status').on('value', function (snap) {
                            if(snap.val()){
                                $scope.response.data[i].presence = snap.val()
                                console.log(snap.val())
                            }
                        })
                    }
                    $rootScope.jobCard = $rootScope.jobCard.concat($scope.response.data);
                    console.log($rootScope.jobCard)
                    $scope.loading = false
                })
            }, function (error) {
                console.log(error)

                $scope.loading = false

            })

        }


    };


    $scope.slideHasChanged = function (index) {
        console.log('slideHasChanged');
        $scope.slideIndex = index
    };

    $scope.slideTo = function (index) {
        $ionicSlideBoxDelegate.slide(index);
    };
    $scope.deviceHeight = window.innerHeight;

    $scope.slideIndex = 1;
// to logout


    $scope.matchlike = "";

    if (!$rootScope.userliked) {
        $rootScope.userliked = [];
    }
    if (!$rootScope.userdisliked) {
        $rootScope.userdisliked = [];
    }

    $scope.filterSearchMook = function () {
        console.log($rootScope.newfilter)
    }
    $scope.applyThis = function (id, key) {
        if ($scope.selectedJob && $scope.selectedJob[id] && $scope.selectedJob[id][key]) {
            delete $scope.selectedJob[id][key]
        } else {

            if (!$scope.selectedJob) {
                $scope.selectedJob = {}
            }
            if (!$scope.selectedJob[id]) {
                $scope.selectedJob[id] = {}
            }
            $scope.selectedJob[id][key] = true;
        }
        console.log($scope.selectedJob)
    };


    $scope.like = function (card, action, selectedJob) {

        AuthUser.userLike(card, action, selectedJob).then(function (result) {
            console.log(result)

        })
    };

    $scope.chatto = function (id) {
        $state.go("employer.chats", {to: id})
    };

    $scope.limit = 5;
    $scope.showMore = function () {
        console.log('reach')
        $rootScope.newfilter.p++
        $scope.getUserFiltered($rootScope.newfilter)

    }
    $scope.loading = false;
    $scope.loadMoreStore = function () {
        if ($scope.newfilter && $scope.response && $scope.newfilter.type == 'store') {
            console.log('request load', $scope.newfilter.p, $scope.response.total_pages)
            if (!$scope.loading && $scope.newfilter) {
                if ($scope.newfilter.p < $scope.response.total_pages) {
                    $scope.loading = true;
                    console.log('loading')

                    $scope.newfilter.p++
                    $scope.getUserFiltered($scope.newfilter);
                    $timeout(function () {
                        $scope.loading = false;
                    }, 500)
                } else {
                    console.log('max page')
                }

            }
        }

    }
    $scope.loadMoreJob = function () {
        if ($scope.newfilter && $scope.response && $scope.newfilter.type == 'job') {
            console.log('request load', $scope.newfilter.p, $scope.response.total_pages)
            if (!$scope.loading && $scope.newfilter) {
                if ($scope.newfilter.p < $scope.response.total_pages) {
                    $scope.loading = true;
                    console.log('loading')

                    $scope.newfilter.p++
                    $scope.getUserFiltered($scope.newfilter);
                    $timeout(function () {
                        $scope.loading = false;
                    }, 500)
                } else {
                    console.log('max page')
                }

            }
        }

    }


});