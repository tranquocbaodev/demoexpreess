/* Controllers */
(function() {
    'use strict';
    angular
        .module('app.core')
        .controller('Core', Core);

    //core 
    function Core($scope, dataSvc,$timeout,$window,$rootScope,$location,$filter) {
        var vm = this;

        $scope.listTag = [];

        //get data Open Po Report
        $scope.dbPoReport = [];
        var promise = dataSvc.query('app/data/openPoReport.json');
        promise.then(function(data) {
            $scope.dbPoReport = angular.copy(data);
        });

        //get data Materials Supplier List
        $scope.dbMaterials = [];
        var promise = dataSvc.query('app/data/materialsSupplierList.json');
        promise.then(function(data) {
            $scope.dbMaterials = angular.copy(data);
        });

        //get data Json Filter
        var promise = dataSvc.query('app/data/filterData.json');
        promise.then(function(data) {
            $scope.vendorsName = angular.copy(data.dbVendorsName);
            $scope.buyerNameReport = angular.copy(data.dbBuyerName);
            $scope.suppliersName = angular.copy(data.dbSuppliersName);
            $scope.buyerNamesMaterial = angular.copy(data.dbBuyerName);
            $scope.region = angular.copy(data.dbRegion);
            $scope.materials= angular.copy(data.dbMaterial);
            $scope.materialsType= angular.copy(data.dbMaterialType);
        });

        //get data radius chart
        $scope.dbRadiusChart = [];
        var promise = dataSvc.query('app/data/dataRadius.json');
        promise.then(function(data) {
            $scope.dbRadiusChart = data;
        });

        //get data radius chart
        $scope.dbCalendar = [];
        $scope.dbAllCalendar = [];
        var promise = dataSvc.query('app/data/calendarDb.json');
        promise.then(function(data) {
            $scope.dbCalendar = angular.copy(data.dbCalendar);
            $scope.dbAllCalendar = angular.copy(data.dbCalendar);
            $scope.monthCalendarInit();
        });


        //click Navigation
        $scope.locationName = $window.location.hash;
        $scope.goDashboardPage =function () {
            $scope.locationName = "#/user/dashboard";
            $location.path('user/dashboard');
            $scope.listTag = [];
            $scope.monthCalendarInit();
            $scope.setheightForMain();
        }

        $scope.goReportPage =function () {
            $scope.locationName = "#/user/report";
            $location.path('user/report');
            $scope.listTag = [];
            $scope.monthCalendarInit();
            $scope.setheightForMain();
        }

        $scope.goCalendarPage =function () {
            $scope.locationName = "#/user/calendar";
            $location.path('user/calendar');
            $scope.listTag = [];
            $scope.monthCalendarInit();
            $scope.setheightForMain();
        }

        $scope.goMaterial =function () {
            $scope.locationName = "#/user/materials";
            $location.path('user/materials');
            $scope.listTag = [];
            $scope.monthCalendarInit();
            $scope.setheightForMain();
        }

        //click Nav on Mobi
        $scope.$on("clickNavMobi",function (event, args) {
            if (args.data === "dashboard") {
                $scope.goDashboardPage();
            }else if(args.data === "report"){
                 $scope.goReportPage();
            }else if(args.data === "calendar"){
                $scope.goCalendarPage();
            }else if(args.data === "materials"){
                $scope.goMaterial();
            }
            $scope.monthCalendarInit();
            $rootScope.$broadcast("callbackNavMobi",{data:$scope.locationName});
        });

        //change month Calendar
        var y;
        var m;
        $scope.monthCalendarInit = function () {
            $scope.previousMonth = new Date();
            y = $scope.previousMonth.getFullYear();
            m = $scope.previousMonth.getMonth();
            $scope.firstDay = $filter('date')(new Date(y, m, 1), "d MMMM yyyy");
            $scope.lastDay =  $filter('date')(new Date(y, m + 1, 0), "d MMMM yyyy");
            $scope.firstDayMobile = $filter('date')(new Date(y, m, 1), "d MMM yyyy");
            $scope.lastDayMobile =  $filter('date')(new Date(y, m + 1, 0), "d MMM yyyy");
            $scope.titleFilterBuyer = "All Buyer";
            $scope.titleFilterVendor ="All Vendor";
            $scope.queryTitleCritical = "";
            $scope.reloadDaTaCalendar();
        }

        
        $scope.nextMonth = function(){
            $scope.previousMonth.setMonth($scope.previousMonth.getMonth()+ 1);
            y = $scope.previousMonth.getFullYear();
            m = $scope.previousMonth.getMonth();
            $scope.firstDay = $filter('date')(new Date(y, m, 1), "d MMMM yyyy");
            $scope.lastDay =  $filter('date')(new Date(y, m + 1, 0), "d MMMM yyyy");
            $scope.firstDayMobile = $filter('date')(new Date(y, m, 1), "d MMM yyyy");
            $scope.lastDayMobile =  $filter('date')(new Date(y, m + 1, 0), "d MMM yyyy");
            $scope.reloadDaTaCalendarNextPrev();
            
        }

        $scope.prevMonth = function(){
            $scope.previousMonth.setMonth($scope.previousMonth.getMonth()-1);
            y = $scope.previousMonth.getFullYear();
            m = $scope.previousMonth.getMonth();
            $scope.firstDay = $filter('date')(new Date(y, m, 1), "d MMMM yyyy");
            $scope.lastDay =  $filter('date')(new Date(y, m + 1, 0), "d MMMM yyyy");
            $scope.firstDayMobile = $filter('date')(new Date(y, m, 1), "d MMM yyyy");
            $scope.lastDayMobile =  $filter('date')(new Date(y, m + 1, 0), "d MMM yyyy");
            $scope.reloadDaTaCalendarNextPrev();
        }

        $scope.toDayFunc = function(){
            var toDay = $filter('date')(new Date(), "d MMMM yyyy");
            var prevDay = $filter('date')(new Date($scope.previousMonth), "d MMMM yyyy");
            if (toDay !== prevDay) {
                $scope.previousMonth =new Date();
                y = $scope.previousMonth.getFullYear();
                m = $scope.previousMonth.getMonth();
                $scope.firstDay = $filter('date')(new Date(y, m, 1), "d MMMM yyyy");
                $scope.lastDay =  $filter('date')(new Date(y, m + 1, 0), "d MMMM yyyy");
                $scope.firstDayMobile = $filter('date')(new Date(y, m, 1), "d MMM yyyy");
                $scope.lastDayMobile =  $filter('date')(new Date(y, m + 1, 0), "d MMM yyyy");
                $scope.reloadDaTaCalendarNextPrev();
            }
        }

        $scope.$on("selectMonthOnTimeline",function (event,args) {
            $scope.previousMonth = new Date(args.data);
            y = $scope.previousMonth.getFullYear();
            m = $scope.previousMonth.getMonth();
            $scope.firstDay = $filter('date')(new Date(y, m, 1), "d MMMM yyyy");
            $scope.lastDay =  $filter('date')(new Date(y, m + 1, 0), "d MMMM yyyy");
            $scope.firstDayMobile = $filter('date')(new Date(y, m, 1), "d MMM yyyy");
            $scope.lastDayMobile =  $filter('date')(new Date(y, m + 1, 0), "d MMM yyyy");
            $scope.reloadDaTaCalendar();
        });

        var searchMatch = function (haystack, needle) {
            if (!needle) {
                return true;
            }
            haystack = haystack.toString();
            needle = needle.toString();
            return haystack.toLowerCase().indexOf(needle.toLowerCase()) !== -1;
        };

        $scope.queryTitleCritical = "";
        $scope.searchCritical = function (query) {
            $scope.queryTitleCritical = query;
            $scope.reloadDaTaCalendar();
        }

        $scope.reloadDaTaCalendar = function () {
            $scope.dbCalendar = $filter("filter")($scope.dbAllCalendar,function (item) {
                var criticalDate = new Date(item.criticalDate);
                if (criticalDate.getMonth() === $scope.previousMonth.getMonth()) {
                    return true;
                }
                return false;
            });

            if ($window.innerHeight > 767) {
                $scope.dbCalendar = $filter("filter")($scope.dbCalendar,function (item) {
                    if ($scope.titleFilterBuyer==="All Buyer") {
                        return true;
                    }

                    if (item.buyerName !== $scope.titleFilterBuyer) {
                        return false;
                    }
                    return true;
                });

                $scope.dbCalendar = $filter("filter")($scope.dbCalendar,function (item) {
                    if ($scope.titleFilterVendor==="All Vendor") {
                        return true;
                    }

                    if (item.vendorName !== $scope.titleFilterVendor) {
                        return false;
                    }
                    return true;
                });

                $scope.dbCalendar = $filter("filter")($scope.dbCalendar,function (item) {
                    if (searchMatch(item.title,$scope.queryTitleCritical)) {
                        return true;
                    }
                    return false;
                });
            }else{
                for (var i = 0; i < $scope.listTag.length; i++) {
                    $scope.dbCalendar = $filter("filter")($scope.dbCalendar,function (item) {
                        if ($scope.listTag[i].type === "Vendor" && (item.vendorName !== $scope.listTag[i].value) && $scope.listTag[i].value!=="All Vendor") {
                            return false;
                        }

                        if ($scope.listTag[i].type === "Buyer" && (item.buyerName !== $scope.listTag[i].value) && $scope.listTag[i].value!=="All Buyer") {
                            return false;
                        }

                        return true
                    });
                }
            }

            $rootScope.$broadcast("updateListCalendar",{data:$scope.dbCalendar});
        }

        $scope.reloadDaTaCalendarNextPrev = function () {

            $scope.dbCalendar = $filter("filter")($scope.dbAllCalendar,function (item) {
                var criticalDate = new Date(item.criticalDate);
                if (criticalDate.getMonth() === $scope.previousMonth.getMonth()) {
                    return true;
                }
                return false;
            });

            $rootScope.$broadcast("updateListCalendarNextPrev",{data:$scope.dbCalendar});
        }

        $scope.titleFilterBuyer = "All Buyer";
        $scope.titleFilterVendor ="All Vendor";
        $scope.$on("updateFilterTagOnCalendar",function (event,args) {
            if ($scope.listTag.length > 0) {                
                for (var i = 0; i < $scope.listTag.length; i++) {
                    if ($scope.listTag[i].type === args.data.type ) {
                        $scope.listTag[i].value = args.data.value;
                        if ($scope.listTag[i].type === "Buyer") {
                            $scope.titleFilterBuyer = $scope.listTag[i].value;
                        }

                        if ($scope.listTag[i].type === "Vendor") {
                            $scope.titleFilterVendor = $scope.listTag[i].value;
                        }
                        $scope.reloadDaTaCalendar();
                        return;
                    }
                }
            }
            $scope.listTag.push(args.data);
            if (args.data.type === "Buyer") {
                $scope.titleFilterBuyer = args.data.value;
            }

            if (args.data.type === "Vendor") {
                $scope.titleFilterVendor = args.data.value;
            }
            $scope.reloadDaTaCalendar();
        });

        $scope.$on("updateFilterTag",function (event,args) {
             $scope.listTag = args.data;
             $scope.reloadDaTaCalendar();
        });

        //click Doropdown filter
        $scope.clickDropdownTooltip = function (event) {
            event.stopPropagation();
            angular.element(document.querySelectorAll(".tool-tip-show")).removeClass("show");
            angular.element(event.currentTarget).parent().find(".tool-tip-show").addClass('show');
            angular.element(document.querySelectorAll(".dark-overlay")).removeClass("ng-hide");
        }

        $scope.clickDropdownTooltipMobile = function (event,title) {
            event.stopPropagation();
            angular.element(document.querySelectorAll(".tool-tip-show")).removeClass("show");
            angular.element(document.querySelectorAll(".dark-overlay")).removeClass("ng-hide");
            angular.element(document.querySelectorAll(".drop-down-here")).removeClass("active");

            if (title === "buyer") {
                angular.element(event.currentTarget).parent().parent().find(".tool-tip-show.buyers-tool").addClass('show');
                angular.element(event.currentTarget).parent().addClass('active');
                angular.element(document.querySelectorAll(".left-group-primary")).addClass("fix-zindex-d");
            }

            if (title === "vendor") {
                angular.element(event.currentTarget).parent().parent().find(".tool-tip-show.vendors-tool").addClass('show');
                angular.element(event.currentTarget).parent().addClass('active');
                angular.element(document.querySelectorAll(".left-group-primary")).addClass("fix-zindex-d");
            }

        }

       //click Detail item Critical Date
        $scope.itemDetailCritical ={}; 
        $scope.itemDetailCritical.title ="title";
        $scope.countPoDetail = 5;
        $scope.clickDetailCriticalsItem = function (item,event) {
            if (item.selected) {
                for (var i = 0; i < $scope.dbCalendar.length; i++) {
                    $scope.dbCalendar[i].selected = false;
                }
            }else{
                for (var i = 0; i < $scope.dbCalendar.length; i++) {
                    $scope.dbCalendar[i].selected = false;
                }
                item.selected = true;
            }
           
            $scope.itemDetailCritical = item;
            $scope.countPoDetail = 0;
            for (var i = 0; i < item.vendors.length; i++) {
                $scope.countPoDetail += item.vendors[i].openPos.length;
            }
            $rootScope.$broadcast("clickDetailCriticalItem",{data:$scope.itemDetailCritical});
        }

        //callBack Click Detail
        $scope.$on("callBackClickDetail",function (event,args) {
            for (var i = 0; i < $scope.dbCalendar.length; i++) {
                if ($scope.dbCalendar[i].idCalendar === args.data.idCalendar) {
                    $scope.dbCalendar[i].selected = args.isSelected;
                }
            }
        });

        //click dark overlay
        $scope.clickDarkOverlay = function (event) {
            angular.element(event.currentTarget).addClass("ng-hide");
        }

        //set height
        $scope.setheightForMain = function () {
            $timeout(function(){
                if ($window.location.hash === "#/user/calendar" || $window.location.hash === "#/user/dashboard") {
                    if (angular.element(document.querySelectorAll(".dashboard-overview-page"))) {
                        var heightCheck = angular.element(document.querySelectorAll(".dashboard-overview-page"))[0].clientHeight;
                        if ($window.innerHeight- 158 > heightCheck) {
                            angular.element(document.querySelectorAll(".dashboard-overview-page")).css("height",$window.innerHeight - 158 + "px");
                        }else{
                            angular.element(document.querySelectorAll(".dashboard-overview-page")).css("height","auto");
                        }
                    }
                    
                }else if($window.location.hash === "#/user/materials"){
                    if (angular.element(document.querySelectorAll(".page-po-report")).length > 0 ) {
                        var heightCheck = angular.element(document.querySelectorAll(".page-po-report"))[0].clientHeight;
                        if ($window.innerHeight- 245 > heightCheck) {
                            angular.element(document.querySelectorAll(".page-po-report")).css("height",$window.innerHeight - 245 + "px");
                        }else{
                            angular.element(document.querySelectorAll(".page-po-report")).css("height","auto");
                        }
                    }
                }else{
                    if (angular.element(document.querySelectorAll(".page-po-report")).length > 0 ) {
                        var heightCheck = angular.element(document.querySelectorAll(".page-po-report"))[0].clientHeight;
                        if ($window.innerHeight- 158 > heightCheck) {
                            angular.element(document.querySelectorAll(".page-po-report")).css("height",$window.innerHeight - 158 + "px");
                        }else{
                            angular.element(document.querySelectorAll(".page-po-report")).css("height","auto");
                        }
                    }
                }
            }, 50);
        }

        $window.addEventListener("resize",function(){
            $scope.setheightForMain();
        });

    }
})();
