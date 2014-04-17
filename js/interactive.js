$(document).ready(function () {
	
/*
Global Functions
*/

//General Animation Method
var animElem = function (options) {
	var selector = options.selector,
		duration = options.duration,
	animation = {};
		animation[options.attr] = options.value;
		return $(selector).stop().animate(animation, duration);
};
//General Styling Method
var styleElem = function (options) {
	var selector = options.selector,
	style = {};
		style[options.attr] = options.value;
		return $(selector).css(style);
};

/**
 *	Slideshow
 **/

var Slideshow = function (leaflet) {
 	var slideshow = this;
	 	slideshow.index = 0,
	 	slideshow.engage = ko.observable(false),
	 	slideshow.first = true,
	 	slideshow.contextsActive = false,
	 	slideshow.leaflet = leaflet,
	 	leaflet.slideshow = slideshow;

	/**
	 *	Slideshow Init
	 **/

	 	//Binds Event Handlers and Sets Slideshow
	 	slideshow.init = function () {
	 		//Intializing Leaflet
	 		slideshow.leaflet.init();
	 		//Handles Dynamic Positioning of Leaflet
	 		$(window).resize(function () {
	 			leaflet.position();
	 		});
	 		//Setting First Slide to Active
	 		$('.slide').first().addClass('active');
	 		//Checking If Local Storage Exists, Allowing Free Navigation If Not
	 		typeof (Storage) !== "undefined" ? slideshow.first = localStorage.getItem("first") : slideshow.first = false;
	 		//If Local Storage Exists and slideshow.first Has Been Set to Null, First Visit is True
	 		slideshow.first === null ? slideshow.first = true : slideshow.first = false;
	 		//Show Nav Depending on First or Return User
	 		slideshow.showNav();
		};

		slideshow.complete = function () {
			//Save That User Has Completed Interactive
			localStorage.setItem("first", "false");
		};

	/**
	 *	Slidshow Methods
	 **/

	 	//Next Slide
	 	slideshow.next = function () {
			$('.active').removeClass('active').next('.slide').addClass('active');
			$('#interactiveWrapper').scrollTo($('.slide.active'), 600);
			var position = $('.slide.active').position();
			styleElem({selector: ".mask", attr: "left", value: position.left});
			slideshow.index++;
			//If Second Slide & First Visit, Show TSP Modal
			if (slideshow.index === 1 && slideshow.first === true) {
				setTimeout(function () {
					$('.tspModal').fadeIn();
					$('.mask').fadeIn();
				}, 1500);
			};
			//If Third Slide & First Visit, Show eci Modal
			if (slideshow.index === 2 && slideshow.first === true) {
				console.log("2");
				setTimeout(function () {
					$('.eciModal').fadeIn();
					$('.mask').fadeIn();
				}, 1500);
			};
			if (slideshow.index === 3) {
				slideshow.complete();
				setTimeout(function () {
					$('.nav').fadeIn();
				}, 1500)
			};
	 	};
	 	//Previous Slide
	 	slideshow.prev = function () {
			$('.active').removeClass('active').prev('.slide').addClass('active');
			$('#interactiveWrapper').scrollTo($('.slide.active'), 600);
			var position = $('.slide.active').position();
			styleElem({selector: ".mask", attr: "left", value: position.left});
			slideshow.index--;
	 	};
	 	slideshow.showNav = function () {
	 		slideshow.first == true ? $('.nav').hide() : $('.nav').show(); 
	 	};
	 	//To Home
	 	slideshow.home = function () {
	 		$('.active').removeClass('active');
	 		$('.slide:eq(0)').addClass('active');
	 		$('#interactiveWrapper').scrollTo($('.slide.active'), 600);
	 		var position = $('.slide.active').position();
			styleElem({selector: ".mask", attr: "left", value: position.left});
	 		slideshow.index = 0;
	 		leaflet.setState(slideshow.leaflet.initial);
	 	};
	 	//To Cycle
	 	slideshow.cycle = function () {
	 		$('.active').removeClass('active');
	 		$('.slide:eq(2)').addClass('active');
	 		$('#interactiveWrapper').scrollTo($('.slide.active'), 600);
	 		var position = $('.slide.active').position();
			styleElem({selector: ".mask", attr: "left", value: position.left});
	 		slideshow.index = 2;
	 		if (slideshow.first === true) {
				setTimeout(function () {
					$('.eciModal').fadeIn();
					$('.mask').fadeIn();
				}, 1500);
			};

	 	};
	 	//Manages Hiding and Showing of Leaflet
	 	slideshow.displayLeaflet = function () {
	 		slideshow.index > 0 ? slideshow.leaflet.show() : slideshow.leaflet.hide();
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
	 	//Show Info
	 	slideshow.showInfo = function (id) {
	 		d3.selectAll('.eciArc.selected').attr('class', 'eciArc');
	 		$('.info').fadeOut();
	 		$('.' + id + '.info').fadeIn();
	 	};
	 	//Show Context
	 	slideshow.showContext = function (id) {
	 		d3.selectAll('.eciHead.selected').attr('class', 'eciHead');
	 		$('.info').fadeOut();
	 		$('.context').fadeOut();
	 		$('.context-bg').fadeIn();
	 		d3.select('#RING').attr('class', 'hover');
	 		$('.' + id + '.context').fadeIn();
	 	};
	 	//Exit Context
	 	slideshow.exitContext = function () {
	 		d3.selectAll('.eciArc.selected').attr('class', 'eciArc');
	 		d3.selectAll('.eciHead').attr('class', 'eciHead');
	 		d3.select('#RING').attr('class', '');
	 		$('.context-bg').fadeOut();
	 		$('.context').fadeOut();
	 		$('.info').fadeOut();
	 		slideshow.contextsActive = false;
	 	};
	 	//Navigat Contexts
	 	slideshow.toContext = function (element) {
	 		var target = element.dataset.to;
	 		$('.context').fadeOut();
	 		$('.' + target).fadeIn();
	 		d3.selectAll('.eciHead').attr('class', 'eciHead');
	 		d3.select('#RING').attr('class', 'hover');
	 		d3.select('#' + target).attr('class', 'hover eciHead');
	 	};
	};

/**
 *	Leaflet Class
 **/

var Leaflet = function () {
	var leaflet = this;
		leaflet.active = false,
		leaflet.dimension = ko.observable(null),
	 	leaflet.level = ko.observable(null);

	 	//Leaflet State Arrays
	 	leaflet.initial = [
	 		{selector: "#leafletWrapper", attr: "width", value: "50px", duration: 600},
	 		{selector: '.tspStem', attr: "background-color", value: "#9a3b47"},
	 		{selector: ".tspStem", attr: "left", value: "-275px", duration: 600},
	 		{selector: ".sliding", attr: "left", value: "-550px", duration: 600},
	 		{selector: ".tspLeaf", attr: "left", value: "0px", duration: 600},
	 		{selector: ".siStem", attr: "left", value: "225px", duration: 600},
	 		{selector: ".siLeaf", attr: "left", value: "49px", duration: 600},
	 		{selector: ".siLeaf .slider", attr: "left", value: "0px", duration: 600},
	 		{selector: ".eciStem", attr: "left" , value: "175px", duration: 600}
	 	];
	 	leaflet.tspShow = [
	 		{selector: '#leafletWrapper', attr: "width", value: "900px", duration: 800},
	 		{selector: ".tspStem", attr: "left", value: "-275px", duration: 600},
	 		{selector: '.tspStem', attr: "background-color", value: "#600922"},
	 		{selector: '.siStem', attr: "background-color", value: "#9a3b47"},
	 		{selector: ".sliding", attr: "left", value: "50px", duration: 600},
	 		{selector: ".tspLeaf", attr: "left", value: "0px", duration: 600},
	 		{selector: ".siStem", attr: "left", value: "225px", duration: 600},
	 		{selector: ".siLeaf", attr: "left", value: "49px", duration: 600},
	 		{selector: ".siLeaf .slider", attr: "left", value: "0px", duration: 600},
	 		{selector: ".eciStem", attr: "left" , value: "175px", duration: 600}
	 	];
	 	leaflet.siShow = [
	 		{selector: '#leafletWrapper', attr: "width", value: "900px", duration: 600},
	 		{selector: ".tspStem", attr: "left", value: "-275px", duration: 600},
	 		{selector: '.tspStem', attr: "background-color", value: "#600922"},
	 		{selector: ".sliding", attr: "left", value: "50px", duration: 600},
	 		{selector: ".tspLeaf", attr: "left", value: "-500px", duration: 600},
	 		{selector: ".siStem", attr: "left", value: "-275px", duration: 600},
	 		{selector: '.siStem', attr: "background-color", value: "#600922"},
	 		{selector: ".siLeaf", attr: "left", value: "49px", duration: 600},
	 		{selector: ".siLeaf .slider", attr: "left", value: "0px", duration: 600},
	 		{selector: ".eciStem", attr: "left" , value: "175px", duration: 600}
	 	];
	 	leaflet.siSelect = [
	 		{selector: '#leafletWrapper', attr: "width", value: "900px", duration: 600},
	 		{selector: ".tspStem", attr: "left", value: "-275px", duration: 600},
	 		{selector: '.tspStem', attr: "background-color", value: "#600922"},
	 		{selector: ".sliding", attr: "left", value: "50px", duration: 600},
	 		{selector: ".tspLeaf", attr: "left", value: "-500px", duration: 600},
	 		{selector: ".siStem", attr: "left", value: "-275px", duration: 600},
	 		{selector: '.siStem', attr: "background-color", value: "#600922"},
	 		{selector: ".siLeaf", attr: "left", value: "49px", duration: 600},
	 		{selector: ".siLeaf .slider", attr: "left", value: "-500px", duration: 600},
	 		{selector: ".eciStem", attr: "left", value: "275px", duration: 600}
	 	];
	 	leaflet.done = [
	 		{selector: '#leafletWrapper', attr: "width", value: "100px", duration: 800},
	 		{selector: ".tspStem", attr: "left", value: "-275px", duration: 600},
	 		{selector: '.tspStem', attr: "background-color", value: "#600922"},
	 		{selector: ".sliding", attr: "left", value: "50px", duration: 600},
	 		{selector: ".tspLeaf", attr: "left", value: "-500px", duration: 600},
	 		{selector: ".siStem", attr: "left", value: "-275px", duration: 600},
	 		{selector: '.siStem', attr: "background-color", value: "#600922"},
	 		{selector: ".siLeaf", attr: "left", value: "-452px", duration: 600},
	 		{selector: ".siLeaf .slider", attr: "left", value: "0px", duration: 600},
	 		{selector: ".eciStem", attr: "left", value: "-275px", duration: 600}
	 	];

	 	leaflet.state = leaflet.initial;

	/**
	 *	Leaflet Methods
	 **/

	 	//Binds Leaflet Event Handlers
		leaflet.init = function () {
	 		leaflet.position();
		};
		//Set Leaflet Position
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
	 	};
	 	//Toggle Leaflet
	 	leaflet.toggle = function () {
	 		leaflet.active === false ? leaflet.slideOut() : leaflet.slideIn();
	 	};
	 	//Slide Out Leaflet Contents
	 	leaflet.slideOut = function () {
	 		leaflet.setState(leaflet.state);
	 		//Show Mask & Set Nav z-index
	 		styleElem({selector: ".nav", attr: "z-index", value: 9999});
	 		$('.mask').fadeIn();
	 		leaflet.active = true;
	 	};
	 	//Slide In Leaflet Contents
	 	leaflet.slideIn = function () {
	 		animElem({selector: '#leafletWrapper', attr: "width", value: "50px", duration: 800});
	 		styleElem({selector: '.tspStem', attr: "background-color", value: "#9a3b47"});
	 		animElem({selector: ".sliding", attr: "left", value: "-550px", duration: 600});
	 		styleElem({selector: ".nav", attr: "z-index", value: 10});
	 		$('.mask').fadeOut();
	 		leaflet.level(null);
			leaflet.dimension(null);
	 		leaflet.active = false;
	 	};
	 	//Loops Throught State Object and Styles Or Animates to State
	 	leaflet.setState = function (state) {
	 		leaflet.state = state;
	 		for (var i = 0; i < state.length; i++) {
	 			if (state[i].hasOwnProperty("duration")) {
	 				animElem({selector: state[i].selector, attr: state[i].attr, value: state[i].value, duration: state[i].duration});
	 			}
	 			else {
	 				styleElem({selector: state[i].selector, attr: state[i].attr, value: state[i].value});
	 			}
	 		};
	 	};
	 	leaflet.resetPosition = function () {

	 	};
	};

/**
 *	Intialize Slideshow
 **/

	var leaflet = new Leaflet();
	var interactive = new Slideshow(leaflet);
		interactive.init();
		ko.applyBindings(interactive);

	/**
	 *	Slideshow Event Bindings
	 **/

	 	//Next Slide
		$('.next').on("click", function () {
			interactive.next();
			interactive.displayLeaflet();
		});
		//Previous Slide
		$('.previous').on("click", function () {
			interactive.prev();
			interactive.displayLeaflet();
		});
		//Navigation - To Home
		$('.icon.home').on("click", function () {
			interactive.home();
			interactive.displayLeaflet();
			interactive.leaflet.active === true ? interactive.leaflet.toggle() : false;
			leaflet.level(null);
			leaflet.dimension(null);
			$('.third').removeClass('selected');
		});
		//Navigation - To eci
		$('.icon.cycle').on("click", function () {
			interactive.cycle();
			interactive.displayLeaflet();
			interactive.leaflet.active === true ? interactive.leaflet.toggle() : false;
		});
		//Select eci Arc
		$('.eciArc').on("click", function (e) {
			interactive.showInfo(e.currentTarget.id);
			d3.select(this).attr('class', 'eciArc selected');
		});
		//Exit eci Context
		$('.context .infoExit').on("click", function () {
			interactive.exitContext();
			interactive.contextsActive = false;
		});
		//Contexts Button Hover Over
		$('#CONTEXTS_button').on("mouseover", function () {
			if (interactive.contextsActive === false) {
				d3.select('#RING').attr("class", "hover");
				d3.select('#CONTEXTS').attr("class", "hover eciHead");
			}
		});
		//Contexts Button Hover Out
		$('#CONTEXTS_button').on("mouseout", function () {
			if (interactive.contextsActive === false) {
				d3.select('#RING').attr("class", "");
				d3.select('#CONTEXTS').attr("class", "eciHead");
			}
		});
		//Contexts Button Click
		$('#CONTEXTS_button').on("click", function () {
			interactive.contextsActive = true;
			interactive.showContext("CONTEXTS");
		});
		//Contexts Next/Previous
		$('.n, .p').on("click", function (e) {
			interactive.toContext(e.currentTarget);
		});
		//Dismiss eci Modal
		$('.eciModal .dismissModal').on("click", function () {
			$('.mask').fadeOut();
			$('.eciModal').fadeOut();
		});
		//Dismiss TSP Modal
		$('.tspModal .dismissModal').on("click", function () {
			$('.tspModal').fadeOut();
			(leaflet.active === false) ? $('.mask').fadeOut() : void(0);
		});

	/**
	 *	Leaflet Event Bindings
	 **/

	 	//TSP Stem Click
		$('.tspStem').on("click", function () {
			(leaflet.active === false) ? leaflet.active = true : void(0);
			$('.tspModal').fadeOut();
			leaflet.setState(leaflet.tspShow);
			$('.third').removeClass('selected');
			leaflet.level(null);
			leaflet.dimension(null);
		});
		//TSP Next Button Click
		$('.tspNext').on("click", function () {
			leaflet.setState(leaflet.siShow);
		});
		//SI Stem Click
		$('.siStem').on("click", function () {
			leaflet.setState(leaflet.siShow);
		});
		//SI Next Button Click
		$('.siNext .button').on("click", function () {
			leaflet.setState(leaflet.siSelect);
		});
		//ECI Stem Click
		$('.eciStem').on("click", function () {
			if (leaflet.level() !== null && leaflet.dimension() !== null) {
				interactive.cycle();
				leaflet.setState(leaflet.done);
				leaflet.active = false;
				styleElem({selector: ".nav", attr: "z-index", value: 10});
				$('.mask').fadeOut();
			};
		});
		//SI - Select Dimension
		$('.third.dimension').on("click", function (e) {
			$('.third.dimension.selected').removeClass('selected');
			$(this).addClass('selected');
			var data = $(this).data().dimension;
			leaflet.dimension(data);
			if ($('.' + data + '.dynamicLevel').hasClass('show')) {
				return;
			} else {
				$('.third.level.selected').removeClass('selected');
				$('.dynamicLevel').removeClass('show');
				$('.' + data + '.dynamicLevel').addClass('show');
				leaflet.level(null);
			};
		});
		//SI - Select Level
		$('.third.level').on("click", function (e) {
			$('.third.level.selected').removeClass('selected');
			$(this).addClass('selected');
			var data = $(this).data().level;
			leaflet.level(data);
		});
});