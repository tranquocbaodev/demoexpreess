/* Controllers */
(function() {
	'use strict';

	angular
		.module('app.user')
		.controller('userCtrl', userCtrl);

	//login
	function userCtrl($scope, $filter, $location,dataSvc,$timeout,$window) {
		var vm = this;
		//Dropdown for Po Payment
		$scope.ddSelectOptionsPoPayment = [ 
			{ 
				"text": "PO PAYMENT DUE STATUS", 
				"value": 1 
			}, { 
				"text": "PO PAYMENT DUE STATUS 2", 
				"value": 2 
			} 
		]; 
		 
		 
		$scope.ddSelectSelectedPoPayment = { 
			"text": "PO PAYMENT DUE STATUS" 
		}; 

		//Dropdown for All Buyers
		$scope.ddSelectOptionsAllBuyers = [ 
			{ 
				"text": "Buyer 1", 
				"value": 1 
			}, { 
				"text": "Buyer 2", 
				"value": 2 
			} 
		]; 
		 
		 
		$scope.ddSelectSelectedAllBuyers = { 
			"text": "All Buyers" 
		}; 

		//Dropdown for All Vendors OPPORTUNITIES
		$scope.ddSelectOptionsAllVendors = [ 
			{ 
				"text": "Opportunities 1", 
				"value": "Opportunities 1" 
			}, { 
				"text": "Opportunities 2", 
				"value": "Opportunities 2"  
			} 
		]; 
		 
		 
		$scope.ddSelectSelectedAllVendors = { 
			"text": "Opportunities First" 
		}; 

		//func Calendar
		$scope.formatDate = function (strDate,type) {
		    if (strDate && strDate !== "") {
		        if (type === "save") {
		            return $filter('date')(new Date(strDate), "MM/d/yyyy");
		        }else{
		            return $filter('date')(new Date(strDate), "MMMM d yyyy");
		        }
		    }
		}

		$scope.getCountOpenPO = function (item) {
		    var count = 0;
		    for (var i = 0; i < item.vendors.length; i++) {
		        count += item.vendors[i].openPos.length;
		    }
		    return count;
		}

		$scope.getSumTotal = function (item) {
		   var count = 0;
		    for (var i = 0; i < item.vendors.length; i++) {
		        for (var j = 0; j < item.vendors[i].openPos.length; j++) {
		            count += item.vendors[i].openPos[j].sumOfToal;
		        }
		    }
		    return count;
		}
		
		//collapse Div criticals Date
		$scope.clickCollapseCritical = function (event) {
			event.stopPropagation();
			var element = angular.element(event.currentTarget).parent().parent().parent();
			if (element.hasClass('expanded-ver')) {
				angular.element(event.currentTarget).parent().parent().parent().removeClass('expanded-ver');
			}else{
				angular.element(event.currentTarget).parent().parent().parent().addClass('expanded-ver');
			}
		}

		$scope.clickCollapseCriticalMobile = function (event) {
			event.stopPropagation();
			var element = angular.element(event.currentTarget).parent();
			if (element.hasClass('expanded-ver')) {
				angular.element(event.currentTarget).parent().removeClass('expanded-ver');
				angular.element(event.currentTarget).addClass('ng-hide');
				angular.element(event.currentTarget).parent().find('.icon-big-down-arrow').removeClass("ng-hide");
			}else{
				angular.element(event.currentTarget).parent().addClass('expanded-ver');
				angular.element(event.currentTarget).addClass('ng-hide');
				angular.element(event.currentTarget).parent().find('.icon-big-up-arrow').removeClass("ng-hide");
			}
		}
		$scope.setheightForMain();
		
	}
})();
