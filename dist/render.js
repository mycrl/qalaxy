import Display from "./display.js";
/**
 * 渲染器
 * @class
 */
export default class Render extends Display {
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
        super(option);
        this.render_index = 0;
        this.render_offset = 0;
        this.render_stack = [];
        this.render_context = this.option.render.getContext("2d");
        this.render_context.font = [this.option.size, this.option.font].join("px ");
        setInterval(this.render_loop.bind(this), 1000);
    }
    /**
     * 定时器循环
     * @returns {void}
     * @private
     */
    async render_loop() {
        this.render_index += 1;
        await this.render_done();
    }
    /**
     * 主循环
     * @param {number} deplay 延迟
     * @returns {void}
     * @public
     */
    async render_poll(deplay) {
        const offset_date = Math.ceil(deplay - this.deplay);
        const move = offset_date * this.move_rate;
        this.render_offset += move;
    }
    /**
     * 计算最大行数
     *
     * 画布高度 / 字体大小 - 1,
     * 减去1是为了对其数组索引为0开头.
     * @returns {number}
     * @private
     */
    render_max_row() {
        const size = this.option.size;
        const height = this.option.render.height;
        return Math.floor(height / size) - 1;
    }
    /**
     * 内容最大宽度
     * @returns {number}
     * @private
     */
    render_max_width() {
        return this.render_stack[this.render_stack.length - 1]
            .map(x => x.offset + x.width)
            .reduce((x, y) => x > y ? x : y);
    }
    /**
     * 保存截图
     * @returns {Promise<void>}
     * @private
     */
    async render_save() {
        const width = this.render_max_width();
        const render = this.option.render;
        const height = this.option.render.height;
        this.display_push(await createImageBitmap(render, 0, 0, width, height));
        this.render_clear();
    }
    /**
     * 检查是否完成单帧
     * @returns {void}
     * @private
     */
    async render_done() {
        const reslove = this.render_index >= this.option.rate;
        const empty = this.render_stack.length === 0;
        !empty && reslove && this.render_save();
        reslove && this.render_reserve();
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
    render_draw(index, i, value, max) {
        const row = i > max ? i - max : i;
        const top = (row + 1) * this.option.size;
        this.render_stack[index][i].offset = this.render_offset;
        this.render_stack[index][i].width = this.render_context.measureText(value.text).width + 20;
        this.render_context.fillStyle = value.color || this.option.color;
        this.render_context.fillText(value.text, this.render_stack[index][i].offset, top);
    }
    /**
     * 渲染弹幕
     * @returns {void}
     * @private
     */
    render_forward() {
        const max = this.render_max_row();
        const index = this.render_stack.length - 1;
        this.render_stack[index].forEach((value, i) => {
            this.render_draw(index, i, value, max);
        });
    }
    /**
     * 恢复初始状态
     * @returns {void}
     * @public
     */
    render_reserve() {
        this.render_index = 0;
        this.render_offset = 0;
    }
    /**
     * 清空画布
     * @returns {void}
     * @private
     */
    render_clear() {
        const { width, height } = this.option.render;
        this.render_context.clearRect(0, 0, width, height);
        this.render_stack = [];
    }
    /**
     * 推送弹幕列表
     * @param {object[]} values 弹幕列表
     * @returns {void}
     * @public
     */
    render_push(values) {
        this.render_stack.push(values);
        this.render_forward();
    }
}
