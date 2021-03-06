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
	 	leaflet.slideshow = slideshow,
	 	slideshow.sequence;

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
	 		$('.dynamicLevel').hide();
	 		$('.dynamicLevel.show').show();
	 		//Checking If Local Storage Exists, Allowing Free Navigation If Not
	 		typeof (Storage) !== "undefined" ? slideshow.first = localStorage.getItem("first") : slideshow.first = true;
	 		//If Local Storage Exists and slideshow.first Has Been Set to Null, First Visit is True
	 		slideshow.first === null ? slideshow.first = true : slideshow.first = false;
	 		//Show Nav Depending on First or Return User
	 		slideshow.showInfo('IDENTIFY');
	 		d3.select('#IDENTIFY').attr('class', 'eciArc selected');
	 		leaflet.state = leaflet.initial;
	 		slideshow.displayLeaflet();
	 		$('.ps-scrollbar-y').css("height", "112px");
		};

		slideshow.complete = function () {
			//Save That User Has Completed Interactive
			localStorage.setItem("first", "false");
			slideshow.first = localStorage.getItem("first");
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
			//If Second Slide
			if (slideshow.index === 1) {
	 			 leaflet.setState(leaflet.initial);
	 		};
			//If Second Slide & First Visit, Show TSP Modal
			if (slideshow.index === 1 && slideshow.first === true) {
				setTimeout(function () {
					$('.tspModal').fadeIn();
					$('.mask').fadeIn();
				}, 1500);
			};
			//If Third Slide & First Visit, Show eci Modal
			if (slideshow.index === 2 && slideshow.first === true) {
				setTimeout(function () {
					$('.eciModal').fadeIn();
					$('.mask').fadeIn();
				}, 1500);
			};
			//Set Slideshow Complete Storage Variable
			if (slideshow.index === 3) {
				leaflet.setState(leaflet.last);
				slideshow.complete();
				slideshow.clearSequence();
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
			$('.eciModal').fadeOut();
			$('.siModal').fadeOut();
			$('.tspModal').fadeOut();
			slideshow.index--;
			if (slideshow.index === 2) {
				leaflet.setState(leaflet.done);
			};
	 	};
	 	//To Home
	 	slideshow.home = function () {
	 		localStorage.removeItem("first");
	 		slideshow.first = true;
	 		$('.active').removeClass('active');
	 		$('.slide:eq(0)').addClass('active');
	 		$('#interactiveWrapper').scrollTo($('.slide.active'), 600);
	 		var position = $('.slide.active').position();
			styleElem({selector: ".mask", attr: "left", value: position.left});
	 		slideshow.index = 0;
	 		leaflet.setState(slideshow.leaflet.first);
	 		slideshow.showInfo('IDENTIFY');
	 		d3.select('#IDENTIFY').attr('class', 'eciArc selected');
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
	 		slideshow.index !== 0 ? leaflet.show() : leaflet.hide();
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
	 	slideshow.showContext = function (context) {
	 		d3.selectAll('.eciHead.selected').attr('class', 'eciHead');
	 		$('.info').fadeOut();
	 		$('.context').fadeOut();
	 		$('.context-bg').fadeIn();
	 		d3.selectAll('.eciHead').attr('class', 'eciHead');
	 		d3.select('#RING').attr('class', 'hover');
	 		d3.select('#' + context).attr('class', 'hover eciHead');
	 		$('.' + context + '.context').fadeIn();
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
	 	slideshow.toContext = function (context) {
	 		$('.context').fadeOut();
	 		$('.' + context).fadeIn();
	 		d3.selectAll('.eciHead').attr('class', 'eciHead');
	 		d3.select('#RING').attr('class', 'hover');
	 		d3.select('#' + context).attr('class', 'hover eciHead');
	 	};
	 	//Arrow Highlighting Sequence
	 	slideshow.highlightArrows = function (number) {
	 		var i = 1;
		 		slideshow.sequence = setInterval(function () {
		 			d3.selectAll('.arrow').transition().duration(600).ease("easeOutCirc").attr("fill", "#9B3B47");
		 			d3.selectAll('.arrowCircle').transition().duration(600).ease("easeOutCirc").attr("fill", "#FFFFFF");
		 			d3.select('#a' + i).transition().duration(600).ease("easeOutCirc").attr("fill", "#FFFFFF");
		 			d3.select('#aC' + i).transition().duration(600).ease("easeOutCirc").attr("fill", "#9B3B47");
		 			i === (number + 1) ? slideshow.clearSequence() : i = i;
		 			i++;
	 			}, 1000);
	 	};
	 	slideshow.clearSequence = function () {
	 		clearInterval(slideshow.sequence);
	 		d3.selectAll('.arrow').transition().duration(600).ease("easeOutCirc").attr("fill", "#9B3B47");
	 		d3.selectAll('.arrowCircle').transition().duration(600).ease("easeOutCirc").attr("fill", "#FFFFFF");
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

	 	//Leaflet State Objects
	 	leaflet.first = {
	 		name: "first",
	 		animations: [
	 			{selector: ".leaflet", attr: "left", value: "0px", duration: 600},
		 		{selector: "#leafletWrapper", attr: "width", value: "50px", duration: 600},
		 		{selector: '.tspStem', attr: "background-color", value: "#9a3b47"},
		 		{selector: ".tspStem", attr: "left", value: "-275px", duration: 600},
		 		{selector: ".sliding", attr: "left", value: "-550px", duration: 600},
		 		{selector: ".tspLeaf", attr: "left", value: "0px", duration: 600},
		 		{selector: ".siStem", attr: "left", value: "225px", duration: 600},
		 		{selector: ".siLeaf", attr: "left", value: "49px", duration: 600},
		 		{selector: ".siLeaf .slider", attr: "left", value: "0px", duration: 600},
		 		{selector: ".eciStem", attr: "left" , value: "175px", duration: 600}
		 	]
		};
	 	leaflet.initial = {
	 		name: "initial",
	 		animations: [
	 			{selector: ".leaflet", attr: "left", value: "0px", duration: 600},
		 		{selector: "#leafletWrapper", attr: "width", value: "50px", duration: 600},
		 		{selector: '.tspStem', attr: "background-color", value: "#9a3b47"},
		 		{selector: ".tspStem", attr: "left", value: "-275px", duration: 600},
		 		{selector: ".sliding", attr: "left", value: "-550px", duration: 600},
		 		{selector: ".tspLeaf", attr: "left", value: "0px", duration: 600},
		 		{selector: ".siStem", attr: "left", value: "225px", duration: 600},
		 		{selector: ".siLeaf", attr: "left", value: "49px", duration: 600},
		 		{selector: ".siLeaf .slider", attr: "left", value: "0px", duration: 600},
		 		{selector: ".eciStem", attr: "left" , value: "175px", duration: 600},
		 		{selector: '.eciStem', attr: "background-color", value: "#600922"}
		 	]
		};
	 	leaflet.tspShow = {
	 		name: "tspShow",
	 		animations: [
	 			{selector: ".leaflet", attr: "left", value: "0px", duration: 600},
		 		{selector: '#leafletWrapper', attr: "width", value: "900px", duration: 800},
		 		{selector: ".tspStem", attr: "left", value: "-275px", duration: 600},
		 		{selector: '.tspStem', attr: "background-color", value: "#600922"},
		 		{selector: '.siStem', attr: "background-color", value: "#9a3b47"},
		 		{selector: ".sliding", attr: "left", value: "50px", duration: 600},
		 		{selector: ".tspLeaf", attr: "left", value: "0px", duration: 600},
		 		{selector: ".siStem", attr: "left", value: "225px", duration: 600},
		 		{selector: ".siLeaf", attr: "left", value: "49px", duration: 600},
		 		{selector: ".siLeaf .slider", attr: "left", value: "0px", duration: 600},
		 		{selector: ".eciStem", attr: "left" , value: "175px", duration: 600},
		 		{selector: '.eciStem', attr: "background-color", value: "#600922"}
		 	]
		};
	 	leaflet.siShow = {
	 		name: "siShow",
	 		animations: [
	 			{selector: ".leaflet", attr: "left", value: "0px", duration: 600},
		 		{selector: '#leafletWrapper', attr: "width", value: "900px", duration: 600},
		 		{selector: ".tspStem", attr: "left", value: "-275px", duration: 600},
		 		{selector: '.tspStem', attr: "background-color", value: "#600922"},
		 		{selector: ".sliding", attr: "left", value: "50px", duration: 600},
		 		{selector: ".tspLeaf", attr: "left", value: "-500px", duration: 600},
		 		{selector: ".siStem", attr: "left", value: "-275px", duration: 600},
		 		{selector: '.siStem', attr: "background-color", value: "#600922"},
		 		{selector: ".siLeaf", attr: "left", value: "49px", duration: 600},
		 		{selector: ".siLeaf .slider", attr: "left", value: "0px", duration: 600},
		 		{selector: ".eciStem", attr: "left" , value: "175px", duration: 600},
		 		{selector: '.eciStem', attr: "background-color", value: "#600922"}
		 	]
		};
	 	leaflet.siSelect = {
	 		name: "siSelect",
	 		animations: [
	 			{selector: ".leaflet", attr: "left", value: "0px", duration: 600},
	 			{selector: '#leafletWrapper', attr: "width", value: "900px", duration: 600},
		 		{selector: ".tspStem", attr: "left", value: "-275px", duration: 600},
		 		{selector: '.tspStem', attr: "background-color", value: "#600922"},
		 		{selector: ".sliding", attr: "left", value: "50px", duration: 600},
		 		{selector: ".tspLeaf", attr: "left", value: "-500px", duration: 600},
		 		{selector: ".siStem", attr: "left", value: "-275px", duration: 600},
		 		{selector: '.siStem', attr: "background-color", value: "#600922"},
		 		{selector: ".siLeaf", attr: "left", value: "49px", duration: 600},
		 		{selector: ".siLeaf .slider", attr: "left", value: "-500px", duration: 600},
		 		{selector: ".eciStem", attr: "left", value: "175px", duration: 600},
		 		{selector: '.eciStem', attr: "background-color", value: "#600922"}
	 		]
	 	};
	 	leaflet.engage = {
	 		name: "engage",
	 		animations: [
	 			{selector: ".leaflet", attr: "left", value: "0px", duration: 600},
	 			{selector: '#leafletWrapper', attr: "width", value: "900px", duration: 600},
		 		{selector: ".tspStem", attr: "left", value: "-275px", duration: 600},
		 		{selector: '.tspStem', attr: "background-color", value: "#600922"},
		 		{selector: ".sliding", attr: "left", value: "50px", duration: 600},
		 		{selector: ".tspLeaf", attr: "left", value: "-500px", duration: 600},
		 		{selector: ".siStem", attr: "left", value: "-275px", duration: 600},
		 		{selector: '.siStem', attr: "background-color", value: "#6005922"},
		 		{selector: ".siLeaf", attr: "left", value: "49px", duration: 600},
		 		{selector: ".siLeaf .slider", attr: "left", value: "-500px", duration: 600},
		 		{selector: '.eciStem', attr: "background-color", value: "#9a3b47"},
		 		{selector: ".eciStem", attr: "left", value: "273px", duration: 600}
	 		]
	 	};
	 	leaflet.done = {
	 		name: "done",
	 		animations: [
	 			{selector: ".leaflet", attr: "left", value: "0px", duration: 600},
		 		{selector: '#leafletWrapper', attr: "width", value: "100px", duration: 800},
		 		{selector: ".tspStem", attr: "left", value: "-275px", duration: 600},
		 		{selector: '.tspStem', attr: "background-color", value: "#600922"},
		 		{selector: ".sliding", attr: "left", value: "50px", duration: 600},
		 		{selector: ".tspLeaf", attr: "left", value: "-500px", duration: 600},
		 		{selector: ".siStem", attr: "left", value: "-275px", duration: 600},
		 		{selector: '.siStem', attr: "background-color", value: "#600922"},
		 		{selector: ".siLeaf", attr: "left", value: "-452px", duration: 600},
		 		{selector: ".siLeaf .slider", attr: "left", value: "0px", duration: 600},
		 		{selector: ".eciStem", attr: "left", value: "-275px", duration: 600},
		 		{selector: '.eciStem', attr: "background-color", value: "#600922"}
		 	]
		};
		leaflet.last = {
			name: "last",
			animations: [
				{selector: ".leaflet", attr: "left", value: "0px", duration: 600},
		 		{selector: '#leafletWrapper', attr: "width", value: "150px", duration: 800},
		 		{selector: ".tspStem", attr: "left", value: "-275px", duration: 600},
		 		{selector: '.tspStem', attr: "background-color", value: "#600922"},
		 		{selector: ".sliding", attr: "left", value: "50px", duration: 600},
		 		{selector: ".tspLeaf", attr: "left", value: "-500px", duration: 600},
		 		{selector: ".siStem", attr: "left", value: "-275px", duration: 600},
		 		{selector: '.siStem', attr: "background-color", value: "#600922"},
		 		{selector: ".siLeaf", attr: "left", value: "-449px", duration: 600},
		 		{selector: ".siLeaf .slider", attr: "left", value: "-1000px", duration: 600},
		 		{selector: '.eciStem', attr: "left", value: "-225px", duration: 600},
		 		{selector: '.eciStem', attr: "background-color", value: "#600922"}
			]
		};

	/**
	 *	Leaflet Methods
	 **/

	 	//Binds Leaflet Event Handlers
		leaflet.init = function () {
	 		leaflet.position();
		};
		//Set Leaflet Position
	 	leaflet.position = function () {
	 		var left = $('#interactiveWrapper').offset().left;
	 		$('#leafletWrapper').css("left", left + "px");
	 	};
	 	//Show Leaflet
	 	leaflet.show = function () {
	 		$('.leaflet').stop().fadeIn(600);
	 	};
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
	 		var animations = state.animations
	 		for (var i = 0; i < animations.length; i++) {
	 			if (animations[i].hasOwnProperty("duration")) {
	 				animElem({selector: animations[i].selector, attr: animations[i].attr, value: animations[i].value, duration: animations[i].duration});
	 			}
	 			else {
	 				styleElem({selector: animations[i].selector, attr: animations[i].attr, value: animations[i].value});
	 			};
	 		};
	 		leaflet.state = state;
	 		return leaflet.state;
	 	};
	 	leaflet.clearHeaders = function () {
	 		$('.siLevels .header').removeClass("selected");
			$('.siDimensions .header').removeClass("selected");
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
			$('.mask').hide();
		});
		//Navigation - To Home
		$('.icon.home').on("click", function () {
			interactive.home();
			interactive.leaflet.hide();
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
		$('#CONTEXTS_button, #STATEPOLICY_button, #COMMUNITY_button, #HIGHEREDUCATION_button, #LOCALPOLICY_button').on("mouseover", function (e) {
			if (interactive.contextsActive === false) {
				var target = (e.currentTarget.id).split("_")[0];
				d3.select('#RING').attr("class", "hover");
				d3.select('#' + target).attr("class", "hover eciHead");
			}
		});
		//Contexts Button Hover Out
		$('#CONTEXTS_button, #STATEPOLICY_button, #COMMUNITY_button, #HIGHEREDUCATION_button, #LOCALPOLICY_button').on("mouseout", function (e) {
			if (interactive.contextsActive === false) {
				var target = (e.currentTarget.id).split("_")[0];
				d3.select('#RING').attr("class", "");
				d3.select('#' + target).attr("class", "eciHead");
			}
		});
		//Contexts Button Click
		$('#CONTEXTS_button, #STATEPOLICY_button, #COMMUNITY_button, #HIGHEREDUCATION_button, #LOCALPOLICY_button').on("click", function (e) {
			var target = (e.currentTarget.id).split("_")[0];
			interactive.contextsActive = true;
			interactive.showContext(target);
		});
		//Contexts Next/Previous
		$('.n, .p').on("click", function (e) {
			var data = $(this).data().context;
			interactive.toContext(data);
		});
		//Dismiss eci Modal
		$('.eciModal .dismissModal').on("click", function () {
			$('.mask').fadeOut();
			$('.eciModal').fadeOut();
			interactive.highlightArrows(6);
		});
		//Dismiss si Modal
		$('.siModal .dismissModal').on("click", function () {
			$('.mask').fadeOut();
			$('.siModal').fadeOut();
		});
		//Dismiss TSP Modal
		$('.tspModal .dismissModal').on("click", function () {
			$('.tspModal').fadeOut();
			$('.leaflet').fadeIn();
			leaflet.setState(leaflet.tspShow);
		});
		//Open SI Leaflet
		$('.s2-img5, .s2-img6, .s2-img7, .s2-img8, .s2-img9, .s2-img10').on("click", function () {
			leaflet.clearHeaders();
			leaflet.setState(leaflet.siSelect);
		});

/**
 *	Leaflet Event Bindings
 **/

	 	//TSP Stem Click
		$('.tspStem').on("click", function () {
			(leaflet.active === false) ? leaflet.active = true : void(0);
			$('.tspModal').fadeOut();
			$('.siModal').fadeOut();
			$('.eciModal').fadeOut();
			$('.third').removeClass('selected');
			(leaflet.state.name === 'tspShow') ? 
				(leaflet.setState(leaflet.initial), $('.mask').fadeOut()) : (leaflet.state.name === "done") ? 
					(leaflet.setState(leaflet.tspShow), $('.mask').fadeIn()) : (leaflet.setState(leaflet.tspShow), $('.mask').fadeIn());
			leaflet.level(null);
			leaflet.dimension(null);
		});
		//TSP Next Button Click
		$('.tspNext').on("click", function () {
			leaflet.setState(leaflet.siShow);
		});
		//SI Stem Click
		$('.siStem').on("click", function () {
			if (leaflet.state.name === "done") {
				leaflet.setState(leaflet.engage);
				$('.mask').fadeIn();
			} else if (leaflet.state.name === "siSelect") {
				leaflet.setState(leaflet.siShow);
			} else if (leaflet.state.name === "siShow") {
				leaflet.setState(leaflet.siSelect);
			} else if (leaflet.state.name === "last") {
				leaflet.setState(leaflet.siSelect);
			} else {
				leaflet.setState(leaflet.done);
				$('.mask').fadeOut();
			};
		});
		//SI Next Button Click
		$('.siNext .button').on("click", function () {
			leaflet.clearHeaders();
			leaflet.setState(leaflet.siSelect);
			if (interactive.first === true) {
				setTimeout(function () {
					$('.siModal').fadeIn();
				}, 1500)
			};
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
			$('.siDimensions .header').addClass("selected");
			$(this).addClass('selected');
			var data = $(this).data().dimension;
			leaflet.dimension(data);
			if ($('.' + data + '.dynamicLevel').hasClass('show')) {
				return;
			} else {
				$('.dynamicLevel').hide();
				$('.third.level.selected').removeClass('selected');
				$('.dynamicLevel').removeClass('show');
				$('.siLevels .header').removeClass("selected");
				$('.' + data + '.dynamicLevel').addClass('show');
				$('.dynamicLevel.show').show();
				leaflet.level(null);
				leaflet.setState(leaflet.siSelect)				
			};
		});
		//SI - Select Level
		$('.third.level').on("click", function (e) {
			$('.third.level.selected').removeClass('selected');
			$('.siLevels .header').addClass("selected");
			$(this).addClass('selected');
			var data = $(this).data().level;
			leaflet.level(data);
			(leaflet.dimension() !== null && leaflet.level !== null) ? leaflet.setState(leaflet.engage) : leaflet.setState(leaflet.siSelect);
		});
});