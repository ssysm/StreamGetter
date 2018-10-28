document.getElementById('submit').addEventListener('click', loadInfo);
const http = new Windows.Web.Http.HttpClient();
const table = document.getElementById('table');
var streamArr = [];

function loadInfo() {
    table.innerHTML = '';
    Debug.writeln("Clicked");
    const channelId = document.getElementById('channel_inline').value;
    const broadcastId = document.getElementById('broadcast_inline').value;
    getLinePlaylist({ channelId, broadcastId });
}

function getLinePlaylist({
    channelId,
    broadcastId
}) {
    channelId = parseInt(channelId);
    broadcastId = parseInt(broadcastId);
    http.getStringAsync(new Windows.Foundation.Uri('https://live-api.line-apps.com/app/v3.2/channel/' + channelId + '/broadcast/' + broadcastId + '/player_status'))
        .done(result => {
            result = JSON.parse(result);
            if (result.status === 404) {
                var noBorCIDMatch = new Windows.UI.Popups.MessageDialog("广播ID/频道ID不正确");
                noBorCIDMatch.showAsync();
            } else if (result.liveStatus === "FINISHED") {
                var streamIsFinsiedAlert = new Windows.UI.Popups.MessageDialog("直播已经结束 流链接失效");
                streamIsFinsiedAlert.showAsync();
            } else {
                streamArr = result.liveHLSURLs;
                var successAlert = new Windows.UI.Popups.MessageDialog("获取成功");
                successAlert.showAsync();
                Debug.writeln(JSON.stringify(streamArr));
                table.innerHTML = lineTableStringBuilder(streamArr);

            }
        }, error => {
            var alert = new Windows.UI.Popups.MessageDialog("获取信息失败，请检查您的网络链接/流服务平台状态");
            alert.showAsync();
        });

}


function lineTableStringBuilder() {
    Debug.writeln("String Build Triggered");
    streamArr = this.streamArr;
    const tableStringBegin = `<table>
                <thead>
                    <tr>
                        <th>类型</th>
                        <th>分辨率</th>
                        <th>链接</th>
                    </tr>
                </thead>

                <tbody>`;
    const tableStringEnd = `</tbody>
            </table>`;
    var tableContentString = '';
    var isAudio = false;
    for (key in streamArr) {
        if (key === "abr" || key === "aac") {
            isAudio = true;
        } else {
            isAudio = false;
        }
        tableContentString += `
                    <tr>
                        <td>${isAudio ? '音频' : '视频'}</td>
                        <td>${key}</td>
                        <td>${streamArr[key]}</td>
                    </tr>`;
    }


    return tableStringBegin + tableContentString + tableStringEnd;
}