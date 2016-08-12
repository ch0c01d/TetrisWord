const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

let mainWindow;

function createWindow() {
	mainWindow = new BrowserWindow({width: 1024, height: 768});

	mainWindow.loadURL(`file://${__dirname}/main.html`);
	// mainWindow.webContents.openDevTools(); // debug mode

	mainWindow.on("closed", function () {
		mainWindow = null;
	})
}

app.on("ready", createWindow);

app.on("window-all-closed", function () {
	if(process.platform != "darwin") {
		app.quit();
	}
});

app.on("activate", function () {
	if(mainWindow === null) {
		createWindow();
	}
});

app.on("closed", function() {
	mainWindow = null;
});