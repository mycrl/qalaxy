"use strict"

/**
 * 阻塞队列
 * @class
 */
export default class Queue {
    
    /**
     * @param {number} rate 速率
     * @constructor
     */
    constructor (rate) {
        this.done = true
        this.rate = rate
        this.queue = []
    }
    
    /**
     * 主循环
     * @returns {Promise<void>}
     * @private
     */
    async poll() {
        this.done = false
        const template = new Array(this.rate).fill(undefined)
        const values = template.map(() => this.queue.shift())
        const filter = values.filter(v => v !== undefined)
        const worker = filter.map(x => this.listener(x))
        void await Promise.all(worker)
        this.done = true
    }

    /**
     * 队列更新
     * @returns {Promise<void>}
     * @private
     */
    async change() {
        await undefined
        if (!this.done) return null
        if (this.done) void await this.poll()
        if (this.queue.length > 0) return this.change()
    }
    
    /**
     * 消费消息
     * @param {async function} handle 处理函数
     * @returns {void}
     * @public
     */
    consume(handle) {
        this.listener = handle
    }

    /**
     * 生产消息
     * @param {any} message 消息
     * @returns {void}
     * @private
     */
    produce(message) {
        this.queue.push(message)
        return this.change()
    }
}