"use strict";

app.controller("ViewProfileCtrl", function ($scope, $stateParams, $sce, $rootScope, $http, CONFIG, $timeout, $state, AuthUser) {

    $(document).ready(function(){
        $('[data-toggle="popover"]').popover();
    });

    $scope.init = function () {
        $rootScope.aside = false
        $scope.profileId = $stateParams.id;
        $scope.admin = $stateParams.admin;
        if($scope.profileId){
            var ProfileRef = firebase.database().ref('profile/' + $scope.profileId);
            ProfileRef.on('value', function (snap) {
                $timeout(function () {
                    $scope.profileData = snap.val();
                    console.log($scope.profileData)

                    var likeAct = firebase.database().ref('activity/like/' + $rootScope.storeId + ':' + $scope.profileId);
                    likeAct.on('value', function (snap) {
                        $timeout(function () {
                            $scope.profileData.act = snap.val();
                            console.log('$scope.profileData.act', $scope.profileData.act)

                        })
                    });
                    if($scope.admin == '1'){
                        firebase.database().ref('user/'+ $scope.profileId).once('value', function (snap) {
                            $timeout(function () {
                                $scope.adminData = snap.val()
                            })
                        })

                    }

                    // for share
                    var profileJob = $rootScope.service.getStringJob($scope.profileData.job);
                    console.log(profileJob);
                    $scope.share = {
                        Url: "web.joboapp.com/view/profile/" + $scope.profileId,
                        Text: 'Ứng viên ' + $scope.profileData.name,
                        Title: "Ứng viên" + $scope.profileData.name,
                        Description: 'Xem thông tin ứng viên ' + $scope.profileData.name + " cho vị trí " + profileJob,
                        Type: 'feed',
                        Media: $scope.profileData.avatar,
                        Via: '295208480879128',
                        Hashtags: 'jobo,timviecnhanh,pg,sale,model',
                        Caption: 'Có ai đang cần tuyển ' + profileJob + ' không nhỉ? Mình vừa mới tìm thấy ứng viên này, thử vào Jobo xem thông tin chi tiết rồi cho mình biết bạn nghĩ sao nhé ;) #jobo #timviecnhanh #pg #sale #model'
                    }
                    $rootScope.og = {
                        title:'Ứng viên ' + $scope.profileData.name,
                        description: 'Xem thông tin ứng viên ' + $scope.profileData.name + " cho vị trí " + profileJob,
                        image: $scope.profileData.avatar
                    }

                })
            })

            $rootScope.service.Ana('viewProfile', {userId: $scope.profileId})

        }
        if ($rootScope.userId) {
            init($rootScope.userId)
        } else {
            $rootScope.$on('storeListen', function (event,userData) {
                init(userData.userId)
            });
            $rootScope.$on('handleBroadcast', function (event,userData) {
                init(userData.userId)

            });


        }
        function init(userId) {
            if ($scope.profileId == userId) {
                $timeout(function () {
                    $scope.myself = true
                    var staticRef =  firebase.database().ref('static/'+ userId)
                    staticRef.on('value',function (snap) {
                        $timeout(function () {
                            $scope.staticData = snap.val()
                        })
                    })
                })

            }


        }

        $scope.indexCurrent = 0;
        if ($rootScope.usercard) {
            for (var i in $rootScope.usercard) {
                if ($rootScope.usercard[i].userId == $scope.profileId) {
                    $scope.indexCurrent = i;
                    console.log($scope.indexCurrent)
                    break
                }
            }
        }

        var reviewAct = firebase.database().ref('activity/review/' + $scope.profileId);
        reviewAct.on('value', function (snap) {
            $timeout(function () {
                $scope.reviewData = snap.val();
                if ($scope.reviewData) {
                    $timeout(function () {
                        $scope.ratingModel = $rootScope.service.calReview($scope.reviewData);
                        console.log($scope.ratingModel)
                    })
                }

            })
        })

    };


    $scope.API = null;

    $scope.onPlayerReady = function(API) {
        $scope.API = API;
    };
    $scope.rating = 3
    $scope.rateFunction = function (rating) {
        $scope.reviews = {
            name: $rootScope.storeData.storeName,
            avatar: $rootScope.storeData.avatar || "",
            userId: $rootScope.storeId,
            rate: rating,
            createdAt: new Date().getTime(),
            type: $rootScope.type
        };
        console.log('Rating selected: ' + rating);
    };
    $scope.review = function (reviews, profileId) {
        var reviewAct = firebase.database().ref('activity/review/' + profileId + '/' + reviews.userId)
        reviewAct.update(reviews)
    }

    $scope.showVideo = function (user) {
        $scope.showVid = true
        $scope.videoTrusted = $sce.trustAsResourceUrl(user.videourl)
    }
    $scope.hideVideo = function () {
        delete $scope.showVid

    }
    $scope.trustSrc = function (src) {
        return $sce.trustAsResourceUrl(src);
    };

    $scope.calculateAge = function calculateAge(birthday) { // birthday is a date
        var ageDifMs = new Date().getFullYear() - birthday
        return ageDifMs
    };


    $scope.nextProfile = function () {
        var next = +$scope.indexCurrent + +1
        console.log(next);
        var nextUserId = $rootScope.usercard[next].userId
        $state.go('app.viewprofile', {id: nextUserId})
    }
    $scope.backProfile = function () {
        var back = +$scope.indexCurrent - +1
        console.log(back);
        var backUserId = $rootScope.usercard[back].userId
        $state.go('app.viewprofile', {id: backUserId})
    }


    $scope.applyThis = function (id, key) {
        if ($scope.selectedJob && $scope.selectedJob[id] && $scope.selectedJob[id][key]) {
            delete $scope.selectedJob[id][key]
            console.log($scope.selectedJob)
        } else {

            if (!$scope.selectedJob) {
                $scope.selectedJob = {}
            }
            if (!$scope.selectedJob[id]) {
                $scope.selectedJob[id] = {}
            }
            $scope.selectedJob[id][key] = true;
            console.log($scope.selectedJob)

        }
    };


    $scope.like = function (card, action, selectedJob) {
        AuthUser.storeLike(card, action, selectedJob).then(function (result) {
            console.log(result)
            $scope.result = result
        })
    };

    $scope.chatto = function (id) {
        $state.go("employer.chats", {to: id, slide: 1})
    };


});