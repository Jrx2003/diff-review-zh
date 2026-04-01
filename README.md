# diff-review-zh

将代码变更（Git diff）转换为精美的中文交互式 HTML 审查报告，让代码修改像读故事一样清晰。

## 效果预览

![预览](examples/preview.png)

## 功能特性

- 🎨 **精美设计** - 暖色调设计系统，舒适的代码阅读体验
- 📊 **项目总览** - 完整的文件树地图，一眼看清修改范围
- 💬 **运行时对话** - 模拟代码修改后的执行逻辑
- 🌊 **数据流追踪** - 可视化数据在系统中的流动
- 📱 **响应式布局** - 支持桌面和移动端查看
- ⌨️ **键盘导航** - 方向键快速切换页面

## 安装

将本仓库克隆到 Claude Code 的 skills 目录：

```bash
cd ~/.claude/skills
git clone https://github.com/Jrx2003/diff-review-zh.git
```

或者手动复制 `SKILL.md` 和 `references/` 目录到 `~/.claude/skills/diff-review-zh/`。

## 使用方法

在 Claude Code 中输入以下任一关键词：

- "review 这个 PR"
- "把 diff 做成可视化"
- "解释这个代码变更"
- "生成代码审查报告"
- "diff 可视化"
- "代码走读"

Claude 会询问要比较的代码范围：

```
[1] 未提交更改 vs 上次提交
[2] 当前分支 vs 目标分支
[3] 指定两次提交对比
[4] 指定 PR/MR 链接
```

生成后会创建子目录 `diff-review-{timestamp}/`，包含独立的 HTML 文件。

## 文件结构

```
diff-review-zh/
├── SKILL.md                    # 主技能文件
├── README.md                   # 本文件
├── references/
│   ├── design-system.css       # CSS 设计系统
│   ├── interactions.js         # JS 交互组件
│   ├── quality-rules.md        # 质量规则
│   └── workflow.md             # 工作流程
├── templates/
│   └── content-patterns.md     # 内容模板
└── examples/
    └── example-output.html     # 示例输出
```

## 设计系统

### 颜色
- 主背景：`#FAF7F2`（暖白）
- 代码背景：`#1E1E2E`（深色）
- 强调色：`#2A7B9B`（蓝绿色）
- 成功/添加：`#2D8B55`（绿色）
- 错误/删除：`#C93B3B`（红色）

### 字体
- 标题：Bricolage Grotesque
- 正文：DM Sans
- 代码：JetBrains Mono

## 内容哲学

每个代码修改必须解释：
1. **为什么** - 修改的动机
2. **原来如何** - 旧做法的问题
3. **现在如何** - 新做法的实现
4. **影响** - 带来的效果

## 工作流程

1. **询问范围** - 确认要比较的代码范围
2. **分析修改** - 提取统计、动机、术语
3. **规划内容** - 根据规模选择展示模式
4. **生成报告** - 创建交互式 HTML
5. **质量检查** - 确保设计合规、内容完整
6. **交付** - 输出文件位置

## 示例输出

查看 [examples/example-output.html](examples/example-output.html) 了解生成的报告样式。

## License

MIT
