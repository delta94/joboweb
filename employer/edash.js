"use strict";

app.controller('eDashCtrl', function ($scope, $state, $http, $sce, toastr, $q
    , CONFIG
    , AuthUser
    , $window
    , $log
    , $rootScope
    , $timeout
    , ModalService) {

    $rootScope.$watch('newNoti', function (newNoti) {
        $rootScope.og = {
            title: '(' + newNoti + ') Jobo' || 'Jobo'
        }
    });

    $(document).ready(function () {
        $('[data-toggle="popover"]').popover();
    });
    $rootScope.$watch('onlineList', function (newvlue) {
        if (newvlue) {
            $rootScope.aside = true
        }
    });
    $scope.init = function () {

        if ($rootScope.storeData) {
            $scope.initData($rootScope.storeData)

        } else {
            $scope.$on('storeListen', function (event, storeData) {
                console.log('Init data', storeData);
                $scope.initData(storeData)
            });
        }

    };
    $scope.calculateAge = function calculateAge(birthday) { // birthday is a date
        var ageDifMs = Date.now() - new Date(birthday).getTime();
        var ageDate = new Date(ageDifMs); // miliseconds from epoch
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    }

    $scope.initData = function (storeData) {
        if (!storeData) {
            $state.go('store', {id: null})
            toastr.info('Hãy tạo cửa hàng đầu tiên của bạn')
        } else if (!$rootScope.storeData.location) {
            ModalService.showModal({
                templateUrl: 'templates/modals/address.html',
                controller: 'ModalAddressCtrl'
            }).then(function (modal) {
                modal.element.modal();
                modal.close.then(function (result) {
                    if (result.location) {
                        $rootScope.storeData.location = result.location;
                        $rootScope.storeData.address = result.address;
                        var userRef = firebase.database().ref('store/' + $rootScope.storeId);
                        console.log(result);
                        userRef.update($rootScope.storeData)
                        $scope.initData()
                    }
                });
            });
        } else if (!$rootScope.storeData.job) {
            toastr.info('Bạn đang cần tuyển vị trí gì?')
            $state.go('store', {id: 'job'})
        } else {
            $rootScope.newfilter = {
                job: $rootScope.service.getfirst($rootScope.storeData.job),
                userId: $rootScope.storeId,
                p: 1
            }
            $scope.getUserFiltered($rootScope.newfilter)
        }
    }

    $rootScope.newfilterFilter = function (type, key) {
        $rootScope.newfilter[type] = key
        $rootScope.newfilter.p = 1
        if ($rootScope.newfilter.experience == false) {
            delete $rootScope.newfilter.experience
        }
        if ($rootScope.newfilter.figure == false) {
            delete $rootScope.newfilter.figure
        }

        console.log($rootScope.newfilter)
        $rootScope.usercard = []
        $scope.getUserFiltered($rootScope.newfilter)
    }


    $scope.showVideo = function (user) {
        $scope.showVid = user.userId
        $scope.videoTrusted = $sce.trustAsResourceUrl(user.videourl)
    }

    $scope.loading = false;
    $scope.loadMore = function () {
        console.log('request load')
        if (!$scope.loading && $rootScope.newfilter && $rootScope.newfilter.p < $scope.response.total_pages)  {
            $scope.loading = true;

            console.log('loading')
            $rootScope.newfilter.p++
            $scope.getUserFiltered($rootScope.newfilter);
            $timeout(function () {
                $scope.loading = false;
            }, 500)
        }
    }
    $rootScope.maxMatchUser = 0


    $scope.getUserFiltered = function (newfilter) {
        console.log('filtering..', newfilter)
        $scope.loading = true
        $http({
            method: 'GET',
            url: CONFIG.APIURL + '/api/users',
            params: newfilter
        }).then(function successCallback(response) {
            console.log("respond", response);
            $scope.response = response.data;
            if ($rootScope.maxMatchUser == 0) {
                $rootScope.maxMatchUser = $scope.response.data[0].match
                console.log($rootScope.maxMatchUser)
            }

            $timeout(function () {
                if (!$rootScope.usercard) {
                    $rootScope.usercard = []
                }
                for (var i in $scope.response.data) {
                    var profileData = $scope.response.data[i]
                    $scope.response.data[i].matchPer = Math.round($scope.response.data[i].match * 100 / $rootScope.maxMatchUser)

                    if (profileData.act) {
                        var ref = 'activity/like/' + $rootScope.storeId + ':' + profileData.userId
                        firebase.database().ref(ref).on('value', function (snap) {
                            $scope.response.data[i].act = snap.val()
                        })
                    }
                    firebase.database().ref('presence/profile/' + profileData.userId + 'status').on('value', function (snap) {
                        if (snap.val()) {
                            $scope.response.data[i].presence = snap.val()
                        }
                    })


                }
                $rootScope.usercard = $rootScope.usercard.concat($scope.response.data);
                console.log($rootScope.usercard)
                $scope.loading = false
            })
        }, function (error) {
            console.log(error)
            $scope.loading = false

        })


    };


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
    };

    $scope.offer = function (id) {
        if (!$scope.jobOffer) {
            $scope.jobOffer = {}
        }
        $scope.jobOffer[id] = true
    }
    $scope.like = function (card, action, selectedJob) {
        AuthUser.storeLike(card, action, selectedJob).then(function (out) {
            console.log(out)
            delete $scope.jobOffer[card.userId]
        })
    };

    $scope.chatto = function (id) {
        $state.go("employer.chats", {to: id, slide: 1})
    };

})
;
