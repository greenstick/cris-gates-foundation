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
	 	slideshow.first = false,
	 	slideshow.ring = false,
	 	slideshow.contextsActive = false,
	 	slideshow.leaflet = leaflet;
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
	 		typeof (Storage) !== "undefined" ? slideshow.first = localStorage.getItem("visited") : slideshow.first = false;
	 		//If Local Storage Exists and slideshow.first Has Been Set to Null, First Visit is True
	 		slideshow.first === null ? slideshow.first = true : slideshow.first = false;
		};

		slideshow.complete = function () {
			//Save That User Has Completed Interactive
			localStorage.setItem("visited", true);
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
	 	};
	 	//Previous Slide
	 	slideshow.prev = function () {
			$('.active').removeClass('active').prev('.slide').addClass('active');
			$('#interactiveWrapper').scrollTo($('.slide.active'), 600);
			var position = $('.slide.active').position();
			styleElem({selector: ".mask", attr: "left", value: position.left});
			slideshow.index--;
	 	};
	 	// Show Modal
	 	slideshow.showModal = function (modal) {
	 		$('.mask').stop().fadeIn();
	 		$(modal).stop().fadeIn();
	 	};
	 	//Exit Modal
	 	slideshow.dismissModal = function (modal) {
	 		$('.mask').fadeOut(600);
	 		$(modal).fadeOut(600);
	 	};
	 	//To Home
	 	slideshow.home = function () {
	 		$('.active').removeClass('active');
	 		$('.slide:eq(0)').addClass('active');
	 		$('#interactiveWrapper').scrollTo($('.slide.active'), 600);
	 		var position = $('.slide.active').position();
			styleElem({selector: ".mask", attr: "left", value: position.left});
	 		slideshow.index = 0;
	 	};
	 	//To Cycle
	 	slideshow.cycle = function () {
	 		$('.active').removeClass('active');
	 		$('.slide:eq(2)').addClass('active');
	 		$('#interactiveWrapper').scrollTo($('.slide.active'), 600);
	 		var position = $('.slide.active').position();
			styleElem({selector: ".mask", attr: "left", value: position.left});
	 		slideshow.index = 2;
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
	 		d3.selectAll('.eicArc.selected').attr('class', 'eicArc');
	 		$('.info').fadeOut();
	 		$('.' + id + '.info').fadeIn();
	 	};
	 	//Show Context
	 	slideshow.showContext = function (id) {
	 		d3.selectAll('.eicHead.selected').attr('class', 'eicHead');
	 		$('.info').fadeOut();
	 		$('.context').fadeOut();
	 		$('.context-bg').fadeIn();
	 		d3.select('#RING').attr('class', 'hover');
	 		$('.' + id + '.context').fadeIn();
	 	};
	 	//Exit Context
	 	slideshow.exitContext = function () {
	 		d3.selectAll('.eicArc.selected').attr('class', 'eicArc');
	 		d3.selectAll('.eicHead.selected').attr('class', 'eicHead');
	 		d3.select('#RING').attr('class', '');
	 		slideshow.ring = false;
	 		$('.context-bg').fadeOut();
	 		$('.context').fadeOut();
	 		$('.info').fadeOut();
	 	};
	 	slideshow.toContext = function (element) {
	 		var target = element.dataset.to;
	 		$('.context').fadeOut();
	 		$('.' + target).fadeIn();
	 		d3.select('.eicHead').attr('class', 'eicHead');
	 		d3.select('#RING').attr('class', 'hover');
	 		d3.select('#' + target).attr('class', 'hover eicHead');
	 	};
	};

/**
 *	Leaflet Class
 **/

var Leaflet = function () {
	var leaflet = this;
		leaflet.active = false;

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
	 		animElem({selector: '#leafletWrapper', attr: "width", value: "900px", duration: 800});
	 		styleElem({selector: '.tspStem', attr: "background-color", value: "#600922"});
	 		animElem({selector: ".sliding", attr: "left", value: "50px", duration: 600});
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
	 		leaflet.active = false;
	 	};
	 	//Show Active Stem
	 	leaflet.stemActive = function (element) {

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

	/**
	 *	Slideshow Event Bindings
	 **/

		$('.next').on("click", function () {
			interactive.next();
			interactive.displayLeaflet();
		});
		$('.previous').on("click", function () {
			interactive.prev();
			interactive.displayLeaflet();
		});
		$('.dismissModal').on("click", function () {
			interactive.dismissModal();
		});
		$('.icon.home').on("click", function () {
			interactive.home();
			interactive.displayLeaflet();
			interactive.leaflet.active === true ? interactive.leaflet.toggle() : false;
		});
		$('.icon.cycle').on("click", function () {
			interactive.cycle();
			interactive.displayLeaflet();
			interactive.leaflet.active === true ? interactive.leaflet.toggle() : false;
		});
		$('.eicArc').on("click", function (e) {
			interactive.showInfo(e.currentTarget.id);
			d3.select(this).attr('class', 'eicArc selected');
		});
		$('.context .infoExit').on("click", function () {
			interactive.exitContext();
			interactive.contextsActive = false;
		});
		$('.eicHead').on("mouseover", function () {
			d3.select('#RING').attr('class', 'hover');
		});
		$('.eicHead').on("mouseout", function () {
			interactive.ring === false ? d3.select('#RING').attr('class', '') : void(0)
		});
		$('#CONTEXTS_button').on("mouseover", function () {
			if (interactive.contextsActive === false) {
				d3.select('#RING').attr("class", "hover");
				d3.select('#CONTEXTS').attr("class", "hover eicHead");
			}
		});
		$('#CONTEXTS_button').on("mouseout", function () {
			if (interactive.contextsActive === false) {
				d3.select('#RING').attr("class", "");
				d3.select('#CONTEXTS').attr("class", "eicHead");
			}
		});
		$('#CONTEXTS_button').on("click", function () {
			interactive.contextsActive = true;
			interactive.showContext("CONTEXTS");
		});
		$('.n, .p').on("click", function (e) {
			interactive.toContext(e.currentTarget);
		});

	/**
	 *	Leaflet Event Bindings
	 **/

		$('.tspStem').on("click", function () {
			leaflet.toggle();
		});
		$('.tspNext').on("click", function () {
			animElem({selector: ".tspLeaf", attr: "left", value: "-500px", duration: 600});
			animElem({selector: ".siStem", attr: "left", value: "-275px", duration: 600});
			styleElem({selector: '.siStem', attr: "background-color", value: "#600922"});
		});
		$('.siStem').on("click", function () {
			animElem({selector: ".tspLeaf", attr: "left", value: "-500px", duration: 600});
			animElem({selector: ".siStem", attr: "left", value: "-275px", duration: 600});
			styleElem({selector: '.siStem', attr: "background-color", value: "#600922"});
		});
		$('.siNext .button').on("click", function () {
			animElem({selector: ".eciStem", attr: "left", value: "275px", duration: 600});
			animElem({selector: ".siLeaf .slider", attr: "left", value: "-500px", duration: 600});
		});
		$('.eciStem').on("click", function () {
			leaflet.slideshow.next();
			animElem({selector: '#leafletWrapper', attr: "width", value: "100px", duration: 800});
			animElem({selector: ".siLeaf", attr: "left", value: "-452px", duration: 600});
			animElem({selector: ".eciStem", attr: "left", value: "-275px", duration: 600});
			styleElem({selector: '.eciStem', attr: "background-color", value: "#600922"});
			styleElem({selector: ".nav", attr: "z-index", value: 10});
			$('.mask').fadeOut();
		});
});