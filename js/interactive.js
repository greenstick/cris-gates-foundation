$(document).ready(function () {
	
	/**
	 *	Slideshow Class
	 **/

	var Slideshow = function (leaflet) {
	 	var slideshow = this;
		 	slideshow.index = 0,
		 	slideshow.engage = ko.observable(false),
		 	slideshow.leaflet = leaflet;
		 	leaflet.slideshow = slideshow;

		/**s
		 *	Slideshow Init
		 **/

		 	//Binds Event Handlers and Sets Slideshow
		 	slideshow.init = function () {
		 		//Intializing Leaflet
		 		slideshow.leaflet.init();
		 		//Handles Dynamic Positioning of Leaflet
		 		$(window).resize(function () {
		 			leaflet.position();
		 		})
		 		//Setting First Slide to Active
		 		$('.slide').first().addClass('active');
		 		//Binding Event Handlers
		 		$('.next').on("click", function () {
		 			slideshow.next();
		 			slideshow.displayLeaflet();
		 		})
		 		$('.previous').on("click", function () {
					slideshow.prev();
					slideshow.displayLeaflet();
				})
				$('.dismissModal').on("click", function () {
					slideshow.dismissModal();
				})
				$('.icon.home').on("click", function () {
					slideshow.home();
					slideshow.displayLeaflet();
					slideshow.leaflet.active === true ? slideshow.leaflet.toggle() : false;
				})
				$('.icon.cycle').on("click", function () {
					slideshow.cycle();
					slideshow.displayLeaflet();
					slideshow.leaflet.active === true ? slideshow.leaflet.toggle() : false;
				})
			};

		/**
		 *	Slidshow Methods
		 **/

		 	//Next Slide
		 	slideshow.next = function () {
				$('.active').removeClass('active').next('.slide').addClass('active');
				$('#interactiveWrapper').scrollTo($('.slide.active'), 600);
				slideshow.index++;
		 	};
		 	//Previous Slide
		 	slideshow.prev = function () {
				$('.active').removeClass('active').prev('.slide').addClass('active');
				$('#interactiveWrapper').scrollTo($('.slide.active'), 600);
				slideshow.index--;
		 	};
		 	slideshow.showModal = function () {
		 		$('.active .mask').stop().fadeIn();
		 		$('.active .modal').stop().fadeIn();
		 	};
		 	//Exit Modal
		 	slideshow.dismissModal = function () {
		 		$('.active .mask').fadeOut(600);
		 		$('.active .modal').fadeOut(600);
		 	};
		 	//To Home
		 	slideshow.home = function () {
		 		$('.active').removeClass('active');
		 		$('.slide:eq(0)').addClass('active');
		 		$('#interactiveWrapper').scrollTo($('.slide.active'), 600);
		 		slideshow.index = 0;
		 	};
		 	//To Cycle
		 	slideshow.cycle = function () {
		 		$('.active').removeClass('active');
		 		$('.slide:eq(2)').addClass('active');
		 		$('#interactiveWrapper').scrollTo($('.slide.active'), 600);
		 		slideshow.index = 2;
		 	};
		 	//Manages Hiding and Showing of Leaflet
		 	slideshow.displayLeaflet = function () {
		 		slideshow.index > 0 && slideshow.index != 3 ? slideshow.leaflet.show() : slideshow.leaflet.hide();
		 	};
		 	//Shows Mask Overlay
		 	slideshow.showMask = function (selector) {
		 		$(selector).stop().fadeIn(600);
		 	};
		 	//Hides Mask Overlay
		 	slideshow.hideMask = function (selector) {
		 		$(selector).stop().fadeOut(400);
		 	};
		 	//Detect Cycle Engage
		 	slideshow.detectEngage = ko.computed(function () {
		 		slideshow.engage() === true ? slideshow.next() : false;
		 	});
	};

	/**
	 *	Leaflet Class
	 **/

	var Leaflet = function () {
		var leaflet = this;
			leaflet.active = false;

		/**
		 *	Leaflet Init
		 **/

		 	//Binds Leaflet Event Handlers
			leaflet.init = function () {
		 			leaflet.position();

				$('.tspStem').on("click", function () {
					leaflet.toggle();
				});
				$('.tspNext, .siStem').on("click", function () {
					leaflet.animElem({selector: ".tspLeaf", attr: "left", value: "-500px", duration: 600});
					leaflet.animElem({selector: ".siStem", attr: "left", value: "-275px", duration: 600});
					leaflet.styleElem({selector: '.siStem', attr: "background-color", value: "#600922", duration: 600});

				});
				$('.siNext .button').on("click", function () {
					leaflet.animElem({selector: ".eciStem", attr: "left", value: "275px", duration: 600});
					leaflet.animElem({selector: ".siLeaf .slider", attr: "left", value: "-500px", duration: 600});
				});
				$('.eciStem').on("click", function () {
					$('.slide.active')
					leaflet.slideshow.next();
					leaflet.styleElem({selector: '#leafletWrapper', attr: "width", value: "100px", duration: 600});
					leaflet.animElem({selector: ".eciStem", attr: "left", value: "-275px", duration: 600});
					leaflet.animElem({selector: ".siLeaf", attr: "left", value: "-450px", duration: 600});
					leaflet.styleElem({selector: '.eciStem', attr: "background-color", value: "#600922", duration: 600});
				});
			};

		/**
		 *	Leaflet Methods
		 **/
		 	leaflet.position = function () {
		 		var left = $('#interactiveWrapper').css("margin-left");
		 		$('#leafletWrapper').css("left", left);
		 	};
		 	//Show Leaflet
		 	leaflet.show = function () {
		 		$('.leaflet').stop().fadeIn(600);
		 	}
		 	//Hide Leaflet
		 	leaflet.hide = function () {
		 		$('.leaflet').stop().fadeOut(400);
		 	}
		 	//Toggle Leaflet
		 	leaflet.toggle = function () {
		 		leaflet.active === false ? leaflet.slideOut() : leaflet.slideIn();
		 	}
		 	//Slide Out Leaflet Contents
		 	leaflet.slideOut = function () {
		 		$('.nav').stop().fadeOut(600);
		 		leaflet.styleElem({selector: '#leafletWrapper', attr: "width", value: "900px", duration: 600});
		 		leaflet.styleElem({selector: '.tspStem', attr: "background-color", value: "#600922", duration: 600});
		 		leaflet.animElem({selector: ".sliding", attr: "left", value: "50px", duration: 600});
		 		leaflet.active = true;
		 	}
		 	//Slide In Leaflet Contents
		 	leaflet.slideIn = function () {
		 		$('.nav').stop().fadeIn(600);
		 		leaflet.styleElem({selector: '#leafletWrapper', attr: "width", value: "50px", duration: 600});
		 		leaflet.styleElem({selector: '.tspStem', attr: "background-color", value: "#9a3b47", duration: 600});
		 		leaflet.animElem({selector: ".sliding", attr: "left", value: "-550px", duration: 600});
		 		leaflet.active = false;
		 	}
		 	//General Animation Parsing Method
		 	leaflet.animElem = function (options) {
		 		var selector = options.selector,
		 			duration = options.duration,
					animation = {};
		 			animation[options.attr] = options.value;
		 		return $(selector).stop().animate(animation, duration);
		 	};
		 	leaflet.styleElem = function (options) {
		 		var selector = options.selector,
		 			duration = options.duration,
					animation = {};
		 			animation[options.attr] = options.value;
		 		return $(selector).css(animation, duration);
		 	}
		 	//Show Active Stem
		 	leaflet.stemActive = function (element) {

		 	};
	};

	/**
	 *	Intialize Slideshow
	 **/

	var leaflet = new Leaflet();
	var interactive = new Slideshow(leaflet);
		interactive.init();


});