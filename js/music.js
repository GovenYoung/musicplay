//接口地址： https://autumnfish.cn/song/url
//搜索接口地址： https://autumnfish.cn/search
var bg = new Vue({
    el: "#bg",
    data: {
        // 关键字
        keyWord: "许嵩",
        // 歌曲列表
        musicList: [],
        // 音乐播放路径
        musicUrl: "",
        // 歌曲图片路径
        picUrl: "../img/default.png",
        // 是否为热门榜单
        isHot: true,
        // 歌曲评论列表
        comments: [],
        // 热门评论
        hotComments: [],
        // 是否播放
        isPlaying: false,
        // 正在播放
        playingMusic: "",
        // mv遮罩是否显示
        isShow: false,
        // mv地址
        mvUrl: "",
    },
    methods: {
        // 关键字查找
        search: function (keyWord) {
            // 定义this指向
            var that = this;
            // 获取搜索类容
            axios.get('https://autumnfish.cn/search?limit=50&keywords=' + keyWord)
                .then(function (data) {
                    that.musicList = data.data.result.songs
                    console.log(that.musicList)
                    that.isHot = false;
                }, function (err) { console.log(err) })
        },
        // 歌曲播放
        playMusic: function (id, name, artists) {
            // 定义this指向
            var that = this;
            // 获取正在播放的歌曲
            this.playingMusic = name + ' - ' + artists
            // 获取歌曲播放路径
            axios.get('https://autumnfish.cn/song/url?id=' + id)
                .then(function (data) {
                    that.musicUrl = data.data.data[0].url;
                }, function (err) { console.log(err) });
            // 获取歌曲封面
            axios.get('https://autumnfish.cn/song/detail?ids=' + id)
                .then(function (data) {
                    that.picUrl = data.data.songs[0].al.picUrl;
                }, function (err) { });
            // 获取歌曲评论
            axios.get('https://autumnfish.cn/comment/music?id=' + id)
                .then(function (data) {
                    that.comments = data.data.comments
                    that.hotComments = data.data.hotComments
                }, function (err) { });

        },
        play: function () {
            this.isPlaying = true;
        },
        pause: function () {
            this.isPlaying = false;
        },
        mvPlaying: function (mvid) {
            var that = this;
            audio.pause();
            axios.get('https://autumnfish.cn/mv/url?id=' + mvid)
                .then(function (data) {
                    that.mvUrl = data.data.data.url;
                    that.isShow = true;

                }, function (err) { })
        },
        mvClose: function () {
            this.isShow = false;
            this.mvUrl = "";

        }
    },
});

var audio = document.querySelector('#audio');
// 获取推荐歌曲榜单
function hotMusic() {
    // 获取推荐歌曲列表
    axios.get('https://autumnfish.cn/personalized/newsong?limit=20')
        .then(function (data) {
            data.data.result.forEach((item, index) => {
                bg.musicList.push(item)
            });
        }, function (err) { })
}
// 执行
hotMusic();