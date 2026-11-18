// Vox Command — example Electron wrapper (clean, near-borderless window).
//
//   cd web
//   npm i -D electron
//   npx electron desktop/electron-main.js
//
// Ships the same web app (app.html) in a frameless window and shows
// icon-512.png in the Dock / taskbar.

const { app, BrowserWindow } = require('electron');
const path = require('path');

const ICON = path.join(__dirname, '..', 'icon-512.png');

function createWindow() {
  const isMac = process.platform === 'darwin';

  const win = new BrowserWindow({
    width: 460,
    height: 760,
    minWidth: 380,
    minHeight: 620,
    title: 'Vox Command',
    backgroundColor: '#0b0c10',
    icon: ICON,                                  // Linux/Windows taskbar icon
    show: false,
    // Clean frame: keep the macOS traffic lights inset, go fully borderless elsewhere.
    ...(isMac
      ? { titleBarStyle: 'hiddenInset', trafficLightPosition: { x: 14, y: 16 } }
      : { frame: false, titleBarOverlay: { color: '#0b0c10', symbolColor: '#f2f4f8', height: 36 } }),
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  win.loadFile(path.join(__dirname, '..', 'app.html'));
  win.once('ready-to-show', () => win.show());
  return win;
}

app.whenReady().then(() => {
  if (process.platform === 'darwin' && app.dock) app.dock.setIcon(ICON); // macOS Dock icon
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
