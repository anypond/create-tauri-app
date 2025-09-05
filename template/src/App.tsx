import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card";
import { ThemeToggle } from "./components/theme-toggle";
import { Github, ExternalLink, Heart, Settings } from "lucide-react";

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function greet() {
    setIsLoading(true);
    try {
      const result = await invoke("greet", { name });
      setGreetMsg(result as string);
    } catch (error) {
      setGreetMsg("调用失败，请检查后端服务");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <header className="flex items-center justify-between py-6">
          <div className="flex items-center gap-md">
            <div className="flex items-center justify-center w-10 h-10 bg-primary rounded">
              <span className="text-white font-bold">T</span>
            </div>
            <div>
              <h1 className="heading-2 text-foreground">Tauri + React</h1>
              <p className="text-small text-muted-foreground">现代化的桌面应用开发模板</p>
            </div>
          </div>
          <ThemeToggle />
        </header>

        {/* Main Content */}
        <main className="space-y-8">
          {/* Hero Section */}
          <Card className="text-center p-lg">
            <CardHeader className="gap-md">
              <CardTitle className="heading-1 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                欢迎使用 Tauri + React
              </CardTitle>
              <CardDescription className="text-large">
                基于 Radix UI + Tailwind CSS 的现代化桌面应用模板
              </CardDescription>
            </CardHeader>
            <CardContent className="gap-lg">
              <div className="flex justify-center gap-md">
                <Button asChild variant="outline">
                  <a
                    href="https://tauri.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-sm"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Tauri 文档</span>
                  </a>
                </Button>
                <Button asChild variant="outline">
                  <a
                    href="https://react.dev"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-sm"
                  >
                    <Github className="w-4 h-4" />
                    <span>React 文档</span>
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Interactive Demo */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-sm">
                <Settings className="w-5 h-5" />
                <span>交互演示</span>
              </CardTitle>
              <CardDescription>
                体验 Tauri 前后端交互功能
              </CardDescription>
            </CardHeader>
            <CardContent className="gap-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                <div className="gap-sm">
                  <Label htmlFor="name">请输入您的名字</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="输入名字..."
                    onKeyPress={(e) => e.key === 'Enter' && greet()}
                  />
                </div>
                <div className="flex items-end">
                  <Button 
                    onClick={greet} 
                    disabled={isLoading || !name.trim()}
                    className="w-full"
                  >
                    {isLoading ? "调用中..." : "打招呼"}
                  </Button>
                </div>
              </div>
              {greetMsg && (
                <Card className="bg-muted/50 border-primary/20">
                  <CardContent className="pt-6">
                    <p className="text-center text-foreground font-medium">
                      {greetMsg}
                    </p>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
            <Card>
              <CardHeader>
                <CardTitle className="heading-3">🎨 现代化设计</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  基于 Radix UI + Tailwind CSS，提供完美的可访问性和响应式设计
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="heading-3">⚡ 高性能</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Tauri 提供轻量级的后端，Rust 确保安全和高性能
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="heading-3">🔧 易于扩展</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  组件化架构，支持主题定制，适合各种业务场景
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </main>

        {/* Footer */}
        <footer className="py-lg text-center text-muted-foreground">
          <div className="flex items-center justify-center gap-sm text-small">
            <span>使用</span>
            <Heart className="w-4 h-4 text-red-500 fill-current" />
            <span>构建</span>
          </div>
          <p className="text-small mt-sm">
            Tauri 2 + React + TypeScript + Radix UI + Tailwind CSS
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;