"use strict";

app.controller('sprofileCtrl', sprofileCtrl).filter('propsFilter', propsFilter);

function sprofileCtrl(debounce, $rootScope, $scope, AuthUser, $stateParams, $timeout, $state, toastr, $http, firebase, Upload, usSpinnerService, $sce, $anchorScroll, $location) {
    $scope.startSpin = function (spin) {
        usSpinnerService.spin(spin);
    };
    $scope.stopSpin = function (spin) {
        usSpinnerService.stop(spin);
    };

    $scope.admin = $stateParams.admin;
    $scope.init = function () {
        $scope.progress = 0
        $scope.multiple = {
            industry: [],
            languages: [],
            time: [],
            job: []
        };
        $scope.picFile = null;
        $scope.indexToShow = 0;
        AuthUser.user().then(function (userInfo) {
            $scope.userInfo = userInfo

            if ($stateParams.admin) {
                $scope.userId = $stateParams.admin
            }
            $rootScope.service
                .JoboApi('on/profile', {userId: $scope.userId})
                .then(function (result) {
                if (result.data.err) {

                    $scope.firsttime = true;
                    $scope.userData = {
                        userId: $scope.userId,
                        name: userInfo.name,
                        photo: []
                    }

                } else {

                    $timeout(function () {

                        $scope.userData = result.data;
                        $scope.userInfo = result.data.userInfo;
                        console.log('$scope.userData',$scope.userData)
                        if ($scope.userInfo.email && $scope.userInfo.phone) {
                            $scope.indexToShow = 1;
                            if ($scope.userData.name && $scope.userData.birthArray && $scope.userData.address && $scope.userData.job) {
                                $scope.indexToShow = 2;
                            }
                        }

                        if ($scope.userData.school) {
                            $scope.autocompleteSchool = {text: $scope.userData.school}
                        }
                        if ($scope.userData.address) {
                            $scope.autocompleteAddress = {text: $scope.userData.address}
                        }

                        if ($scope.userData.industry) {
                            for (var i in $scope.userData.industry) {
                                $scope.multiple.industry.push(i)
                            }
                        }
                        if ($scope.userData.languages) {
                            for (var i in $scope.userData.languages) {
                                $scope.multiple.languages.push(i)
                            }
                        }

                        if ($scope.userData.job) {
                            for (var i in $scope.userData.job) {
                                $scope.multiple.job.push(i)
                            }
                        }
                        if ($scope.userData.birth) {
                            $scope.userData.birthArray = $rootScope.service.convertDateArray($scope.userData.birth)
                            console.log('$scope.userData.birthArray', $scope.userData.birthArray)
                        }

                        if (!$scope.userData.photo) {
                            $scope.userData.photo = []
                        }

                        $scope.videoTrusted = $sce.trustAsResourceUrl($scope.userData.videourl)


                    })
                }


            })


        }, function (error) {
            console.log(error)
            // error
        });
    }


    $scope.rangeFinishCallback = function (sliderObj) {
        var newValue = sliderObj.from;
        console.log(newValue)

        if ($scope.userData) {
            $scope.userData.expect_distance = newValue
        }
    }
    $scope.uploadAvatar = function (imageData, errFiles) {
        $scope.avatarUpload = true
        $scope.startSpin('avatar');

        var uploadRef = firebase.storage().ref().child('images/' + $scope.userId)
        uploadRef.putString(imageData, 'data_url').then(function (snapshot) {
            if ($scope.avatarUpload == true) {
                console.log('Uploaded a base64 string!', snapshot);
                var downloadAvatar = snapshot.downloadURL;
                console.log(downloadAvatar);
                $scope.userData.avatar = downloadAvatar;
                $scope.$apply(function () {
                    $scope.stopSpin('avatar');
                    delete $scope.picFile;
                    downloadAvatar = null;
                    $scope.avatarUpload = false
                })
            }

        });


    };

    $scope.options = ['FBMessenger', 'Skype', 'Zalo', 'Facetime'];


    $scope.uploadVideo = function (imageData) {
        $scope.startSpin('video');
        $scope.videoUpload = true

        console.log('imageData', imageData)
        var metadata = {
            'contentType': imageData.type
        };
        var storageRef = firebase.storage().ref();
        var uploadTask = storageRef.child('video/' + $scope.userId).put(imageData, metadata);
        uploadTask.then(function (snapVideo) {
            if ($scope.videoUpload == true) {
                var downloadVideo = snapVideo.downloadURL;
                console.log(downloadVideo);
                $timeout(function () {
                    $scope.userData.videourl = downloadVideo;
                    $scope.videoTrusted = $sce.trustAsResourceUrl($scope.userData.videourl)
                    $scope.$apply(function () {
                        $scope.stopSpin('video');
                        downloadVideo = null
                    })

                })

                $scope.videoUpload = false
            }
        })
        uploadTask.on('state_changed', function (snapVideo) {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded

            var progress = (snapVideo.bytesTransferred / snapVideo.totalBytes) * 100;
            $timeout(function () {
                $scope.progress = Math.round(progress * 10) / 10

            });
            $scope.progress = progress

            console.log('Upload is ' + progress + '% done');

            switch (snapVideo.state) {
                case firebase.storage.TaskState.PAUSED: // or 'paused'
                    console.log('Upload is paused');
                    break;
                case firebase.storage.TaskState.RUNNING: // or 'running'
                    console.log('Upload is running');
                    break;
            }
        }, function (error) {
            // Handle unsuccessful uploads
        }, function () {
            // Handle successful uploads on complete

        });
    };

    //school
    $scope.autocompleteSchool = {text: ''};
    $scope.searchSchool = function () {
        var params = {
            query: S($scope.autocompleteSchool.text).latinise().s,
            type: 'university'
        };
        $http({
            method: 'GET',
            url: $rootScope.CONFIG.APIURL + '/api/places',
            params: params
        }).then(function successCallback(response) {
            $scope.ketquasSchool = response.data.results;
            console.log($scope.ketquasSchool);
            $('#list-school').show();
        })
    };

    $scope.setSelectedSchool = function (selected) {
        $scope.school = selected;
        console.log($scope.school)
        $scope.autocompleteSchool.text = $scope.school.name
        $scope.userData.school = $scope.school.name
        $('#list-school').hide();

    };

    $scope.eraseSchool = function () {
        $scope.autocompleteSchool.text = null;
        $('#list-school').hide();
    }
    //address
    // var delay = false;
    $scope.autocompleteAddress = {text: ''};
    $scope.ketquasAddress = [];
    $scope.searchAddress = function (textfull) {
        var text = S(textfull).latinise().s
        $scope.URL = 'https://maps.google.com/maps/api/geocode/json?address=' + text;

        $http({
            method: 'GET',
            url: $scope.URL
        }).then(function successCallback(response) {
            $scope.ketquasAddress = response.data.results;
            console.log($scope.ketquasAddress);
            $('#list-add').show();
        })
    };
    $scope.setSelectedAddress = function (selected) {
        $scope.autocompleteAddress.text = selected.formatted_address;
        $scope.address = selected;
        $scope.userData.address = selected.formatted_address;
        $scope.userData.location = selected.geometry.location;

        console.log(selected);
        $('#list-add').hide();

    };
    $scope.eraseAddress = function () {
        $scope.autocompleteAddress.text = null;
        $('#list-add').hide();
    };
    $scope.deleteExp = function (id) {
        delete  $scope.userData.experience[id]
    };

    $scope.addMoreExp = function () {
        $scope.tempoExperience = {}
    };
    $scope.saveJob = function () {

        var newkey = 'p' + Math.round(100000000000000 * Math.random());
        $scope.tempoExperience.id = newkey
        if (!$scope.userData.experience) {
            $scope.userData.experience = {}
        }
        $scope.userData.experience[newkey] = $scope.tempoExperience
        delete $scope.tempoExperience
    };
    //admin note
    $scope.addMoreNote = function () {
        $scope.tempoAdminNote = {};
        $scope.tempoAdminNote.date = new Date();
        $scope.tempoAdminNote.adminId = $scope.adminData.userId;
    };
    $scope.deleteNote = function (id) {
        delete $scope.userData.adminNote[id]
    };
    $scope.deleteTempNote = function () {
        delete $scope.tempoAdminNote
    }
    $scope.saveNote = function () {

        var newkey = 'p' + Math.round(100000000000000 * Math.random());
        $scope.tempoAdminNote.id = newkey;
        if (!$scope.userData.adminNote) {
            $scope.userData.adminNote = {}
        }
        $scope.userData.adminNote[newkey] = $scope.tempoAdminNote;
    };
    //update data
    $scope.updateData = function () {
        $scope.error = {};
        var dataUser = {};
        if ($scope.indexToShow === 0) {
            console.log('Update phone and email');
            if ($scope.userInfo && $scope.userInfo.email && $scope.userInfo.phone) {
                console.log($scope.userInfo.phone);
                console.log($scope.userInfo.email);
                dataUser.user = {
                    phone: $scope.userInfo.phone,
                    email: $scope.userInfo.email
                };
                $rootScope.service.JoboApi('update/user', {
                    userId: $scope.userId,
                    user: dataUser.user
                });
                $scope.indexToShow++;
                console.log($scope.indexToShow);
                $rootScope.service.Ana('Update phone and email');
                $scope.gotoAnchor('name');
            } else {
                if (!$scope.userData.email) {
                    $scope.error.email = true;
                }
                if (!$scope.userData.phone) {
                    $scope.error.phone = true;
                }
            }
        } else if ($scope.indexToShow === 1) {
            console.log('Update User Profile');
            if ($scope.userInfo.email
                && $scope.userInfo.phone
                && $scope.userData.address
                && $scope.userData.name
                && $scope.userData.birthArray
                && $scope.multiple.job.length > 0) {

                $scope.userData.name = $rootScope.service.upperName($scope.userData.name);
                $scope.userData.birth = $rootScope.service.convertDate($scope.userData.birthArray);
                $scope.userData.createdAt = new Date().getTime()

                console.log($scope.userData);
                $timeout(function () {
                    // console.log($scope.multiple);
                    if ($scope.multiple.job.length >= 0) {
                        $scope.userData.job = {};
                        angular.forEach($scope.multiple.job, function (card) {
                            $scope.userData.job[card] = true
                        })
                    }
                    console.log($scope.userData);

                    dataUser.user = {
                        phone: $scope.userData.phone,
                        email: $scope.userData.email,
                        name: $scope.userData.name
                    };
                    dataUser.profile = {
                        userId: $scope.userData.userId,
                        name: $scope.userData.name,
                        birth: $scope.userData.birth,
                        birthArray: $scope.userData.birthArray,
                        address: $scope.userData.address,
                        location: $scope.userData.location,
                        job: $scope.userData.job,
                        avatar: $scope.userData.avatar,
                        createAt: $scope.userData.createAt

                    };
                    $rootScope.service.JoboApi('update/user', {

                        userId: $scope.userId,
                        user: dataUser.user,
                        profile: dataUser.profile
                    });

                    console.log('Update User Profile Complete');

                }, 1000);
                $rootScope.service.Ana('Update user profile');
                $scope.indexToShow++;
                console.log($scope.indexToShow);
                $scope.gotoAnchor('info');
            } else {
                if (!$scope.userData.name) {
                    $scope.error.name = true;
                }
                if (!$scope.userData.birthArray) {
                    $scope.error.birth = true;
                }
                if (!$scope.userData.email) {
                    $scope.error.email = true;
                }
                if (!$scope.userData.phone) {
                    $scope.error.phone = true;
                }
                if (!$scope.userData.address) {
                    $scope.error.address = true;
                }
                if ($scope.multiple.job.length === 0) {
                    $scope.error.job = true;
                }
            }
        }
    };
    //upload more image
    $scope.$watch('files', function () {
        $scope.upload($scope.files);
    });
    $scope.$watch('file', function () {
        if ($scope.file != null) {
            $scope.files = [$scope.file];
        }
    });
    $scope.log = {};
    $scope.deleteImage = function (images) {
        console.log('clicked', images)
        $scope.userData.photo.splice(images, 1);
    };
    //delete video
    $scope.deleteVideo = function () {
        if (confirm("Bạn muốn xoá video?") === true) {
            console.log('videoURL undelete', $scope.userData.videourl);
            $rootScope.service.JoboApi('delete/video', {
                userId: $scope.userId,
                videoURL: $scope.userData.videourl
            });
            delete $scope.userData.videourl;
            console.log('videoURL deleted', $scope.userData.videourl);
        }
    };
    $scope.upload = function (files) {
        $scope.uploadPhoto = true
        $scope.startSpin('photo');

        if (files && files.length) {
            for (var i = 0; i < files.length; i++) {
                console.log(i)
                var file = files[i];
                console.log(file)

                if (!file.$error) {

                    var metadata = {
                        'contentType': file.type
                    };
                    var storageRef = firebase.storage().ref();
                    var newkey = 'p' + Math.round(100000000000000 * Math.random());
                    var uploadTask = storageRef.child('images/' + newkey).put(file, metadata);

                    uploadTask.then(function (snapshot) {
                        if ($scope.uploadPhoto == true) {
                            var downloadPhoto = snapshot.downloadURL;
                            console.log(downloadPhoto);

                            $scope.userData.photo.push(downloadPhoto);
                            console.log($scope.userData.photo)
                        }
                    });

                    uploadTask.on('state_changed', function (snapshot) {
                        $timeout(function () {
                                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                                $scope.log[i] = progress + '%';
                                console.log('Upload is ' + progress + '% done');
                            }
                        );
                        // Observe state change events such as progress, pause, and resume
                    }, function (error) {
                        // Handle unsuccessful uploads
                    }, function () {
                        // Handle successful uploads on complete
                        // For instance, get the download URL: https://firebasestorage.googleapis.com/...


                        $scope.stopSpin('photo')
                    })

                }
            }
        }
    };

    $scope.submit = function () {
        console.log('$rootScope.userData', $scope.userData)
        if (($scope.userInfo.email
                && $scope.userInfo.phone
                && $scope.userData.address
                && $scope.userData.name
                && $scope.userData.birthArray
                && $scope.multiple.job.length > 0) || ($stateParams.admin)) {
            $scope.userData.name = $rootScope.service.upperName($scope.userData.name)
            $scope.userData.birth = $rootScope.service.convertDate($scope.userData.birthArray);
            console.log($scope.userData);

            $timeout(function () {
                console.log($scope.multiple)
                if ($scope.multiple.industry.length >= 0) {
                    $scope.userData.industry = {};
                    angular.forEach($scope.multiple.industry, function (card) {
                        $scope.userData.industry[card] = true
                    })
                }
                if ($scope.multiple.job.length >= 0) {
                    $scope.userData.job = {};
                    angular.forEach($scope.multiple.job, function (card) {
                        $scope.userData.job[card] = true
                    })
                }

                if ($scope.multiple.languages.length >= 0) {
                    $scope.userData.languages = {};
                    angular.forEach($scope.multiple.languages, function (card) {
                        $scope.userData.languages[card] = true
                    })
                }

                $scope.userData.userId = $scope.userId;
                console.log($scope.userData);

                var dataUser = {
                    name: $scope.userData.name,
                    phone: $scope.userData.phone,
                    email: $scope.userData.email
                };
                if ($scope.userData.wrongEmail) {
                    dataUser.wrongEmail = $scope.userData.wrongEmail
                }
                var dataProfile = Object.assign({}, $scope.userData);
                delete dataProfile.phone
                delete dataProfile.email
                delete dataProfile.webToken
                delete dataProfile.ref
                delete dataProfile.provider
                delete dataProfile.type
                delete dataProfile.mobileToken
                delete dataProfile.wrongEmail
                delete dataProfile.adminData
                delete dataProfile.act
                delete dataProfile.distance


                console.log(dataProfile)

                $rootScope.service.JoboApi('update/user', {
                    userId: $scope.userId,
                    user: $scope.userInfo,
                    profile: dataProfile
                }).then(function (res) {
                    if ($scope.firsttime) {
                        $rootScope.service.Ana('createProfile');
                    } else {
                        $rootScope.service.Ana('updateProfile');
                    }

                    if (!$scope.userData.avatar) {
                        toastr.info('Bạn cần cập nhật avatar thì thông tin của bạn mới được hiện thị cho nhà tuyển dụng, hãy cập nhật ngay!');

                    }
                    toastr.success('Cập nhật hồ sơ thành công');
                    if ($rootScope.preApply) {
                        $rootScope.service.userLike($rootScope.preApply.card, 0, $rootScope.preApply.jobOffer)
                            .then(function () {
                                $state.go('app.viewstore', {
                                    id: $rootScope.preApply.card.storeId,
                                    job: $rootScope.preApply.jobOffer
                                })
                            })

                    }
                    if ($scope.adminData && $scope.adminData.admin) {
                        console.log('adminData.admin');
                        $state.go('app.viewprofile', {
                            id: $scope.userId,
                        })
                    } else {
                        $state.go('app.sdash', {}, {reload: true})
                    }
                });

            }, 1000)
        } else {
            console.log($scope.userData);
            $scope.error = {};
            if ($scope.userData.name) {

            } else {
                $scope.error.name = true;
                $timeout(function () {
                    console.log($scope.error)
                })
            }
            if ($scope.userData.birthArray) {

            } else {
                $scope.error.birth = true;
                $timeout(function () {
                    console.log($scope.error)
                })
            }
            if ($scope.userInfo.email) {

            } else {
                $scope.error.email = true;
                $timeout(function () {
                    console.log($scope.error)
                })
            }
            if ($scope.userInfo.phone) {

            } else {
                $scope.error.phone = true;
                $timeout(function () {
                    console.log($scope.error)
                })
            }
            if ($scope.userData.address) {

            } else {
                $scope.error.address = true;
                $timeout(function () {
                    console.log($scope.error)
                })
            }
            if ($scope.multiple.job.length > 0) {
            } else {
                $scope.error.job = true;
                $timeout(function () {
                    console.log($scope.error)
                })
            }
            if ($scope.userData.avatar) {

            } else {
                $scope.error.avatar = true;
                $timeout(function () {
                    console.log($scope.error)
                })
            }

            toastr.error('Bạn chưa cập nhật đủ thông tin', 'Lỗi');
            $scope.gotoAnchor('name')
        }
    };

    $scope.gotoAnchor = function (x) {
        var newHash = 'anchor' + x;
        if ($location.hash() !== newHash) {
            // set the $location.hash to `newHash` and
            // $anchorScroll will automatically scroll to it
            $location.hash('anchor' + x);
        } else {
            // call $anchorScroll() explicitly,
            // since $location.hash hasn't changed
            $anchorScroll();
        }
    };

}

function propsFilter() {
    return function (items, props) {
        var out = [];

        if (angular.isArray(items)) {
            items.forEach(function (item) {
                var itemMatches = false;

                var keys = Object.keys(props);
                for (var i = 0; i < keys.length; i++) {
                    var prop = keys[i];
                    var text = props[prop].toLowerCase();
                    if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                        itemMatches = true;
                        break;
                    }
                }

                if (itemMatches) {
                    out.push(item);
                }
            });
        } else {
            // Let the output be the input untouched
            out = items;
        }

        return out;
    }
}
