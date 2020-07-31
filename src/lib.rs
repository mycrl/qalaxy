use serde::{Deserialize, Serialize};
use wasm_bindgen::{prelude::*, JsCast};
use web_sys::{CanvasRenderingContext2d, HtmlCanvasElement};

/// 内部弹幕类型
struct Item {
    text: String,
    color: String,
    width: usize,
    offset: f64,
    y: f64
}

/// 配置类型
#[wasm_bindgen]
#[derive(Serialize, Deserialize)]
pub struct Config {
    rate: f64,
    opacity: f64,
    size: f64,
    font: String,
}

/// 弹幕类型
#[wasm_bindgen]
#[derive(Serialize, Deserialize)]
pub struct Subtitle {
    text: String,
    color: String,
}

/// 弹幕类
#[wasm_bindgen]
pub struct Qalaxy {
    size: f64,
    rate: f64,
    opacity: f64,
    font: String,
    map: Vec<Vec<Subtitle>>,
    display: Vec<Vec<Item>>,
    context: CanvasRenderingContext2d,
    el: HtmlCanvasElement,
    is_init: bool,
}

#[wasm_bindgen]
impl Qalaxy {
    /// 创建实例
    ///
    /// 指定canvas节点和配置对象, 
    /// 创建弹幕插件实例.
    #[rustfmt::skip]
    #[wasm_bindgen(constructor)]
    pub fn new(el: HtmlCanvasElement, config: &JsValue) -> Self {
        let context = el
            .get_context("2d")
            .unwrap()
            .unwrap()
            .dyn_into::<CanvasRenderingContext2d>()
            .unwrap();
        let option: Config = config.into_serde().unwrap();
        Self {
            el,
            context,
            map: Vec::new(),
            display: Vec::new(),
            rate: option.rate,
            size: option.size,
            font: option.font,
            opacity: option.opacity,
            is_init: false,
        }
    }

    /// 添加弹幕列表
    ///
    /// 将弹幕列表推入到实例内部, 
    /// 由实例内部缓存弹幕列表, 
    /// 并且检查是否已经初始化, 
    /// 如果未初始化就初始化画布.
    #[wasm_bindgen]
    #[rustfmt::skip]
    pub fn append(&mut self, values: js_sys::Array) {
        let into_source = values
            .to_vec()
            .iter()
            .map(|x| x.into_serde().unwrap())
            .collect::<Vec<Subtitle>>();
        self.map.insert(0, into_source);
        if !self.is_init {
            self.is_init = true;
            self.init();
        }
    }

    /// 主循环
    ///
    /// 先检查弹幕列表长度,
    /// 如果存在未处理弹幕则压入显示区,
    /// 完成之后开始绘图.
    #[wasm_bindgen]
    #[rustfmt::skip]
    pub fn poll(&mut self) {
        if !self.map.is_empty() { self.forward() }
        if !self.display.is_empty() { self.draw() }
    }
}

impl Qalaxy {
    /// 获取最大行
    ///
    /// 通过画布高度/字体大小实现,
    /// 结果已向上取整.
    #[rustfmt::skip]
    fn max_row(&mut self) -> usize {
        ((self.el.height() as f64 / self.size).floor() - 1f64) as usize
    }

    /// 初始化画布
    ///
    /// 指定字体和字体大小,
    /// 并设置全局透明度.
    #[rustfmt::skip]
    fn init(&mut self) {
        let size = format!("{}", self.size);
        let font = [size, self.font.clone()].join("px ");
        self.context.set_global_alpha(self.opacity);
        self.context.set_font(&font);
    }

    /// 清空
    ///
    /// 将画布全部清空,
    /// 将推出列表清空.
    #[rustfmt::skip]
    fn clear_canvas(&mut self) {
        let width = self.el.width() as f64;
        let height = self.el.height() as f64;
        self.context.clear_rect(0.0, 0.0, width, height);
    }

    /// 遍历弹幕缓存
    /// 
    /// 如果当前元素索引超出最大行数,
    /// 则最大行数减去当前索引,
    /// 如果没有超出，则使用当前元素的索引,
    /// 最后将元素添加到显示区.
    #[rustfmt::skip]
    fn map_foreach(&mut self, row: usize, offset: f64, y: f64, value: &Subtitle) {
        if self.display.get(row).is_none() { self.display.insert(row, vec![]); }
        let width = self.context
            .measure_text(&value.text)
            .unwrap()
            .width() as usize;
        self.display[row].push(Item {
            color: value.color.clone(),
            text: value.text.clone(),
            offset,
            width,
            y
        })
    }

    /// 溢出检查
    /// 
    /// 检查行首元素是否溢出,
    /// 如果溢出删除行首元素.
    fn overflow_check(&mut self) {
        for index in 0..self.display.len() {
            if let Some(v) = self.display[index].get(0) {
                if v.offset < (0.0 - v.width as f64) {
                    self.display[index].remove(0);
                }
            }
        }
    }

    /// 绘图
    ///
    /// 先清空整个画布,
    /// 然后按行将所有元素全部重新渲染.
    #[rustfmt::skip]
    fn draw(&mut self) {
        self.clear_canvas();
        self.overflow_check();
        for index in 0..self.display.len() {
            for i in 0..self.display[index].len() {
                let value = &self.display[index][i];
                let offset = value.offset - self.rate;
                self.context.set_fill_style(&JsValue::from(value.color.clone()));
                self.context.fill_text(&value.text, offset, value.y).unwrap();
                self.display[index][i].offset = offset;
            }
        }
    }

    /// 将弹幕从弹幕列表压入显示区
    ///
    /// 先计算最大行,
    /// 然后数组尾部弹出元素并循环处理,
    /// 为了前进后出的原则,
    /// 因为新弹幕列表是添加到列表头部,
    /// 所以这个地方从尾部弹出单个元素.
    #[rustfmt::skip]
    fn forward(&mut self) {
        let max_rows = self.max_row() - 1;
        let offset = self.el.width() as f64;
        self.map.pop().unwrap().iter().enumerate().for_each(|(i, value)| {
            let row = if i > max_rows { i - max_rows } else { i };
            let y = (i as f64 + 1.0) * self.size;
            self.map_foreach(row, offset, y, value);
        })
    }
}
