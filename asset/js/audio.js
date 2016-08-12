// work @localhost
function createAudio() {
	var sound = $("#sound");

	for(var i = 0; i < words.length; i++) {
		var audio = $("<audio />");

		audio.attr("src", "../bgm/" + words[i] + ".mp3");
		audio.addClass("" + words[i]);
		sound.append(audio);
	}

	var buttonPress = $('<audio />');

	buttonPress.attr("src", "../bgm/Buttonpress.mp3");
	buttonPress.attr("id", "buttonPressSound");
	sound.append(buttonPress);

	var collide = $("<audio />");

	collide.attr("src", "../bgm/Collide.mp3");
	collide.attr("id", "collideSound");
	sound.append(collide);
}