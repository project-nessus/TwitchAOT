// TODO: 간단화 하기
const ip = async (twitchid) => {
  // twitchid가 없을 경우, input에서 가져옴
  if (twitchid === '') twitchid = $('#id').val()
  const config = {
    headers: { Authorization: `Bearer ${remote.getGlobal('sharedObject').token}` }
  }

  // TODO: 100명 이상 지원
  // 팔로워 목록 불러오기
  const getUser = await axios.get(`https://api.twitch.tv/helix/users?login=${twitchid}`, config)
  const userData = getUser.data.data[0]
  const getFollower = await axios.get(`https://api.twitch.tv/helix/users/follows?from_id=${userData.id}&first=100`, config)
  const followerData = getFollower.data
  const streamingUserQueryString = (followerData) => {
    let queryString = 'https://api.twitch.tv/helix/streams?'
    for (let i = 0; i < followerData.total; i++) {
      queryString += `user_id=${followerData.data[i].to_id}&`
    }
    return queryString
  }

  // 스트리머 정보 불러오기
  const getStreamingUser = await axios.get(`${streamingUserQueryString(followerData)}first=100`, config)
  const streamerData = getStreamingUser.data.data
  const streamerProfileQueryString = (streamerData) => {
    let queryString = 'https://api.twitch.tv/helix/users?'
    for (let i = 0; i < Object.keys(streamerData).length; i++) {
      queryString += `id=${streamerData[i].user_id}&`
    }
    return queryString
  }

  // 스트리머 UI 업데이트
  const getStreamer = await axios.get(streamerProfileQueryString(streamerData), config)
  const profileData = getStreamer.data
  $('#entry').remove()
  for (let i = 0; i < Object.keys(profileData.data).length; i++) {
    if (profileData.data[i].display_name.toLowerCase() === profileData.data[i].login.toLowerCase()) $('#cover').append(`<div class="paper" style="float:left; margin-right:1rem;" onclick="twitchMove('${profileData.data[i].login}')"><img width="100" height="100" src="${profileData.data[i].profile_image_url}"/><p style="margin:0; line-height:1.8em; display:inline;"><br />${profileData.data[i].display_name}<br />${streamerData[i].viewer_count}</p><p style="float:left;margin:0;margin-right:5px;font-size:10px;color:#e21212;">●</p></div>`)
    else $('#cover').append(`<div class="paper" style="float:left; margin-right:1rem;" onclick="twitchMove('${profileData.data[i].login}')"><img width="100" height="100" src="${profileData.data[i].profile_image_url}"/><p style="margin:0; line-height:1.8em; display:inline;"><br />${profileData.data[i].display_name} (${profileData.data[i].login})<br />${streamerData[i].viewer_count}</p><p style="float:left;margin:0;margin-right:5px;font-size:10px;color:#e21212;">●</p></div>`)
  }
}

// 저장된 ID 데이터가 있으면 ID 입력 스킵
const followSkip = (twitchid) => {
  ip(twitchid)
}

const PartyInfo = () => {
  window.open(`file://${__dirname}/party.pug`, '3rdparty', 'nodeIntegration=yes')
}

const twitchMove = (twitchid) => {
  remote.getGlobal('sharedObject').id = twitchid
  window.location.href = `file://${__dirname}/player.pug`
  $('.container-fluid').remove()
  $('.container-after-titlebar').css('overflow', 'hidden')
  $('.container-after-titlebar').append(slink.replace(/0streamer0/gi, id))
  $('iframe[height=378]').css('width', '100vw')
  $('iframe[height=378]').css('height', 'calc(100vh - 30px)')
}
