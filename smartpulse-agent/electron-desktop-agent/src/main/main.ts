import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { monitorActivity } from './activityMonitor'; // hypothetical module for monitoring activity

let mainWindow: BrowserWindow | null;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'), // preload script for secure context
            contextIsolation: true,
            enableRemoteModule: false,
        },
    });

    mainWindow.loadFile(path.join(__dirname, '../../public/index.html'));

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

app.on('ready', () => {
    createWindow();
    monitorActivity(); // Start monitoring worker activities
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

// IPC communication for sending activity data to the renderer process
ipcMain.on('request-activity-data', (event) => {
    const activityData = getActivityData(); // hypothetical function to get activity data
    event.reply('activity-data', activityData);
});