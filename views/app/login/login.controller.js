/* Controllers */
(function() {
    'use strict';

    angular
        .module('app.login')
        .controller('loginCtrl', Login);

    //login
    function Login($scope, $filter, $location,dataSvc) {
        $scope.dbUser;
        var vm = this;
        vm.isEnabledReset = false;

       //get data
       var promise = dataSvc.query('app/data/users.json');
       promise.then(function(data) {
           $scope.dbUser = data;
       });

        //login
        vm.login = function() {
            var u = vm.username,
                p = vm.password;
            var isVaid = false;
            vm.loginError = false;
            var matched = [];
            var search = $filter('filter')($scope.dbUser.users, function(item) {
                console.log(item.password);
                console.log(p);
                if (u && p && item.username.toLowerCase() === u.toLowerCase() && item.password === p) {
                    matched.push(item);
                    return true;
                }
                return false;
            });


            if (search.length > 0) {
                isVaid = true;
            }

            if (isVaid) {
                var u = matched[0];
                $scope.goDashboardPage();
            } else {
                vm.loginError = true;
            }
        }
    }
})();
