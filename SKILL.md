---
name: diff-review-zh
description: "将代码变更（Git diff）转换为精美的中文交互式 HTML 审查报告，让代码修改像读故事一样清晰。触发词包括：'review 这个 PR'、'把 diff 做成可视化'、'解释这个代码变更'、'生成代码审查报告'、'diff 可视化'、'代码走读'、'审查代码改动'。本技能生成一个精美的独立 HTML 文件，包含滚动式导航、运行时逻辑对话、数据流追踪和代码与白话文并排翻译。"
---

# diff-review-zh

**名称**: diff-review-zh

**描述**: 将代码变更（Git diff）转换为精美的中文交互式 HTML 审查报告，让代码修改像读故事一样清晰。

**触发词**: "review 这个 PR", "把 diff 做成可视化", "解释这个代码变更", "生成代码审查报告", "diff 可视化", "代码走读", "审查代码改动"

## 触发条件

当用户输入以下关键词时触发：
- "review 这个 PR"
- "把 diff 做成可视化"
- "解释这个代码变更"
- "生成代码审查报告"
- "diff 可视化"
- "代码走读"
- "审查代码改动"

## 工作流

### 阶段 0：准备预构建资源

在开始分析 diff 之前，首先创建输出目录并复制预构建的 CSS/JS 资源。

**创建目录结构**：
```bash
mkdir -p diff-review-{YYYYMMDD-HHMMSS}/{styles,scripts,modules}
```

**复制预构建资源**（从 skill 目录复制，不要重新生成）：
- `references/design-system.css` → `diff-review-{timestamp}/styles/design-system.css`
- `references/interactions.js` → `diff-review-{timestamp}/scripts/interactions.js`

### 阶段 1：询问比较范围并获取 diff

**必须**在生成报告前询问用户要比较的修改范围：

```
请选择要审查的代码范围：

[1] 未提交更改 vs 上次提交（git diff HEAD）
[2] 当前分支 vs 目标分支（git diff main...HEAD）
[3] 指定两次提交对比（输入 commit SHA）
[4] 指定 PR/MR 链接

请输入选项（1-4）：
```

**根据选择执行**：
| 选项 | 执行命令 |
|------|----------|
| 1 | `git diff HEAD` |
| 2 | `git diff {目标分支}...HEAD`（询问目标分支，默认 main） |
| 3 | 询问两次 commit SHA，执行 `git diff {SHA1}..{SHA2}` |
| 4 | 询问 PR/MR URL，获取 diff |

**必须**显示获取到的概览并确认：
```
找到以下修改：
- 文件数：{N}
- 添加行数：+{N}
- 删除行数：-{N}
- 主要修改文件：{file1}, {file2}...

确认生成审查报告？(y/n)：
```

### 阶段 1：分析修改

**并行执行**以下任务：

1. **统计信息**：计算添加/删除行数，统计修改文件数
2. **提取动机**：读取 commit message，识别修改原因
3. **识别关键修改**：找出核心逻辑变更，标记新增函数
4. **构建术语表**：识别专业术语，准备中文解释

### 阶段 2：规划内容

**必须**根据修改规模选择展示模式：

| 规模 | 条件 | 展示模式 | 模块数量 |
|------|------|----------|----------|
| 小型 | ≤3 文件且 ≤100 行 | 基础版 | 3 个模块 |
| 中型 | 3-10 文件或 100-500 行 | 标准版 | 5 个模块 |
| 大型 | ≥10 文件或 ≥500 行 | 完整版 | 6+ 个模块 |

**必须包含**的模块（按顺序）：

| 模块编号 | 模块名称 | 说明 |
|----------|----------|------|
| module-0 | 项目结构总览 | **必须始终包含**。完整的文件树地图 + 统计卡片 |
| module-1 | 运行时逻辑对话 | 展示修改后代码的执行流程，使用 ChatSimulation |
| module-2 | 数据流追踪 | 可视化数据流动，使用 FlowAnimation |
| module-3 | 变更时间线 | 修改的完整生命周期 |
| module-4+ | 代码修改详情 | 每个修改文件一个模块，使用代码对比块 |

**小型修改**（3 个模块）：
- module-0: 项目结构总览（简化版）
- module-1: 代码修改详情（合并展示）

**中型修改**（5 个模块）：
- module-0: 项目结构总览（完整版）
- module-1: 运行时逻辑对话
- module-2: 数据流追踪
- module-3: 变更时间线
- module-4: 代码修改详情

**大型修改**（6+ 个模块）：
- module-0: 项目结构总览（完整版）
- module-1: 运行时逻辑对话
- module-2: 数据流追踪
- module-3: 变更时间线
- module-4+: 按文件分组的代码详情（每文件一个模块）

### 阶段 2.5：规划模块结构（关键步骤）

在编写 HTML 之前，**必须**先规划模块结构并创建简报。这是避免遗漏功能的关键步骤。

**模块规划表**：

| 模块 | 内容 | 文件路径 |
|------|------|----------|
| module-0 | 项目结构总览 | `modules/module-0-overview.html` |
| module-1 | 运行时逻辑对话 | `modules/module-1-runtime.html` |
| module-2 | 数据流追踪 | `modules/module-2-dataflow.html` |
| module-3 | 变更时间线 | `modules/module-3-timeline.html` |
| module-4+ | 代码详情（每文件一个） | `modules/module-4-{filename}.html` |

**必须**为每个模块创建简报：

```markdown
<!-- briefs/module-0-brief.md -->
# Module 0: 项目结构总览

## 内容要点
- 文件树地图
- 统计卡片
- 变更类型说明

## 数据
- 总文件数：{N}
- 修改文件：{list}
- 新增文件：{list}
- 删除文件：{list}

## 交互元素
- 文件树（可点击跳转）
- 统计卡片（数字动画）
```

### 阶段 3：分模块生成 HTML

**不要一次性生成完整文件**。采用分模块策略：

1. **顺序生成**（小型修改，≤5 个模块）：
   - 逐个生成每个模块 HTML
   - 每个模块独立写入 `modules/module-N.html`

2. **并行生成**（中型/大型修改，>5 个模块）：
   - 使用子代理并行生成不同模块
   - 每个代理接收简报，写入对应模块文件

**每个模块 HTML 结构**：
```html
<section class="module" id="module-N">
  <div class="module-content">
    <!-- 模块内容 -->
  </div>
</section>
```

**生成顺序**：
1. module-0: 项目结构总览
2. module-1: 运行时逻辑对话（如需要）
3. module-2: 数据流追踪（如需要）
4. module-3: 变更时间线（如需要）
5. module-4+: 各文件代码详情

### 阶段 3.5：组装完整 HTML

**必须**使用组装脚本合并所有模块：

```bash
# 读取基础模板
cat templates/base.html > diff-review.html

# 按顺序插入各模块
for module in modules/module-*.html; do
  cat "$module" >> diff-review.html
done

# 添加结束标签
cat templates/footer.html >> diff-review.html
```

或使用 Node.js/Bash 脚本进行更复杂的组装。

**组装后的文件结构**：
```
diff-review-{timestamp}/
├── styles/
│   └── design-system.css    # 预构建
├── scripts/
│   └── interactions.js      # 预构建
├── modules/
│   ├── module-0.html
│   ├── module-1.html
│   └── ...
├── briefs/                   # 构建后可删除
└── diff-review.html         # 最终组装输出
```

#### 3.1 HTML 头部结构

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>代码变更审查 - {{PROJECT_NAME}}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,700;12..96,800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400;1,9..40,500&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    /* 复制 references/design-system.css 的全部内容 */
    /* 额外添加以下样式 */
    
    /* 术语提示框 */
    .term {
      border-bottom: 1.5px dashed var(--color-accent-muted);
      cursor: pointer;
      color: var(--color-accent);
      font-weight: 500;
    }
    .term:hover { border-bottom-color: var(--color-accent); }
    .term-tooltip {
      position: fixed;
      background: var(--color-bg-code);
      color: #CDD6F4;
      padding: var(--space-3) var(--space-4);
      border-radius: var(--radius-sm);
      font-size: var(--text-sm);
      width: max(200px, min(320px, 80vw));
      box-shadow: var(--shadow-lg);
      pointer-events: none;
      opacity: 0;
      transition: opacity var(--duration-fast);
      z-index: 10000;
    }
    .term-tooltip.visible { opacity: 1; }
    
    /* 运行时对话 */
    .chat-window {
      background: var(--color-surface);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-md);
      overflow: hidden;
      margin: var(--space-8) 0;
    }
    .chat-messages {
      padding: var(--space-6);
      display: flex;
      flex-direction: column;
      gap: var(--space-4);
      min-height: 300px;
    }
    .chat-message {
      display: flex;
      align-items: flex-end;
      gap: var(--space-3);
      animation: fadeSlideUp 0.3s var(--ease-out);
    }
    .chat-avatar {
      width: 36px; height: 36px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: var(--font-display);
      font-size: var(--text-sm);
      font-weight: 700;
      color: white;
      flex-shrink: 0;
    }
    .chat-bubble {
      max-width: 75%;
      background: var(--color-bg-warm);
      border-radius: var(--radius-md) var(--radius-md) var(--radius-md) 4px;
      padding: var(--space-3) var(--space-4);
    }
    .chat-sender {
      display: block;
      font-size: var(--text-xs);
      font-weight: 700;
      margin-bottom: var(--space-1);
      font-family: var(--font-mono);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    
    /* 数据流动画 */
    .flow-animation {
      background: var(--color-surface);
      border-radius: var(--radius-lg);
      padding: var(--space-8);
      box-shadow: var(--shadow-md);
      margin: var(--space-8) 0;
    }
    .flow-actors {
      display: flex;
      justify-content: space-around;
      align-items: center;
      gap: var(--space-4);
      margin-bottom: var(--space-8);
      flex-wrap: wrap;
    }
    .flow-actor {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--space-2);
    }
    .flow-actor-icon {
      width: 56px; height: 56px;
      border-radius: var(--radius-md);
      background: var(--color-bg-warm);
      border: 2px solid var(--color-border);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: var(--text-xl);
      font-weight: 700;
    }
    .flow-actor.active .flow-actor-icon {
      border-color: var(--color-accent);
      background: var(--color-accent-light);
      box-shadow: 0 0 0 3px var(--color-accent-light);
    }
    .flow-log {
      background: var(--color-bg-code);
      border-radius: var(--radius-md);
      padding: var(--space-4);
      font-family: var(--font-mono);
      font-size: var(--text-sm);
      color: #CDD6F4;
      min-height: 150px;
    }
    
    /* 时间线 */
    .timeline {
      position: relative;
      margin: var(--space-8) 0;
      padding-left: var(--space-8);
    }
    .timeline::before {
      content: '';
      position: absolute;
      left: 15px; top: 0; bottom: 0;
      width: 2px;
      background: var(--color-border);
    }
    .timeline-item {
      position: relative;
      margin-bottom: var(--space-6);
      padding: var(--space-4);
      background: var(--color-surface);
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-sm);
    }
    .timeline-item::before {
      content: '';
      position: absolute;
      left: calc(-1 * var(--space-8) + 8px);
      top: var(--space-4);
      width: 16px; height: 16px;
      border-radius: 50%;
      background: var(--color-accent);
      border: 3px solid var(--color-bg);
    }
    .timeline-item.added::before { background: var(--color-success); }
  </style>
</head>
```

#### 3.2 导航结构

**必须**包含 5 个导航点（中型/大型修改）：
```html
<nav class="nav">
  <div class="nav-inner">
    <span class="nav-title">代码变更审查</span>
    <div class="nav-dots">
      <button class="nav-dot active" onclick="scrollToModule(0)" title="项目结构"></button>
      <button class="nav-dot" onclick="scrollToModule(1)" title="运行时逻辑"></button>
      <button class="nav-dot" onclick="scrollToModule(2)" title="数据流追踪"></button>
      <button class="nav-dot" onclick="scrollToModule(3)" title="变更时间线"></button>
      <button class="nav-dot" onclick="scrollToModule(4)" title="代码详情"></button>
    </div>
  </div>
</nav>
```

#### 3.3 模块内容

使用 `templates/content-patterns.md` 中的模板填充：
- module-0: 文件树（完整项目结构）+ 统计卡片 + 变更类型卡片
- module-1: 运行时对话（ChatSimulation）
- module-2: 数据流追踪（FlowAnimation）
- module-3: 变更时间线（Timeline）
- module-4+: 代码对比块（每个修改文件一个）

#### 3.4 JavaScript 功能

**必须**在底部包含以下完整功能：

```javascript
<script>
// ==================== 1. 导航功能 ====================
function scrollToModule(index) {
  const module = document.getElementById(`module-${index}`);
  if (module) {
    module.scrollIntoView({ behavior: 'smooth' });
    updateActiveNavDot(index);
  }
}

function updateActiveNavDot(index) {
  document.querySelectorAll('.nav-dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === index);
  });
}

// 滚动时自动更新导航点
const observerOptions = { root: null, threshold: 0.5 };
const moduleObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const index = parseInt(entry.target.id.replace('module-', ''));
      updateActiveNavDot(index);
    }
  });
}, observerOptions);

document.querySelectorAll('.module').forEach(m => moduleObserver.observe(m));

// 键盘导航
document.addEventListener('keydown', (e) => {
  const current = document.querySelector('.nav-dot.active');
  const dots = Array.from(document.querySelectorAll('.nav-dot'));
  const currentIndex = dots.indexOf(current);
  
  if (e.key === 'ArrowDown' && currentIndex < dots.length - 1) {
    scrollToModule(currentIndex + 1);
  } else if (e.key === 'ArrowUp' && currentIndex > 0) {
    scrollToModule(currentIndex - 1);
  }
});

// ==================== 2. 术语提示框 ====================
function initTooltips() {
  const tooltip = document.createElement('div');
  tooltip.className = 'term-tooltip';
  document.body.appendChild(tooltip);
  
  document.querySelectorAll('.term').forEach(term => {
    term.addEventListener('mouseenter', (e) => {
      tooltip.textContent = term.dataset.definition;
      tooltip.classList.add('visible');
      positionTooltip(e.target, tooltip);
    });
    
    term.addEventListener('mouseleave', () => {
      tooltip.classList.remove('visible');
    });
    
    term.addEventListener('mousemove', (e) => {
      positionTooltip(e.target, tooltip);
    });
  });
}

function positionTooltip(target, tooltip) {
  const rect = target.getBoundingClientRect();
  const tooltipRect = tooltip.getBoundingClientRect();
  
  let top = rect.bottom + 8;
  let left = rect.left + (rect.width - tooltipRect.width) / 2;
  
  // 边界检查
  if (left < 10) left = 10;
  if (left + tooltipRect.width > window.innerWidth - 10) {
    left = window.innerWidth - tooltipRect.width - 10;
  }
  if (top + tooltipRect.height > window.innerHeight - 10) {
    top = rect.top - tooltipRect.height - 8;
  }
  
  tooltip.style.top = `${top}px`;
  tooltip.style.left = `${left}px`;
}

// ==================== 3. 运行时对话 ====================
class ChatSimulation {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    this.messages = this.container.querySelectorAll('.chat-message');
    this.totalSteps = options.totalSteps || this.messages.length;
    this.currentStep = 0;
    this.progressId = options.progressId;
    
    this.init();
  }
  
  init() {
    // 隐藏所有消息
    this.messages.forEach((msg, i) => {
      msg.style.display = i === 0 ? 'flex' : 'none';
      msg.style.opacity = i === 0 ? '1' : '0';
    });
    this.updateProgress();
  }
  
  nextStep() {
    if (this.currentStep < this.totalSteps - 1) {
      this.currentStep++;
      const message = this.messages[this.currentStep];
      message.style.display = 'flex';
      
      // 触发重绘以启动动画
      requestAnimationFrame(() => {
        message.style.opacity = '1';
        message.style.animation = 'fadeSlideUp 0.3s var(--ease-out)';
      });
      
      this.updateProgress();
      this.scrollToBottom();
    }
  }
  
  reset() {
    this.currentStep = 0;
    this.messages.forEach((msg, i) => {
      msg.style.display = i === 0 ? 'flex' : 'none';
      msg.style.opacity = i === 0 ? '1' : '0';
      msg.style.animation = '';
    });
    this.updateProgress();
  }
  
  updateProgress() {
    if (this.progressId) {
      const progressEl = document.getElementById(this.progressId);
      if (progressEl) {
        progressEl.textContent = `步骤 ${this.currentStep + 1}/${this.totalSteps}`;
      }
    }
  }
  
  scrollToBottom() {
    this.container.scrollTop = this.container.scrollHeight;
  }
}

// ==================== 4. 数据流动画 ====================
class FlowAnimation {
  constructor(logId, actorSelector) {
    this.logContainer = document.getElementById(logId);
    this.actors = document.querySelectorAll(actorSelector);
    this.steps = [];
    this.currentStep = 0;
  }
  
  setSteps(steps) {
    this.steps = steps;
    this.currentStep = 0;
    this.clearLog();
    this.addLogEntry(this.steps[0]?.log || '准备开始...');
    this.highlightActor(this.steps[0]?.actor);
  }
  
  nextStep() {
    if (this.currentStep < this.steps.length - 1) {
      this.currentStep++;
      const step = this.steps[this.currentStep];
      
      this.addLogEntry(step.log);
      this.highlightActor(step.actor);
      this.scrollToBottom();
    }
  }
  
  reset() {
    this.currentStep = 0;
    this.clearLog();
    if (this.steps.length > 0) {
      this.addLogEntry(this.steps[0].log);
      this.highlightActor(this.steps[0].actor);
    }
  }
  
  addLogEntry(html) {
    const line = document.createElement('div');
    line.className = 'flow-log-line';
    line.innerHTML = html;
    line.style.animation = 'fadeSlideUp 0.2s var(--ease-out)';
    this.logContainer.appendChild(line);
  }
  
  clearLog() {
    this.logContainer.innerHTML = '';
  }
  
  highlightActor(actorId) {
    this.actors.forEach(actor => {
      actor.classList.toggle('active', actor.dataset.actor === actorId);
    });
  }
  
  scrollToBottom() {
    this.logContainer.scrollTop = this.logContainer.scrollHeight;
  }
}

// ==================== 5. 代码块拖拽滚动 ====================
function initDragToScroll() {
  document.querySelectorAll('.code-panel').forEach(panel => {
    let isDown = false;
    let startX;
    let scrollLeft;
    
    panel.addEventListener('mousedown', (e) => {
      isDown = true;
      panel.style.cursor = 'grabbing';
      startX = e.pageX - panel.offsetLeft;
      scrollLeft = panel.scrollLeft;
    });
    
    panel.addEventListener('mouseleave', () => {
      isDown = false;
      panel.style.cursor = 'grab';
    });
    
    panel.addEventListener('mouseup', () => {
      isDown = false;
      panel.style.cursor = 'grab';
    });
    
    panel.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - panel.offsetLeft;
      const walk = (x - startX) * 2;
      panel.scrollLeft = scrollLeft - walk;
    });
    
    // 触摸支持
    panel.addEventListener('touchstart', (e) => {
      startX = e.touches[0].pageX - panel.offsetLeft;
      scrollLeft = panel.scrollLeft;
    }, { passive: true });
    
    panel.addEventListener('touchmove', (e) => {
      const x = e.touches[0].pageX - panel.offsetLeft;
      const walk = (x - startX) * 2;
      panel.scrollLeft = scrollLeft - walk;
    }, { passive: true });
  });
}

// ==================== 6. 文件树交互 ====================
function initFileTree() {
  document.querySelectorAll('.ft-folder').forEach(folder => {
    const name = folder.querySelector('.ft-name');
    const children = folder.querySelector('.ft-children');
    
    if (name && children) {
      name.style.cursor = 'pointer';
      name.addEventListener('click', () => {
        folder.classList.toggle('collapsed');
        children.style.display = folder.classList.contains('collapsed') ? 'none' : 'block';
      });
    }
  });
}

// ==================== 初始化 ====================
document.addEventListener('DOMContentLoaded', () => {
  initTooltips();
  initDragToScroll();
  initFileTree();
});
</script>
```

#### 3.5 术语提示框使用

**必须**在内容中使用术语提示框：
```html
<span class="term" data-definition="中文解释">专业术语</span>
```

**必须**识别并添加提示框的术语包括：
- 技术概念（如：solid、runner、registry）
- 缩写词（如：API、MCP）
- 项目特定术语（如：annular_seed_pattern）
- 算法/模式名称（如：bootstrap_state、pattern_completion）

### 阶段 4：质量检查

**必须**检查以下项目：

- [ ] 主背景使用暖色（#FAF7F2）
- [ ] 代码块可以横向滚动
- [ ] 代码缩进正确显示
- [ ] 每个修改都有"为什么"的解释
- [ ] 专业术语有中文解释
- [ ] 键盘导航可用（方向键切换页面）

**禁止**出现以下问题：
- 使用深色主背景
- 代码行使用 `display: flex`
- 代码块无法滚动
- 只描述代码行为不解释原因

### 阶段 5：交付

**必须**输出：
```
已生成代码审查报告：
📁 位置：./diff-review-{timestamp}/diff-review.html
📊 统计：{N} 文件，+{N}/-{N} 行
🌐 在浏览器中打开查看
```

## 设计系统

**必须**严格遵循以下设计规范：

### 颜色
- 主背景：`#FAF7F2`（暖白）或 `#F5F0E8`（暖灰）
- 代码背景：`#1E1E2E`（深色）
- 强调色：`#2A7B9B`（蓝绿色）
- 成功/添加：`#2D8B55`（绿色）
- 错误/删除：`#C93B3B`（红色）

### 字体
- 标题：Bricolage Grotesque
- 正文：DM Sans
- 代码：JetBrains Mono

### 代码格式
**必须**使用以下结构：
```html
<div class="code-block-wrapper">
  <div class="file-header">...</div>
  <div class="code-block-content">
    <div class="code-panel">
      <pre><span class="code-line">...</span></pre>
    </div>
    <div class="explanation-panel">...</div>
  </div>
</div>
```

**必须**使用 `display: block` 在 `.code-line` 上。
**必须**使用 `white-space: pre` 在 `<pre>` 上。

## 内容哲学

### 必须包含的解释要素
1. **为什么** - 修改的动机
2. **原来如何** - 旧做法的问题
3. **现在如何** - 新做法的实现
4. **影响** - 带来的效果

### 禁止的解释方式
- 仅描述代码表面行为
- 使用技术术语而不解释
- 不说明修改的业务价值

## 文件结构

```
~/.claude/skills/diff-review-zh/
├── SKILL.md                           # 本文件
├── references/
│   ├── design-system.css              # 完整 CSS 设计系统（预构建，直接复制）
│   ├── interactions.js                # 可复用 JS 交互（预构建，直接复制）
│   ├── content-patterns.md            # 内容模式模板
│   ├── quality-rules.md               # 质量检查清单
│   └── workflow.md                    # 详细工作流程
├── templates/
│   ├── base.html                      # HTML 基础模板
│   ├── footer.html                    # HTML 结束模板
│   ├── module-wrapper.html            # 模块包装模板
│   └── build.sh                       # 组装脚本
└── examples/
    └── example-output.html            # 示例输出
```

## 输出目录结构

在运行目录下创建：
```
./diff-review-{YYYYMMDD-HHMMSS}/
└── diff-review.html                   # 独立的 HTML 报告
```
