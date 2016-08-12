function App() {
	var _self = this;
	this.oldPosition = 0;

	this.views = {
		clouds: $("#clouds"),
		city: $("#city"),
		city2: $("#city2"),
		car: $("#car")
	};

	this.init = function() {
		this.animate();
	};

	this.animate = function() {
		var offset = 0;
		var carOffset = parseInt(this.views.car.css("left"));

		window.setInterval(function(){
			_self.views.clouds.attr("style", "background-position: " + offset + "px 0px");
			_self.views.city.attr("style", "background-position: " + offset * 0.5 + "px 0px");
			_self.views.city2.attr("style", "background-position: " + offset * -1 + "px 0px");

			offset -= 1;
		}, 30);

		var tmp = ($(document).width() - $(".center").width()) / 2;

		tmp += 400;

		_self.views.car.animate({
			left: tmp * -1
		}, 8000);
	};
}

$(document).ready(function() {
	window.app = new App();
	window.app.init();
});
