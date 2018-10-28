//useless
class StreamGetter {
    constructor(props) {
        this.http = new Windows.Web.Http.HttpClient();
        this.streamUrlArr = [];
        this.tableElemet = props.tableEl;
    }
}