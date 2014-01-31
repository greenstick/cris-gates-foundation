$(document).ready(function () {
	
	/**
	 *	Slideshow Class
	 **/

	var Slideshow = function () {
	 	var slideshow = this;
		 	slideshow.index = null,
		 	slideshow.activeSlide = null;

		/**
		 *	Slideshow Init
		 **/

		 	slideshow.init = function () {
		 		//Setting First Slide to Active
		 		$('.slide').first().addClass('active');
		 		//Binding Event Handlers
		 		$('.next').on("click", function () {
		 			slideshow.next();
		 		})
		 		$('.previous').on("click", function () {
					slideshow.prev();
				})
				$('.exitmodal').on("click", function () {
					slideshow.dismissModal();
				})
				$('.icon.home').on("click", function () {
					slideshow.home();
				})
				$('.icon.cycle').on("click", function () {
					slideshow.cycle();
				})
			};
		 	//Next Slide
		 	slideshow.next = function () {
				$('.active').removeClass('active').next('.slide').addClass('active');
				$('#interactiveWrapper').scrollTo($('.slide.active'), 600);
		 	};
		 	//Previous Slide
		 	slideshow.prev = function () {
				$('.active').removeClass('active').prev('.slide').addClass('active');
				$('#interactiveWrapper').scrollTo($('.slide.active'), 600);
		 	};
		 	//Exit Modal
		 	slideshow.dismissModal = function () {
				$(this).parent('.modal').fadeOut(600);
		 	};
		 	//To Home
		 	slideshow.home = function () {
		 		$('.active').removeClass('active');
		 		$('.slide:eq(0)').addClass('active');
		 		$('#interactiveWrapper').scrollTo($('.slide.active'), 600);
		 	};
		 	//To Cycle
		 	slideshow.cycle = function () {
		 		$('.active').removeClass('active');
		 		$('.slide:eq(2)').addClass('active');
		 		$('#interactiveWrapper').scrollTo($('.slide.active'), 600);
		 	};

	};

	/**
	 *	Leaflet Class
	 **/

	var Leaflet = function () {
		var leaflet = this;

		/**
		 *	Leaflet Init
		 **/

			leaflet.init = function () {
				console.log("Leaf");
			};

		/**
		 *	Leaflet Methods
		 **/
		 	//Slide Previous Leaflet Left
		 	leaflet.left = function () {

		 	};
		 	//Slide Next Leaflet Right
		 	leaflet.right = function () {

		 	};
		 	//Show Active Stem
		 	leaflet.stemActive = function (element) {

		 	};
	};

	/**
	 *	Intialize Slideshow
	 **/

	var interactive = new Slideshow();
	var leaflet = new Leaflet();
		interactive.init();
		leaflet.init();
});