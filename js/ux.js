$(document).ready(() => {
  // index.pug에서 저장된 ID 데이터가 있으면 ID 입력 스킵
  if (window.location.href.includes('index.pug')) {
    storage.get('config', (error, data) => {
      if (error) alert(error)
      if (data.id !== '') followSkip(data.id)
    })
  }

  const Titlebar = new customTitlebar.Titlebar({
    backgroundColor: customTitlebar.Color.fromHex('#2C2541')
  })

  const menu = new Menu()
  menu.append(new MenuItem({
  // TODO: 할 거 추가
  // TODO: ID 초기화 추가하기
    label: '',
    submenu: [{
      label: '업데이트 확인',
      click: () => UpdateCheck()
    }, {
      label: '개발자 도구 열기',
      click: () => remote.getCurrentWebContents().openDevTools()
    }, {
      type: 'separator'
    }, {
      label: `버전 v${remote.getGlobal('sharedObject').version}`
    }, {
      label: '서드파티 라이브러리 정보',
      click: () => PartyInfo()
    }, {
      label: '환경설정' // TODO: 새 창 열기
    }]
  }))
  menu.append(new MenuItem({
    label: '',
    submenu: [{
      label: '1920x1080',
      click: () => remote.getCurrentWindow().setContentSize(1920, 1110)
    }, {
      label: '1600x900',
      click: () => remote.getCurrentWindow().setContentSize(1600, 930)
    }, {
      label: '1366x768',
      click: () => remote.getCurrentWindow().setContentSize(1366, 798)
    }, {
      label: '1280x720',
      click: () => remote.getCurrentWindow().setContentSize(1280, 750)
    }, {
      label: '960x540',
      click: () => remote.getCurrentWindow().setContentSize(960, 570)
    }, {
      label: '640x360',
      click: () => remote.getCurrentWindow().setContentSize(640, 390)
    }, {
      label: '535x301',
      click: () => remote.getCurrentWindow().setContentSize(535, 331)
    }, {
      label: '400x225',
      click: () => remote.getCurrentWindow().setContentSize(400, 255)
    }]
  }))

  menu.append(new MenuItem({
    label: '',
    click: () => window.history.back()
  }))

  menu.append(new MenuItem({
    label: '',
    click: () => window.location.reload(true)
  }))

  Titlebar.updateMenu(menu)

  $('.menubar-menu-title')[0].className += ' fa fa-bars'
  $('.menubar-menu-title')[1].className += ' fa fa-desktop'
  $('.menubar-menu-title')[2].className += ' fa fa-arrow-left'
  $('.menubar-menu-title')[3].className += ' fa fa-repeat'

  $('input').on('keyup', (event) => {
  // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
      $('#move').click()
    }
  })
})
