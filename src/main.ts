import { app, BrowserWindow } from 'electron';
import type { BrowserWindow as BW } from 'electron';
import path from 'path';
// import * as Sentry from "@sentry/electron";
// Sentry.init({ dsn: "https://f04c94535f8041a4883b47c7420fa7bd@o688242.ingest.sentry.io/5773229" });
const gotTheLock = app.requestSingleInstanceLock();
let mainWindow: BW | null = null;
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup') || !gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // Someone tried to run a second instance, we should focus our window.
    console.log('second-instance', process.platform)
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    } else {
      if (process.platform === "darwin") {
        if (app.isReady()) createWindow();
      }
    }
  });

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on('ready', () => {
    createWindow();
  });

  // Quit when all windows are closed, except on macOS. There, it's common
  // for applications and their menu bar to stay active until the user quits
  // explicitly with Cmd + Q.
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });

  // In this file you can include the rest of your app's specific main process
  // code. You can also put them in separate files and import them here.

}
function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
    // Open the DevTools.
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }
}
