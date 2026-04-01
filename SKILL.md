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

### 阶段 0：询问比较范围

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

| 规模 | 条件 | 展示模式 |
|------|------|----------|
| 小型 | ≤3 文件且 ≤100 行 | 单页：概览 + 代码详情 |
| 中型 | 3-10 文件或 100-500 行 | 多页：概览 + 运行时 + 代码详情 |
| 大型 | ≥10 文件或 ≥500 行 | 多页：完整导航 + 按模块分组 |

**必须包含**的模块：
- 项目总览（文件树 + 统计卡片）
- 代码修改详情（每个修改文件一个代码对比块）

**条件包含**的模块：
- 运行时对话：如果修改涉及复杂业务逻辑
- 数据流追踪：如果修改涉及多组件交互
- 变更时间线：如果修改包含多个 commit

### 阶段 3：生成输出

**必须**创建子目录存放输出：
```bash
mkdir -p diff-review-{YYYYMMDD-HHMMSS}/
```

**必须**生成独立 HTML 文件，内联所有资源：
- 复制 `references/design-system.css` 到 `<style>`
- 复制 `references/interactions.js` 到 `<script>`
- 使用 `templates/content-patterns.md` 中的模板填充内容

**必须**为每个代码对比块包含：
- 文件路径头（含添加/删除行数统计）
- 可横向滚动的代码面板
- 白话解释面板

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
│   ├── design-system.css              # 完整 CSS 设计系统
│   ├── interactions.js                # 可复用 JS 交互
│   ├── quality-rules.md               # 质量检查清单
│   └── workflow.md                    # 详细工作流程
├── templates/
│   └── content-patterns.md            # 内容模板
└── examples/
    └── example-output.html            # 示例输出
```

## 输出目录结构

在运行目录下创建：
```
./diff-review-{YYYYMMDD-HHMMSS}/
└── diff-review.html                   # 独立的 HTML 报告
```
