const { app, BrowserWindow, Tray, Menu } = require('electron');
const path = require('path');
const AutoLaunch = require("auto-launch");
const notifier = require('node-notifier');
const mainservice = require('./modules/mainservice.js');

const appname = 'SController';

var autoLauncher = new AutoLaunch({
  name: appname
});

process.on('uncaughtException', function(err) {
  if(err.code === 'EADDRINUSE' || err.code === 'EACCES' ){
      console.log("Process Exception: perhaps port already used...Details:",err);

      notifier.notify({
        title: appname,
        message: "Process Exception: perhaps port already used...Details:"+err.message,
        timeout: 5
      });

  }else{
      console.log("Process Exception: ",err);

  }    
});


let win = null;
let tray = null;

app.whenReady().then(() => {
  createWindow();
});

function createWindow() {

  win = new BrowserWindow({
    autoHideMenuBar: true,
    fullscreen: false,
    frame: true,
    show: false,
    minimizable: false,
    alwaysOnTop: false,
    fullscreenable: false,
    webPreferences: {
      nodeIntegration: true
    }
  });

  win.hide();

  mainservice.mainservice(function(port){ 
    notifier.notify({
      title: appname,
      message: "Successfully started on local port: "+port,
      timeout: 2
    });
    win.loadURL('http://localhost:'+port);
    win.webContents.openDevTools();
  });
  
  
  tray = new Tray(path.join(__dirname, '/gfx/trayicon.png'));
  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Open/Hide "+appname, click: (item, window, event) => {
        if (win.isVisible()) {
          win.hide();
        }else{
          win.show();
          win.focus();
        }
      }
    },

    { type: "separator" },
    { role: "quit" }, // "role": system prepared action menu
  ]);

  tray.setToolTip(appname);
  tray.setContextMenu(contextMenu);

  /*
  ipcMain.on('devtools-toggle', (event, arg) => {

    if (win.webContents.isDevToolsOpened()) {
      win.webContents.closeDevTools();
    } else {
      win.webContents.openDevTools();
    }

  });
  */

  /*
  ipcMain.handle('read-config', (event, arg) => {
    return config;
  });

  ipcMain.on('save-config', (event, arg) => {
    let ret = saveconfig(arg);
    if (ret) config = readconfig();
    //re apply config here -> this updates the ui
    registershortcuts(config);
    win.webContents.send("rerender");
    return ret;
  });

  var lastTime = (new Date()).getTime();

  setInterval(function () {
    var currentTime = (new Date()).getTime();
    if (currentTime > (lastTime + 2000 * 3)) {
      win.webContents.send("initiate-keypress", "event-wakeup");
    }
    lastTime = currentTime;
  }, 2000);
  */

}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
})