import EventEmitter from "./events.js"

/**
 * 可视区
 * @class
 */
export default class Display extends EventEmitter {
    
    /**
     * @param {element} [el] 画布节点
     * @param {number} [rate] 帧移动速率
     * @param {string} [default.color] 默认字体颜色
     * @param {number} [default.opacity] 默认字体透明度
     * @param {number} [default.size] 默认字体大小
     * @param {string} [default.font] 默认字体
     * @constructor
     */
    constructor(option) {
        super()
        this.map = []
        this.index = 0
        this.body = document.createElement("DIV")
        this.display = document.createElement("DIV")
        this.render = document.createElement("CANVAS")
        this.values = [0, 0, 0].map(() => document.createElement("IMG"))
        this.option = Object.assign(option, { render: this.render })
        // setInterval(this.poll.bind(this), option.rate * 1000)
        this.init()
    }
    
    /**
     * 初始化
     * @returns {void}
     * @private
     */
    init() {
        const {clientWidth} = this.option.el
        const transition = this.option.rate + "s"
        this.body.appendChild(this.render)
        this.body.appendChild(this.display)
        this.option.el.appendChild(this.body)
        this.display.appendChild(this.values[0])
        this.display.appendChild(this.values[1])
        this.display.appendChild(this.values[2])
        this.body.className = "Qalaxy"
        this.display.className = "Qalaxy_Display"
        this.render.className = "Qalaxy_Render"
        this.render.width = Math.floor(this.body.clientWidth * 2)
        this.render.height = this.body.clientHeight
        this.values[0].className = "Qalaxy_Value"
        this.values[0].style.transitionDuration = transition
        this.values[0].style.left = clientWidth + "px"
        this.values[0].style.backgroundColor = "#000"
        
        this.values[1].className = "Qalaxy_Value"
        this.values[1].style.transitionDuration = transition
        this.values[1].style.left = clientWidth * 2 + "px"
        this.values[1].style.backgroundColor = "#0c9cf8"
        
        this.values[2].className = "Qalaxy_Value"
        this.values[2].style.transitionDuration = transition
        this.values[2].style.left = 0 - clientWidth + "px"
        this.values[2].style.backgroundColor = "#00b150"
    }
    
    /**
     * 下个索引
     * @param {number} index 索引
     * @returns {number}
     * @private
     */
    next_index(index) {
        const target = index + 1
        return target === 3 ? 0 : target
    }
    
    /**
     * 上个索引
     * @param {number} index 索引
     * @returns {number}
     * @private
     */
    fore_index(index) {
        const target = index - 1
        return target < 0 ? 2 : target
    }
    
    /**
     * 控制显示
     * @returns {void}
     * @private
     */
    display_update() {
        const fore = this.fore_index(this.index)
        const {opacity} = this.option.default
        this.values.forEach((value, index) => {
            value.style.opacity = fore === index ? 0 : opacity
        })
    }
    
    /**
     * 主循环
     * @returns {void}
     * @private
     */
    poll() {
        // this.map.shift()
        const {clientWidth} = this.option.el
        const next = this.next_index(this.index)
        const nexts = this.next_index(next)
        this.values[this.index].style.left = 0 - clientWidth + "px"
        this.values[nexts].style.left = clientWidth + "px"
        this.values[next].style.left = "0px"
        this.display_update()
        this.index = next
    }
    
    /**
     * 推送图像
     * @param {Blob} blob 图像数据
     * @param {number} width 图像内容宽度
     * @returns {void}
     * @public
     */
    push(blob, width) {
        this.map.push({
            url: URL.createObjectURL(blob),
            width
        })
    }
}