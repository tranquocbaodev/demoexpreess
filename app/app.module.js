/* angular modules */
(function() {
    'use strict';

    angular.module('app', [
        'app.core',
        /*
         * Feature areas
         */
         'app.login',
         'app.user',
         'ui.calendar', 
         'ui.bootstrap',
         'ngDropdowns'
    ]);
})();