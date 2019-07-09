const {
  app,
  BrowserWindow
} = require('electron');
const locals = {
  /* ...*/ }
const setupPug = require('electron-pug');
const request = require("request");
const version = "1.0.0";
// 기본 const
let win
global.sharedObject = {
  version: version
}

if (require('electron-squirrel-startup')) app.quit()
// if first time install on windows, do not run application, rather
// let squirrel installer do its work
const setupEvents = require('./installers/setup-events')

function Initialize() {
  app.on('ready', async () => {
    try {
      let pug = await setupPug({
        pretty: true
      }, locals)
      pug.on('error', err => console.error('electron-pug error', err))
    } catch (err) {
      // electron-pug에서 오류
    }

    win = new BrowserWindow({
      width: 1280,
      height: 750,
      frame: false,
      webPreferences: {
        nodeIntegration: true
      },
      alwaysOnTop: true,
      icon: "./twitch.ico"
    })

    win.loadURL(`file://${__dirname}/views/index.pug`)
    // 작동 코드
    win.webContents.openDevTools()
    // 창이 닫힐 때 발생합니다
    win.on('closed', () => {
      // window 객체에 대한 참조해제. 여러 개의 창을 지원하는 앱이라면 
      // 창을 배열에 저장할 수 있습니다. 이곳은 관련 요소를 삭제하기에 좋은 장소입니다.
      win = null
    })
  })

  // 이 메서드는 Electron이 초기화를 마치고 
  // 브라우저 창을 생성할 준비가 되었을 때  호출될 것입니다.
  // 어떤 API는 이 이벤트가 나타난 이후에만 사용할 수 있습니다.

  // 모든 창이 닫혔을 때 종료.
  app.on('window-all-closed', () => {
    // macOS에서는 사용자가 명확하게 Cmd + Q를 누르기 전까지는
    // 애플리케이션이나 메뉴 바가 활성화된 상태로 머물러 있는 것이 일반적입니다.
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })

  app.on('activate', () => {
    // macOS에서는 dock 아이콘이 클릭되고 다른 윈도우가 열려있지 않았다면
    // 앱에서 새로운 창을 다시 여는 것이 일반적입니다.
    if (win === null) {
      createWindow()
    }
  })
}

function UpdateCheck(version) {
  request({
      url: "https://api.github.com/repos/electron/electron/releases/latest",
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.121 Electron/5.0.6 Safari/537.36"
      }
    },
    function (err, res, body) {
      let gparse = JSON.parse(body)
      CheckedVersion = gparse.tag_name;
      if (gparse.tag_name.substring(1) > version) {
        // TODO: 업데이트 알림 띄우고 확인 누르면 설치하기 (aot.js)
        // getGlobal 쓰면 됨
        /*         var downloadRelease = require('@terascope/fetch-github-release');

                // 릴리즈 필터
                function filterRelease(release) {
                    return release.prerelease === false;
                }
                // 에셋 플랫폼 필터
                function filterAsset(asset) {
                    // win32-x64 빌드만 다운로드
                    return asset.name.indexOf('win32-x64') >= 0;
                }

                downloadRelease("twitchaot", "twitchaot", "./", filterRelease, filterAsset, false)
                    .then(function () {
                        console.log('All done!');
                    })
                    .catch(function (err) {
                        console.error(err.message);
                    }); */
      }
    });
}
Initialize()