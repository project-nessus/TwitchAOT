// 기본적인 모듈 가져오기
const { remote } = require('electron')
const { Menu, MenuItem } = remote
const customTitlebar = require('custom-electron-titlebar')
const storage = require('electron-json-storage')
const axios = require('axios')
const fs = require('fs')
