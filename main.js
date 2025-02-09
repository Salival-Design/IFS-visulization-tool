const { app, BrowserWindow } = require('electron')
const path = require('path')
const isDev = process.env.NODE_ENV === 'development'

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // Set Content Security Policy
  mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [
          isDev
            ? [
                "default-src 'self'",
                "script-src 'self' 'unsafe-inline'",
                "style-src 'self' 'unsafe-inline'",
                "img-src 'self' data: blob: https:",
                "font-src 'self'",
                "connect-src 'self' ws://localhost:* http://localhost:*",
                "worker-src 'self' blob:",
                "base-uri 'self'",
                "form-action 'self'"
              ].join('; ')
            : [
                "default-src 'self'",
                "script-src 'self'",
                "style-src 'self' 'unsafe-inline'",
                "img-src 'self' data: blob: https:",
                "font-src 'self'",
                "connect-src 'self'",
                "worker-src 'self' blob:",
                "base-uri 'self'",
                "form-action 'self'"
              ].join('; ')
        ]
      }
    })
  })

  // Load the app
  if (isDev) {
    mainWindow.loadURL('http://localhost:5174')
    mainWindow.webContents.openDevTools()
  } else {
    // In production, try multiple possible paths
    const possiblePaths = [
      path.join(__dirname, 'dist', 'index.html'),
      path.join(__dirname, '..', 'dist', 'index.html'),
      path.join(process.cwd(), 'dist', 'index.html')
    ]

    console.log('Trying to load from these paths:')
    possiblePaths.forEach(p => console.log('- ' + p))

    // Try each path until one works
    const loadPath = possiblePaths.find(p => {
      try {
        return require('fs').existsSync(p)
      } catch (e) {
        return false
      }
    })

    if (loadPath) {
      console.log('Loading from:', loadPath)
      mainWindow.loadFile(loadPath).catch(err => {
        console.error('Failed to load index.html:', err)
        app.quit()
      })
    } else {
      console.error('Could not find index.html in any of the possible paths')
      app.quit()
    }
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

// Create window when app is ready
app.whenReady().then(createWindow)

// Quit when all windows are closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// Create a new window if none exists (macOS)
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

