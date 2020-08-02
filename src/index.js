import Render from "./render.js"
import Display from "./display.js"

/**
 * 弹幕类
 * @class
 */
export default class Qalaxy {
    
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
        this.option = option
        this.display = new Display(option)
        this.render = new Render(option)
        this.init()
    }
    
    /**
     * 初始化
     * @returns {void}
     * @private
     */
    init() {
        this.render.on("frame", (blob, width) => {
            this.display.produce({blob, width})
        })
    }
    
    /**
     * 添加弹幕列表
     * @param {object[]} values 弹幕列表
     * @returns {void}
     * @public
     */
    append(values) {
        this.render.push(values)
    }
}