document.getElementById('submit').addEventListener('click', loadInfo);
const http = new Windows.Web.Http.HttpClient();
const table = document.getElementById('table');
var streamArr = [];

function loadInfo() {
    table.innerHTML = '';
    Debug.writeln("Clicked");
    const roomId = document.getElementById('roomId_inline').value;
    getBilibiliFlv({ roomId });
}

function getBilibiliFlv({
    roomId
}) {
    roomId = parseInt(roomId);
    http.getStringAsync(new Windows.Foundation.Uri('https://api.live.bilibili.com/room/v1/Room/room_init?id=' + roomId))
        .done(realRoomId => {
                realRoomId = JSON.parse(realRoomId);
                if (realRoomId.code !== 0) {
                    var alert = new Windows.UI.Popups.MessageDialog("未找到对应的房间号/房间号不存在");
                    alert.showAsync();
                } else {
                    http.getStringAsync(new Windows.Foundation.Uri('https://api.live.bilibili.com/api/playurl?cid=' + realRoomId.data.room_id + '&otype=json&quality=0&platform=web'))
                        .done(streamUri => {
                            streamUri = JSON.parse(streamUri);
                            if (!streamUri.durl) {
                                var alert = new Windows.UI.Popups.MessageDialog("未解析到对应的房间号");
                                alert.showAsync();
                            } else {
                                streamArr = streamUri.durl;
                                var successAlert = new Windows.UI.Popups.MessageDialog("获取成功");
                                successAlert.showAsync();
                                Debug.writeln(JSON.stringify(streamArr));
                                table.innerHTML = bilibiliTableStringBuilder(streamArr);
                            }
                        });
                }
            }, error => {
                var alert = new Windows.UI.Popups.MessageDialog("获取信息失败，请检查您的网络链接/流服务平台状态");
                alert.showAsync();
            });
}

function bilibiliTableStringBuilder(streamArr) {
    Debug.writeln("String Build Triggered");
    const tableStringBegin = `<table class="responsive-table highlight striped">
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
    streamArr.map((item, i) => {
        if (i !== 1) {
            tableContentString += `
                    <tr>
                        <td>视频</td>
                        <td>原画</td>
                        <td>${item.url}</td>
                    </tr>`;
        }
    });

    return tableStringBegin + tableContentString + tableStringEnd;
}