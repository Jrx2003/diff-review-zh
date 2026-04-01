# 交互元素模式

本文档记录 diff-review 中使用的交互式 UI 组件。

## 1. 术语提示框 (Glossary Tooltips)

用于解释技术术语，点击或悬停显示定义。

### HTML 结构

```html
<span class="term" data-definition="术语的详细解释">技术术语</span>
```

### CSS 样式

```css
.term {
  border-bottom: 1.5px dashed var(--color-accent-muted);
  cursor: pointer;
  color: var(--color-accent);
  font-weight: 500;
  transition: all 0.2s ease;
}

.term:hover {
  border-bottom-color: var(--color-accent);
  color: var(--color-accent-hover);
}

.term-tooltip {
  position: fixed;  /* 关键：使用 fixed 避免被容器裁剪 */
  background: var(--color-bg-code);
  color: #CDD6F4;
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-sm);
  font-size: var(--text-sm);
  width: max(200px, min(320px, 80vw));
  box-shadow: var(--shadow-lg);
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.15s ease;
  z-index: 10001;
}

.term-tooltip.visible {
  opacity: 1;
}

/* 箭头 */
.term-tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 6px solid transparent;
  border-top-color: var(--color-bg-code);
}

/* 翻转模式（当空间不足时） */
.term-tooltip.flip::after {
  top: auto;
  bottom: 100%;
  border-top-color: transparent;
  border-bottom-color: var(--color-bg-code);
}
```

### JavaScript 实现

```javascript
let activeTooltip = null;

function positionTooltip(term, tip) {
  const rect = term.getBoundingClientRect();
  const tipWidth = 300;
  let left = rect.left + rect.width / 2 - tipWidth / 2;
  left = Math.max(8, Math.min(left, window.innerWidth - tipWidth - 8));

  tip.style.left = left + 'px';
  document.body.appendChild(tip);
  const tipHeight = tip.offsetHeight;

  // 自动翻转
  if (rect.top - tipHeight - 8 < 0) {
    tip.style.top = (rect.bottom + 8) + 'px';
    tip.classList.add('flip');
  } else {
    tip.style.top = (rect.top - tipHeight - 8) + 'px';
    tip.classList.remove('flip');
  }
}

document.querySelectorAll('.term').forEach(term => {
  const tip = document.createElement('span');
  tip.className = 'term-tooltip';
  tip.textContent = term.dataset.definition;

  term.addEventListener('mouseenter', () => {
    positionTooltip(term, tip);
    requestAnimationFrame(() => tip.classList.add('visible'));
    activeTooltip = tip;
  });

  term.addEventListener('mouseleave', () => {
    tip.classList.remove('visible');
    setTimeout(() => {
      if (!tip.classList.contains('visible')) tip.remove();
    }, 150);
    activeTooltip = null;
  });
});
```

---

## 2. 对话模拟 (Chat Simulation)

展示修改背景或决策过程的对话形式。

### HTML 结构

```html
<div class="chat-window">
  <div class="chat-header">
    <span class="chat-icon">💬</span>
    <span class="chat-title">AI Agent 讨论记录</span>
  </div>
  <div class="chat-messages">
    <div class="chat-message">
      <div class="chat-avatar" style="background: var(--color-actor-1); color: white;">AI</div>
      <div class="chat-bubble">
        <div class="chat-sender">AI Agent</div>
        <div class="chat-text">消息内容</div>
      </div>
    </div>
    <div class="chat-message">
      <div class="chat-bubble user">用户消息</div>
    </div>
  </div>
</div>
```

### CSS 样式

```css
.chat-window {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  margin-bottom: var(--space-8);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--color-border-light);
}

.chat-header {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-5);
  padding-bottom: var(--space-4);
  border-bottom: 1px solid var(--color-border-light);
}

.chat-messages {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.chat-message {
  display: flex;
  gap: var(--space-3);
  opacity: 0;
  transform: translateY(10px);
  animation: fadeInUp 0.5s ease forwards;
}

.chat-message:nth-child(1) { animation-delay: 0.1s; }
.chat-message:nth-child(2) { animation-delay: 0.4s; }
.chat-message:nth-child(3) { animation-delay: 0.7s; }

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.chat-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: var(--text-sm);
  flex-shrink: 0;
}

.chat-bubble {
  background: var(--color-bg-warm);
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-md);
  max-width: 80%;
}

.chat-bubble.user {
  background: var(--color-accent-light);
  margin-left: auto;
}
```

---

## 3. 流程时间线 (Flow Timeline)

展示修改的生命周期或步骤。

### HTML 结构

```html
<div class="flow-timeline">
  <div class="flow-header">
    <span style="font-size: 1.5rem;">⏱️</span>
    <span class="flow-title">变更流程</span>
  </div>
  <div class="flow-steps">
    <div class="flow-step modified">
      <div class="flow-step-marker">1</div>
      <div class="flow-step-content">
        <div class="flow-step-title">步骤标题</div>
        <div class="flow-step-desc">步骤描述</div>
      </div>
    </div>
  </div>
</div>
```

### CSS 样式

```css
.flow-timeline {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  margin-bottom: var(--space-8);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--color-border-light);
}

.flow-header {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-5);
}

.flow-steps {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.flow-step {
  display: flex;
  gap: var(--space-4);
  position: relative;
}

.flow-step:not(:last-child)::before {
  content: '';
  position: absolute;
  left: 20px;
  top: 40px;
  bottom: -20px;
  width: 2px;
  background: var(--color-border);
}

.flow-step-marker {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--color-accent);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-family: var(--font-display);
  flex-shrink: 0;
  z-index: 1;
}

.flow-step.added .flow-step-marker { background: var(--color-success); }
.flow-step.modified .flow-step-marker { background: var(--color-accent); }
.flow-step.removed .flow-step-marker { background: var(--color-error); }

.flow-step-content {
  flex: 1;
  padding-bottom: var(--space-5);
}
```

---

## 4. 文件树地图 (File Tree Map)

项目概览中的可点击文件列表。

### HTML 结构

```html
<div class="file-tree-map">
  <div class="tree-item modified" onclick="scrollToModule(3)">
    <span class="tree-icon">🐍</span>
    <div class="tree-info">
      <div class="tree-path">src/example.py</div>
      <div class="tree-desc">修改描述</div>
    </div>
    <div class="tree-stats">
      <span class="added">+180</span>
      <span class="removed">-25</span>
    </div>
  </div>
</div>
```

### CSS 样式

```css
.file-tree-map {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--space-3);
}

.tree-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  background: var(--color-bg);
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border-light);
  cursor: pointer;
  transition: all 0.2s ease;
}

.tree-item:hover {
  background: var(--color-accent-light);
  border-color: var(--color-accent-muted);
  transform: translateX(4px);
}

.tree-item.modified {
  border-left: 3px solid var(--color-accent);
}

.tree-item.added {
  border-left: 3px solid var(--color-success);
}

.tree-path {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: var(--color-text);
  font-weight: 500;
}

.tree-desc {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  margin-top: 2px;
}

.tree-stats .added { color: var(--color-success); }
.tree-stats .removed { color: var(--color-error); }
```

---

## 5. 导航与滚动

### 滚动吸附模块

```css
html {
  scroll-snap-type: y proximity;
  scroll-behavior: smooth;
}

.module {
  min-height: 100vh;
  min-height: 100dvh;
  scroll-snap-align: start;
}
```

### 导航点交互

```javascript
// 滚动检测更新导航点
const modules = document.querySelectorAll('.module');
const navDots = document.querySelectorAll('.nav-dot');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const index = Array.from(modules).indexOf(entry.target);
      navDots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
      });
    }
  });
}, {
  rootMargin: '-50% 0px -50% 0px',
  threshold: 0
});

modules.forEach(module => observer.observe(module));

// 键盘导航
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === ' ') {
    e.preventDefault();
    const current = document.querySelector('.nav-dot.active');
    const next = current?.nextElementSibling;
    if (next) next.click();
  } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
    e.preventDefault();
    const current = document.querySelector('.nav-dot.active');
    const prev = current?.previousElementSibling;
    if (prev) prev.click();
  }
});
```
