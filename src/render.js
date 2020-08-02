import EventEmitter from "./events.js"

/**
 * 渲染器
 * @class
 */
export default class Render extends EventEmitter {
    
    /**
     * @param {element} [el] 画布节点
     * @param {element} [render] 渲染画布节点
     * @param {number} [rate] 帧移动速率
     * @param {string} [default.color] 默认字体颜色
     * @param {number} [default.opacity] 默认字体透明度
     * @param {number} [default.size] 默认字体大小
     * @param {string} [default.font] 默认字体
     * @constructor
     */
    constructor(option) {
        super()
        this.index = 0
        this.offset = 0
        this.stack = []
        this.option = option
        this.context = option.render.getContext("2d")
        this.context.font = [option.default.size, option.default.font].join("px ")
        setInterval(this.poll.bind(this), 1000)
    }
    
    /**
     * 主循环
     * @returns {void}
     * @private
     */
    async poll() {
        const {rate} = this.option
        const {clientWidth} = this.option.el
        this.offset += Math.floor(clientWidth / rate)
        this.index += 1
        await this.done()
    }
    
    /**
     * 计算最大行数
     *
     * 画布高度 / 字体大小 - 1,
     * 减去1是为了对其数组索引为0开头.
     * @returns {void}
     * @private
     */
    max_row() {
        const size = this.option.default.size
        const height = this.option.render.height
        return Math.floor(height / size) - 1
    }
    
    /**
     * 内容最大宽度
     * @returns {number}
     * @private
     */
    max_width() {
        return this.stack[this.stack.length - 1]
            .map(x => x.offset + x.width)
            .reduce((x, y) => x > y ? x : y)
    }
    
    /**
     * 获取图像数据
     * @returns {Promise<Blob>}
     * @private
     */
    as_blob() {
        return new Promise(resolve => {
            this.option.render.toBlob(resolve)
        })
    }
    
    /**
     * 保存截图
     * @returns {Promise<Blob>}
     * @private
     */
    async save() {
        const max = this.max_width()
        const blob = await this.as_blob()
        this.emit("frame", blob, max)
        this.clear()
    }
    
    /**
     * 检查是否完成单帧
     * @returns {void}
     * @private
     */
    async done() {
        const reslove = this.index >= this.option.rate
        const empty = this.stack.length === 0
        !empty && reslove && this.save()        
        reslove && this.reserve()
    }
    
    /**
     * 绘图
     * @param {number} index 外层索引
     * @param {number} i 内层索引
     * @param {object} value 元素
     * @param {numer} max 最大行索引
     * @returns {void}
     * @private
     */
    draw(index, i, value, max) {
        const row = i > max ? i - max : i
        const top = (row + 1) * this.option.default.size
        this.stack[index][i].offset = this.offset
        this.stack[index][i].width = this.context.measureText(value.text).width + 20
        this.context.fillStyle = value.color || this.option.default.color
        this.context.fillText(value.text, this.stack[index][i].offset, top)
    }
    
    /**
     * 渲染弹幕
     * @returns {void}
     * @private
     */
    forward() {
        const max = this.max_row()
        const index = this.stack.length - 1
        this.stack[index].forEach((value, i) => {
            this.draw(index, i, value, max)
        })
    }
    
    /**
     * 恢复初始状态
     * @returns {void}
     * @public
     */
    reserve() {
        this.offset = 0
        this.index = 0
    }
    
    /**
     * 清空画布
     * @returns {void}
     * @private
     */
    clear() {
        const {width, height} = this.option.render
        this.context.clearRect(0, 0, width, height)
        this.stack = []
    }
    
    /**
     * 推送弹幕列表
     * @param {object[]} values 弹幕列表
     * @returns {void}
     * @public
     */
    push(values) {
        this.stack.push(values)
        this.forward()
    }
}