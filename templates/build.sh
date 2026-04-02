#!/bin/bash
# =============================================================
# DIFF-REVIEW BUILD SCRIPT
# 将各模块组装成完整的 HTML 文件
# =============================================================

set -e

# 配置
MODULES_DIR="modules"
OUTPUT_FILE="diff-review.html"

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🔧 开始组装代码审查报告...${NC}"

# 检查目录结构
if [ ! -d "$MODULES_DIR" ]; then
    echo -e "${RED}✗ 错误: 未找到 $MODULES_DIR 目录${NC}"
    exit 1
fi

# 统计模块数量
MODULE_COUNT=$(ls -1 $MODULES_DIR/module-*.html 2>/dev/null | wc -l)
if [ "$MODULE_COUNT" -eq 0 ]; then
    echo -e "${RED}✗ 错误: 未找到任何模块文件${NC}"
    exit 1
fi

echo -e "${GREEN}✓ 找到 $MODULE_COUNT 个模块${NC}"

# 生成导航点
NAV_DOTS=""
for i in $(seq 0 $((MODULE_COUNT - 1))); do
    ACTIVE=""
    [ "$i" -eq 0 ] && ACTIVE=" active"
    NAV_DOTS="${NAV_DOTS}      <button class=\"nav-dot${ACTIVE}\" onclick=\"scrollToModule($i)\" title=\"模块 $i\"></button>\n"
done

# 组装 HTML
echo -e "${YELLOW}📝 组装 HTML 文件...${NC}"

# 写入头部
cat templates/base.html | sed "s|<!-- NAV_DOTS_PLACEHOLDER -->|$NAV_DOTS|" > "$OUTPUT_FILE"

# 按顺序追加各模块
for module in $(ls -v $MODULES_DIR/module-*.html); do
    echo -e "${GREEN}  + 添加 $(basename $module)${NC}"
    cat "$module" >> "$OUTPUT_FILE"
done

# 追加底部
cat templates/footer.html >> "$OUTPUT_FILE"

echo -e "${GREEN}✓ 组装完成: $OUTPUT_FILE${NC}"
echo -e "${GREEN}📊 统计: $MODULE_COUNT 个模块${NC}"
echo ""
echo -e "${YELLOW}🌐 在浏览器中打开 $OUTPUT_FILE 查看报告${NC}"
