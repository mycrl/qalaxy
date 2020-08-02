import EventEmitter from "./util/events.js"

/**
 * 可视区
 * @class
 */
export default class Display extends EventEmitter {
    
    /**
     * @param {element} [option.el] 画布节点
     * @param {element} [option.render] 渲染画布节点
     * @param {number} [option.rate] 帧移动速率
     * @param {string} [option.color] 默认字体颜色
     * @param {number} [option.opacity] 默认字体透明度
     * @param {number} [option.size] 默认字体大小
     * @param {string} [option.font] 默认字体
     * @constructor
     */
    constructor(option) {
        super()
        this.option = option
        this.display_map = []
        this.display_deplay = 0
        this.display_animation = null
        this.display_poll_worker = false
        this.display_body = document.createElement("DIV")
        this.display_view = document.createElement("CANVAS")
        this.display_context = this.display_view.getContext("2d")
        this.move_rate = this.option.el.clientWidth / option.rate / 1000
        this.display_worker = this.display_poll.bind(this)
        this.display_init()
    }
    
    /**
     * 初始化
     * @returns {void}
     * @private
     */
    display_init() {
        const {clientWidth, clientHeight} = this.option.el
        this.display_body.appendChild(this.option.render)
        this.display_body.appendChild(this.display_view)
        this.display_body.className = "Qalaxy"
        this.display_view.className = "Qalaxy_Display"
        this.display_view.width = Math.floor(clientWidth * 2)
        this.display_view.height = clientHeight
        this.display_view.style.opacity = this.option.opacity
        this.option.render.className = "Qalaxy_Render"
        this.option.render.width = Math.floor(clientWidth * 2)
        this.option.render.height = clientHeight
        this.option.el.appendChild(this.display_body)
    }
    
    /**
     * 清空画布
     * @returns {void}
     * @private
     */
    display_clear() {
        const {width, height} = this.display_view
        this.display_context.clearRect(0, 0, width, height)
    }
    
    /**
     * 绘图
     * @param {number} deplay 时间偏移
     * @returns {void}
     * @private
     */
    display_draw(deplay) {
        this.display_clear()
        const offset_date = Math.ceil(deplay - this.display_deplay)
        const move = this.display_deplay === 0 ? 0 : offset_date * this.move_rate
        this.display_map.forEach((value, i) => {
            this.display_context.drawImage(value.bitmap, value.offset, 0)
            this.display_map[i].offset -= move
        })
    }
    
    /**
     * 检查是否溢出
     * @returns {void}
     * @private
     */
    display_overflow() {
        if (this.display_map.length > 0) {
            const {offset, bitmap: {width}} = this.display_map[0]
            offset <= 0 - width && this.display_map.pop()
        }
    }
    
    /**
     * 主循环
     * @param {number} deplay 时间偏移
     * @returns {void}
     * @private
     */
    display_poll(deplay) {
        const is_empty = this.display_map.length === 0
        !is_empty && this.display_draw(deplay)
        !is_empty && this.display_start()
        is_empty && this.display_stop()
        this.display_deplay = deplay
        this.display_overflow()
    }
    
    /**
     * 停止主循环
     * @returns {void}
     * @private
     */
    display_stop() {
        this.display_poll_worker = false
        cancelAnimationFrame(this.display_animation)
    }
    
    /**
     * 启动主循环
     * @returns {void}
     * @private
     */
    display_start() {
        this.display_poll_worker = true
        const animation = requestAnimationFrame(this.display_worker)
        this.display_animation = animation
    }
    
    /**
     * 推送图像
     * @param {ImageBitmap} [bitmap] 图像
     * @returns {void}
     * @public
     */
    display_push(bitmap) {
        const {clientWidth} = this.option.el
        const template = {offset: clientWidth, bitmap: {width: 0}}
        const fore = this.display_map[0] || template
        const prediction_offset = fore.offset + fore.bitmap.width
        const is_overflow = prediction_offset <= clientWidth
        const offset = is_overflow ? clientWidth : prediction_offset
        this.display_map.unshift({bitmap, offset})
        !this.display_poll_worker && this.display_start()
    }
}