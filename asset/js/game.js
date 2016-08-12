// deklarasi variable
var grid_state; // grid block
var grid_characters; // grid karakter
var match_characters; // tmp karakter sesuai
var currentShape; // block
var currentX, currentY; // posisi

var shapes = [
	// [1, 1, 1, 1], [ I ]
	// [1, 1, 1, 0, 1], [ _| ]
	// [1, 1, 1, 0, 0, 0, 1], [ L ]
	// [1, 1, 0, 0, 1, 1], [ O ]
	// [1, 0, 0, 0, 0, 0], [ . ]
	// [1, 0, 0, 0, 1, 0], [ i ]
	[1], // [ . ]
	// [1, 1, 0, 0, 0, 1, 1], [ S ]
	// [0, 1, 1, 0, 1, 1], [ Z ]
	// [0, 1, 0, 0, 1, 1, 1] [ T ]
];

var currentLetters; // teks utk block
var kamus = ["WOOW", "WOOF", "LOOL", "WOFL", "WOLF", "FOOL", "FOWL", "FLOW"]; // kamus kata
var limit_kamus = 4; // limit kata
var wordMatched = 0;
var wordMatchedLeft = 0;
var wordMatchedRight = 0;
var wordMatchedDown = 0;
var wordMatchedUp = 0;
var leftx;
var lefty;
var rightx;
var righty;
var downx;
var downy;
var upx;
var upy;
var interval;
var canvas = document.getElementById("canvas_tetris");

canvas.height = 600;
canvas.width = 300;

var total_px = canvas.height * canvas.width;
var total_rows = 20;
var total_cols = 10;
var block_px = total_px / (total_rows * total_cols);
var block_size = Math.sqrt(block_px);

var ctx = canvas.getContext("2d");

function init() {
	// grid array kosong utk posisi block
	grid_state = new Array(total_rows); // 20 rows

	for(var x = 0; x < total_rows; ++x) {
		grid_state[x] = new Array(total_cols); // 10 cols

		for(var y = 0; y < total_cols; ++y) {
			grid_state[x][y] = 0;
		}
	}

	// grid array kosong utk posisi karakter
	grid_characters = new Array(total_rows); // 20 rows

	for(var x = 0; x < total_rows; ++x) {
		grid_characters[x] = new Array(total_cols); // 10 cols

		for(var y = 0; y < total_cols; ++y) {
			grid_characters[x][y] = "";
		}
	}

	// grid array utk teks yg sesuai kamus
	match_characters = new Array(total_rows); // 20 rows

	for(var x = 0; x < total_rows; ++x) {
		match_characters[x] = new Array(total_cols); // 10 cols

		for(var y = 0; y < total_cols; ++y) {
			match_characters[x][y] = 0;
		}
	}
}

// buat block
function newShape() {
	var shape_id = Math.floor(Math.random() * shapes.length);
	var shape = shapes[shape_id];
	currentShape = [];

	for(var x = 0; x < 4; ++x) {
		currentShape[x] = [];

		for(var y = 0; y < 4; ++y) {
			var i = 4 * y + x;

			if(typeof shape[i] !== "undefined" && shape[i]) {
				currentShape[x][y] = 1;
			} else {
				currentShape[x][y] = 0;
			}
		}
	}

	currentX = 0;
	currentY = 5;
}

// generate huruf
function generateLetters() {
	// deklarasi huruf random
	// var letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

	// generate huruf random berdasarkan kamus dalam kata
	var l1 = kamus[Math.floor(Math.random() * kamus.length)];
	var letters = l1[Math.floor(Math.random() * l1.length)];

	// Generate huruf random[A,Z]
	// letters.sort(function () {
	// 	return 0.5 - Math.random();
	// });

	var currentLetter = [];

	currentLetter[0] = letters[0];
	currentLetter[1] = letters[1];
	currentLetter[2] = letters[2];
	currentLetter[3] = letters[3];

	var letterCount = 0;

	currentLetters = [];

	for(var x = 0; x < 4; ++x) {
		currentLetters[x] = [];

		for(var y = 0; y < 4; ++y) {
			if(currentShape[x][y]) {
				currentLetters[x][y] = currentLetter[letterCount];
				++letterCount;
			}
		}
	}
}

// render block
function render() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	for(var x = 0; x < total_rows; ++x) {
		for(var y = 0; y < total_cols; ++y) {
			if(grid_state[x][y]) {
				drawBlock(x, y); // buat block
				drawBoardLetters(x, y); // buat teks
			}

			if(match_characters[x][y]) {
				fillBlock(x, y); // warna block
			}
		}
	}

	for(var x = 0; x < 4; ++x) {
		for(var y = 0; y < 4; ++y) {
			if(currentShape[x][y]) {
				drawBlock(currentX + x, currentY + y); // buat block
				drawText(currentX + x, currentY + y, x, y); // buat teks
			}
		}
	}
}

// warna block
function fillBlock(x, y) {
	var pixelX = y * block_size;
	var pixelY = x * block_size;

	var alpha = 0.5;

	ctx.fillStyle = "rgba(255, 187, 255 , " + alpha + ")";
	ctx.fillRect(pixelX, pixelY, block_size - 2, block_size - 2);
}

// buat block
function drawBlock(x, y) {
	var pixelX = y * block_size;
	var pixelY = x * block_size;

	// warna
	ctx.strokeStyle = "#FF0000";
	ctx.strokeRect(pixelX, pixelY, block_size - 2, block_size - 2);
}

// teks::a
function drawBoardLetters(x, y) {
	var pixelX = y * block_size;
	var pixelY = x * block_size;

	ctx.font = "20px Calibri";
	ctx.strokeStyle = "#FFFFFF";
	ctx.textBaseline = "hanging";

	ctx.strokeText(grid_characters[x][y], pixelX + 6, pixelY + 8);
}

// teks::b
function drawText(a, b, x, y) {
	var pixelX = b * block_size;
	var pixelY = a * block_size;

	ctx.font = "20px Calibri";
	ctx.strokeStyle = "#FFFFFF";
	ctx.textBaseline = "hanging";

	ctx.strokeText(currentLetters[x][y], pixelX + 6, pixelY + 8);
}

// poin. block jatuh - regen. block
function fallingBlocks() {
	if(valid(1)) {
		++currentX;
	} else {
		freeze();
		match();

		if(wordMatched) {
			clearBlocks();
			//  render();
			alignrows();
		}

		newShape();
		generateLetters();
	}

	render();
}

// rotasi block (I,L(l),L(r),S(l),S(r),T,O,i)
function rotate(currentShape) {
	var newCurrentShape = [];

	for(var x = 0; x < 4; ++x) {
		newCurrentShape[x] = [];

		for(var y = 0; y < 4; ++y) {
			newCurrentShape[x][y] = currentShape[3 - y][x];
		}
	}

	return newCurrentShape;
}

// rotasi huruf
function rotateLetter(currentLetters) {
	var newCurrentLetters = [];

	for(var x = 0; x < 4; ++x) {
		newCurrentLetters[x] = [];

		for(var y = 0; y < 4; ++y) {
			newCurrentLetters[x][y] = currentLetters[3 - y][x];
		}
	}

	return newCurrentLetters;
}

// posisi
function valid(offsetX, offsetY, newCurrentShape) {
	offsetX = offsetX || 0;
	offsetY = offsetY || 0;
	offsetX = currentX + offsetX;
	offsetY = currentY + offsetY;
	newCurrentShape = newCurrentShape || currentShape;

	for(var x = 0; x < 4; ++x) {
		for(var y = 0; y < 4; ++y) {
			if(newCurrentShape[x][y]) {
				if(typeof grid_state[x + offsetX] == "undefined"
					|| typeof grid_state[x + offsetX][y + offsetY] == "undefined"
					|| grid_state[x + offsetX][y + offsetY]
					|| y + offsetY < 0
					|| x + offsetX >= total_rows
					|| y + offsetY >= total_cols) {

					return false;
				}
			}
		}
	}

	return true;
}

// stop posisi
function freeze() {
	$("#collideSound").trigger("play");

	for(var x = 0; x < 4; ++x) {
		for(var y = 0; y < 4; ++y) {
			if(currentShape[x][y]) {
				grid_state[x + currentX][y + currentY] = currentShape[x][y];
				grid_characters[x + currentX][y + currentY] = currentLetters[x][y];
			}
		}
	}
}

// gabungkan teks pada posisi tiap block & sesuaikan dengan kamus
function match() {
	for(var x = 0; x < total_rows; ++x) {
		match_characters[x] = new Array(total_cols);

		for(var y = 0; y < total_cols; ++y) {
			match_characters[x][y] = 0;
		}
	}

	for(var x = 0; x < total_rows; ++x) {
		for(var y = 0; y < total_cols; ++y) {
			if(grid_characters[x][y] !== "") {
				checkLeft(x, y);
				checkRight(x, y);
				checkUp(x, y);
				checkDown(x, y);
			}
		}
	}
}

// cek pos. kiri
function checkLeft(x, y) {
	if(y < 3) {
		return;
	} else {
		if(grid_characters[x][y - 1] !== "" && grid_characters[x][y - 2] !== "" && grid_characters[x][y - 3] !== "") {
			var left_chars = [];

			for(var i = 0; i < limit_kamus; ++i) {
				left_chars[i] = grid_characters[x][y - i];
			}

			var left_string = left_chars.join("");
			var matched = searchStringInArray(left_string, kamus);

			if(matched == 1) {
				$("#" + left_string).text(parseInt($("#" + left_string).text()) + 1);
				$("." + left_string).trigger("play");

				wordMatched = 1;
				wordMatchedLeft = 1;
				leftx = x;
				lefty = y;

				for(var i = 0; i < limit_kamus; ++i) {
					match_characters[x][y - i] = 1;
				}
			}
		}
	}
}

// cek pos. kanan
function checkRight(x, y) {
	if(y > 6) {
		return;
	} else {
		if(grid_characters[x][y + 1] !== "" && grid_characters[x][y + 2] !== "" && grid_characters[x][y + 3] !== "") {
			var right_chars = [];

			for(var i = 0; i < limit_kamus; ++i) {
				right_chars[i] = grid_characters[x][y + i];
			}

			var right_string = right_chars.join("");
			var matched = searchStringInArray(right_string, kamus);

			if(matched == 1) {
				$("#" + right_string).text(parseInt($("#" + right_string).text()) + 1);
				$("." + right_string).trigger("play");

				wordMatched = 1;
				wordMatchedRight = 1;
				rightx = x;
				righty = y;

				for(var i = 0; i < limit_kamus; ++i) {
					match_characters[x][y + i] = 1;
				}
			}
		}
	}
}

// cek pos. bawah
function checkDown(x, y) {
	if(x > 16) {
		return;
	} else {
		if(grid_characters[x + 1][y] !== "" && grid_characters[x + 2][y] !== "" && grid_characters[x + 3][y] !== "") {
			var down_chars = [];

			for(var i = 0; i < limit_kamus; ++i) {
				down_chars[i] = grid_characters[x + i][y];
			}

			var down_string = down_chars.join("");
			var matched = searchStringInArray(down_string, kamus);

			if(matched == 1) {
				$("#" + down_string).text(parseInt($("#" + down_string).text()) + 1);
				$("." + down_string).trigger("play");

				wordMatched = 1;
				wordMatchedDown = 1;
				downx = x;
				downy = y;

				for(var i = 0; i < limit_kamus; ++i) {
					match_characters[x + i][y] = 1;
				}
			}
		}
	}
}

// cek pos. atas
function checkUp(x, y) {
	if(x < 3) {
		return;
	} else {
		if(grid_characters[x - 1][y] !== "" && grid_characters[x - 2][y] !== "" && grid_characters[x - 3][y] !== "") {
			var up_chars = [];

			for(var i = 0; i < limit_kamus; ++i) {
				up_chars[i] = grid_characters[x - i][y];
			}

			var up_string = up_chars.join("");
			var matched = searchStringInArray(up_string, kamus);

			if(matched == 1) {
				$("#" + up_string).text(parseInt($("#" + up_string).text()) + 1);
				$("." + up_string).trigger("play");

				wordMatched = 1;
				wordMatchedUp = 1;
				upx = x;
				upy = y;

				for(var i = 0; i < limit_kamus; ++i) {
					match_characters[x - i][y] = 1;
				}
			}
		}
	}
}

// hapus block sesuai posisi gridnya
function clearBlocks() {
	for(var x = 0; x < total_rows; ++x) {
		for(var y = 0; y < total_cols; ++y) {
			if(match_characters[x][y]) {
				grid_state[x][y] = 0;
				grid_characters[x][y] = "";
				//  match_characters[x][y] = 0;
			}
		}
	}
}

// cari string dalam array
function searchStringInArray(str, strArray) {
	for(var j = 0; j < strArray.length; j++) {
		if(strArray[j].match(str)) {
			return 1;
		}
	}

	return 0;
}

// alignment baris
function alignrows() {
	if(wordMatchedLeft == 1) {
		for(var y = lefty; y >= lefty - 3; y--) {
			for(var x = leftx - 1; x >= 0; x--) {
				grid_state[x + 1][y] = grid_state[x][y];
				grid_characters[x + 1][y] = grid_characters[x][y];
				//  render();
			}
		}

		leftx = 0;
		lefty = 0;
		wordMatchedLeft = 0;
	}

	if(wordMatchedRight == 1) {
		for(var y = righty; y <= righty + 3; y++) {
			for(var x = rightx - 1; x >= 0; x--) {
				grid_state[x + 1][y] = grid_state[x][y];
				grid_characters[x + 1][y] = grid_characters[x][y];
				// render();
			}
		}

		rightx = 0;
		righty = 0;
		wordMatchedRight = 0;
	}

	if(wordMatchedDown == 1) {
		for(var x = downx - 1; x >= 0; x--) {
			y = downy;
			grid_state[x + 4][y] = grid_state[x][y];
			grid_characters[x + 4][y] = grid_characters[x][y];
			//  render();
		}

		downx = 0;
		downy = 0;
		wordMatchedDown = 0;
	}

	if(wordMatchedUp == 1) {
		var y = upy;

		for(var x = upx - 4; x >= 0; x--) {
			grid_state[x + 4][y] = grid_state[x][y];
			grid_characters[x + 4][y] = grid_characters[x][y];
			//  render();
		}

		upx = 0;
		upy = 0;
		wordMatchedUp = 0;
	}

	wordMatched = 0;
}

// new game
function newGame() {
	clearInterval(interval);
	init();
	newShape();
	generateLetters();

	$("#start").val("Pause");
	interval = window.setInterval(fallingBlocks, 500);
}

// pause permainan
function pause() {
	clearInterval(interval);

	$("#start").val("Resume");
}

// resume permainan
function resume() {
	interval = window.setInterval(fallingBlocks, 500);

	$("#start").val("Pause");
}

// tabel kamus
function tableWords() {
	var table = $("#inner_body");

	for(var i = 0; i < kamus.length; i++) {
		table.append('<tr style="text-align:center;">' + '<td>' + kamus[i] + '</td>' + '<td id =' + kamus[i] + '>' + 0 + '</td>');
	}
}

// tabel kamus @skor
function modal_tableResult() {
	var table = $("#outer_body");

	for(var i = 0; i < kamus.length; i++) {
		var text = $("#" + kamus[i]).text();

		table.append('<tr style="text-align:center;">' + '<td>' + kamus[i] + '</td>' + '<td>' + text + '</td>');
	}
}

// gameover
function gameOver() {
	clearInterval(interval);
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	$("#start").val("Start");
	$("tbody#outer_body tr").remove();

	modal_tableResult();

	$("tbody#inner_body tr").remove();
	$("#gameover").modal({show: true});
}

// main
$(document).ready(function () {
	// exec. DOM HTML ketika script di load
	$("#start").click(function() {
		if($(this).val() =="Start") {
			newGame();

			tableWords();
			createAudio(); // audio / suara
			document.getElementById("stop").disabled = false;

			return;
		}

		if($(this).val() == "Pause") {
			pause();

			return;
		}

		if($(this).val() == "Resume") {
			resume();

			return;
		}
	});

	$("#stop").click(function() {
		gameOver();
	});
});
