# 内容模式

本文档记录 diff-review 中用于呈现代码变更的内容结构模式。

## 1. 翻译块 (Translation Block)

并排显示代码和对应的白话解释，这是 diff-review 的核心组件。

### 结构

```html
<div class="translation-block">
  <div class="translation-code">
    <span class="translation-label">代码</span>
    <pre><code>
<span class="code-line"><span class="line-number">851</span><span class="line-content">  <span class="code-property">round_no</span>=round_no,</span></span>
<span class="code-line added"><span class="line-number">854</span><span class="line-content">  <span class="code-property">executed_actions</span>=executed_actions,</span></span>
    </code></pre>
  </div>
  <div class="translation-english">
    <span class="translation-label">白话解释</span>
    <div class="translation-lines">
      <p class="tl"><strong>标题</strong></p>
      <p class="tl">解释内容...</p>
    </div>
  </div>
</div>
```

### 关键规则

1. **代码格式关键**：使用 `display: block` 而不是 flex
   ```css
   .code-line {
     display: block;
     white-space: pre-wrap;
     word-break: break-word;
   }
   ```

2. **行号结构**：行号用 inline-block，与内容分离
   ```html
   <span class="code-line">
     <span class="line-number">854</span>
     <span class="line-content">code here</span>
   </span>
   ```

3. **变更标记**：
   - `added` 类 = 绿色背景，表示新增代码
   - `removed` 类 = 红色背景，表示删除代码
   - 无类 = 上下文代码

4. **语法高亮类**：
   - `.code-keyword` - 关键字 (紫色)
   - `.code-string` - 字符串 (绿色)
   - `.code-function` - 函数 (蓝色)
   - `.code-property` - 属性 (黄色)
   - `.code-comment` - 注释 (灰色斜体)
   - `.code-number` - 数字 (橙色)

---

## 2. 强调框 (Callout)

用于强调核心目标、关键洞察等重要信息。

### 结构

```html
<div class="callout callout-accent">
  <div class="callout-icon">🎯</div>
  <div class="callout-content">
    <h2>标题</h2>
    <p>内容描述，可包含 <code>代码</code> 和 <span class="term" data-definition="...">术语</span></p>
  </div>
</div>
```

### 变体

- `.callout-accent` - 蓝色强调（主要）
- 可扩展更多变体如 `.callout-success`, `.callout-warning`

---

## 3. 统计卡片 (Stats Cards)

顶部概览统计数字。

### 结构

```html
<div class="stats-grid">
  <div class="stat-card">
    <div class="stat-value added">+1967</div>
    <div class="stat-label">添加行数</div>
  </div>
  <div class="stat-card">
    <div class="stat-value removed">-59</div>
    <div class="stat-label">删除行数</div>
  </div>
</div>
```

### 颜色变体

- `.added` - 绿色（添加）
- `.removed` - 红色（删除）
- `.files` - 蓝色（文件数）

---

## 4. 变更类型卡片 (Pattern Cards)

展示变更的分类（新功能、修复、重构）。

### 结构

```html
<div class="pattern-cards">
  <div class="pattern-card feature">
    <div class="pattern-icon">✨</div>
    <h3 class="pattern-title">新功能</h3>
    <p class="pattern-desc">描述...</p>
  </div>
  <div class="pattern-card fix">
    <div class="pattern-icon">🔧</div>
    <h3 class="pattern-title">问题修复</h3>
    <p class="pattern-desc">描述...</p>
  </div>
  <div class="pattern-card refactor">
    <div class="pattern-icon">♻️</div>
    <h3 class="pattern-title">代码重构</h3>
    <p class="pattern-desc">描述...</p>
  </div>
</div>
```

### 样式对应

| 类型 | 类名 | 图标背景 | 标题颜色 |
|------|------|----------|----------|
| 新功能 | `.feature` | 绿色浅底 | 绿色 |
| 修复 | `.fix` | 蓝色浅底 | 蓝色 |
| 重构 | `.refactor` | 暖色背景 | 灰色 |

---

## 5. 模块头部 (Module Header)

每个滚动页面的标题区。

### 结构

```html
<div class="module-header">
  <div class="module-number">01</div>
  <h1 class="module-title">项目总览</h1>
  <p class="module-subtitle">aCAD.subagent.iteration - 9 个文件变更</p>
</div>
```

### 编号系统

- 使用两位数编号 (01, 02, 03...)
- 大号淡色数字显示在标题上方
- 编号颜色：`var(--color-accent)`，透明度 15%

---

## 6. 内容层级建议

### 一个典型页面的内容顺序：

1. **模块头部** - 标题 + 副标题
2. **强调框** (可选) - 核心目标或关键洞察
3. **项目概览** (可选) - 文件树地图
4. **统计卡片** - 数字概览
5. **变更类型** - Pattern cards
6. **对话模拟** (可选) - 背景讨论
7. **时间线** (可选) - 变更流程
8. **翻译块** (主要) - 代码详解（可多个）

### 翻译块数量建议

- 简单修改：1-2 个翻译块
- 中等修改：2-4 个翻译块
- 复杂修改：4-6 个翻译块，分多个页面

---

## 7. 编写白话解释的原则

1. **先回答"为什么"** - 解释动机比解释代码更重要
2. **使用类比** - "这就像从...变成..."
3. **突出对比** - 明确指出新旧方式的区别
4. **强调影响** - 这个改动会带来什么效果
5. **避免术语堆砌** - 技术术语用 `<code>` 包裹，必要时加 tooltip

### 示例对比

**不好的写法：**
> 添加了 executed_actions 参数

**好的写法：**
> **为什么添加这个参数？**
> 原来只传递 `executed_action_count`（数量），但现在需要知道**具体执行了哪些动作**才能判断状态。
> 新的 `executed_actions` 参数让函数能看到完整的动作历史，而不仅仅是计数。这就像从"知道吃了几顿饭"变成"知道每顿饭吃了什么"。
