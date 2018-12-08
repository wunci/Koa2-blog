/**
 * 简单分页类
 */
class SimplePagination {
    constructor (totalPageCount) {
      if (!totalPageCount) return
      this.state = {
        pageNumber: 1,
        totalPageCount
      }
    }
  
    init (paramsObj) {
      let state = this.state
      // 页面元素的外部容器
      state.container = paramsObj.container || 'body'
      // 不包括开头和结尾的两个固定按钮外，中间最多展示几个数字页码按钮
      state.maxShowBtnCount = paramsObj.maxShowBtnCount || 5
      // 所有的页码元素，包括上一页、下一页
      state.pCName = paramsObj.pCName || 'page-li',
      // 当选中页码时添加的类名class
      state.activeCName = paramsObj.activeCName || 'page-active',
      // 代表页码数字的属性
      state.dataNumberAttr = paramsObj.dataNumberAttr || 'data-number',
      // 上一页 按钮的类名class
      state.prevCName = paramsObj.prevCName || 'page-prev',
      // 下一页 按钮的类名class
      state.nextCName = paramsObj.nextCName || 'page-next',
      // 禁用 上一页 按钮时给此按钮添加的类名class
      state.disbalePrevCName = paramsObj.disbalePrevCName || 'no-prev',
      // 禁用 下一页 按钮时给此按钮添加的类名class
      state.disbaleNextCName = paramsObj.disbaleNextCName || 'no-next',
      // 不包括 上一页 下一页 省略号 按钮的页码元素类名
      state.pageNumberCName = paramsObj.pageNumberCName || 'page-number'
      // 触发切换页面的事件
      state.swEvent = paramsObj.swEvent || 'click'
      // 切换页面时调用的函数
      state.onPageChange = paramsObj.onPageChange
      // 当需要省略符号占位时，确定 active的位置
      state.totalPageCount > state.maxShowBtnCount + 2 && (state.activePosition = Math.ceil(state.maxShowBtnCount / 2))
      this.renderPageDOM()
    }
  
    switchPage () {
      let state = this.state
      let pCNameList = this.selectorEle('.' + state.pCName, true)
      let pageNumber
      pCNameList.forEach(item => {
        item.addEventListener(state.swEvent, e => {
          const currentPageEle = e.target
          if (this.hasClass(currentPageEle, state.activeCName)) return
          let dataNumberAttr = currentPageEle.getAttribute(state.dataNumberAttr)
          if (dataNumberAttr) {
            // 点击 数字 按钮
            pageNumber = +dataNumberAttr
          } else if (this.hasClass(currentPageEle, state.prevCName)) {
            // 点击 上一页 按钮
            state.pageNumber > 1 && (pageNumber = state.pageNumber - 1)
          } else if (this.hasClass(currentPageEle, state.nextCName)) {
            // 点击 下一页 按钮
           state.pageNumber <= state.totalPageCount && (pageNumber = state.pageNumber + 1)
          }
          pageNumber && this.gotoPage(pageNumber)
        })
      })
    }
    gotoPage (pageNumber) {
      let state = this.state
      let evaNumberLi = this.selectorEle('.' + state.pageNumberCName, true)
      let len = evaNumberLi.length
      if (!len || this.isIllegal(pageNumber)) return
      // 清除 active 样式
      this.removeClass(this.selectorEle(`.${state.pCName}.${state.activeCName}`), state.activeCName)
      if (state.activePosition) {
        let rEllipseSign = state.totalPageCount - (state.maxShowBtnCount - state.activePosition) - 1
        // 左边不需要出现省略符号占位
        if (pageNumber <= state.maxShowBtnCount && (pageNumber < rEllipseSign)) {
          if (+evaNumberLi[1].getAttribute(state.dataNumberAttr) > 2) {
            for (let i = 1; i < state.maxShowBtnCount + 1; i++) {
              evaNumberLi[i].innerText = i + 1
              evaNumberLi[i].setAttribute(state.dataNumberAttr, i + 1)
            }
          }
          this.hiddenEllipse('.ellipsis-head')
          this.hiddenEllipse('.ellipsis-tail', false)
          this.addClass(evaNumberLi[pageNumber - 1], state.activeCName)
        }
        // 两边都需要出现省略符号占位
        if (pageNumber > state.maxShowBtnCount && pageNumber < rEllipseSign) {
          // 针对 maxShowBtnCount===1 的特殊处理
          this.hiddenEllipse('.ellipsis-head', pageNumber === 2 && state.maxShowBtnCount === 1)
          this.hiddenEllipse('.ellipsis-tail', false)
          for (let i = 1; i < state.maxShowBtnCount + 1; i++) {
            evaNumberLi[i].innerText = pageNumber + (i - state.activePosition)
            evaNumberLi[i].setAttribute(state.dataNumberAttr, pageNumber + (i - state.activePosition))
          }
          this.addClass(evaNumberLi[state.activePosition], state.activeCName)
        }
        // 右边不需要出现省略符号占位
        if (pageNumber >= rEllipseSign) {
          this.hiddenEllipse('.ellipsis-tail')
          this.hiddenEllipse('.ellipsis-head', false)
          if (+evaNumberLi[len - 2].getAttribute(state.dataNumberAttr) < state.totalPageCount - 1) {
            for (let i = 1; i < state.maxShowBtnCount + 1; i++) {
              evaNumberLi[i].innerText = state.totalPageCount - (state.maxShowBtnCount - i) - 1
              evaNumberLi[i].setAttribute(state.dataNumberAttr, state.totalPageCount - (state.maxShowBtnCount - i) - 1)
            }
          }
          this.addClass(evaNumberLi[(state.maxShowBtnCount + 1) - (state.totalPageCount - pageNumber)], state.activeCName)
        }
      } else {
        // 不需要省略符号占位
        this.addClass(evaNumberLi[pageNumber - 1], state.activeCName)
      }
      state.pageNumber = pageNumber
      state.onPageChange && state.onPageChange(state)
      // 判断 上一页 下一页 是否可使用
      this.switchPrevNextAble()
    }
  
    switchPrevNextAble () {
      let state = this.state
      let prevBtn = this.selectorEle('.' + state.prevCName)
      let nextBtn = this.selectorEle('.' + state.nextCName)
      // 当前页已经是第一页，则禁止 上一页 按钮的可用性
      state.pageNumber > 1
        ? (this.hasClass(prevBtn, state.disbalePrevCName) && this.removeClass(prevBtn, state.disbalePrevCName))
        : (!this.hasClass(prevBtn, state.disbalePrevCName) && this.addClass(prevBtn, state.disbalePrevCName))
      // 当前页已经是最后一页，则禁止 下一页 按钮的可用性
      console.log(state.pageNumber >= state.totalPageCount);
      state.pageNumber >= state.totalPageCount
        ? (!this.hasClass(nextBtn, state.disbaleNextCName) && this.addClass(nextBtn, state.disbaleNextCName))
        : (this.hasClass(nextBtn, state.disbaleNextCName) && this.removeClass(nextBtn, state.disbaleNextCName))
    }
  
    renderPageDOM () {
      // 渲染页码DOM
      let state = this.state
      let pageContainer = this.selectorEle(state.container)
      if (!pageContainer) return
      let { totalPageCount, pCName, prevCName, disbalePrevCName, pageNumberCName,
        activeCName, dataNumberAttr, maxShowBtnCount,nextCName, disbaleNextCName } = state
      let paginationStr = `
      <ul class="pagination">
      <li class="${pCName} ${prevCName} ${disbalePrevCName}">上一页</li>
      <li class="${pCName} ${pageNumberCName} ${activeCName}" ${dataNumberAttr}='1'>1</li>
      `
      if (totalPageCount - 2 > maxShowBtnCount) {
        paginationStr += `
        <li class="${pCName} number-ellipsis ellipsis-head" style="display: none;">...</li>`
        for (let i = 2; i < maxShowBtnCount + 2; i++) {
          paginationStr += `<li class="${pCName} ${pageNumberCName} ${i === 1 ? activeCName : ''}" ${dataNumberAttr}='${i}'>${i}</li>`
        }
        paginationStr += `
        <li class="${pCName} number-ellipsis ellipsis-tail">...</li>
        <li class="${pCName} ${pageNumberCName}" ${dataNumberAttr}='${totalPageCount}'>${totalPageCount}</li>
        `
      } else {
        for (let i = 2; i <= totalPageCount; i++) {
          paginationStr += `<li class="${pCName} ${pageNumberCName}" ${dataNumberAttr}='${i}'>${i}</li>`
        }
      }
      paginationStr += `<li class="${pCName} ${nextCName}${totalPageCount === 1 ? ' ' + disbaleNextCName : ''}">下一页</li></ul>`
      pageContainer.innerHTML = paginationStr
      // 切换页码
      this.switchPage()
    }
  
    isIllegal (pageNumber) {
      let state = this.state
      return (
        state.pageNumber === pageNumber || Math.ceil(pageNumber) !== pageNumber ||
        pageNumber > state.totalPageCount || pageNumber < 1 ||
        typeof pageNumber !== 'number' || pageNumber !== pageNumber
      )
    }
  
    hiddenEllipse (selector, shouldHidden = true) {
      this.selectorEle(selector).style.display = shouldHidden ? 'none' : ''
    }
  
    selectorEle (selector, all = false) {
      return all ? document.querySelectorAll(selector) : document.querySelector(selector)
    }
  
    hasClass (eleObj, className) {
      return eleObj.classList.contains(className);
    }
  
    addClass (eleObj, className) {
        eleObj.classList.add(className);
    }
  
    removeClass (eleObj, className) {
      if (this.hasClass(eleObj, className)) {
          eleObj.classList.remove(className);
      }
    }
  }