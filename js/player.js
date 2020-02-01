$(document).ready(() => {
  $('.container-after-titlebar').css('overflow', 'hidden')
  $('.container-after-titlebar').append(slink.replace(/streamerId/gi, remote.getGlobal('sharedObject').id))
  $('iframe[height=378]').css('width', '100vw')
  $('iframe[height=378]').css('height', 'calc(100vh - 30px)')
})

const slink = `<iframe src="https://player.twitch.tv/?channel=streamerId" frameborder="0" allowfullscreen="true" scrolling="no"
height="378" width="620"></iframe><a href="https://www.twitch.tv/streamerId?tt_content=text_link&tt_medium=live_embed"
style="padding:2px 0px 4px; display:block; width:345px; font-weight:normal; font-size:10px; text-decoration:underline;">`
// TODO: Going to be added
const clink = '<iframe src="https://www.twitch.tv/embed/streamerId/chat" frameborder="0" scrolling="no" height="500" width="350"></iframe>'
$(document).ready(() => {

})
