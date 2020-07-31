// 弹幕类
// @class
class Qalaxy {
    
    // @constructor
    // @param {Element} [el] 画布节点
    // @param {Number} [frameRate] 帧率
    // @param {Number} [rate] 帧移动速率
    // @param {String} [default.color] 默认字体颜色
    // @param {Number} [default.opacity] 默认字体透明度
    // @param {Number} [default.size] 默认字体大小
    // @param {String} [default.font] 默认字体
    constructor(option) {
        this.map = []
        this.display = []
        this.option = option
        this.context = option.el.getContext("2d")
        this.context.globalAlpha = option.default.opacity
        this.context.font = [option.default.size, option.default.font].join("px ")
        window.requestAnimationFrame(this.engine.bind(this))
    }
    
    // 弹幕引擎
    // @returns {void}
    // @private
    engine() {
        
        // 检查弹幕列表长度,
        // 如果存在未处理弹幕则压入显示区.
        if (this.map.length > 0) {
            this.move()
        }
        
        // 绘图
        // 重放动画
        this.draw()
        window.requestAnimationFrame(this.engine.bind(this))
    }
    
    // 绘图
    // @returns {void}
    // @private
    draw() {
        
        // 计算画布大小
        // 清空画布等待重新绘图
        const canvas_width = this.option.el.width
        const canvas_height = this.option.el.height
        this.context.clearRect(0, 0, canvas_width, canvas_height)
        
        // 循环显示区所有行
        for (let index = 0; index < this.display.length; index ++) {
            const row = this.display[index]
            
            // 获取行首位的偏移
            // 如果行首位已经不在可视区域,
            // 则删除当前行首.
            if (row[0] && row[0].offset < (0 - row[0].width)) {
                row.shift()
            }
            
            // 根据行索引计算Y轴
            // 循环处理行中的所有元素
            const y = (index + 1) * this.option.default.size
            for (let i = 0; i < row.length; i ++) {
                const { text, color, offset } = row[i]
                this.context.fillStyle = color || this.option.default.color
                this.display[index][i].offset -= this.option.rate
                this.context.fillText(text, row[i].offset, y)
            }
        }
    }
    
    // 将弹幕从弹幕列表压入显示区
    // @returns {void}
    // @private
    move() {
        
        // 计算最大行数
        //
        // 画布高度 / 字体大小 - 1,
        // 减去1是为了对其数组索引为0开头.
        const max_rows = Math.floor(this.option.el.height / this.option.default.size) - 1
        
        // 数组尾部弹出元素并循环处理
        //
        // 为了前进后出的原则,
        // 因为新弹幕列表是添加到列表头部,
        // 所以这个地方从尾部弹出单个元素.
        this.map.pop().forEach((value, i) => {
            
            // 如果当前元素索引超出最大行数,
            // 则最大行数减去当前索引,
            // 如果没有超出，则使用当前元素的索引.
            const row = i > max_rows ? i - max_rows : i
            
            // 检查当前行数的数组是否已经初始化,
            // 如果没有初始化则初始化当前行数组.
            if (!Array.isArray(this.display[row])) {
                this.display[row] = []
            }
            
            // 将元素添加到显示区
            //
            // 当前元素偏移计算:
            // 最后元素偏移 + 最后元素长度.
            this.display[row].push({
                width: this.context.measureText(value.text).width + 20,
                offset: this.option.el.width,
                ...value
            })
        })
    }
    
    // 添加弹幕列表
    // @param {Array<Object>} values 弹幕列表
    // @returns {void}
    // @public
    append(values) {
        this.map.unshift(values)
    }
}