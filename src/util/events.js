"use strict"

/**
 * 事件循环类
 * @class
 */
export default class EventEmitter {
    constructor() {
        this._listener = {}
        this._events = {}
        this._index = -1
    }
    
    /**
     * 检查是否为空
     * @param {string} event 事件名
     * @returns {void}
     * @private
     */
    event_some(event) {
       if (!this._events[event]) {
            this._events[event] = new Set()
        }
    }
    
    /**
     * 绑定事件
     * @param {string} event 事件名
     * @param {funtion} handle 事件处理
     * @param {boolean} once 是否为单次监听
     * @returns {number}
     * @private
     */
    event_bind(event, handle, once) {
        this.event_some(event)
        this._index += 1
        const index = this._index
        this._events[event].add({index, handle, once})
        this._listener[index] = event
        return index
    }

    /**
     * 监听
     * @param {string} event 事件名
     * @param {funtion} handle 事件处理
     * @returns {number}
     * @public
     */
    on(event, handle) {
        return this.event_bind(event, handle, false)
    }

    /**
     * 单次监听
     * @param {string} event 事件名
     * @param {funtion} handle 事件处理
     * @returns {number}
     * @public
     */
    once(event, handle) {
        return this.event_bind(event, handle, true)
    }
    
    /**
     * 删除事件
     * @param {string} event 事件名
     * @returns {void}
     * @public
     */
    remove(event) {
        delete this._events[event]
    }
    
    /**
     * 移除监听器
     * @param {number} id 监听器ID
     * @returns {void}
     * @public
     */
    pop(id) {
        const event = this._listener[id]
        const context = this._events[event][id]
        this._events[event].delete(context)
        delete this._listener[id]
    }

    /**
     * 推送事件
     * @param {string} event 事件名
     * @param {any} argv 参数
     * @returns {void}
     * @public
     */
    emit(event, ...argv) {
        if (this._events[event]) {
            this._events[event].forEach(x => {
                x && x.handle(...argv)
                x && x.once && this._events[event]
                    .delete(x)
            })
        }
    }
}