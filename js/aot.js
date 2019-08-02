// TODO: 간단화 하기

$(document).ready(function () {
    const {
        remote
    } = require('electron')
    const {
        Menu,
        MenuItem
    } = remote
    const customTitlebar = require('custom-electron-titlebar');
    var Titlebar = new customTitlebar.Titlebar({
        backgroundColor: customTitlebar.Color.fromHex('#2C2541')
    });

    function DownNofi(text, fa) {
        if ($("#update-banner").text() == "") alert(text);
        let banner = $("#update-banner");
        let nofi = $("#nofitext")
        nofi.text(text)
        banner.css("visibility", "visible");
        banner.addClass('slideInUp');
        nofi.addClass(fa)
        banner.one("animationend", function () {
            $(this).removeClass("slideInUp")
            $(this).addClass("slideOutDown delay-1s slow")
            $(this).one("animationend", function () {
                $(this).removeClass("slideOutDown delay-1s slow")
                nofi.removeClass(fa)
                $(this).css("visibility", "hidden");
            });
        });
    }

    function UpdateCheck() {
        var request = require("request")
        // TODO: uri.all.js.map, performance-now.js.map 버그 고치기 (취약점 가능)
        request({
                url: "https://api.github.com/repos/Bananamilk452/TwitchAOT/releases/latest",
                method: "GET",
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.121 Electron/5.0.6 Safari/537.36"
                }
            },
            function (err, res, body) {
                let gparse = JSON.parse(body)
                let CheckedVersion = gparse.tag_name;
                console.log(gparse + CheckedVersion)
                if (CheckedVersion.substring(1) > require('electron').remote.getGlobal('sharedObject').version) {
                    // TODO: 인터넷 연결 없을때 try문으로 제외시키기
                    // TODO: 로거 만들기
                    var downloadRelease = require('@terascope/fetch-github-release');

                    // 릴리즈 필터
                    function filterRelease(release) {
                        return release.prerelease === false;
                    }
                    // 에셋 플랫폼 필터
                    function filterAsset(asset) {
                        // win32-x64 빌드만 다운로드
                        return asset.name.indexOf('setup') >= 0;
                    }
                    DownNofi("다운로드 및 설치 중입니다.", "fa-download")
                    downloadRelease("Bananamilk452", "twitchaot", "./", filterRelease, filterAsset, false, false)
                        .then(function () {
                            function UpdateProcess() {
                                var exec = require('child_process').execFile;
                                var fs = require('fs')
                                exec('twitchaot-' + gparse.tag_name.substring(1) + '-setup.exe', function (err, data) {
                                    console.log(err)
                                    console.log(data.toString());
                                    fs.unlinkSync('twitchaot-' + gparse.tag_name.substring(1) + '-setup.exe')
                                    require('electron').remote.getCurrentWindow().close()
                                })
                            }
                            UpdateProcess()
                            console.log('All done!');
                        })
                        .catch(function (err) {
                            DownNofi("업데이트 확인을 한번 더 눌러주세요.", "fa-times")
                            console.error(err.message);
                        });

                } else if (CheckedVersion.substring(1) <= require('electron').remote.getGlobal('sharedObject').version) {
                    // TODO: 방송 볼 떄 배너 살리기
                    DownNofi("TwitchAOT가 최신버전입니다.", "fa-check")
                }
            });
    }

    const menu = new Menu();
    menu.append(new MenuItem({
        // TODO: 할 거 추가
        label: '$menu$',
        submenu: [{
                label: '업데이트 확인',
                click: () => UpdateCheck()
            },
            {
                label: '개발자 도구 열기',
                click: () => require('electron').remote.getCurrentWebContents().openDevTools()
            },
            {
                type: 'separator'
            },
            {
                label: "버전 v" + require('electron').remote.getGlobal('sharedObject').version
            },
            {
                label: '서드파티 라이브러리 정보',
            },
            {
                label: '환경설정', // TODO: 새 창 열기 
            }
        ]
    }));
    menu.append(new MenuItem({
        label: '$resolution$',
        submenu: [{
                label: '1920x1080',
                click: () => require('electron').remote.getCurrentWindow().setContentSize(1920, 1110)
            },
            {
                label: '1600x900',
                click: () => require('electron').remote.getCurrentWindow().setContentSize(1600, 930)
            },
            {
                label: '1366x768',
                click: () => require('electron').remote.getCurrentWindow().setContentSize(1366, 798)
            },
            {
                label: '1280x720',
                click: () => require('electron').remote.getCurrentWindow().setContentSize(1280, 750)
            },
            {
                label: '960x540',
                click: () => require('electron').remote.getCurrentWindow().setContentSize(960, 570)
            },
            {
                label: '640x360',
                click: () => require('electron').remote.getCurrentWindow().setContentSize(640, 390)
            },
            {
                label: '535x301',
                click: () => require('electron').remote.getCurrentWindow().setContentSize(535, 331)
            },
            {
                label: '400x225',
                click: () => require('electron').remote.getCurrentWindow().setContentSize(400, 255)
            }
        ]
    }));
    menu.append(new MenuItem({
        label: '$refresh$',
        click: () => window.location.reload(true)
    }));


    Titlebar.updateMenu(menu);

    $("input").on("keyup", function (event) {
        // Number 13 is the "Enter" key on the keyboard
        if (event.keyCode === 13) {
            $("#move").click();
        }
    });

});

let slink = `<iframe src="https://player.twitch.tv/?channel=0streamer0" frameborder="0" allowfullscreen="true" scrolling="no"
height="378" width="620"></iframe><a href="https://www.twitch.tv/0streamer0?tt_content=text_link&tt_medium=live_embed"
style="padding:2px 0px 4px; display:block; width:345px; font-weight:normal; font-size:10px; text-decoration:underline;">`
let clink = `<iframe src="https://www.twitch.tv/embed/0streamer0/chat" frameborder="0" scrolling="no" height="500" width="350"></iframe>`
$(document).ready(function () {
    $(".menubar-menu-title")[0].innerHTML = ""
    $(".menubar-menu-title")[0].className += " fa fa-bars"
    $(".menubar-menu-title")[1].innerHTML = ""
    $(".menubar-menu-title")[1].className += " fa fa-desktop"
    $(".menubar-menu-title")[2].innerHTML = ""
    $(".menubar-menu-title")[2].className += " fa fa-repeat"
});

function twitch_move() {
    // TODO: 빈칸일 경우에 dialog 띄우기
    let twitchid = $("input").val()
    $(".paper").remove()
    $(".container-fluid").remove()
    $(".container-after-titlebar").css('overflow', 'hidden')
    $(".container-after-titlebar").append(slink.replace(/0streamer0/gi, twitchid));
    $("iframe[height=378]").css('width', '100vw')
    $("iframe[height=378]").css('height', 'calc(100vh - 30px)')
}

function follow_move() {
    // TODO: 빈칸일 경우에 dialog 띄우기
    let twitchid = $("#id").val()
    var follower, guid, name, guidlist, idlist;
    guidlist = "https://api.twitch.tv/helix/streams?"
    idlist = "https://api.twitch.tv/helix/users?"
    var request = require("request")
    request({
            url: "https://api.twitch.tv/helix/users?login=" + twitchid,
            method: "GET",
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.121 Electron/5.0.6 Safari/537.36",
                "Authorization": "Bearer kihnu5gzn0kp6j98upo83ppow60ty0"
            }
        },
        function (err, res, body) {
            let parse = JSON.parse(body)
            name = parse.data[0].display_name
            guid = parse.data[0].id
            request({
                    url: "https://api.twitch.tv/helix/users/follows?from_id=" + guid + "&first=100",
                    method: "GET",
                    headers: {
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.121 Electron/5.0.6 Safari/537.36",
                        "Authorization": "Bearer kihnu5gzn0kp6j98upo83ppow60ty0"
                    }
                },
                function (err, res, body) {
                    let parse = JSON.parse(body)
                    for (var i = 0; i < parse.total; i++) {
                        guidlist = guidlist + "user_id=" + parse.data[i].to_id + "&"
                    }
                    request({
                            url: guidlist + "first=100",
                            method: "GET",
                            headers: {
                                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.121 Electron/5.0.6 Safari/537.36",
                                "Authorization": "Bearer kihnu5gzn0kp6j98upo83ppow60ty0"
                            }
                        },
                        function (err, res, body) {
                            var pdata = JSON.parse(body)
                            for (var i = 0; i < Object.keys(pdata.data).length; i++) {
                                idlist += "id=" + pdata.data[i].user_id + "&"
                            }
                            request({
                                url: idlist,
                                method: "GET",
                                headers: {
                                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.121 Electron/5.0.6 Safari/537.36",
                                    "Authorization": "Bearer kihnu5gzn0kp6j98upo83ppow60ty0"
                                }
                            },
                            function (err, res, body) {
                                var profile = JSON.parse(body)
                                
                                $('#entry').remove()
                                $('#entry').remove()
                                for (var i = 0; i < Object.keys(pdata.data).length; i++) {
                                    console.log(pdata.data[i].user_name)
                                    $('#cover').append(`<div class="paper" style="float:left; margin-right:1rem;"><img width="100" height="100" src="${profile.data[i].profile_image_url}"/><p style="margin:0; line-height:1.8em; display:inline;"><br />${profile.data[i].display_name} (${profile.data[i].login})<br />${pdata.data[i].viewer_count}</p><p style="float:left;margin:0;margin-right:5px;font-size:10px;color:#e21212;">●</p></div>`)
                                }
                            })
                        });
                });
        });
}