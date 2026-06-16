# 尘心的轻首页

一个面向个人日常使用的浏览器轻首页，用来快速搜索、访问常用工具、查看今日待办，并记录临时灵感。

## 使用

直接打开 `index.html` 即可使用。今日待办、临时记录和搜索引擎选择会保存在当前浏览器的 `localStorage` 中。

## 搜索

- 搜索框采用输入框、搜索引擎下拉框和搜索按钮的组合
- 输入内容会实时筛选「常用网站」
- 按 Enter 或点击「搜索」会使用当前选中的搜索引擎
- 可选搜索引擎：Bing、百度、Google、GitHub
- 输入 `https://example.com` 或 `www.example.com` 可直接打开网址

在页面空白处按 `/` 可以快速聚焦搜索框。

## 自定义

- 常用网站：编辑 `index.html` 中的「常用网站」，当前列表来自 `samuel-navigation-lite.html`
- 网站图标：替换 `assets/ico.png` 和 `assets/ico2.png`
- 箴言语料库：编辑 `app.js` 中的 `MOTTO_CORPUS`
- 默认待办：编辑 `app.js` 中的 `defaultTasks`
- 颜色、字体和布局：编辑 `styles.css` 中的 `:root` 变量
