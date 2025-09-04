#!/bin/bash

# Tauri 2 + React + TypeScript 一键启动脚本

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 脚本信息
SCRIPT_NAME="Tauri 2 启动器"
SCRIPT_VERSION="1.0.0"

# 打印带颜色的信息
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 显示帮助信息
show_help() {
    cat << EOF
$SCRIPT_NAME v$SCRIPT_VERSION

Tauri 2 + React + TypeScript 开发环境一键启动器

用法: $0 [选项] [命令]

选项:
    -h, --help          显示此帮助信息
    -v, --version       显示版本信息
    -e, --env           检查环境配置
    -c, --create        创建新项目
    -d, --dev           启动开发服务器
    -b, --build         构建项目
    -t, --test          运行测试
    -g, --gui           测试GUI环境
    -s, --setup         设置环境
    --project NAME      指定项目名称

命令:
    env                检查环境配置
    create [NAME]      创建新项目 (可选项目名称)
    dev                启动开发服务器
    build              构建项目
    test               运行测试
    gui                测试GUI环境
    setup              设置环境
    clean              清理项目缓存

示例:
    $0                  # 显示菜单
    $0 --env            # 检查环境
    $0 --create my-app  # 创建项目
    $0 --dev            # 启动开发服务器
    $0 --project my-app dev  # 在指定项目启动开发服务器

EOF
}

# 显示版本信息
show_version() {
    echo "$SCRIPT_NAME v$SCRIPT_VERSION"
    echo "Tauri 2 + React + TypeScript 开发环境"
}

# 检查和设置环境变量
setup_environment() {
    print_info "设置环境变量..."
    
    # 设置nvm
    export NVM_DIR="$HOME/.nvm"
    if [ -s "$NVM_DIR/nvm.sh" ]; then
        \. "$NVM_DIR/nvm.sh"
        print_success "nvm环境变量已设置"
    else
        print_error "nvm未安装，请先安装nvm"
        return 1
    fi
    
    # 设置Node.js版本
    if command -v nvm &> /dev/null; then
        nvm use 22 2>/dev/null || nvm install 22
        print_success "Node.js版本: $(node --version)"
    fi
    
    # 设置GUI环境变量
    export DISPLAY=:0.0
    export WAYLAND_DISPLAY=wayland-0
    export LIBGL_ALWAYS_INDIRECT=1
    export PULSE_SERVER=tcp:$(grep nameserver /etc/resolv.conf | awk '{print $2}'):3456
    
    print_success "GUI环境变量已设置"
}

# 检查环境配置
check_environment() {
    print_info "检查环境配置..."
    
    issues=0
    
    # 检查Node.js
    if command -v node &> /dev/null; then
        node_version=$(node --version)
        if [[ $node_version == v22* ]]; then
            print_success "Node.js: $node_version"
        else
            print_warning "Node.js: $node_version (建议使用v22.x)"
            ((issues++))
        fi
    else
        print_error "Node.js未安装"
        ((issues++))
    fi
    
    # 检查pnpm
    if command -v pnpm &> /dev/null; then
        print_success "pnpm: $(pnpm --version)"
    else
        print_error "pnpm未安装"
        ((issues++))
    fi
    
    # 检查Rust
    if command -v cargo &> /dev/null; then
        print_success "Rust: $(cargo --version | cut -d' ' -f1-2)"
    else
        print_error "Rust未安装"
        ((issues++))
    fi
    
    # 检查系统依赖
    deps=("libwebkit2gtk-4.1-dev" "build-essential" "libxdo-dev" "libssl-dev")
    for dep in "${deps[@]}"; do
        if dpkg -l | grep -q "^ii  $dep"; then
            print_success "$dep 已安装"
        else
            print_warning "$dep 未安装"
            ((issues++))
        fi
    done
    
    # 检查GUI环境
    if [ -n "$DISPLAY" ]; then
        print_success "DISPLAY: $DISPLAY"
    else
        print_error "DISPLAY变量未设置"
        ((issues++))
    fi
    
    if [ $issues -eq 0 ]; then
        print_success "环境配置正常"
        return 0
    else
        print_warning "发现 $issues 个问题"
        return 1
    fi
}

# 测试GUI环境
test_gui() {
    print_info "测试GUI环境..."
    
    # 检查环境变量
    echo "DISPLAY: ${DISPLAY:-未设置}"
    echo "WAYLAND_DISPLAY: ${WAYLAND_DISPLAY:-未设置}"
    
    # 测试X11连接
    if command -v xdpyinfo &> /dev/null; then
        if timeout 3s xdpyinfo >/dev/null 2>&1; then
            print_success "X11服务器连接正常"
        else
            print_warning "X11服务器连接失败"
        fi
    else
        print_warning "xdpyinfo不可用，跳过X11测试"
    fi
    
    # 测试Tauri依赖
    if dpkg -l | grep -q "^ii  libwebkit2gtk-4.1-dev"; then
        version=$(dpkg -l | grep libwebkit2gtk-4.1-dev | awk '{print $3}')
        print_success "libwebkit2gtk-4.1-dev: $version"
    else
        print_error "libwebkit2gtk-4.1-dev未安装"
    fi
    
    print_info "GUI测试完成"
}

# 创建新项目
create_project() {
    local project_name="$1"
    
    if [ -z "$project_name" ]; then
        read -p "请输入项目名称: " project_name
    fi
    
    if [ -z "$project_name" ]; then
        print_error "项目名称不能为空"
        return 1
    fi
    
    print_info "创建项目: $project_name"
    
    # 创建项目目录
    mkdir -p "$HOME/tauri-projects"
    cd "$HOME/tauri-projects"
    
    # 检查项目是否已存在
    if [ -d "$project_name" ]; then
        print_error "项目 '$project_name' 已存在"
        return 1
    fi
    
    # 创建项目
    if pnpm create tauri-app@latest "$project_name" -- --frontend react --template react-ts --package-manager pnpm; then
        print_success "项目创建成功"
        cd "$project_name"
        print_info "项目位置: $(pwd)"
        print_info "启动开发: pnpm tauri dev"
    else
        print_error "项目创建失败"
        return 1
    fi
}

# 启动开发服务器
start_dev() {
    local project_dir="$1"
    
    if [ -n "$project_dir" ]; then
        if [ -d "$project_dir" ]; then
            cd "$project_dir"
        else
            print_error "项目目录 '$project_dir' 不存在"
            return 1
        fi
    fi
    
    # 检查是否在Tauri项目中
    if [ ! -f "package.json" ] || [ ! -d "src-tauri" ]; then
        print_error "当前目录不是Tauri项目"
        print_info "请使用 --create 创建新项目或进入项目目录"
        return 1
    fi
    
    print_info "启动开发服务器..."
    pnpm tauri dev
}

# 构建项目
build_project() {
    local project_dir="$1"
    
    if [ -n "$project_dir" ]; then
        if [ -d "$project_dir" ]; then
            cd "$project_dir"
        else
            print_error "项目目录 '$project_dir' 不存在"
            return 1
        fi
    fi
    
    # 检查是否在Tauri项目中
    if [ ! -f "package.json" ] || [ ! -d "src-tauri" ]; then
        print_error "当前目录不是Tauri项目"
        return 1
    fi
    
    print_info "构建项目..."
    pnpm tauri build
}

# 运行测试
run_tests() {
    local project_dir="$1"
    
    if [ -n "$project_dir" ]; then
        if [ -d "$project_dir" ]; then
            cd "$project_dir"
        else
            print_error "项目目录 '$project_dir' 不存在"
            return 1
        fi
    fi
    
    # 检查是否在Tauri项目中
    if [ ! -f "package.json" ]; then
        print_error "当前目录不是Node.js项目"
        return 1
    fi
    
    print_info "运行测试..."
    if pnpm test; then
        print_success "测试通过"
    else
        print_warning "测试失败或未配置"
    fi
}

# 清理项目缓存
clean_project() {
    local project_dir="$1"
    
    if [ -n "$project_dir" ]; then
        if [ -d "$project_dir" ]; then
            cd "$project_dir"
        else
            print_error "项目目录 '$project_dir' 不存在"
            return 1
        fi
    fi
    
    print_info "清理项目缓存..."
    
    # 清理pnpm缓存
    if command -v pnpm &> /dev/null; then
        pnpm store prune
        rm -rf node_modules pnpm-lock.yaml
        print_success "pnpm缓存已清理"
    fi
    
    # 清理Tauri缓存
    if [ -d "src-tauri/target" ]; then
        rm -rf src-tauri/target
        print_success "Tauri构建缓存已清理"
    fi
    
    print_info "重新安装依赖..."
    pnpm install
}

# 显示菜单
show_menu() {
    echo ""
    echo "=================================="
    echo "  $SCRIPT_NAME v$SCRIPT_VERSION"
    echo "=================================="
    echo ""
    echo "1. 检查环境配置"
    echo "2. 创建新项目"
    echo "3. 启动开发服务器"
    echo "4. 构建项目"
    echo "5. 运行测试"
    echo "6. 测试GUI环境"
    echo "7. 清理项目缓存"
    echo "8. 设置环境"
    echo "9. 显示帮助"
    echo "0. 退出"
    echo ""
    read -p "请选择操作 [0-9]: " choice
}

# 主循环
main() {
    # 解析命令行参数
    while [[ $# -gt 0 ]]; do
        case $1 in
            -h|--help)
                show_help
                exit 0
                ;;
            -v|--version)
                show_version
                exit 0
                ;;
            -e|--env)
                setup_environment
                check_environment
                exit $?
                ;;
            -c|--create)
                setup_environment
                create_project "$2"
                exit $?
                ;;
            -d|--dev)
                setup_environment
                start_dev "$2"
                exit $?
                ;;
            -b|--build)
                setup_environment
                build_project "$2"
                exit $?
                ;;
            -t|--test)
                setup_environment
                run_tests "$2"
                exit $?
                ;;
            -g|--gui)
                setup_environment
                test_gui
                exit $?
                ;;
            -s|--setup)
                setup_environment
                check_environment
                exit $?
                ;;
            --project)
                PROJECT_NAME="$2"
                shift 2
                ;;
            env)
                setup_environment
                check_environment
                exit $?
                ;;
            create)
                setup_environment
                create_project "$2"
                exit $?
                ;;
            dev)
                setup_environment
                start_dev "$2"
                exit $?
                ;;
            build)
                setup_environment
                build_project "$2"
                exit $?
                ;;
            test)
                setup_environment
                run_tests "$2"
                exit $?
                ;;
            gui)
                setup_environment
                test_gui
                exit $?
                ;;
            setup)
                setup_environment
                check_environment
                exit $?
                ;;
            clean)
                setup_environment
                clean_project "$2"
                exit $?
                ;;
            *)
                print_error "未知选项: $1"
                show_help
                exit 1
                ;;
        esac
    done
    
    # 交互式菜单
    while true; do
        show_menu
        
        case $choice in
            1)
                setup_environment
                check_environment
                ;;
            2)
                setup_environment
                read -p "请输入项目名称: " project_name
                create_project "$project_name"
                ;;
            3)
                setup_environment
                read -p "请输入项目目录 (留空使用当前目录): " project_dir
                start_dev "$project_dir"
                ;;
            4)
                setup_environment
                read -p "请输入项目目录 (留空使用当前目录): " project_dir
                build_project "$project_dir"
                ;;
            5)
                setup_environment
                read -p "请输入项目目录 (留空使用当前目录): " project_dir
                run_tests "$project_dir"
                ;;
            6)
                setup_environment
                test_gui
                ;;
            7)
                setup_environment
                read -p "请输入项目目录 (留空使用当前目录): " project_dir
                clean_project "$project_dir"
                ;;
            8)
                setup_environment
                check_environment
                ;;
            9)
                show_help
                ;;
            0)
                print_info "退出"
                exit 0
                ;;
            *)
                print_error "无效选择: $choice"
                ;;
        esac
        
        echo ""
        read -p "按Enter继续..."
    done
}

# 运行主函数
main "$@"