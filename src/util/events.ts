"use strict"

// 监听句柄
type Handle<T> = (...x: T[]) => void

/**
 * 事件
 * @param {Handle} handle
 * @param {number} index ID
 * @param {boolean} once 是否为单次监听 
 */
interface Event<T> {
    handle: Handle<T>
    index: number
    once: boolean
}

/**
 * 事件循环类
 * @class
 */
export default class EventEmitter<T> {
    private listener: {[key: number]: string}
    private events: {[key: string]: Set<Event<T>>}
    private index: number
    constructor() {
        this.listener = {}
        this.events = {}
        this.index= -1
    }
    
    /**
     * 检查是否为空
     * @param {string} event 事件名
     * @returns {void}
     * @private
     */
    private some(event: string): void {
       if (!this.events[event]) {
            this.events[event] = new Set()
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
    private bind(event: string, handle: Handle<T>, once: boolean): number {
        this.some(event)
        this.index+= 1
        const index = this.index
        this.events[event].add({index, handle, once})
        this.listener[index] = event
        return index
    }

    /**
     * 监听
     * @param {string} event 事件名
     * @param {funtion} handle 事件处理
     * @returns {number}
     * @public
     */
    public on(event: string, handle: Handle<T>): number {
        return this.bind(event, handle, false)
    }

    /**
     * 单次监听
     * @param {string} event 事件名
     * @param {funtion} handle 事件处理
     * @returns {number}
     * @public
     */
    public once(event: string, handle: Handle<T>): number {
        return this.bind(event, handle, true)
    }
    
    /**
     * 删除事件
     * @param {string} event 事件名
     * @returns {void}
     * @public
     */
    public remove(event: string): void {
        delete this.events[event]
    }

    /**
     * 推送事件
     * @param {string} event 事件名
     * @param {any} argv 参数
     * @returns {void}
     * @public
     */
    emit(event: string, ...argv: T[]): void {
        if (this.events[event]) {
            this.events[event].forEach(x => {
                x && x.handle(...argv)
                x && x.once && this.events[event]
                    .delete(x)
            })
        }
    }
}
