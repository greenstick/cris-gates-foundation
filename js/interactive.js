(function () {
	var ViewModel = function () {
		var master = this;
			master.next = function () {
				$(this).on("click", function () {
					console.log("next");
					$('.active').removeClass('active').next('.slide').addClass('active');
				});
			};
			master.prev = function () {
				$('.previous').on("click", function () {
					console.log("previous");
					$('.active').removeClass('active').prev('.slide').addClass('active');
				});
			};
			master.slideOpen = function () {

			};
			master.slideClose = function () {

			};
			master.exit = function () {
				$(this).on("click", function () {
					$(parent).fadeOut(600);
				})
			};
	};
	ViewModel();
});