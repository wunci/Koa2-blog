function pagination(data, callback) {
    // css样式
    if (!document.getElementById('pageStyle')) {
        var style = document.createElement('style')
        style.id = 'pageStyle'
        style.innerHTML = '.pagination{text-align:right;overflow:hidden;float:right;margin-bottom:20px;}.goto{float:left;overflow:hidden;}.goto i{float:left;}.pagination a,.pagination span{margin:0 2px;padding:8px 15px;color:#428bca;background:#fff;text-decoration:none;border:1px solid #ddd;border-radius:4px;user-select:none;cursor:pointer;float:left;display:block;height:20px;}.pagination a:hover,.pagination span:hover{color:#fff;background:#428bca}.pagination .active{color:#fff;background:#428bca;cursor:default;}.pagination input{width:80px;padding:7px 0;border:none;outline:0;border:1px solid #ddd;border-radius:4px;text-align:center;margin:0 5px;float:left;height:20px;}.pagination i{font-style: normal;margin:0 5px;color:#999;float:left;line-height:34px;}.pagination input:focus{border:1px solid #428bca}'
        document.getElementsByTagName('head')[0].appendChild(style)
    }
    var page = document.getElementById(data.selector.slice(1)),
        nextPage = document.getElementById('nextPage'),
        prevPage = document.getElementById('prevPage'),
        inputGo = document.getElementById('inputGo'),
        currentPage = data.currentPage,
        nowPage = currentPage ? currentPage : 1,
        visiblePage = Math.ceil(data.visiblePage / 2),
        i_html = '',
        pageOneLoad = data.pageOneLoad ? false : true;
    // 初始化
    pageAction(nowPage)

    function pageAction(dataPage) {
        nowPage = dataPage;
        i_html = '';
        console.log(data.count);
        var count = data.count <= 1 ? 1 : data.count ? data.count : 2
        startPage = dataPage - data.count <= 1 ? 1 : dataPage - data.count,
            endPage = dataPage + data.count >= data.totalPage ? data.totalPage : dataPage + data.count,
            prevPage = data.prev ? data.prev : '<',
            nextPage = data.next ? data.next : '>';
        console.log(dataPage);
        if (dataPage > 1) {
            i_html += '<span id=\"prevPage\">' + prevPage + '</span>'
            if (data.first) {
                i_html += '<a data-page="1" href=\"javascript:void(0);\">首页</a>'
            }
        }
        if (dataPage > 5 ) {
            for (var i = 1; i <= 2; i++) {
                i_html += '<a data-page="' + i + '" href=\"javascript:void(0);\">' + i + '</a>'
            }
            i_html += '<span>...</span>'
        }
        for (var j = startPage; j <= endPage; j++) {
            i_html += '<a data-page="' + j + '" href=\"javascript:void(0);\">' + j + '</a>'
        }
        if (endPage + 1 < data.totalPage) {
            i_html += '<span>...</span>'
            for (var i = (endPage > data.totalPage - 2 ? data.totalPage : data.totalPage - 1); i <= data.totalPage; i++) {
                i_html += '<a data-page="' + i + '" href=\"javascript:void(0);\">' + i + '</a>'
            }
            if (data.last) {
                i_html += '<a data-page="' + data.totalPage + '" href=\"javascript:void(0);\">尾页</a>'
            }
            i_html += '<span id=\"nextPage\">' + nextPage + '</span>'
        }
        if (data.showTotalPage && data.totalPage >= 1) {
            i_html += '<i>当前第' + nowPage + '页/共有' + data.totalPage + '页</i>'
        }
        if (data.jumpBtn && data.totalPage >= 1) {
            i_html += '<div class="goto"><i>前往</i><input id="pageInput" type="text" /><i>页</i> <span id="inputGo">确定</span></div>'
        }
        page.innerHTML = i_html;
        var pageA = page.getElementsByTagName('a');
        for (var i = 0, pageALength = pageA.length; i < pageALength; i++) {
            pageA[i].className = ''
            if (pageA[i].getAttribute('data-page') == dataPage) {
                pageA[i].className = "active"
            }
        }
        // 第一页不请求
        if (!pageOneLoad) {
            callback && callback.call(null, dataPage)
        }
    }
    page.onclick = function(event) {
        var event = event || window.event,
            target = event.target || event.srcElement,
            dataPage = parseInt(target.getAttribute('data-page'));
        pageOneLoad = false;
        if (target.className == 'active') return
        if (target.nodeName.toLowerCase() == 'a') {
            pageAction(dataPage)
        }
        if (target.id == 'nextPage') {
            nowPage++
            pageAction(nowPage)
        }
        if (target.id == 'prevPage') {
            nowPage--
            pageAction(nowPage)
        }
        if (target.id == 'inputGo') {
            var pageInput = document.getElementById('pageInput'),
                goPage = pageInput.value > data.totalPage ? 1 : /[1-9]+/g.test(pageInput.value) ? pageInput.value : 1;
            pageAction(parseInt(goPage))
        }
    }
}