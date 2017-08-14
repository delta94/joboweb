"use strict";


app.controller('introController', function ($state, $scope, $rootScope, $timeout, CONFIG, toastr, ModalService) {

    secondary.auth().getRedirectResult().then(function (result) {
        if (result.credential) {
            toastr.info('Đang đăng nhập bằng Facebook...');

            var token = result.credential.accessToken;

            var credential = firebase.auth.FacebookAuthProvider.credential(token);

            SignInWithCredential(credential);
        }

    }).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        toastr.error(errorMessage)
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
    });

    $scope.button = "Đăng nhập";

    $scope.facebookLogin = function () {

        var provider = new firebase.auth.FacebookAuthProvider();
        secondary.auth().signInWithRedirect(provider);
    }


    function SignInWithCredential(credential) {
        secondary.auth().signInWithCredential(credential).then(function (result) {
            var user = secondary.auth().currentUser || result;
            var userData = {
                userId: user.uid,
                name: user.displayName,
                email: user.email,
                createdAt: new Date().getTime(),
            };

            console.log(user);
            checkSignupOrSignIn(userData);
        }, function (error) {
            console.log(error)
        })

    }


    function checkSignupOrSignIn(userData) {
        $rootScope.service.JoboApi('on/user', {userId: userData.userId}).then(function (data) {
            console.log('checkSignupOrSignIn', data.data);
            var userDataLoad = data.data;
            if (userDataLoad && userDataLoad.type) {
                toastr.success('Đăng nhập thành công');
                var type = userDataLoad.type;
                if (type == 1) {
                    console.log('employer go to');

                    $state.go('app.edash')
                }
                if (type == 2) {
                    $state.go('app.sdash')
                }
            } else {

                console.log('Đăng ký');

                if (!type) {

                    ModalService.showModal({
                        templateUrl: 'templates/modals/choosetype.html',
                        controller: 'ModalController'
                    }).then(function (modal) {
                        modal.element.modal();
                        modal.close.then(function (result) {
                            if (result == 1 || 2) {
                                createDataUser(userData.userId, userData, result)
                            }
                        });
                    });
                    // A confirm dialog
                }
                if (type) {
                    console.log('has type');

                    createDataUser(userData.userId, userData, type)
                }

            }
        });
    }

    function createDataUser(userId, userData, type) {
        userData.type = type;
        $rootScope.service.JoboApi('update/user', {
            userId: userId,
            user: userData
        });
        // userRef.update(userData);
        toastr.success('Đăng ký thành công')
        if (userData.type == 1) {
            $state.go('store', {id: null})
        }
        if (userData.type == 2) {
            $state.go('profile')
        }
    }


    $scope.doLogin = function (userLogin) {

        $scope.button = "Đang đăng nhập...";

        console.log(userLogin);
        secondary.auth().signInWithEmailAndPassword(userLogin.username, userLogin.password).then(function () {

            $rootScope.userId = secondary.auth().currentUser.uid;
            $rootScope.service.JoboApi('on/user', {
                userId: $rootScope.userId
            }).then(function (data) {
                $rootScope.type = data.data.type;
                console.log($rootScope.type);
                toastr.success('Đăng nhập thành công...')

                if ($rootScope.type == 1) {
                    $state.go('app.edash')
                }
                if ($rootScope.type == 2) {
                    $state.go('app.sdash')
                }
            });

        }, function (error) {

            $scope.button = "Đăng nhập...";

            // An error happened.
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorCode);
            if (errorCode === 'auth/invalid-email') {
                toastr.error('Kiểm tra lại email.');
                return false;
            } else if (errorCode === 'auth/wrong-password') {
                toastr.error('Mật khẩu không đúng.');
                return false;
            } else if (errorCode === 'auth/argument-error') {
                toastr.error('Password must be string.');
                return false;
            } else if (errorCode === 'auth/user-not-found') {
                toastr.error('Email này không tồn tại.');
                return false;
            } else if (errorCode === 'auth/too-many-requests') {
                toastr.error('Too many failed login attempts, please try after sometime.');
                return false;
            } else if (errorCode === 'auth/network-request-failed') {
                toastr.error('Request timed out, please try again.');
                return false;
            } else {
                toastr.error(errorMessage);
                return false;
            }

        });


    };
// end $scope.doLogin()


})
    .controller('resetController', function ($scope, $state, $document, toastr) {

        $scope.doResetemail = function (userReset) {

            //console.log(userReset);

            if (userReset != "") {


                secondary.auth().sendPasswordResetEmail(userReset).then(function () {
                    // Sign-In successful.
                    toastr.success("Reset email sent successful");

                    $state.go("login");


                }, function (error) {
                    // An error happened.
                    var errorCode = error.code;
                    console.log(errorCode);

                    if (errorCode === 'auth/user-not-found') {
                        toastr.error('Email này không đúng.');
                        return false;
                    } else if (errorCode === 'auth/invalid-email') {
                        toastr.error('Email you entered is not complete or invalid.');
                        return false;
                    }

                });


            } else {

                toastr.error('Please enter registered email to send reset link');
                return false;

            }//end check client username password


        };


    })

    .controller('signupCtrl', function ($scope, $rootScope, $stateParams, $http, $state, ModalService, toastr, $timeout) {

        var type = $stateParams.id;
        if ($stateParams.apply) {
            if (type == 2) {
                $rootScope.service.JoboApi('on/store', {
                    storeId: $stateParams.apply
                }).then(function (data) {
                    $timeout(function () {
                        $rootScope.preApply = {
                            card: data.data,
                            jobOffer: $stateParams.job
                        }
                        console.log('$rootScope.preApply', $rootScope.preApply)
                    })
                });
                /*firebase.database().ref('store/' + $stateParams.apply).once('value', function (snap) {
                    $timeout(function () {
                        $rootScope.preApply = {
                            card: snap.val(),
                            jobOffer: $stateParams.job
                        }
                        console.log('$rootScope.preApply', $rootScope.preApply)
                    })

                })*/

            }
        }


        $scope.type = type;

        secondary.auth().getRedirectResult().then(function (result) {
            if (result.credential) {
                toastr.info('Đang đăng nhập bằng Facebook...');

                var token = result.credential.accessToken;

                var credential = firebase.auth.FacebookAuthProvider.credential(token);

                SignInWithCredential(credential);
            }

        }).catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            toastr.error(errorMessage)
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...
        });

        $scope.facebookLogin = function () {
            var provider = new firebase.auth.FacebookAuthProvider();
            secondary.auth().signInWithRedirect(provider);
        };


        function SignInWithCredential(credential) {
            secondary.auth().signInWithCredential(credential).then(function (result) {
                var user = secondary.auth().currentUser || result;
                var userData = {
                    userId: user.uid,
                    name: user.displayName,
                    email: user.email,
                    provider: 'facebook'
                };

                console.log(user);
                checkSignupOrSignIn(userData);
            }, function (error) {
                console.log(error)
            })

        }


        function checkSignupOrSignIn(userData) {
            $rootScope.service.JoboApi('on/user', {userId: userData.userId}).then(function (data) {
                console.log('checkSignupOrSignIn', JSON.stringify(data.data));
                var userDataLoad = data.data;
                if (userDataLoad && userDataLoad.type) {
                    toastr.success('Đăng nhập')
                    var type = userDataLoad.type
                    if (type == 1) {
                        console.log('employer go to');

                        $state.go('app.edash')
                    }
                    if (type == 2) {
                        $state.go('app.sdash')
                    }
                } else {

                    toastr.success('Đăng ký')

                    if (!$scope.type) {

                        ModalService.showModal({
                            templateUrl: 'templates/modals/address.html',
                            controller: 'ModalController'
                        }).then(function (modal) {
                            modal.element.modal();
                            modal.close.then(function (result) {
                                if (result == 1 || 2) {
                                    createDataUser(userData.userId, userData, result)
                                }
                            });
                        });
                        // A confirm dialog
                    }
                    if ($scope.type) {
                        console.log('has type');

                        createDataUser(userData.userId, userData, $scope.type)
                    }


                }
            });
            /*var userRef = firebase.database().ref("user/" + userData.userId);
            userRef.once('value', function (snap) {
                console.log('checkSignupOrSignIn', JSON.stringify(snap.val()));
                var userDataLoad = snap.val();
                if (userDataLoad) {
                    toastr.success('Đăng nhập')
                    var type = userDataLoad.type
                    if (type == 1) {
                        console.log('employer go to');

                        $state.go('app.edash')
                    }
                    if (type == 2) {
                        $state.go('app.sdash')
                    }
                } else {

                    toastr.success('Đăng ký')

                    if (!$scope.type) {

                        ModalService.showModal({
                            templateUrl: 'templates/modals/address.html',
                            controller: 'ModalController'
                        }).then(function (modal) {
                            modal.element.modal();
                            modal.close.then(function (result) {
                                if (result == 1 || 2) {
                                    createDataUser(userData.userId, userData, result)
                                }
                            });
                        });
                        // A confirm dialog
                    }
                    if ($scope.type) {
                        console.log('has type');

                        createDataUser(userData.userId, userData, $scope.type)
                    }


                }
            })*/

        }

        function createDataUser(userId, userData, type) {
            userData.type = type;
            userData.createdAt = new Date().getTime();
            var refer = window.localStorage.getItem('ref')
            if (refer) {
                userData.ref = refer;
            }
            $rootScope.service.JoboApi('update/user', {
                userId: userId,
                user: JSON.stringify(userData)
            });
            // userRef.update(userData);
            if (userData.type == 1) {
                $state.go('store', {id: null})
            }
            if (userData.type == 2) {
                $state.go('profile')
            }
        }


        $scope.doSignup = function (userSignup) {

            $rootScope.registering = true;
            secondary.auth().createUserWithEmailAndPassword(userSignup.username, 'tuyendungjobo').then(function (user) {

                $rootScope.userId = user.uid;
                // $scope.usersRef = firebase.database().ref('user/' + user.uid);
                var userData = {
                    type: $scope.type,
                    phone: '',
                    userId: user.uid,
                    email: userSignup.username,
                    provider: 'normal'
                };
                createDataUser(user.uid, userData, $scope.type)

                toastr.success("Đăng ký thành công, mật khẩu đăng nhập của bạn là: tuyendungjobo");
                if ($scope.type == 1) {
                    $state.go('store', {id: null})
                }
                if ($scope.type == 2) {
                    $state.go('profile')
                }

            }, function (error) {

                // An error happened.
                var errorCode = error.code;
                console.log(errorCode);

                if (errorCode === 'auth/weak-password') {

                    toastr.error('Mật khẩu ngắn, hãy chọn mật khẩu khác!');

                    return false;
                } else if (errorCode === 'auth/email-already-in-use') {
                    toastr.error('Email này đã được sử dụng rồi');

                    return false;
                }
            });
        };

    })
