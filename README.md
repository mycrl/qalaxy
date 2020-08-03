# Qalaxy

高性能海量弹幕组件, 该组件的性能可以达到您浏览器或者物理机的承受极限.
与常规弹幕系统不同, 这个组件使用了离屏预渲染来解决海量弹幕下的渲染问题.
不过值得注意的是, 因为该组件使用预生成静态图片来做弹幕显示, 所以对于复杂弹幕不支持（比如：不同速度、可点击等）.


### 版本
0.0.1 (预览版本)


### 现有问题
* 首屏渲染延迟问题.
* 单弹幕字体样式定义.
* 更灵活的控制（暂停恢复等）.


### API

#### `{@class}` new Qalaxy(option): Qalaxy
- `option`  `{Option}` 事件循环总线.

#### `{@interface}` Option
- `el` `{Element}` 容器节点.
- `rate` `{number}` 弹幕速率 (弹幕多少秒从屏幕右边到左边).
- `color` `{string}` 默认字体颜色.
- `opacity` `{number}` 透明度.
- `size` `{number}` 字体大小.
- `font` `{string}` 字体.

#### `{@interface}` Value
- `text` `{string}` 弹幕内容.
- `color` `{string}` 弹幕颜色.

#### `{@function}` Qalaxy.append(values): void
- `values` `{Array<Value>}` 弹幕列表.


### License
[GPL](./LICENSE)
Copyright (c) 2020 Mr.Panda.