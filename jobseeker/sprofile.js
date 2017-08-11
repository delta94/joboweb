"use strict";

app.controller('sprofileCtrl', sprofileCtrl).filter('propsFilter', propsFilter);

function sprofileCtrl(debounce, $rootScope, $scope, AuthUser, $stateParams, $timeout, $state, toastr, $http, firebase, Upload, usSpinnerService, $sce, $anchorScroll, $location) {
    $scope.startSpin = function (spin) {
        usSpinnerService.spin(spin);
    };
    $scope.stopSpin = function (spin) {
        usSpinnerService.stop(spin);
    };
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
        AuthUser.user()
            .then(function (userInfo) {
                $scope.userInfo = userInfo
                $timeout(function () {
                    if (!$rootScope.userData) {
                        //chưa có hồ sơ
                        $scope.firsttime = true
                        $rootScope.userData = {
                            userId: $rootScope.userId,
                            name: userInfo.name,
                            photo: []
                        }
                    }
                    if ($rootScope.userData.email && $rootScope.userData.phone) {
                        $scope.indexToShow = 1;
                        if ($rootScope.profileData.name && $rootScope.profileData.birthArray && $rootScope.profileData.address && $rootScope.profileData.job) {
                            $scope.indexToShow = 2;
                        }
                    }

                    if ($rootScope.profileData.school) {
                        $scope.autocompleteSchool = {text: $rootScope.profileData.school}
                    }
                    if ($rootScope.profileData.address) {
                        $scope.autocompleteAddress = {text: $rootScope.profileData.address}
                    }

                    if ($rootScope.profileData.industry) {
                        for (var i in $rootScope.profileData.industry) {
                            $scope.multiple.industry.push(i)
                        }
                    }
                    if ($rootScope.profileData.languages) {
                        for (var i in $rootScope.profileData.languages) {
                            $scope.multiple.languages.push(i)
                        }
                    }

                    if ($rootScope.profileData.job) {
                        for (var i in $rootScope.profileData.job) {
                            $scope.multiple.job.push(i)
                        }
                    }
                    if ($rootScope.profileData.birth) {
                        $rootScope.profileData.birthArray = $rootScope.service.convertDateArray($rootScope.profileData.birth)
                        console.log('$rootScope.profileData.birthArray', $rootScope.profileData.birthArray)
                    }

                    if (!$rootScope.profileData.photo) {
                        $rootScope.profileData.photo = []
                    }

                    $scope.videoTrusted = $sce.trustAsResourceUrl($rootScope.profileData.videourl)
                })

            }, function (error) {
                console.log(error)
                // error
            });
    }
    var admin = $stateParams.admin
    $scope.admin = $stateParams.admin;
    if (admin && $rootScope.type !== 0) {
        $scope.indexToShow = 2;
        AuthUser.user().then(function (adminInfo) {
            $scope.adminData = adminInfo;
            console.log('adminData ', $scope.adminData);
            if ($scope.adminData.admin) {
                $rootScope.userId = admin;

                $scope.progress = 0;

                $scope.multiple = {
                    industry: [],
                    languages: [],
                    time: [],
                    job: []
                };

                $scope.picFile = null;

                $rootScope.service.JoboApi('initData', {userId: $rootScope.userId}).then(function (data) {
                    $rootScope.userData = data.data.userData;
                    $rootScope.profileData = data.data.profileData;
                    console.log('$rootScope.userData: ', $rootScope.userData);
                    console.log('$rootScope.profileData: ', $rootScope.profileData);
                    $timeout(function () {
                        if (!$rootScope.userData) {
                            //chưa có hồ sơ
                            $scope.firsttime = true
                            $rootScope.userData = {
                                userId: $rootScope.userId,
                                name: userInfo.name,
                                photo: []
                            }
                        }

                        if ($rootScope.profileData.school) {
                            $scope.autocompleteSchool = {text: $rootScope.profileData.school}
                        }
                        if ($rootScope.profileData.address) {
                            $scope.autocompleteAddress = {text: $rootScope.profileData.address}
                        }

                        if ($rootScope.profileData.industry) {
                            for (var i in $rootScope.profileData.industry) {
                                $scope.multiple.industry.push(i)
                            }
                        }
                        if ($rootScope.profileData.languages) {
                            for (var i in $rootScope.profileData.languages) {
                                $scope.multiple.languages.push(i)
                            }
                        }

                        if ($rootScope.profileData.job) {
                            for (var i in $rootScope.profileData.job) {
                                $scope.multiple.job.push(i)
                            }
                        }
                        if ($rootScope.profileData.birth) {
                            $rootScope.profileData.birthArray = $rootScope.service.convertDateArray($rootScope.profileData.birth)
                            console.log('$rootScope.profileData.birthArray', $rootScope.profileData.birthArray)
                        }

                        if (!$rootScope.profileData.photo) {
                            $rootScope.profileData.photo = []
                        }

                        $scope.videoTrusted = $sce.trustAsResourceUrl($rootScope.profileData.videourl)
                    })

                })
            }
        });
    } else {
        $scope.init()
    }

    $scope.rangeFinishCallback = function (sliderObj) {
        var newValue = sliderObj.from;
        console.log(newValue)

        if ($scope.profileData) {
            $scope.profileData.expect_distance = newValue
        }
    }
    $scope.uploadAvatar = function (imageData, errFiles) {
        $scope.avatarUpload = true
        $scope.startSpin('avatar');

        var uploadRef = firebase.storage().ref().child('images/' + $rootScope.userId)
        uploadRef.putString(imageData, 'data_url').then(function (snapshot) {
            if ($scope.avatarUpload == true) {
                console.log('Uploaded a base64 string!', snapshot);
                var downloadAvatar = snapshot.downloadURL;
                console.log(downloadAvatar);
                $rootScope.profileData.avatar = downloadAvatar;
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
        var uploadTask = storageRef.child('video/' + $rootScope.userId).put(imageData, metadata);
        uploadTask.then(function (snapVideo) {
            if ($scope.videoUpload == true) {
                var downloadVideo = snapVideo.downloadURL;
                console.log(downloadVideo);
                $timeout(function () {
                    $rootScope.profileData.videourl = downloadVideo;
                    $scope.videoTrusted = $sce.trustAsResourceUrl($rootScope.profileData.videourl)
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
        }
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
        $rootScope.profileData.school = $scope.school.name
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
        /*if (delay == false) {
         delay = true
         $http({
         method: 'GET',
         url: $scope.URL
         }).then(function successCallback(response) {
         $scope.ketquasAddress = response.data.results;
         console.log($scope.ketquasAddress);
         $('#list-add').show();
         })
         $timeout(function () {
         delay = false
         }, 1000)
         }*/
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
        $rootScope.profileData.address = selected.formatted_address;
        $rootScope.profileData.location = selected.geometry.location;

        console.log(selected);
        $('#list-add').hide();
        //$rootScope.profileData.address = selected.formatted_address;
        //$rootScope.profileData.location = selected.geometry.location;

    };
    $scope.eraseAddress = function () {
        $scope.autocompleteAddress.text = null;
        $('#list-add').hide();
    };
    $scope.deleteExp = function (id) {
        delete  $scope.profileData.experience[id]
    };

    $scope.addMoreExp = function () {
        $scope.tempoExperience = {}
    };
    $scope.saveJob = function () {
        // var experienceRef = firebase.database().ref('profile/' + $rootScope.userId + '/experience');
        // var newkey = experienceRef.push().key;
        var newkey = 'p' + Math.round(100000000000000 * Math.random());
        $scope.tempoExperience.id = newkey
        if (!$scope.profileData.experience) {
            $scope.profileData.experience = {}
        }
        $scope.profileData.experience[newkey] = $scope.tempoExperience
        delete $scope.tempoExperience
    }
    //admin note
    $scope.addMoreNote = function () {
        $scope.tempoAdminNote = {};
        $scope.tempoAdminNote.date = new Date();
        $scope.tempoAdminNote.adminId = $scope.adminData.userId;
    };
    $scope.deleteNote = function (id) {
        delete $scope.profileData.adminNote[id]
    };
    $scope.deleteTempNote = function () {
        delete $scope.tempoAdminNote
    }
    $scope.saveNote = function () {
        // var adminNoteRef = firebase.database().ref('profile/' + $rootScope.userId + '/note');
        // var newkey = adminNoteRef.push().key;
        var newkey = 'p' + Math.round(100000000000000 * Math.random());
        $scope.tempoAdminNote.id = newkey;
        if (!$scope.profileData.adminNote) {
            $scope.profileData.adminNote = {}
        }
        $scope.profileData.adminNote[newkey] = $scope.tempoAdminNote;
        delete $scope.tempoAdminNote
    };
    //update data
    $scope.updateData = function () {
        $scope.error = {};
        var dataUser = {};
        if ($scope.indexToShow === 0) {
            console.log('Update phone and email');
            if ($rootScope.userData && $rootScope.userData.email && $rootScope.userData.phone) {
                console.log($rootScope.userData.phone);
                console.log($rootScope.userData.email);
                dataUser.user = {
                    phone: $rootScope.userData.phone,
                    email: $rootScope.userData.email
                };
                $rootScope.service.JoboApi('update/user', {
                    userId: $rootScope.userId,
                    user: $rootScope.userData
                });
                $scope.indexToShow++;
                console.log($scope.indexToShow);
                $rootScope.service.Ana('Update phone and email');
                $scope.gotoAnchor('name');
            } else {
                if (!$rootScope.userData.email) {
                    $scope.error.email = true;
                }
                if (!$rootScope.userData.phone) {
                    $scope.error.phone = true;
                }
            }
        } else if ($scope.indexToShow === 1) {
            console.log('Update User Profile');
            if ($rootScope.userData.email
                && $rootScope.userData.phone
                && $rootScope.profileData.address
                && $rootScope.profileData.name
                && $rootScope.profileData.birthArray
                && $scope.multiple.job.length > 0) {

                $rootScope.profileData.name = $rootScope.service.upperName($rootScope.profileData.name);
                $rootScope.userData.name = $rootScope.profileData.name;
                $rootScope.profileData.birth = $rootScope.service.convertDate($rootScope.profileData.birthArray);
                $rootScope.profileData.createdAt = new Date().getTime()

                console.log($rootScope.userData);
                console.log($rootScope.profileData);
                $timeout(function () {
                    // console.log($scope.multiple);
                    if ($scope.multiple.job.length >= 0) {
                        $rootScope.profileData.job = {};
                        angular.forEach($scope.multiple.job, function (card) {
                            $rootScope.profileData.job[card] = true
                        })
                    }
                    console.log($rootScope.userData);

                    dataUser.user = {
                        phone: $rootScope.userData.phone,
                        email: $rootScope.userData.email,
                        name: $rootScope.userData.name
                    };
                    dataUser.profile = {
                        userId: $rootScope.userData.userId,
                        name: $rootScope.userData.name,
                        birth: $rootScope.userData.birth,
                        birthArray: $rootScope.userData.birthArray,
                        address: $rootScope.userData.address,
                        location: $rootScope.userData.location,
                        job: $rootScope.userData.job,
                        avatar: $rootScope.userData.avatar,
                        createAt: $rootScope.userData.createAt

                    };
                    $rootScope.service.JoboApi('update/user', {

                        userId: $rootScope.userId,
                        user: $rootScope.userData,
                        profile: $rootScope.profileData
                    });

                    console.log('Update User Profile Complete');

                }, 1000);
                $rootScope.service.Ana('Update user profile');
                $scope.indexToShow++;
                console.log($scope.indexToShow);
                $scope.gotoAnchor('info');
            } else {
                if (!$rootScope.profileData.name) {
                    $scope.error.name = true;
                }
                if (!$rootScope.profileData.birthArray) {
                    $scope.error.birth = true;
                }
                if (!$rootScope.userData.email) {
                    $scope.error.email = true;
                }
                if (!$rootScope.userData.phone) {
                    $scope.error.phone = true;
                }
                if (!$rootScope.profileData.address) {
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
        $scope.profileData.photo.splice(images, 1);
    };
    //delete video
    $scope.deleteVideo = function () {
        if (confirm("Bạn muốn xoá video?") === true) {
            console.log('videoURL undelete', $rootScope.profileData.videourl);
            $rootScope.service.JoboApi('delete/video', {
                userId: $rootScope.userId,
                videoURL: $rootScope.profileData.videourl
            });
            delete $rootScope.profileData.videourl;
            console.log('videoURL deleted', $rootScope.profileData.videourl);
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
                    // var newkey = firebase.database().ref('profile/' + $rootScope.userId + '/photo').push().key;
                    var newkey = 'p' + Math.round(100000000000000 * Math.random());
                    var uploadTask = storageRef.child('images/' + newkey).put(file, metadata);

                    uploadTask.then(function (snapshot) {
                        if ($scope.uploadPhoto == true) {
                            var downloadPhoto = snapshot.downloadURL;
                            console.log(downloadPhoto);

                            $rootScope.profileData.photo.push(downloadPhoto);
                            console.log($rootScope.profileData.photo)
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
        console.log('$rootScope.userData', $rootScope.userData);
        console.log('$rootScope.profileData', $rootScope.profileData);
        if (($rootScope.userData.email
                && $rootScope.userData.phone
                && $rootScope.profileData.address
                && $rootScope.profileData.name
                && $rootScope.profileData.birthArray
                && $scope.multiple.job.length > 0) || ($stateParams.admin)) {
            $rootScope.profileData.name = $rootScope.service.upperName($rootScope.profileData.name);
            $rootScope.userData.name = $rootScope.profileData.name;
            $rootScope.profileData.birth = $rootScope.service.convertDate($rootScope.profileData.birthArray);
            console.log($rootScope.userData);
            console.log($rootScope.profileData);

            $timeout(function () {
                console.log($scope.multiple)
                if ($scope.multiple.industry.length >= 0) {
                    $rootScope.profileData.industry = {};
                    angular.forEach($scope.multiple.industry, function (card) {
                        $rootScope.profileData.industry[card] = true
                    })
                }
                if ($scope.multiple.job.length >= 0) {
                    $rootScope.profileData.job = {};
                    angular.forEach($scope.multiple.job, function (card) {
                        $rootScope.profileData.job[card] = true
                    })
                }

                if ($scope.multiple.languages.length >= 0) {
                    $rootScope.profileData.languages = {};
                    angular.forEach($scope.multiple.languages, function (card) {
                        $rootScope.profileData.languages[card] = true
                    })
                }

                $rootScope.userData.userId = $rootScope.userId;
                $rootScope.profileData.userId = $rootScope.userId;
                console.log($rootScope.userData);
                console.log($rootScope.profileData);

                var dataUser = {
                    name: $rootScope.userData.name,
                    phone: $rootScope.userData.phone,
                    email: $rootScope.userData.email
                };
                if ($rootScope.profileData.wrongEmail) {
                    dataUser.wrongEmail = $rootScope.userData.wrongEmail;
                    $rootScope.userData.wrongEmail = $rootScope.profileData.wrongEmail;
                }
                var dataProfile = $rootScope.profileData
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
                    userId: $rootScope.userId,
                    user: $rootScope.userData,
                    profile: $rootScope.profileData
                });


                //init profile
                if ($scope.firsttime) {
                    $rootScope.service.Ana('createProfile');
                } else {
                    $rootScope.service.Ana('updateProfile');
                }

                if (!$rootScope.profileData.avatar) {
                    toastr.info('Bạn cần cập nhật avatar thì thông tin của bạn mới được hiện thị cho nhà tuyển dụng, hãy cập nhật ngay!');

                }
                toastr.success('Cập nhật hồ sơ thành công');
                if ($rootScope.preApply) {
                    $rootScope.service.userLike($rootScope.preApply.card, 0, $rootScope.preApply.jobOffer)
                }
                console.log('$rootScope.userData done', $rootScope.userData);
                console.log('$rootScope.profileData done', $rootScope.profileData);
                if ($scope.adminData && $scope.adminData.admin) {
                    console.log('adminData.admin', $scope.adminData);
                    /*$timeout(function () {
                        window.location.href = "/view/profile/" + $rootScope.userId;
                    });*/
                } else {
                    // $state.go('app.sdash', {}, {reload: true})
                }
                // $state.go('app.sdash', {}, {reload: true})
            }, 1000)
        } else {
            console.log($rootScope.userData);
            console.log($rootScope.profileData);
            $scope.error = {};
            if ($rootScope.profileData.name) {

            } else {
                $scope.error.name = true;
                $timeout(function () {
                    console.log($scope.error)
                })
            }
            if ($rootScope.profileData.birthArray) {

            } else {
                $scope.error.birth = true;
                $timeout(function () {
                    console.log($scope.error)
                })
            }
            if ($rootScope.userData.email) {

            } else {
                $scope.error.email = true;
                $timeout(function () {
                    console.log($scope.error)
                })
            }
            if ($rootScope.userData.phone) {

            } else {
                $scope.error.phone = true;
                $timeout(function () {
                    console.log($scope.error)
                })
            }
            if ($rootScope.profileData.address) {

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
            if ($rootScope.profileData.avatar) {

            } else {
                $scope.error.avatar = true;
                $timeout(function () {
                    console.log($scope.error)
                })
            }

            toastr.error('Bạn chưa cập nhật đủ thông tin', 'Lỗi');
            $scope.gotoAnchor('name')
        }
    }

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
