import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 检查是否在 Git 仓库中
function isGitRepo() {
    try {
        execSync('git rev-parse --is-inside-work-tree', { stdio: 'pipe' });
        return true;
    } catch (e) {
        return false;
    }
}

// 安装 husky hooks
function installHusky() {
    try {
        // 检查 husky 是否已安装
        if (fs.existsSync(path.join(process.cwd(), '.husky'))) {
            console.log('🔧 Husky already installed, updating hooks...');
        } else {
            console.log('📦 Installing husky hooks...');
        }
        
        // 执行 husky install（新版本）
        execSync('pnpm exec husky', { stdio: 'inherit' });
        
        // 确保所有 hooks 有执行权限
        const huskyDir = path.join(process.cwd(), '.husky');
        if (fs.existsSync(huskyDir)) {
            const files = fs.readdirSync(huskyDir);
            files.forEach(file => {
                const filePath = path.join(huskyDir, file);
                if (fs.statSync(filePath).isFile()) {
                    fs.chmodSync(filePath, '755');
                }
            });
        }
        
        console.log('✅ Git hooks installed successfully!');
        console.log('');
        console.log('You can now use:');
        console.log('  pnpm commit    - Make a commit with Commitizen');
        console.log('  pnpm release   - Create a new release');
        console.log('');
        
    } catch (error) {
        console.log('⚠️  Failed to install husky hooks automatically.');
        console.log('Please run manually:');
        console.log('  pnpm exec husky');
        console.log('');
    }
}

// 主函数
function main() {
    // 检查是否是模板项目本身（通过检查目录结构）
    const isTemplate = fs.existsSync(path.join(process.cwd(), 'scripts', 'setup-git-hooks.sh'));
    
    if (isTemplate && process.env.npm_config_user_agent && !process.env.INIT_CWD) {
        // 这是模板项目本身，不安装 hooks
        console.log('📝 This is a template project. Git hooks will be installed when used as a template.');
        return;
    }
    
    // 检查是否在 Git 仓库中
    if (!isGitRepo()) {
        console.log('⚠️  Not in a Git repository. Skipping Git hooks installation.');
        console.log('Run "git init" first, then "pnpm install" again to install hooks.');
        return;
    }
    
    // 安装 hooks
    installHusky();
}

main();