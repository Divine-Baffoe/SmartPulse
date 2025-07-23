import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';

let mainWindow: BrowserWindow | null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      
    },
  });

  mainWindow.loadFile(path.join(__dirname, '../../public/index.html'));

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function getActivityData() {
  return {
    productiveHours: 4.5,
    nonProductiveHours: 2,
    idleTime: 1200,
  };
}

app.on('ready', () => {
  createWindow();
  // monitorActivity(); <-- add this when implemented in a separate utils file
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on('request-activity-data', (event) => {
  const activityData = getActivityData();
  event.reply('activity-data', activityData);
});