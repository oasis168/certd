#!/bin/bash
# Certd 一键安装脚本 (商业版)
# 使用方法: curl -fsSL https://raw.githubusercontent.com/oasis168/certd/v2/install.sh | bash

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

info()  { echo -e "${GREEN}[INFO]${NC} $1"; }
warn()  { echo -e "${YELLOW}[WARN]${NC} $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; exit 1; }

INSTALL_DIR="${CERTD_INSTALL_DIR:-/opt/certd}"
REPO_URL="https://github.com/oasis168/certd.git"
BRANCH="v2"
NODE_MIN_VERSION=18

# 检查命令是否存在
check_cmd() { command -v "$1" >/dev/null 2>&1; }

# 检查 Node.js 版本
check_node() {
    if ! check_cmd node; then
        error "未找到 Node.js，请先安装 Node.js >= ${NODE_MIN_VERSION}\n  推荐: curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - && sudo apt install -y nodejs"
    fi
    local ver
    ver=$(node -v | sed 's/v//' | cut -d. -f1)
    if [ "$ver" -lt "$NODE_MIN_VERSION" ]; then
        error "Node.js 版本过低 (当前: $(node -v))，需要 >= ${NODE_MIN_VERSION}"
    fi
    info "Node.js $(node -v) ✓"
}

# 检查 pnpm
check_pnpm() {
    if ! check_cmd pnpm; then
        info "安装 pnpm..."
        npm install -g pnpm || error "pnpm 安装失败"
    fi
    info "pnpm $(pnpm -v) ✓"
}

# 检查 git
check_git() {
    check_cmd git || error "未找到 git，请先安装: sudo apt install -y git"
    info "git $(git --version | awk '{print $3}') ✓"
}
# 克隆项目
clone_repo() {
    if [ -d "$INSTALL_DIR" ]; then
        warn "目录 $INSTALL_DIR 已存在"
        if [ -d "$INSTALL_DIR/.git" ]; then
            info "更新代码..."
            cd "$INSTALL_DIR" && git pull origin "$BRANCH"
            return
        else
            error "目录已存在但不是 git 仓库，请手动删除或指定其他目录: CERTD_INSTALL_DIR=/other/path bash install.sh"
        fi
    fi
    info "克隆项目到 $INSTALL_DIR ..."
    git clone --depth 1 -b "$BRANCH" "$REPO_URL" "$INSTALL_DIR"
}

# 安装依赖并编译
build_project() {
    cd "$INSTALL_DIR"
    info "安装依赖..."
    pnpm install --frozen-lockfile 2>/dev/null || pnpm install
    info "编译项目..."
    npx lerna run build
    info "复制前端文件..."
    cp -r packages/ui/certd-client/dist/* packages/ui/certd-server/public/
}

# 创建 systemd 服务
install_service() {
    if [ "$(id -u)" -ne 0 ]; then
        warn "非 root 用户，跳过 systemd 服务安装。你可以手动启动:"
        info "  cd $INSTALL_DIR/packages/ui/certd-server && NODE_ENV=production node bootstrap.js"
        return
    fi

    cat > /etc/systemd/system/certd.service <<EOF
[Unit]
Description=Certd Certificate Manager
After=network.target

[Service]
Type=simple
WorkingDirectory=${INSTALL_DIR}/packages/ui/certd-server
ExecStart=$(which node) --optimize-for-size bootstrap.js
Environment=NODE_ENV=production
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

    systemctl daemon-reload
    systemctl enable certd
    systemctl start certd
    info "systemd 服务已安装并启动"
}

# 主流程
main() {
    echo ""
    echo "========================================="
    echo "  Certd 一键安装脚本"
    echo "  安装目录: $INSTALL_DIR"
    echo "========================================="
    echo ""

    check_git
    check_node
    check_pnpm
    clone_repo
    build_project
    install_service

    echo ""
    echo "========================================="
    info "安装完成!"
    echo ""
    info "访问地址: https://localhost:7002"
    info "默认账号: admin"
    info "默认密码: 123456"
    info "授权版本: 商业版 (永久)"
    echo ""
    info "数据目录: $INSTALL_DIR/packages/ui/certd-server/data/"
    info "请定期备份此目录"
    echo "========================================="
}

main "$@"
