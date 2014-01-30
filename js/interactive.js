$(document).ready(function () {
	
	/**
	 *	Slideshow Class
	 **/

	var Slideshow = function () {
	 	var slideshow = this;
		 	slideshow.index = null;

		/**
		 *	Slideshow Methods
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
					slideshow.exitmodal();
				})
			};
		 	//Next Slide
		 	slideshow.next = function () {
		 		console.log("nom");
				$('.active').removeClass('active').next('.slide').addClass('active');
		 	};
		 	//Previous Slide
		 	slideshow.prev = function () {
				$('.active').removeClass('active').prev('.slide').addClass('active');
		 	};
		 	//Exit Modal
		 	slideshow.dismissmodal = function () {
				$(this).parent('.modal').fadeOut(600);
		 	};

	};
	var Leaflet = function () {
		var leaflet = this;

		/**
		 *	Leaflet Methods
		 **/

			leaflet.init = function () {

			};
	}

	/**
	 *	Intialize Slideshow
	 **/
	 var interactive = new Slideshow();
		interactive.init();
	});