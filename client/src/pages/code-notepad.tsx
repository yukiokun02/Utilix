import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import BackgroundShapes from "@/components/background-shapes";
import { ArrowLeftIcon, CodeIcon, SaveIcon, DownloadIcon, CopyIcon, FileTextIcon, PlusIcon } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

const LANGUAGES = [
  { value: 'javascript', label: 'JavaScript', extension: 'js', mime: 'text/javascript' },
  { value: 'typescript', label: 'TypeScript', extension: 'ts', mime: 'text/typescript' },
  { value: 'python', label: 'Python', extension: 'py', mime: 'text/x-python' },
  { value: 'html', label: 'HTML', extension: 'html', mime: 'text/html' },
  { value: 'css', label: 'CSS', extension: 'css', mime: 'text/css' },
  { value: 'json', label: 'JSON', extension: 'json', mime: 'application/json' },
  { value: 'xml', label: 'XML', extension: 'xml', mime: 'application/xml' },
  { value: 'markdown', label: 'Markdown', extension: 'md', mime: 'text/markdown' },
  { value: 'sql', label: 'SQL', extension: 'sql', mime: 'text/x-sql' },
  { value: 'php', label: 'PHP', extension: 'php', mime: 'text/x-php' },
  { value: 'java', label: 'Java', extension: 'java', mime: 'text/x-java' },
  { value: 'cpp', label: 'C++', extension: 'cpp', mime: 'text/x-c++src' },
  { value: 'c', label: 'C', extension: 'c', mime: 'text/x-csrc' },
  { value: 'csharp', label: 'C#', extension: 'cs', mime: 'text/x-csharp' },
  { value: 'go', label: 'Go', extension: 'go', mime: 'text/x-go' },
  { value: 'rust', label: 'Rust', extension: 'rs', mime: 'text/x-rustsrc' },
  { value: 'bash', label: 'Bash', extension: 'sh', mime: 'text/x-sh' },
  { value: 'powershell', label: 'PowerShell', extension: 'ps1', mime: 'text/x-powershell' },
];

const CODE_TEMPLATES = {
  javascript: `// JavaScript Example
function greetUser(name) {
    const greeting = \`Hello, \${name}!\`;
    console.log(greeting);
    return greeting;
}

// Call the function
greetUser('Developer');

// TODO: Add more functionality`,
  
  python: `# Python Example
def greet_user(name):
    greeting = f"Hello, {name}!"
    print(greeting)
    return greeting

# Call the function
greet_user('Developer')

# TODO: Add more functionality`,

  html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Web Page</title>
</head>
<body>
    <h1>Hello, World!</h1>
    <p>This is a sample HTML document.</p>
</body>
</html>`,

  css: `/* CSS Example */
body {
    font-family: 'Arial', sans-serif;
    margin: 0;
    padding: 20px;
    background-color: #f5f5f5;
}

.container {
    max-width: 800px;
    margin: 0 auto;
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h1 {
    color: #333;
    text-align: center;
}`,

  json: `{
  "name": "My Project",
  "version": "1.0.0",
  "description": "A sample JSON configuration",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "test": "jest"
  },
  "dependencies": {
    "express": "^4.18.0",
    "lodash": "^4.17.21"
  },
  "author": "Developer",
  "license": "MIT"
}`,
};

export default function CodeNotepad() {
  const [code, setCode] = useState(CODE_TEMPLATES.javascript);
  const [language, setLanguage] = useState('javascript');
  const [fileName, setFileName] = useState('untitled');
  const [savedFiles, setSavedFiles] = useState<Array<{name: string, content: string, language: string}>>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const { toast } = useToast();

  const getLineNumbers = () => {
    const lines = code.split('\n').length;
    return Array.from({ length: lines }, (_, i) => i + 1);
  };

  const getStats = () => {
    const lines = code.split('\n').length;
    const words = code.trim() ? code.trim().split(/\s+/).length : 0;
    const characters = code.length;
    const charactersNoSpaces = code.replace(/\s/g, '').length;

    return { lines, words, characters, charactersNoSpaces };
  };

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    setHasUnsavedChanges(true);
    // Optionally load template for new language
    if (CODE_TEMPLATES[newLanguage as keyof typeof CODE_TEMPLATES] && code === CODE_TEMPLATES[language as keyof typeof CODE_TEMPLATES]) {
      setCode(CODE_TEMPLATES[newLanguage as keyof typeof CODE_TEMPLATES] || '');
    }
  };

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    setHasUnsavedChanges(true);
  };

  const handleAddNew = () => {
    if (hasUnsavedChanges) {
      const shouldSave = window.confirm(
        "You have unsaved changes. Would you like to save the current file before creating a new one?"
      );
      if (shouldSave) {
        handleSave();
      }
    }
    
    setCode(CODE_TEMPLATES.javascript);
    setLanguage('javascript');
    setFileName('untitled');
    setHasUnsavedChanges(false);
    
    toast({
      title: "New file created",
      description: "Started with a fresh JavaScript template"
    });
  };

  const handleSave = () => {
    if (!fileName.trim()) {
      toast({
        title: "Invalid filename",
        description: "Please enter a valid filename",
        variant: "destructive"
      });
      return;
    }

    const newFile = {
      name: fileName,
      content: code,
      language: language,
    };

    setSavedFiles(prev => {
      const existingIndex = prev.findIndex(f => f.name === fileName);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = newFile;
        return updated;
      }
      return [...prev, newFile];
    });

    setHasUnsavedChanges(false);

    toast({
      title: "File saved",
      description: `Saved as ${fileName}`
    });
  };

  const handleDownload = () => {
    const selectedLang = LANGUAGES.find(l => l.value === language);
    const extension = selectedLang?.extension || 'txt';
    const fullFileName = fileName.includes('.') ? fileName : `${fileName}.${extension}`;
    
    const blob = new Blob([code], { type: selectedLang?.mime || 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fullFileName;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "File downloaded",
      description: `Downloaded as ${fullFileName}`
    });
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      toast({
        title: "Copied to clipboard",
        description: "Code copied successfully"
      });
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Could not copy to clipboard",
        variant: "destructive"
      });
    }
  };

  const loadFile = (file: {name: string, content: string, language: string}) => {
    if (hasUnsavedChanges) {
      const shouldSave = window.confirm(
        "You have unsaved changes. Would you like to save the current file before loading a new one?"
      );
      if (shouldSave) {
        handleSave();
      }
    }
    
    setCode(file.content);
    setLanguage(file.language);
    setFileName(file.name);
    setHasUnsavedChanges(false);
    toast({
      title: "File loaded",
      description: `Loaded ${file.name}`
    });
  };

  const getVerticalGuides = () => {
    // Different column guidelines for different languages
    const guides: Record<string, number[]> = {
      javascript: [80, 120],
      typescript: [80, 120],
      python: [79, 99],
      html: [80, 120],
      css: [80, 120],
      json: [80],
      xml: [80, 120],
      markdown: [80],
      sql: [80],
      php: [80, 120],
      java: [80, 120],
      cpp: [80, 120],
      c: [80, 120],
      csharp: [80, 120],
      go: [80, 120],
      rust: [80, 120],
      bash: [80],
      powershell: [80],
    };
    
    return guides[language] || [80];
  };

  const stats = getStats();

  return (
    <div className="min-h-screen pt-20 relative">
      <BackgroundShapes />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                Code Notepad
              </span>
            </h1>
            <p className="text-muted-foreground">Write, edit, and save code with syntax highlighting</p>
          </div>
          <Link href="/">
            <Button variant="outline" size="icon" className="w-10 h-10 rounded-lg">
              <ArrowLeftIcon className="w-4 h-4" />
            </Button>
          </Link>
        </div>
        
        {/* Editor Controls */}
        <Card className="bg-card/50 backdrop-blur-sm border-border mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex items-center gap-2">
                  <Label className="text-foreground">Language:</Label>
                  <Select value={language} onValueChange={handleLanguageChange}>
                    <SelectTrigger className="w-40 bg-background border-border text-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {LANGUAGES.map((lang) => (
                        <SelectItem key={lang.value} value={lang.value}>
                          {lang.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center gap-2">
                  <Label className="text-foreground">Filename:</Label>
                  <Input
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                    className="w-40 bg-background border-border text-foreground"
                    placeholder="untitled"
                  />
                </div>
                
                <div className="text-sm text-muted-foreground">
                  Lines: {stats.lines} | Words: {stats.words} | Characters: {stats.characters}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button onClick={handleAddNew} variant="outline" size="sm" className="pill-button">
                  <PlusIcon className="w-4 h-4 mr-1" />
                  New
                </Button>
                <Button onClick={copyToClipboard} variant="outline" size="sm" className="pill-button">
                  <CopyIcon className="w-4 h-4 mr-1" />
                  Copy
                </Button>
                <Button onClick={handleSave} variant="outline" size="sm" className="pill-button">
                  <SaveIcon className="w-4 h-4 mr-1" />
                  Save{hasUnsavedChanges ? '*' : ''}
                </Button>
                <Button onClick={handleDownload} size="sm" className="pill-button bg-gradient-to-r from-violet-500 to-purple-600">
                  <DownloadIcon className="w-4 h-4 mr-1" />
                  Download
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Code Editor */}
          <div className="lg:col-span-3">
            <Card className="bg-card/50 backdrop-blur-sm border-border">
              <CardContent className="p-0">
                <div className="bg-slate-900 rounded-lg overflow-hidden">
                  <div className="flex">
                    <div className="bg-slate-800 text-slate-500 select-none px-4 py-4 min-w-[3rem] text-right text-sm font-mono border-r border-slate-700">
                      {getLineNumbers().map((num) => (
                        <div key={num} className="leading-6">{num}</div>
                      ))}
                    </div>
                    <div className="flex-1 relative">
                      {/* Vertical Guidelines */}
                      {getVerticalGuides().map((column, index) => (
                        <div
                          key={column}
                          className="absolute top-0 bottom-0 w-px bg-slate-600/30 pointer-events-none"
                          style={{
                            left: `${column * 0.6}em`, // Approximate character width
                            marginLeft: '1rem' // Account for padding
                          }}
                        />
                      ))}
                      
                      <Textarea
                        value={code}
                        onChange={(e) => handleCodeChange(e.target.value)}
                        className="w-full bg-transparent border-0 text-slate-100 font-mono text-sm resize-none outline-none focus:ring-0 min-h-[500px] p-4 leading-6"
                        placeholder="Start coding..."
                        style={{ 
                          fontFamily: '"Fira Code", "Source Code Pro", Consolas, "Courier New", monospace',
                          lineHeight: '1.5'
                        }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Export Options */}
            <Card className="bg-card/50 backdrop-blur-sm border-border">
              <CardHeader>
                <CardTitle className="text-foreground text-lg">Quick Export</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  {LANGUAGES.slice(0, 8).map((lang) => (
                    <Button
                      key={lang.value}
                      variant="outline"
                      size="sm"
                      className="pill-button text-xs"
                      onClick={() => {
                        const blob = new Blob([code], { type: lang.mime });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `${fileName}.${lang.extension}`;
                        a.click();
                        URL.revokeObjectURL(url);
                      }}
                    >
                      .{lang.extension}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Saved Files */}
            <Card className="bg-card/50 backdrop-blur-sm border-border">
              <CardHeader>
                <CardTitle className="text-foreground text-lg">Saved Files</CardTitle>
              </CardHeader>
              <CardContent>
                {savedFiles.length > 0 ? (
                  <div className="space-y-2">
                    {savedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="p-3 bg-background rounded-lg border border-border hover:bg-muted/20 transition-colors cursor-pointer"
                        onClick={() => loadFile(file)}
                      >
                        <div className="flex items-center gap-2">
                          <FileTextIcon className="w-4 h-4 text-muted-foreground" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {LANGUAGES.find(l => l.value === file.language)?.label}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No saved files yet
                  </p>
                )}
              </CardContent>
            </Card>
            
            {/* Code Stats */}
            <Card className="bg-card/50 backdrop-blur-sm border-border">
              <CardHeader>
                <CardTitle className="text-foreground text-lg">Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Lines:</span>
                  <span className="text-foreground font-medium">{stats.lines}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Words:</span>
                  <span className="text-foreground font-medium">{stats.words}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Characters:</span>
                  <span className="text-foreground font-medium">{stats.characters}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Without spaces:</span>
                  <span className="text-foreground font-medium">{stats.charactersNoSpaces}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
