/**
 * config
 */
(function() {
    'use strict';

    var core = angular.module('app.core')
        .run(runBlock);

    //runBlock
    function runBlock($rootScope, $window, $location, $state) {

        $rootScope.path = $location.path();
        $rootScope.go = function(path) {
            $rootScope.app;
            if (path === 'back') { // Allow a 'back' keyword to go to previous page
                $window.history.back();
            } else { // Go to the specified path
                $location.path(path);
            };
        };

        $rootScope.$on('$stateChangeSuccess', function() {
            $('body').scrollTop(0);
            $rootScope.path = $location.path();
            $rootScope.currentState = $state.current.name;
        });
    }
})();
