'use strict'

import { app, protocol, BrowserWindow, ipcMain, dialog } from 'electron'
import {
  createProtocol,
  /* installVueDevtools */
} from 'vue-cli-plugin-electron-builder/lib'
import fs from 'fs'
import { execFile } from 'child_process'
import path from 'path'
import walkdir from 'walkdir';

const isDevelopment = process.env.NODE_ENV !== 'production'
const Entries = []

ipcMain.on('synchronous-message', (event, arg) => {
  console.log("Message", arg)
  event.returnValue = Entries
})

ipcMain.on('launch', (event, binary) => {
  console.log("Message", binary)
  let child = execFile(binary, (err, data) => {
    if(err){
      console.error(err)
      return;
    }

    console.log(data.toString())
  })
  event.returnValue = true
})

function scanEntries() {
  walkdir('./public/Entries', { max_depth: 1})
      .on('file', (p, stat) => {
        //console.log(path)
      })
      .on('directory', (p, stat) => {
        let entryName = path.basename(p);
        let name = entryName.split(" by ")[0]
        let author = entryName.split(" by ")[1]

        let entry = {
          name,
          author,
          path: p,
          played: false,
          ranked: false,
          rank: 0,
          ratings: []
        };

        let files = walkdir.sync(p, { return_object: false })
        // //return files.filter(file => file.indexOf('.exe') !== -1)
        // if(binary.length){
        //   entry.bin = binary[0]
        // }
        entry.files = files

        let bins = files.filter(file => file.includes('.exe'))
        let bin

        if(bins.length) {
          bin = bins[0]
        }

        let readme = files.filter(file => file.toLowerCase().includes('readme.txt'))

        if(readme.length){
          readme = fs.readFileSync(readme[0], 'utf8')
        } else {
          readme = ""
        }

        entry.bin = bin
        entry.readme = readme

        Entries.push(entry)

      })
      .on('error', (p, err) => {
        console.log(`!!!! ${p} ${err}`)
      })
      .on('end', () => {
        //console.log(Entries)
        let contents = win.webContents
        contents.send('entries', Entries)
      })

}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{scheme: 'app', privileges: { secure: true, standard: true } }])

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({ width: 1024, height: 768, webPreferences: {
    // Use pluginOptions.nodeIntegration, leave this alone
    // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
    nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
    preload: path.join(__dirname, 'preload.js')
  } })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    // if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }

  win.on('closed', () => {
    win = null
  })

  scanEntries()
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    // Devtools extensions are broken in Electron 6.0.0 and greater
    // See https://github.com/nklayman/vue-cli-plugin-electron-builder/issues/378 for more info
    // Electron will not launch with Devtools extensions installed on Windows 10 with dark mode
    // If you are not using Windows 10 dark mode, you may uncomment these lines
    // In addition, if the linked issue is closed, you can upgrade electron and uncomment these lines
    // try {
    //   await installVueDevtools()
    // } catch (e) {
    //   console.error('Vue Devtools failed to install:', e.toString())
    // }

  }
  createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', data => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
