# 内容模式模板

本文档定义 diff-review 中可复用的内容结构。

## 1. 代码对比块（核心模式）

**用途**：展示单个文件的代码修改

**结构**：
```html
<div class="code-block-wrapper">
  <div class="file-header">
    <span class="file-header-icon">📄</span>
    <span class="file-header-path">{{FILE_PATH}}</span>
    <span class="file-header-stats">
      <span class="removed">-{{REMOVED_LINES}}</span>
      <span class="added">+{{ADDED_LINES}}</span>
    </span>
  </div>
  <div class="code-block-content">
    <div class="code-panel">
      <pre>{{CODE_LINES}}</pre>
    </div>
    <div class="explanation-panel">
      <span class="translation-label">白话解释</span>
      <div class="translation-lines">
        <p class="tl"><strong>{{EXPLANATION_TITLE}}</strong></p>
        <p class="tl">{{EXPLANATION_CONTENT}}</p>
      </div>
    </div>
  </div>
</div>
```

**变量**：
| 变量 | 说明 | 示例 |
|------|------|------|
| `FILE_PATH` | 文件路径 | `src/runner.py` |
| `ADDED_LINES` | 添加行数 | `+5` |
| `REMOVED_LINES` | 删除行数 | `-3` |
| `CODE_LINES` | 代码行（含语法高亮） | 见下方格式 |
| `EXPLANATION_TITLE` | 解释标题 | 为什么添加这个参数？ |
| `EXPLANATION_CONTENT` | 解释内容 | 原来只传递... |

**代码行格式**：
```html
<!-- 上下文行 -->
<span class="code-line"><span class="line-number">851</span><span class="line-content">    normal_line()</span></span>

<!-- 添加的行 -->
<span class="code-line added"><span class="line-number">852</span><span class="line-content">    new_line()</span></span>

<!-- 删除的行 -->
<span class="code-line removed"><span class="line-number">853</span><span class="line-content">    old_line()</span></span>
```

---

## 2. 统计卡片组

**用途**：展示修改概览数字

**结构**：
```html
<div class="stats-grid">
  <div class="stat-card">
    <div class="stat-value added">+{{ADDED_TOTAL}}</div>
    <div class="stat-label">添加行数</div>
  </div>
  <div class="stat-card">
    <div class="stat-value removed">-{{REMOVED_TOTAL}}</div>
    <div class="stat-label">删除行数</div>
  </div>
  <div class="stat-card">
    <div class="stat-value files">{{FILE_COUNT}}</div>
    <div class="stat-label">修改文件</div>
  </div>
</div>
```

---

## 3. 文件树

**用途**：展示项目结构和修改位置

**结构**：
```html
<div class="file-tree-section">
  <div class="file-tree-header">
    <div class="file-tree-icon">🗂️</div>
    <div class="file-tree-title">
      <h3>{{PROJECT_NAME}} 项目结构</h3>
      <p>共 {{TOTAL_FILES}} 个文件，{{MODIFIED_FILES}} 个文件有变更</p>
    </div>
  </div>
  <div class="file-tree">
    <!-- 文件夹 -->
    <div class="ft-folder">
      <span class="ft-name">{{FOLDER_NAME}}/</span>
      <span class="ft-desc">{{FOLDER_DESC}}</span>
      <div class="ft-children">
        <!-- 文件（修改） -->
        <div class="ft-file {{STATUS}}" onclick="scrollToModule({{MODULE_INDEX}})">
          <span class="ft-name">{{FILE_NAME}}</span>
          <span class="ft-desc">{{FILE_DESC}}</span>
          <div class="ft-stats">
            <span class="added">+{{ADDED}}</span>
            <span class="removed">-{{REMOVED}}</span>
          </div>
        </div>
        <!-- 文件（未修改） -->
        <div class="ft-file">
          <span class="ft-name">{{FILE_NAME}}</span>
        </div>
      </div>
    </div>
  </div>
</div>
```

**状态类**：`modified` | `added` | `removed`

---

## 4. 运行时对话

**用途**：展示代码修改后的执行逻辑

**结构**：
```html
<div class="chat-window">
  <div class="chat-messages" id="{{CHAT_ID}}">
    <div class="chat-message" data-step="1">
      <div class="chat-avatar" style="background: var(--color-actor-2);">U</div>
      <div class="chat-bubble">
        <span class="chat-sender" style="color: var(--color-actor-2);">User</span>
        <p>{{USER_MESSAGE}}</p>
      </div>
    </div>
    <div class="chat-message" data-step="2" style="display: none;">
      <div class="chat-avatar" style="background: var(--color-actor-1);">R</div>
      <div class="chat-bubble">
        <span class="chat-sender" style="color: var(--color-actor-1);">Runner</span>
        <p>{{SYSTEM_MESSAGE}}</p>
      </div>
    </div>
  </div>
  <div class="chat-controls">
    <button class="btn btn-primary" onclick="{{CHAT_INSTANCE}}.nextStep()">下一步 →</button>
    <button class="btn" onclick="{{CHAT_INSTANCE}}.reset()">重置</button>
    <span class="chat-progress" id="{{PROGRESS_ID}}">步骤 1/{{TOTAL_STEPS}}</span>
  </div>
</div>
```

**初始化**：
```javascript
const {{CHAT_INSTANCE}} = new ChatSimulation('{{CHAT_ID}}', {
  totalSteps: {{TOTAL_STEPS}},
  progressId: '{{PROGRESS_ID}}'
});
```

---

## 5. 数据流动画

**用途**：可视化数据在系统中的流动

**结构**：
```html
<div class="flow-animation">
  <div class="flow-actors">
    <div class="flow-actor active" data-actor="{{ACTOR_ID}}">
      <div class="flow-actor-icon">{{ACTOR_ICON}}</div>
      <span>{{ACTOR_NAME}}</span>
    </div>
  </div>
  <div class="flow-log" id="{{LOG_ID}}">
    <span class="flow-log-line">{{INITIAL_LOG}}</span>
  </div>
  <div class="chat-controls">
    <button class="btn btn-primary" onclick="{{FLOW_INSTANCE}}.nextStep()">执行下一步 →</button>
    <button class="btn" onclick="{{FLOW_INSTANCE}}.reset()">重置</button>
  </div>
</div>
```

**初始化**：
```javascript
const {{FLOW_INSTANCE}} = new FlowAnimation('{{LOG_ID}}', '.flow-actor');
{{FLOW_INSTANCE}}.setSteps([
  { actor: '{{ACTOR_ID}}', log: '<span class="timestamp">[TIME]</span> <span class="level">LEVEL</span> {{MESSAGE}}' }
]);
```

---

## 6. 模块头部

**用途**：每个页面的标题区

**结构**：
```html
<div class="module-header">
  <div class="module-number">{{MODULE_NUMBER}}</div>
  <h1 class="module-title">{{TITLE}}</h1>
  <p class="module-subtitle">{{SUBTITLE}}</p>
</div>
```

---

## 内容哲学

### 必须包含的解释要素
1. **为什么** - 修改的动机
2. **原来如何** - 旧做法的问题
3. **现在如何** - 新做法的实现
4. **影响** - 带来的效果

### 禁止的解释方式
- 仅描述代码表面行为
- 使用过多技术术语而不解释
- 不说明修改的业务价值
