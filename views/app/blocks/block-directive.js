$(function() {
	angular.module('app.core')
		.directive('headerTemp', headerTemp)
		.directive('headerMobiTemp', headerMobiTemp)
		.directive('searchTagBlock', searchTagBlock)
		.directive('tooltipDropdownBlock', tooltipDropdownBlock)
		.directive('tableBlock', tableBlock)
		.directive('clickConfigCol', clickConfigCol)
		.directive('insertHtmlFromString', insertHtmlFromString)
		.directive('collapseComponent', collapseComponent)
		.directive('scrollTrigger', scrollTrigger)
		.directive('validNumber', validNumber)
		.directive('radiusChart', radiusChart)
		.directive('timeLineBlock', timeLineBlock)
		.directive('percentBar', percentBar)
		.directive('clickNextPrevMonth', clickNextPrevMonth)
		.directive('fullCalendarBlock', fullCalendarBlock) ;

	var arrayPerPage = [
		{
			"value":10
		},
		{
			"value":20
		},
		{
			"value":50
		}
	];

	$("body").click(function () {
		$(".tool-tip-show").removeClass("show");
		$(".drop-down-here").removeClass("active");
		$(".dark-over-all").removeClass("show");
		$(".left-group-primary").removeClass("fix-zindex-d");
		$(".drop-down-here").removeClass("active");
	});

	function headerTemp() {
		return {
			restrict: 'A',
			templateUrl: 'app/templates/header-temp.html'
		}
	}

	function headerMobiTemp() {
		return {
			restrict: 'A',
			templateUrl: 'app/templates/header-mobi-temp.html',
			controller: function($scope,$filter,$rootScope,$window){

				$scope.locationName = $window.location.hash;

				$scope.clickNavMobi = function (titlePage) {
					$rootScope.$broadcast("clickNavMobi",{data:titlePage});
				}

				$scope.$on("callbackNavMobi",function (event,args) {
					$scope.locationName = args.data;
				})
				 
			}
		}
	}

	function percentBar() {
		return {
			restrict: 'A',
			template: '<span class="demo-percent"></span>',
			scope:{
				data:"=percentBar"
			},
			link:function(scope, el, attr) {
				$(el).find("span").css("width",scope.data+"%");
			}
		}
	}

	function clickNextPrevMonth() {
		return {
			restrict: 'A',
			scope: {
				type: "@"
			},
			link: function(scope, el, attr) {
				$(el).click(function () {
					if (scope.type === "next") {
						$('.calendar').fullCalendar('next');
					}else if(scope.type === "prev"){
						$('.calendar').fullCalendar('prev');
					}else if(scope.type === "today"){
						$('.calendar').fullCalendar('today');
					}
				});
				
			}
		}
	}

	function insertHtmlFromString() {
		return {
			scope: {
				html: "=insertHtmlFromString"
			},
			link: function(scope, el, attr) {
				var _ = $(el);
				_.append(scope.html)
			}
		}
	}

	//scoll Load More
	function scrollTrigger() {
	    return {
	        link : function(scope, element, attrs ) {
	            var offset = parseInt(attrs.threshold) || 0;
	            var e = jQuery(element[0]);
	            var doc = jQuery(document);
            	angular.element(document).bind('scroll', function() {
            	    if (doc.scrollTop() + $(window).height() + offset > e.offset().top) {
            	        scope.$apply(attrs.scrollTrigger);
            	    }
            	});
	        }
	    };
	}

	//input only number
	function validNumber() {
	    return {
		    require: '?ngModel',
		    link: function(scope, element, attrs, ngModelCtrl) {
		      	if(!ngModelCtrl) {
		        	return; 
		      	}
		      	ngModelCtrl.$parsers.push(function(val) {
		        	if (angular.isUndefined(val)) {
		            	var val = '';
		        	}
			        var clean = val.replace(/[^-0-9\.]/g, '');
			        var negativeCheck = clean.split('-');
			        var decimalCheck = clean.split('.');
			        if(!angular.isUndefined(negativeCheck[1])) {
			            negativeCheck[1] = negativeCheck[1].slice(0, negativeCheck[1].length);
			            clean =negativeCheck[0] + '-' + negativeCheck[1];
			            if(negativeCheck[0].length > 0) {
			                clean =negativeCheck[0];
			            }
		        	}
		          
			        if(!angular.isUndefined(decimalCheck[1])) {
			            decimalCheck[1] = decimalCheck[1].slice(0,4);
			            clean =decimalCheck[0] + '.' + decimalCheck[1];
			        }

			        if (val !== clean) {
			          	ngModelCtrl.$setViewValue(clean);
			          	ngModelCtrl.$render();
			        }
		        	return clean;
		      	});

		      element.bind('keypress', function(event) {
		        if(event.keyCode === 32) {
		          	event.preventDefault();
		        }
		      });
		    }
	  	}
	}

	//search temp
	function searchTagBlock() {
		return {
			restrict: 'A',
			templateUrl: 'app/blocks/search-block.html',
			scope:{
				listTag:"=searchTagBlock"
			},
			controller: function($scope,$filter,$rootScope){
				$scope.keyPressFunc = function (e) {
					if(e.which === 13) {
				        var listQueryTag = $scope.inputSearchTag.split(",");
				        for (var i = 0; i < listQueryTag.length; i++) {
				        	if (listQueryTag[i]!=="") {
				        		if (!isNaN(listQueryTag[i])) {
				        			listQueryTag[i] = parseInt(listQueryTag[i]);
				        		}
				        		var objTag = {
				        			"type":"string",
				        			"value":listQueryTag[i]
				        		}
				        		$scope.listTag.push(objTag);
				        	}
				        	
				        }
				        $scope.inputSearchTag = "";
				        $rootScope.$broadcast("updateFilterTag",{data:$scope.listTag});
				    }
				}

				//remove Tag
				$scope.removeTagFilter = function (index) {
					$scope.listTag.splice(index,1);
					$rootScope.$broadcast("updateFilterTag",{data:$scope.listTag});
					$scope.setWidthForInputTag();
				}

				//add Tag Filter
				$scope.$on("addTagFilter",function (event,args) {
					if ($scope.listTag.length>0) {
						for (var i = 0; i < $scope.listTag.length; i++) {
							if ($scope.listTag[i].type === args.data.type ) {
								$scope.listTag[i].value = args.data.value;
								$rootScope.$broadcast("updateFilterTag",{data:$scope.listTag});
								$scope.setWidthForInputTag();
								return;
							}
						}
						$scope.listTag.push(args.data);
					}else{
						$scope.listTag.push(args.data);
					}
					$rootScope.$broadcast("updateFilterTag",{data:$scope.listTag});
					$scope.setWidthForInputTag();
				});
			},
			link: function(scope, el, attr) {
				$(el).find('.for-search').keypress(function(e) {
					if(e.which === 13) {
						scope.setWidthForInputTag();
					}
				});
				//windown resize
				$( window ).resize(function() {
				  	scope.setWidthForInputTag();
				});
				scope.setWidthForInputTag = function () {
					setTimeout(function () {
						var countWitdh = 0;
						var widthContain =0;
						if ($(window).width() < 668) {
							widthContain =	$(el).find(".tag-search-here").width();
							$(el).find(".demo-tag").each(function () {
								countWitdh += ($(this).width()+11);
							    if (countWitdh > widthContain) {
							    	countWitdh = 0;
							    	countWitdh +=($(this).width()+11);
							    }
							    
							});
							var widthForInput = widthContain-countWitdh-1;
							if (widthForInput > 75) {
								$(el).find(".for-search").css("width",widthForInput +"px");
							}else{
								$(el).find(".for-search").css("width","100%");
							}
						}else{
							widthContain = $(el).find(".tag-search-here").width();
							$(el).find(".demo-tag").each(function () {
								countWitdh += ($(this).width()+11);
							    if (countWitdh > widthContain) {
							    	countWitdh = 0;
							    	countWitdh +=($(this).width()+11);
							    }
							    
							});
							var widthForInput = widthContain-countWitdh-1;
							if (widthForInput > 158) {
								$(el).find(".for-search").css("width",widthForInput +"px");
							}else{
								$(el).find(".for-search").css("width","100%");
							}
						}
					},20);
				}
			}
		}
	}

	//search temp
	function tooltipDropdownBlock() {
		return {
			restrict: 'A',
			templateUrl: 'app/blocks/tooltip-dropdown.html',
			scope:{
				list:"=tooltipDropdownBlock",
				title:"@"
			},
			controller: function($scope,$filter,$rootScope,$window){
				
				$scope.clickItem = function (item,event) {
					angular.element(document.querySelectorAll(".tool-tip-show ul li")).removeClass("active");
					angular.element(document.querySelectorAll(".dark-overlay.calendar-ver")).addClass("ng-hide");

					if (($window.location.hash === "#/user/calendar" || $window.location.hash === "#/user/dashboard")
						&& $(window).width() > 767) {
						$rootScope.$broadcast("updateFilterTagOnCalendar",{data:item});
					}else{
						$rootScope.$broadcast("addTagFilter",{data:item});
					}
					angular.element(event.currentTarget).parent().addClass('active');
					angular.element(document.querySelectorAll(".tool-tip-show")).removeClass("show");
				}

				//selec item All
				$scope.clickAllItem = function () {
					angular.element(document.querySelectorAll(".dark-overlay.calendar-ver")).addClass("ng-hide");
					var objectAll = {
						"type":$scope.title,
						"value":"All "+$scope.title
					}

					if ($window.location.hash === "#/user/calendar" || $window.location.hash === "#/user/dashboard" && $(window).width() > 767) {
						$rootScope.$broadcast("updateFilterTagOnCalendar",{data:objectAll});
					}else{
						$rootScope.$broadcast("addTagFilter",{data:objectAll});
					}
					angular.element(document.querySelectorAll(".tool-tip-show")).removeClass("show");		
				}
			},
			link: function(scope, el, attr) {

			}
		}
	}

	//time Line 
	function timeLineBlock() {
		return {
			restrict: 'A',
			scope:{
				list:"=timeLineBlock"
			},
			templateUrl: 'app/blocks/timeline-block.html',
			controller: function($scope,$filter,$rootScope,$window){
				$scope.listGroupTimeLine = [];
				$scope.doGroupDataTimeLine = function () {
					$scope.listGroupTimeLine = [];
					for (var i = 0; i < $scope.list.length; i++) {
						$scope.checkDataTimeLine($scope.list[i]);
					}
					$scope.listGroupTimeLine = $filter('orderBy')($scope.listGroupTimeLine ,'criticalDate', false);
				}

				$scope.checkDataTimeLine = function (item) {
					for (var i = 0; i < $scope.listGroupTimeLine.length; i++) {
						var dateitem = new Date(item.criticalDate).getDate();
						var dateGroup = new Date($scope.listGroupTimeLine[i].criticalDate).getDate();
						if ( dateitem === dateGroup) {
							$scope.listGroupTimeLine[i].groups.push(item);
							return;
						}
					}

					var criticalItemGroup = {
						"criticalDate":new Date(item.criticalDate),
						"groups":[item]
					}
					$scope.listGroupTimeLine.push(criticalItemGroup);
				}

				$scope.doGroupDataTimeLine();

				$scope.$on("updateListCalendar",function (event,args) {
					$scope.list = args.data;
					$scope.doGroupDataTimeLine();
				})

				$scope.formatDate = function (strDate,type) {
				    return $filter('date')(new Date(strDate), "d MMMM yyyy");
				}

				// dropdown month
				//Dropdown for Sort by 
				$scope.ddSelectOptionsSortByMonth = [ 
					{ 
						"text": "October 2016", 
						"value": "10/1/2016" 
					},
					{ 
						"text": "November 2016", 
						"value": "11/1/2016" 
					},
					{ 
						"text": "December 2016", 
						"value": "12/1/2016" 
					},
					{ 
						"text": "January 2017", 
						"value": "1/1/2017" 
					} 
				]; 

				$scope.selectedMonth = function (selected) {
					selected.value = new Date(selected.value);
					var month = selected.value.getMonth();
					$rootScope.$broadcast("selectMonthOnTimeline",{data:selected.value});
				}


				$scope.getToday = function () {
					return $filter("date")(new Date,"MMMM d");
				}
				 
				 
				$scope.ddSelectSelectedSortByMonth = { 
					"text": "November 2016" 
				};
				 
			},
			link: function(scope, el, attr) {
			}
		}
	}

	//table Block
	function tableBlock() {
		return {
			restrict: 'A',
			scope: {
				list: "=tableBlock",
				listCol:"=",
				tableRole:"@",
				selected:"=",
				vendorsList:"=",
				buyerNameList:"=",
				region:"=",
				materials:"="
			},
			templateUrl: function(element, attrs) {
				  return "app/blocks/" + attrs.tableRole + "-table-block.html";
			},
			controller: function($scope,$filter,$rootScope,$window,$timeout){
				$scope.arrayPerPage = arrayPerPage;
				$scope.arrayPerPage[0].isSelected = true;

				//filter Data
				$scope.listTagFilter = [];
				$scope.sortingOrder = "";
				$scope.reverse = true;
				$scope.filteredItems = [];
				$scope.groupedItems = [];
				$scope.itemsPerPage = 10;
				$scope.pagedItems = [];
				$scope.currentPage = 0;
				$scope.inputCurrentPage = $scope.currentPage + 1;
				$scope.querySearch="";

				$scope.totalTypeMSD =0;
				$scope.totalTypeIndirect =0;
				$scope.totalTypeServices =0;
				$scope.totalTypeSuppliers =0;

				angular.element($window).bind('resize', function () {
				    if ($window.innerWidth < 1024) {
				    	$scope.itemsPerPage = $scope.list.length;
				    }
				});

				if ($window.innerWidth < 1024) {
			    	$scope.itemsPerPage = $scope.list.length;
			    }

				// init the filtered items
				var searchMatch = function (haystack, needle) {
					if (!needle) {
						return true;
					}

					haystack = haystack.toString();
					needle = needle.toString();
					return haystack.toLowerCase().indexOf(needle.toLowerCase()) !== -1;
					
				};

				$scope.search = function () {
					$scope.totalTypeMSD =0;
					$scope.totalTypeIndirect =0;
					$scope.totalTypeServices =0;
					$scope.totalTypeSuppliers =0;

					$scope.filteredItems =angular.copy($scope.list);

					if ($scope.listTagFilter.length > 0) {
						for (var i = 0; i < $scope.listTagFilter.length; i++) {
							$scope.filteredItems = $filter('filter')($scope.filteredItems, function (item) {
								if ($scope.listTagFilter[i].type === "Buyer" && $scope.listTagFilter[i].value !== "All Buyer") {
									if (!searchMatch(item.buyerName, $scope.listTagFilter[i].value)) {
										return false;
									}
								}

								if ($scope.listTagFilter[i].type === "Vendor" && $scope.listTagFilter[i].value !== "All Vendor") {
									if (!searchMatch(item.vendorName, $scope.listTagFilter[i].value)) {
										return false;
									}
								}

								if ($scope.listTagFilter[i].type === "Suppliers" && $scope.listTagFilter[i].value !== "All Supplier") {
									if (item.suppliersName.toLowerCase() !== $scope.listTagFilter[i].value.toLowerCase()) {
										return false;
									}
								}

								if ($scope.listTagFilter[i].type === "Region" && $scope.listTagFilter[i].value !== "All Region") {
									if (!searchMatch(item.region, $scope.listTagFilter[i].value)) {
										return false;
									}
								}

								if ($scope.listTagFilter[i].type === "MaterialsType" && $scope.listTagFilter[i].value !== "All MaterialsType") {
									if (!searchMatch(item.type, $scope.listTagFilter[i].value)) {
										return false;
									}
								}

								if ($scope.listTagFilter[i].type === "Materials" && $scope.listTagFilter[i].value !== "All Materials") {
									if (!searchMatch(item.materialName, $scope.listTagFilter[i].value)) {
										return false;
									}
								}

								if ($scope.listTagFilter[i].type === "Date" && $scope.tableRole === "materials") {	
									$scope.listTagFilter[i].value = $filter("date")(new Date($scope.listTagFilter[i].value),"M/d/yyyy");	
									if (item.q1 !== $scope.listTagFilter[i].value && item.q2 !== $scope.listTagFilter[i].value
										&& item.q3 !== $scope.listTagFilter[i].value && item.q4 !== $scope.listTagFilter[i].value) {
										return false;
									}
								}
								
								if ($scope.listTagFilter[i].type === "Date" && $scope.tableRole === "report") {	
									$scope.listTagFilter[i].value = $filter("date")(new Date($scope.listTagFilter[i].value),"M/d/yyyy");	
									if (item.criticalDate !== $scope.listTagFilter[i].value) {
										return false;
									}
								}

								if ($scope.listTagFilter[i].type === "string") {
									for (var attr in item) {
										if (searchMatch(item[attr], $scope.listTagFilter[i].value)) {
											return true;
										}
									}
									return false;
								}
								return true;
							});
						}
					}

					if ($scope.tableRole === "materials") {
						for (var i = 0; i < $scope.filteredItems.length; i++) {
							if ($scope.filteredItems[i].type === "MSD") {
								$scope.totalTypeMSD++;
							}
							if ($scope.filteredItems[i].type === "Indirect Material") {
								$scope.totalTypeIndirect++;
							}
							if ($scope.filteredItems[i].type === "Services") {
								$scope.totalTypeServices++;
							}
							if ($scope.filteredItems[i].type === "Suppliers") {
								$scope.totalTypeSuppliers++;
							}
						}
					}
					$scope.currentPage = 0;
					$scope.groupToPages();
					$scope.setHeigthForMobile();
				};

				// calculate page in place
				$scope.groupToPages = function () {
					$scope.pagedItems = [];
					for (var i = 0; i < $scope.filteredItems.length; i++) {
						if (i % $scope.itemsPerPage === 0) {
							$scope.pagedItems[Math.floor(i / $scope.itemsPerPage)] = [$scope.filteredItems[i]];
						} else {
							$scope.pagedItems[Math.floor(i / $scope.itemsPerPage)].push($scope.filteredItems[i]);
						}
					}
				};

				$scope.range = function (start, end) {
				  var ret = [];
				  if (!end) {
					  end = start;
					  start = 0;
				  }
				  for (var i = start; i < end; i++) {
					  ret.push(i);
				  }
				  return ret;
				};

				$scope.prevPage = function () {
				  if ($scope.currentPage > 0) {
					  $scope.currentPage--;
					  $scope.inputCurrentPage = $scope.currentPage+1;
				  }
				};

				$scope.nextPage = function () {
				  if ($scope.currentPage < $scope.pagedItems.length - 1) {
					  $scope.currentPage++;
					  $scope.inputCurrentPage = $scope.currentPage+1;
				  }
				};

				$scope.setPage = function (e) {
					if(e.which === 13) {
				        $scope.currentPage = parseInt($scope.inputCurrentPage) -1;
				    }
				};

				//select item on dropdow Page
				$scope.setNumberPerPage = function(selected){
					for (var i = 0; i < $scope.arrayPerPage.length; i++) {
						$scope.arrayPerPage[i].isSelected = false;
					}
				   	$scope.itemsPerPage = selected;
				   	$scope.search();
				};

				$scope.filterDataStatus = function (status,event) {
					angular.element(document.querySelectorAll('.table-data-d .above-table .list-sort li a')).removeClass('active');
					angular.element(event.currentTarget).addClass('active');
					$scope.search();
					if (status!=="") {
						$scope.filteredItems = $filter('filter')($scope.filteredItems ,function (item) {
							// return true;
							if(item.status === status){
								return true
							}
							return false;
						});
					}else{
						$scope.filteredItems = $scope.list;
					}
					// $scope.listFilter =[];
					$scope.groupToPages();
					$rootScope.$broadcast("setHeighForMain");
				}


				$scope.setClassForTable = function () {
					if ($scope.tableRole === "report") {
						if ($scope.listCol[0].isShow && !$scope.listCol[1].isShow && $scope.listCol[2].isShow && $scope.listCol[3].isShow && $scope.listCol[4].isShow
							&& $scope.listCol[5].isShow && !$scope.listCol[6].isShow && $scope.listCol[7].isShow && !$scope.listCol[8].isShow && $scope.listCol[9].isShow
							&& $scope.listCol[10].isShow) {
							angular.element(document.querySelectorAll('.table-data .table-report-main')).addClass('nice-table-report');
						}else{
							angular.element(document.querySelectorAll('.table-data .table-report-main')).removeClass('nice-table-report');
						}
					}

					if ($scope.tableRole === "materials") {
						if ($scope.listCol[0].isShow && $scope.listCol[1].isShow && $scope.listCol[2].isShow && $scope.listCol[3].isShow && $scope.listCol[4].isShow) {
							angular.element(document.querySelectorAll('.table-data table')).addClass('nice-table-material');
						}else{
							angular.element(document.querySelectorAll('.table-data table')).removeClass('nice-table-material');
						}
					}
				}

				$scope.checkAllItem = function() {
					$scope.isCheckAll =!$scope.isCheckAll;
					for (var i = 0; i < $scope.list.length; i++) {
						$scope.selected[$scope.list[i].id] = $scope.isCheckAll;
					}
				}

				$scope.clickCheckBoxItem = function (item) {
					$scope.selected[item.id] = !$scope.selected[item.id];
					if (!$scope.selected[item.id]) {
						$scope.isCheckAll = false;
					}
				}

				//call Back Data Filter
				$scope.$on("updateFilterTag",function (event,args) {
					$scope.listTagFilter = args.data;
					$scope.search();
					angular.element(document.querySelectorAll(".tool-tip-show")).removeClass("show");
					angular.element(document.querySelectorAll(".drop-down-here")).removeClass("active");
					angular.element(document.querySelectorAll(".dark-over-all")).removeClass("show");
				})

				//set height
				$scope.setHeigthForMobile = function () {
					if ($window.innerWidth < 668) {
						angular.element(document.querySelectorAll(".main-report-d")).css("height","100%");
						$timeout(function(){
							if (($window.innerHeight -212) >= angular.element(document.querySelectorAll(".main-report-d"))[0].clientHeight) {
								angular.element(document.querySelectorAll(".main-report-d")).css("height",$window.innerHeight -212 +"px");
							}else{
								angular.element(document.querySelectorAll(".main-report-d")).css("height","100%");
							}
						}, 50);
					}
				}

				$scope.search();

				// dropdown Conclusion
				$scope.optionSaveFilter = [ 
					{ 
						"text": "Save Filters", 
						"value": "Save Filters" 
					}, 
					{ 
						"text": "Lorem Ipsum", 
						"value": "Lorem Ipsum" 
					} 
				]; 
				$scope.selectSaveFilter = { 
					"text": "Save Filters", 
					"value": "Save Filters" 
				};

				//dropdown 
				$scope.optionNewFirst = [ 
					{ 
						"text": "Newest First", 
						"value": "Newest First" 
					}, 
					{ 
						"text": "Lorem Ipsum", 
						"value": "Lorem Ipsum" 
					} 
				]; 
				$scope.selectNewFirst = { 
					"text": "Newest First", 
					"value": "Newest First" 
				};

				//scoll Load More Data
				$scope.limitNumberShow = 5;
				var tempCountNumberShow = 9;
				$scope.loadMore = function () {
					if ($scope.limitNumberShow <= $scope.list.length) {
						angular.element(document.querySelectorAll(".loading-page")).removeClass("hide");
						$timeout(function(){
							$scope.limitNumberShow = $scope.limitNumberShow + 5;
							angular.element(document.querySelectorAll(".loading-page")).addClass("hide");
						}, 1500);
						
					}
				}

				//go Calendar View
				$scope.goCalendarView = function () {
					$rootScope.$broadcast("clickNavMobi",{data:"calendar"});
				}

				//send Tag Filter
				$scope.sendTagFilter = function (dateText) {
					var object = {
						"type":"Date",
						"value":dateText
					}
					$rootScope.$broadcast("addTagFilter",{data:object});
				}
				 
			},
			link: function(scope, el, attr) {


				// datepicker
				$( ".critical-datepicker" ).datepicker({
					dateFormat: 'mm/d/yy',
					onSelect: function(dateText) {
						scope.sendTagFilter(dateText);
						scope.$apply();
			        }
				});

				$(".btn-tooltipvender").click(function (event) {
					event.stopPropagation();
					if ($(this).parent().find(".tool-tip-show").hasClass('show')) {
						$(".tool-tip-show").removeClass("show");
					}else{
						$(".tool-tip-show").removeClass("show");
						$(this).parent().find(".tool-tip-show").addClass("show");
					}
				});

				$(".tool-tip-show").click(function (event) {
					event.stopPropagation();
				});

				//click collapse main data when mobi
				$(".table-data-box").on("click",".btn-colappse",function () {
					if ($(this).parent().parent().hasClass('active')) {
						$(this).parent().parent().removeClass('active')
					}else{
						$(this).parent().parent().addClass('active')
					}
				});

				//click button show tooltip dropdown
				$(".btn-materials-tool").click(function (e) {
					e.stopPropagation();
					$(".drop-down-here").removeClass("active");
					if ($(".materials-tool").hasClass('show')) {
						$(".tool-tip-show").removeClass("show");
						$(".dark-over-all").removeClass("show");
					}else{
						$(".tool-tip-show").removeClass("show");
						$(".materials-tool").addClass('show');
						$(this).parent().addClass("active");
						$(".dark-over-all").addClass("show");
					}
				});

				$(".btn-buyers-tool").click(function (e) {
					e.stopPropagation();
					$(".drop-down-here").removeClass("active");
					if ($(".buyers-tool").hasClass('show')) {
						$(".tool-tip-show").removeClass("show");
						$(".dark-over-all").removeClass("show");
					}else{
						$(".tool-tip-show").removeClass("show");
						$(".buyers-tool").addClass('show');
						$(this).parent().addClass("active");
						$(".dark-over-all").addClass("show");
					}
				});

				$(".btn-vendors-tool").click(function (e) {
					e.stopPropagation();
					$(".drop-down-here").removeClass("active");
					if ($(".vendors-tool").hasClass('show')) {
						$(".tool-tip-show").removeClass("show");
						$(".dark-over-all").removeClass("show");
					}else{
						$(".tool-tip-show").removeClass("show");
						$(".vendors-tool").addClass('show');
						$(this).parent().addClass("active");
						$(".dark-over-all").addClass("show");
					}
				});

				$(".btn-region-tool").click(function (e) {
					e.stopPropagation();
					$(".drop-down-here").removeClass("active");
					if ($(".region-tool").hasClass('show')) {
						$(".tool-tip-show").removeClass("show");
						$(".dark-over-all").removeClass("show");
					}else{
						$(".tool-tip-show").removeClass("show");
						$(".region-tool").addClass('show');
						$(this).parent().addClass("active");
						$(".dark-over-all").addClass("show");
					}
				});

				//click body

				$("body").click(function () {
					$(".tool-tip-show").removeClass("show");
					$(".drop-down-here").removeClass("active");
					$(".dark-over-all").removeClass("show");
				});

				setTableBody();
			    $(window).resize(setTableBody);
			    $(".table-body").scroll(function ()
			    {
			        $(".table-header").offset({ left: -1*this.scrollLeft });
			    });

			    function setTableBody()
			    {
			        $(".table-body").height($(".inner-container").height() - $(".table-header").height());
			    }
			}
		}
	}

	//click Config Column
	function clickConfigCol() {
		return {
			restrict: 'A',
			link: function(scope, el, attr) {
				var _ = $(el);
				$(_).on('click', function(e) {
					e.stopPropagation();
					if (_.parent().find('.show-tool-col').hasClass('show')) {
						_.parent().find('.show-tool-col').removeClass('show');
						_.addClass("active");
					} else {
						_.parent().find('.show-tool-col').addClass('show');
						_.removeClass("active");
					}
				})

				_.parent().find('.show-tool-col').on('click', function(e) {
					e.stopPropagation();
				})

				$('body').on('click', function() {
					_.parent().find('.show-tool-col').removeClass('show');
					_.removeClass("active");
				})
			}
		}
	}

	//click collapse component GroupInfo
	function collapseComponent() {
		return {
			restrict: 'A',
			link: function(scope, el, attr) {
				var _ = $(el);
				$(_).on('click', function(e) {
					e.stopPropagation();
					if (_.parent().parent().parent().parent().parent().parent().hasClass("collapse")) {
						_.parent().parent().parent().parent().parent().parent().removeClass("collapse");
						_.removeClass("active");
					}else{
						_.parent().parent().parent().parent().parent().parent().addClass("collapse");
						_.addClass("active");
					}
				})
			}
		}
	}

	// FullCalendar Block
	function fullCalendarBlock() {
		return {
			restrict: 'A',
			scope: {
				list: "=fullCalendarBlock"
			},
			templateUrl: 'app/blocks/calendar-block.html',
				controller: function($scope,$filter, uiCalendarConfig, $compile,$rootScope){
					// calendar function
					var date = new Date();
					var d = date.getDate();
					var m = date.getMonth();
					var y = date.getFullYear();

					var initData = function () {
						$scope.calEventsExt = {};
						for (var i = 0; i < $scope.list.length; i++) {
							$scope.list[i].start = new Date($scope.list[i].start);
							$scope.list[i].end = new Date($scope.list[i].start);
							$scope.list[i].end.setDate($scope.list[i].start.getDate()+1); 

							$scope.list[i].start = $filter('date')($scope.list[i].start, "yyyy-MM-dd");
							$scope.list[i].end = $filter('date')($scope.list[i].end, "yyyy-MM-dd");
							$scope.list[i].criticalDate = $filter('date')(new Date($scope.list[i].criticalDate), "yyyy-MM-dd");

							if ($scope.list[i].status === "No Request") {
								$scope.list[i].opportunitieStart = $filter('date')(new Date($scope.list[i].opportunitieStart), "yyyy-MM-dd");
								$scope.list[i].opportunitieEnd = $filter('date')(new Date($scope.list[i].opportunitieEnd), "yyyy-MM-dd");
							}
						}

						$scope.calEventsExt.events = angular.copy($scope.list);
						$scope.eventCopy = angular.copy($scope.calEventsExt.events);
					}
					
					initData();

					/* Render Tooltip */
					$scope.eventRender = function( event, element, view ) { 
						// event.stopPropagation();
						var btnhtml;
						var classColor = "";
						var classColor2 = "";
						if (event.category === "category1") {
							classColor = "blue-color";
						}else if(event.category === "category2"){
							classColor = "orange-color";
						}else if(event.category === "category3"){
							classColor = "green-color";
						}else if(event.category === "category4"){
							classColor = "purple-color";
						}else if(event.category === "category5"){
							classColor = "white-blue-color";
						}

						 if(event.quarter === "Q2"){
							classColor2 = "q-two";
						}
						
						if (event.status === "Request") {
							btnhtml = "<div class='event-box critical-active " 
							+ classColor + " " + classColor2 
							+ " '><div class='name-company truncate'>" 
							+event.title
							+ "</div><div class='detail'><div class='quarter-box'><span data-ng-mouseover='quarterOver()' data-ng-mouseout='quarterOut()'>"
							+event.quarter
							+"</span><div class='tooltip-payment hide quarter-tooltip' data-ng-mouseover='quarterOver()' data-ng-mouseout='quarterOut()'><span class='title'>PAYMENT DUE</span><p class='status-one'>Cash payment in <i class='t-bold'>1st Quarter 2016.</i> 'Payment due' on <i class='t-bold'>30/1/2016</i> <i class='t-blue'>(30 days)</i></p></div></div><div class='money-box icon-green-dollar01 icon-dollar04' data-ng-mouseover='opportunitiesOver()' data-ng-mouseout='opportunitiesOut()'><div class='tooltip-payment opportunities hide opportunities-tooltip' data-ng-mouseover='opportunitiesOver()' data-ng-mouseout='opportunitiesOut()'><span class='title'>Opportunities</span><p class='status-one'>Save up to <i class='t-green'>$370,900</i> by Push out 'Critical date' on <i class='t-bold'>3/2/2016</i></p> </i></p></div></div><div><a class='show-vender' href='javascript:;' data-ng-mouseover='venderOver()' data-ng-mouseout='venderOut()'>+3 More Vendors</a><div class='flyout-vendors hide vendor-tooltip-critical' data-ng-mouseover='venderOver()' data-ng-mouseout='venderOut()'><div class='cover-all'><div class='demo-values'><span class='top-title'>HANGZHOU DATON WIND POWER IMPETUS CO LTD</span><ul><li><i class='n-blue'>1</i><p class='line-one'><span class='big-title'>PO Number</span><span class='small-num'>888001808</span></p><p class='line-two'><span class='big-title'>SUM of total</span><span class='small-num'><i>$</i> 14,040</span> </p></li><li><i class='n-blue'>2</i><p class='line-one'><span class='big-title'>PO Number</span><span class='small-num'>888001808</span></p><p class='line-two'><span class='big-title'>SUM of total</span><span class='small-num'><i>$</i> 14,040</span> </p></li></ul></div><div class='demo-values only'><span class='top-title'> BRASVENDING COMERCIAL SA</span><ul><li><i class='n-blue'>1</i><p class='line-one'><span class='big-title'>PO Number</span><span class='small-num'>888001808</span></p><p class='line-two'><span class='big-title'>SUM of total</span><span class='small-num'><i>$</i> 14,040</span> </p></li></ul></div></div><a class='view-more' href='javascript:;'>+1 More Vendors</a></div><div class='flyout-vendors opportunities hide vendor-tooltip' data-ng-mouseover='venderOver()' data-ng-mouseout='venderOut()'> <div class='critical-date'><i class='icon-green-dollar02'></i><span class='t-title'>OPPORTUNITIES</span><span class='b-title'>Save up to <i class='t-bold'>$119,608</i> by push out 'Critical Date' on 3/2/2016.</span></div><div class='cover-all'><div class='demo-values'><span class='top-title'>HANGZHOU DATON WIND POWER IMPETUS CO LTD</span><ul><li><i class='n-blue'>1</i><p class='line-one'><span class='big-title'>PO Number</span><span class='small-num'>888001808</span></p><p class='line-two'><span class='big-title'>SUM of total</span><span class='small-num'><i>$</i> 14,040</span> </p></li><li><i class='n-blue'>2</i><p class='line-one'><span class='big-title'>PO Number</span><span class='small-num'>888001808</span></p><p class='line-two'><span class='big-title'>SUM of total</span><span class='small-num'><i>$</i> 14,040</span> </p></li></ul></div><div class='demo-values only'><span class='top-title'>LM WIND POWER BLADES QINHUANGDAO CO LTD</span><ul><li><i class='n-blue'>1</i><p class='line-one'><span class='big-title'>PO Number</span><span class='small-num'>888001808</span></p><p class='line-two'><span class='big-title'>SUM of total</span><span class='small-num'><i>$</i> 14,040</span> </p></li></ul></div></div><a class='view-more' href='javascript:;'>+2 More Vendors</a></div></div></div><span class='save-money'>Save $"
							+event.saving
							+"</span><span class='critical-end'>Critical date</span><span class='start-color'></span><span class='arrow-color'></span><span class='arrow-color-second hidden-xs'></span><span class='arrow-color-second mobi-ver'></span></div>";
						
						}else if(event.status === "No Request"){
							// no-critical-active
							btnhtml = "<div class='event-box no-critical-active " 
							+ classColor + " " + classColor2 
							+ " '><div class='name-company truncate'>" 
							+event.title
							+ "</div><div class='detail'><div class='quarter-box'><span data-ng-mouseover='quarterOver()' data-ng-mouseout='quarterOut()'>"
							+event.quarter
							+"</span><div class='tooltip-payment hide quarter-tooltip' data-ng-mouseover='quarterOver()' data-ng-mouseout='quarterOut()'><span class='title'>PAYMENT DUE</span><p class='status-one'>Cash payment in <i class='t-bold'>1st Quarter 2016.</i> 'Payment due' on <i class='t-bold'>30/1/2016</i> <i class='t-blue'>(30 days)</i></p></div></div><div class='money-box icon-green-dollar01 icon-dollar04' data-ng-mouseover='opportunitiesOver()' data-ng-mouseout='opportunitiesOut()'><div class='tooltip-payment opportunities hide opportunities-tooltip' data-ng-mouseover='opportunitiesOver()' data-ng-mouseout='opportunitiesOut()'><span class='title'>Opportunities</span><p class='status-one'>Save up to <i class='t-green'>$370,900</i> by Push out 'Critical date' on <i class='t-bold'>3/2/2016</i></p></i></p></div></div><div><a class='show-vender' href='javascript:;' data-ng-mouseover='venderOver()' data-ng-mouseout='venderOut()'>+3 More Vendors</a><div class='flyout-vendors hide vendor-tooltip-critical' data-ng-mouseover='venderOver()' data-ng-mouseout='venderOut()'><div class='cover-all'><div class='demo-values'><span class='top-title'>HANGZHOU DATON WIND POWER IMPETUS CO LTD</span><ul><li><i class='n-blue'>1</i><p class='line-one'><span class='big-title'>PO Number</span><span class='small-num'>888001808</span></p><p class='line-two'><span class='big-title'>SUM of total</span><span class='small-num'><i>$</i> 14,040</span> </p></li><li><i class='n-blue'>2</i><p class='line-one'><span class='big-title'>PO Number</span><span class='small-num'>888001808</span></p><p class='line-two'><span class='big-title'>SUM of total</span><span class='small-num'><i>$</i> 14,040</span> </p></li></ul></div><div class='demo-values only'><span class='top-title'> BRASVENDING COMERCIAL SA</span><ul><li><i class='n-blue'>1</i><p class='line-one'><span class='big-title'>PO Number</span><span class='small-num'>888001808</span></p><p class='line-two'><span class='big-title'>SUM of total</span><span class='small-num'><i>$</i> 14,040</span> </p></li></ul></div></div><a class='view-more' href='javascript:;'>+1 More Vendors</a></div><div class='flyout-vendors opportunities hide vendor-tooltip' data-ng-mouseover='venderOver()' data-ng-mouseout='venderOut()'> <div class='critical-date'><i class='icon-green-dollar02'></i><span class='t-title'>OPPORTUNITIES</span><span class='b-title'>Save up to <i class='t-bold'>$119,608</i> by push out 'Critical Date' on 3/2/2016.</span></div><div class='cover-all'><div class='demo-values'><span class='top-title'>HANGZHOU DATON WIND POWER IMPETUS CO LTD</span><ul><li><i class='n-blue'>1</i><p class='line-one'><span class='big-title'>PO Number</span><span class='small-num'>888001808</span></p><p class='line-two'><span class='big-title'>SUM of total</span><span class='small-num'><i>$</i> 14,040</span> </p></li><li><i class='n-blue'>2</i><p class='line-one'><span class='big-title'>PO Number</span><span class='small-num'>888001808</span></p><p class='line-two'><span class='big-title'>SUM of total</span><span class='small-num'><i>$</i> 14,040</span> </p></li></ul></div><div class='demo-values only'><span class='top-title'>LM WIND POWER BLADES QINHUANGDAO CO LTD</span><ul><li><i class='n-blue'>1</i><p class='line-one'><span class='big-title'>PO Number</span><span class='small-num'>888001808</span></p><p class='line-two'><span class='big-title'>SUM of total</span><span class='small-num'><i>$</i> 14,040</span> </p></li></ul></div></div><a class='view-more' href='javascript:;'>+2 More Vendors</a></div></div></div><span class='save-money'>Save $"
							+event.saving
							+"</span><span class='critical-end'>Critical date</span><span class='start-color'></span><span class='arrow-color'></span><span class='arrow-color-second hidden-xs'></span><span class='arrow-color-second mobi-ver'></span></div>";
						}
						var temp = $compile(btnhtml)($scope);
						return  temp;
						
					};

					var checkQuart = false;
					$scope.quarterOver = function() {
						checkQuart = true;
					}

					$scope.quarterOut = function() {
						checkQuart = false;
					}

					var checkOpportunities = false;
					$scope.opportunitiesOver = function() {
						checkOpportunities = true;
					}

					$scope.opportunitiesOut = function() {
						checkOpportunities = false;
					}
					
					var checkVender = false;
					$scope.venderOver = function() {
						checkVender = true;
					}

					$scope.venderOut = function() {
						checkVender = false;
					}

					$scope.nextBackCheck = false;
					$(".closeOpportunitiesPopup").click(function(event) {
						$(".dark-overlay-d").addClass('ng-hide');
						$(".tooltip-payment-mobi-ver.green-ver").addClass('ng-hide');
					});

					$(".closePaymentPopup").click(function(event) {
						$(".dark-overlay-d").addClass('ng-hide');
						$(".tooltip-payment-mobi-ver.blue-ver").addClass('ng-hide');
						$scope.nextBackCheck = true;
					});

					$(".dark-overlay.calendar-ver").click(function(event) {
						$(".dark-overlay-d").addClass('ng-hide');
						$(".tooltip-payment-mobi-ver.blue-ver").addClass('ng-hide');
						$scope.nextBackCheck = true;
					});


					// close all tootltip
					$scope.closeAllTooltips = function() {
						angular.element(document.querySelectorAll('.quarter-tooltip')).addClass('hide');
						angular.element(document.querySelectorAll('.opportunities-tooltip')).addClass('hide');
						angular.element(document.querySelectorAll('.vendor-tooltip')).addClass('hide');
						angular.element(document.querySelectorAll('.vendor-tooltip-critical')).addClass('hide');
					}
					$scope.alertOnEventClick = function( date, jsEvent, view, index){
						$scope.closeAllTooltips();
						jsEvent.stopPropagation();
						if (checkQuart === true) {
							if ($(window).width() >=320 && $(window).width() <=767) { 
								$(".dark-overlay-d").removeClass('ng-hide');
								$(".tooltip-payment-mobi-ver.blue-ver").removeClass('ng-hide');
								$scope.nextBackCheck = false;
								return
							}else {
								angular.element(jsEvent.currentTarget.getElementsByClassName("quarter-tooltip")).removeClass('hide');
								angular.element(document.querySelectorAll('.event-box')).removeClass('fix-zindex');
								angular.element(jsEvent.currentTarget.getElementsByClassName("flyout-vendors")).parent().parent().parent().addClass('fix-zindex');
								return;
							}
						}
						if (checkOpportunities === true) {
							if ($(window).width() >=320 && $(window).width() <=767) { 
								$(".dark-overlay-d").removeClass('ng-hide');
								$(".tooltip-payment-mobi-ver.green-ver").removeClass('ng-hide');
								return
							}else {
								angular.element(jsEvent.currentTarget.getElementsByClassName("opportunities-tooltip")).removeClass('hide');
								return;
							}
							
						}
						if (checkVender === true) {
							if ($(window).width() >=320 && $(window).width() <=767) { 
								$(".dark-overlay-d").removeClass('ng-hide');
								$(".tooltip-payment-mobi-ver.vendor-ver").removeClass('ng-hide');
							}else {
								if (date.status === "Request") {
									angular.element(jsEvent.currentTarget.getElementsByClassName("vendor-tooltip-critical")).removeClass('hide');
									angular.element(document.querySelectorAll('.event-box')).removeClass('fix-zindex');
									angular.element(jsEvent.currentTarget.getElementsByClassName("flyout-vendors")).parent().parent().parent().addClass('fix-zindex');
								}else {
									angular.element(jsEvent.currentTarget.getElementsByClassName("vendor-tooltip")).removeClass('hide');
									angular.element(document.querySelectorAll('.event-box')).removeClass('fix-zindex');
									angular.element(jsEvent.currentTarget.getElementsByClassName("flyout-vendors")).parent().parent().parent().addClass('fix-zindex');
								}
								return;
							}
							
						}

						if ($scope.nextBackCheck === false) {

							$scope.calEventsExt.events.splice(0,$scope.calEventsExt.events.length);
							if (date.status === "Request") {
								$scope.calEventsExt.events.push({
									idCalendar : date.idCalendar,
									title: date.title, 
									start: date._start._i,
									end: date.criticalDate,
									criticalDate: date.criticalDate,
									status: date.status,
									opportunitieStart: date.opportunitieStart, 
									opportunitieEnd: date.opportunitieEnd,
									saving: date.saving,
									category: date.category,
									quarter:date.quarter
								});
								setTimeout(function() {
									$(".event-box").addClass('critical-after');
									$(".event-box").eq(1).addClass('inline-title-calendar');
									$(".event-box").eq(0).addClass('hide-icon');
									$(".name-company").removeClass('truncate');
									$(".fc-day-number").addClass('active');
									$(".event-box").addClass('remove-color');

									var dateString;
									
									for (var i = 0; i < $scope.calEventsExt.events.length; i++) {
										var evStartDate = new Date($scope.calEventsExt.events[i].start),
										       evFinishDate = new Date($scope.calEventsExt.events[i].end);
										   if ($scope.calEventsExt.events[i].end) {
										       while (evStartDate <= evFinishDate) {
										           addClassByDate(evStartDate);
										           evStartDate.setDate(evStartDate.getDate()+1);
										       }
										   } else {
										       addClassByDate(evStartDate);
										   }
									}
									function addClassByDate(date) {
									    var dataAttr = getDataAttr(date);
									    $("[data-date='" + dataAttr + "']").addClass("hasEvent");
									}
									function getDataAttr(date) {
									    return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + (date.getDate().toString().length === 2 ? date.getDate() : "0" + date.getDate());
									};
										
									dateString = moment(date.criticalDate).format('YYYY-MM-DD');
									$("[data-date='" + dateString + "']").removeClass("hasEvent");
								}, 50);
								
								

							}else {
								$scope.calEventsExt.events.push(
									{
										idCalendar : date.idCalendar,
										title: date.title, 
										start: date._start._i,
										end: date.criticalDate,
										criticalDate: date.criticalDate,
										status: date.status,
										opportunitieStart: date.opportunitieStart, 
										opportunitieEnd: date.opportunitieEnd,
										saving: date.saving,
										category: date.category,
										quarter:date.quarter
									},
									{
										idCalendar : date.idCalendar,
										title: date.title, 
										start: date.opportunitieStart,
										end: date.opportunitieEnd,
										criticalDate: date.criticalDate,
										status: date.status,
										opportunitieStart: date.opportunitieStart, 
										opportunitieEnd: date.opportunitieEnd,
										saving: date.saving,
										category: date.category,
										quarter:date.quarterOp
									}
								);
								setTimeout(function() {
									$(".event-box").eq(0).addClass('hide-icon');
									$(".event-box").eq(0).addClass('no-opportunitie-active');
									$(".event-box").eq(1).addClass('no-opportunitie-active');
									$(".event-box").eq(2).addClass('opportunitie-active');
									$(".event-box").eq(1).addClass('hide-icon');
									$(".event-box").eq(1).addClass('inline-title-calendar');
									$(".name-company").removeClass('truncate');
									$(".fc-day-number").addClass('active');
									$(".event-box").addClass('remove-color');


									var dateString;
									for (var i = 0; i < $scope.calEventsExt.events.length; i++) {
										var evStartDate = new Date($scope.calEventsExt.events[i].start),
										       evFinishDate = new Date($scope.calEventsExt.events[i].end);
										   if ($scope.calEventsExt.events[i].end) {
										       while (evStartDate <= evFinishDate) {
										           addClassByDate(evStartDate);
										           evStartDate.setDate(evStartDate.getDate()+1);
										       }
										   } else {
										       addClassByDate(evStartDate);
										   }
									}
									function addClassByDate(date) {
									    var dataAttr = getDataAttr(date);
									    $("[data-date='" + dataAttr + "']").addClass("hasEvent");
									}
									function getDataAttr(date) {
									    return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + (date.getDate().toString().length === 2 ? date.getDate() : "0" + date.getDate());
									};
									dateString = moment($scope.calEventsExt.events[1].end).format('YYYY-MM-DD');
									$("[data-date='" + dateString + "']").removeClass("hasEvent");
								}, 50);
							}
							$rootScope.$broadcast("callBackClickDetail",{data:date,isSelected:true});
							//add  time
							$scope.nextBackCheck = true;
							$scope.reRenderCalendar();

							return;
						}

						if ($scope.nextBackCheck === true) {
							setTimeout(function() {
								$(".fc-day").removeClass("hasEvent");
								$(".fc-day-number").removeClass("hasEvent");
								$(".fc-day-number").removeClass('active');
								$(".event-box").removeClass('remove-color');

							}, 50);
							$scope.reloadDataCalendar();
							$rootScope.$broadcast("callBackClickDetail",{data:date,isSelected:false});
							return;
						}
					};
					// config calendar
					$scope.uiConfig = {
						calendar:{
							height: "auto",
							editable: false,
							eventLimit: 2,
							firstDay: 1,
							header:{
								left: 'title',
								center: '',
								right: 'today prev,next'
							},
							eventClick: $scope.alertOnEventClick,
							eventDrop: $scope.alertOnDrop,
							eventResize: $scope.alertOnResize,
							eventRender: $scope.eventRender
						}
					};

					$scope.reRenderCalendar = function(calendar) {			
						uiCalendarConfig.calendars.myCalendar1.fullCalendar('removeEvents');
						uiCalendarConfig.calendars.myCalendar1.fullCalendar('renderEvents');
				    };

					$scope.reloadDataCalendar = function () {
						// delete all array
						$scope.calEventsExt.events.splice(0,$scope.calEventsExt.events.length);
						//add  time
						for (var i = 0; i < $scope.eventCopy.length; i++) {
							$scope.calEventsExt.events.push({
								idCalendar : $scope.eventCopy[i].idCalendar,
								title: $scope.eventCopy[i].title, 
								start: $scope.eventCopy[i].start,
								end: $scope.eventCopy[i].end,
								criticalDate: $scope.eventCopy[i].criticalDate,
								status: $scope.eventCopy[i].status,
								opportunitieStart: $scope.eventCopy[i].opportunitieStart, 
								opportunitieEnd: $scope.eventCopy[i].opportunitieEnd,
								saving: $scope.eventCopy[i].saving,
								category: $scope.eventCopy[i].category,
								quarter:$scope.eventCopy[i].quarter,
								quarterOp:$scope.eventCopy[i].quarterOp,
							});
						}
						$scope.nextBackCheck = false;
						$scope.reRenderCalendar();
					}

					$scope.reloadDataCalendarNextPrev = function () {
						// delete all array
						$scope.calEventsExt.events.splice(0,$scope.calEventsExt.events.length);
						//add  time
						for (var i = 0; i < $scope.eventCopy.length; i++) {
							$scope.calEventsExt.events.push({
								idCalendar : $scope.eventCopy[i].idCalendar,
								title: $scope.eventCopy[i].title, 
								start: $scope.eventCopy[i].start,
								end: $scope.eventCopy[i].end,
								criticalDate: $scope.eventCopy[i].criticalDate,
								status: $scope.eventCopy[i].status,
								opportunitieStart: $scope.eventCopy[i].opportunitieStart, 
								opportunitieEnd: $scope.eventCopy[i].opportunitieEnd,
								saving: $scope.eventCopy[i].saving,
								category: $scope.eventCopy[i].category,
								quarter:$scope.eventCopy[i].quarter
							});
						}
						$scope.nextBackCheck = false;
						uiCalendarConfig.calendars.myCalendar1.fullCalendar('removeEvents');
						uiCalendarConfig.calendars.myCalendar1.fullCalendar('addEventSource', $scope.calEventsExt.events);
						uiCalendarConfig.calendars.myCalendar1.fullCalendar('renderEvents');
					}

					$scope.eventSources = [$scope.calEventsExt];

					$scope.$on("updateListCalendar",function (event,args) {
						$scope.list = angular.copy(args.data);
						for (var i = 0; i < $scope.list.length; i++) {
							$scope.list[i].start = new Date($scope.list[i].start);
							$scope.list[i].end = new Date($scope.list[i].start);
							$scope.list[i].end.setDate($scope.list[i].start.getDate()+1); 

							$scope.list[i].start = $filter('date')($scope.list[i].start, "yyyy-MM-dd");
							$scope.list[i].end = $filter('date')($scope.list[i].end, "yyyy-MM-dd");
							$scope.list[i].criticalDate = $filter('date')(new Date($scope.list[i].criticalDate), "yyyy-MM-dd");

							if ($scope.list[i].status === "No Request") {
								$scope.list[i].opportunitieStart = $filter('date')(new Date($scope.list[i].opportunitieStart), "yyyy-MM-dd");
								$scope.list[i].opportunitieEnd = $filter('date')(new Date($scope.list[i].opportunitieEnd), "yyyy-MM-dd");
							}
						}
						$scope.nextBackCheck === true
						$scope.eventCopy = angular.copy($scope.list);
						$scope.reloadDataCalendar();						
					});

					$scope.$on("updateListCalendarNextPrev",function (event,args) {
						$scope.list = angular.copy(args.data);
						for (var i = 0; i < $scope.list.length; i++) {
							$scope.list[i].start = new Date($scope.list[i].start);
							$scope.list[i].end = new Date($scope.list[i].start);
							$scope.list[i].end.setDate($scope.list[i].start.getDate()+1); 

							$scope.list[i].start = $filter('date')($scope.list[i].start, "yyyy-MM-dd");
							$scope.list[i].end = $filter('date')($scope.list[i].end, "yyyy-MM-dd");
							$scope.list[i].criticalDate = $filter('date')(new Date($scope.list[i].criticalDate), "yyyy-MM-dd");

							if ($scope.list[i].status === "No Request") {
								$scope.list[i].opportunitieStart = $filter('date')(new Date($scope.list[i].opportunitieStart), "yyyy-MM-dd");
								$scope.list[i].opportunitieEnd = $filter('date')(new Date($scope.list[i].opportunitieEnd), "yyyy-MM-dd");
							}
						}
						$scope.nextBackCheck === true
						$scope.eventCopy = angular.copy($scope.list);
						$scope.reloadDataCalendarNextPrev();						
					});

					//click Detail Item Click
					$scope.$on("clickDetailCriticalItem",function (event,args) {
						if (args.data.selected) {
							$scope.calEventsExt.events.splice(0,$scope.calEventsExt.events.length);
							if (args.data.status === "Request") {
								$scope.calEventsExt.events.push({
									title: args.data.title, 
									start: args.data.start,
									end: args.data.criticalDate,
									criticalDate: args.data.criticalDate,
									status: args.data.status,
									opportunitieStart: args.data.opportunitieStart, 
									opportunitieEnd: args.data.opportunitieEnd,
									saving: args.data.saving,
									category: args.data.category,
									quarter:args.data.quarter
								});
								setTimeout(function() {
									$(".event-box").addClass('critical-after')
									$(".event-box").eq(1).addClass('inline-title-calendar');
									$(".event-box").eq(0).addClass('hide-icon');
									$(".name-company").removeClass('truncate');
								}, 10);
							}else {
								$scope.calEventsExt.events.push(
									{
										title: args.data.title, 
										start: args.data.start,
										end: args.data.criticalDate,
										criticalDate: args.data.criticalDate,
										status: args.data.status,
										opportunitieStart: args.data.opportunitieStart, 
										opportunitieEnd: args.data.opportunitieEnd,
										saving: args.data.saving,
										category: args.data.category,
										quarter:args.data.quarter
									},
									{
										title: args.data.title, 
										start: args.data.opportunitieStart,
										end: args.data.opportunitieEnd,
										criticalDate: args.data.criticalDate,
										status: args.data.status,
										opportunitieStart: args.data.opportunitieStart, 
										opportunitieEnd: args.data.opportunitieEnd,
										saving: args.data.saving,
										category: args.data.category,
										quarter:args.data.quarter
									}
								);
								setTimeout(function() {
									$(".event-box").eq(0).addClass('hide-icon');
									$(".event-box").eq(0).addClass('no-opportunitie-active');
									$(".event-box").eq(1).addClass('no-opportunitie-active');
									$(".event-box").eq(2).addClass('opportunitie-active');
									$(".event-box").eq(1).addClass('hide-icon');
									$(".event-box").eq(1).addClass('inline-title-calendar');
									$(".name-company").removeClass('truncate');
								}, 10);
							}
							//add  time
							$scope.nextBackCheck = args.data.selected;
							$scope.reRenderCalendar();
						}else{
							$scope.reloadDataCalendar();
						}
					});
				},
				link: function(scope, el, attr) {
					$(".dark-overlay-d.calendar-ver").click(function (e) {
						$(".dark-overlay-d").addClass('ng-hide');
						$(".tooltip-payment-mobi-ver.green-ver").addClass('ng-hide');
						$(".tooltip-payment-mobi-ver.blue-ver").addClass('ng-hide');
						$(".tooltip-payment-mobi-ver.vendor-ver").addClass('ng-hide');
						scope.nextBackCheck = true;
					})

					$(".dark-overlay").click(function (e) {
						$(".dark-overlay").addClass('ng-hide');
						$(".tooltip-payment-mobi-ver.green-ver").addClass('ng-hide');
						$(".tooltip-payment-mobi-ver.blue-ver").addClass('ng-hide');
						$(".tooltip-payment-mobi-ver.vendor-ver").addClass('ng-hide');
						scope.nextBackCheck = true;
					})

					//click body
					$(".quarter-box span").click(function (e) {
						e.stopPropagation();
					});

					$("body").click(function () {
						$('.quarter-tooltip').addClass('hide');
						$('.opportunities-tooltip').addClass('hide');
						$('.flyout-vendors').addClass('hide');
					});
				}
		}
	}

	//radius chart
	function radiusChart() {
	   return {
		   restrict: 'A',
		   scope: {
			   dataRadius: "=radiusChart",
			   typeChart:"@",
			   idChart:"@"
		   },
		   templateUrl: 'app/blocks/radius-chart.html',
		   controller: function($scope,$filter){
		   },
		   link: function(scope, el, attr) {
				var dataPercent = scope.dataRadius.radiusBig;
				var dataColor = scope.dataRadius.rangeColor;
				var dataRadius = 155;
				var inboundRadius = 30;
				scope.checkText = false;
				scope.checkNonText = false;

				// total value
				scope.totalValueRadiusText = scope.dataRadius.total;

				if (scope.typeChart==="desktop") {
					dataRadius = 89;
					inboundRadius = 15;
					scope.checkText =false;
					scope.checkNonText = false;
				}
				if (scope.typeChart==="mobile") {
					dataRadius = 95;
					inboundRadius = 17;
					scope.checkText  = true;
					scope.checkNonText = true;
				}
				if (scope.typeChart==="small") {
					dataRadius = 70;
					inboundRadius = 13;
					scope.checkText  = true;
					scope.checkNonText = false;
				}
				

				var width = dataRadius,
					height = dataRadius,
					radius = Math.min(width, height) / 2;

				var pie = d3.layout.pie()
					.value(function(d) { return d.valueRadius; })
					.sort(null);

				var arc = d3.svg.arc()
					.innerRadius(radius - inboundRadius)
					.outerRadius(radius - 0);

				var svg = d3.select("#" + el[0].id + " " + ".main-radius .box-radius-big").append("svg")
					.attr("width", width)
					.attr("height", height)
					.append("g")
					.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

				var color = d3.scale.category20()
					.range(dataColor);

				var path = svg.datum(dataPercent).selectAll("path")
					.data(pie)
					.enter().append("path")
					.attr("fill", function(d, i) { return color(i); })
					.attr("d", arc);
		   }
	   }
	}

});
