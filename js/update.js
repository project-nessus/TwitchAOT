const downloadDir = process.env.APPDATA + '\\twitchaot\\update'
const repo = '/Bananamilk452/TwitchAOT'
const updateProcess = (version) => {
  const exec = require('child_process').execFile
  const fs = require('fs')
  exec(`${downloadDir}\\twitchaot-${version}-setup.exe`, (err, data) => {
    fs.unlinkSync(`${downloadDir}\\twitchaot-${version}-setup.exe`)
    remote.getCurrentWindow().close()
  })
}

const UpdateCheck = async () => {
  // TODO: uri.all.js.map, performance-now.js.map 버그 고치기 (취약점 가능)
  const body = await axios.get(`https://api.github.com/repos${repo}/releases/latest`)
  const gparse = JSON.parse(body)
  const newRawVer = gparse.tag_name.substring(1)
  const newVers = gparse.tag_name.replace('v', '').split('.').map(v => Number(v))
  const nowVers = remote.getGlobal('sharedObject').version.split('.').map(v => Number(v))
  for (let i = 0; i < newVers.length; i++) {
  if (newVers[i] <= nowVers[i]) continue
    const writeStream = createWriteStream(`${downloadDir}\\twitchaot-${newRawVer}-setup.exe`)
    // alert('다운로드 및 설치 중입니다.')
    const raw = await axios({
      url: gparse.assets[0].browser_download_url,
      method: 'GET',
      responseType: 'stream'
    })
    raw.data.pipe(writeStream)
    writeStream.on('finish', () => updateProcess(newRawVer))
  }
  alert('TwitchAOT가 최신버전입니다.')
}
