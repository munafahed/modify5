"use client";

import { useState, useRef, type ChangeEvent } from "react";
import JSZip from "jszip";
import { 
  Home, 
  FolderOpen, 
  Smartphone, 
  Palette, 
  Upload,
  CheckSquare,
  Layers,
  Loader2,
  Download,
  Sparkles,
  Plus,
  X,
  Eye,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Play,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FlutterPreviewFrame, type AppConfig as BaseAppConfig } from "@/components/flutter-preview-frame";

interface CustomPage {
  name: string;
  description: string;
  code?: string;
  pubspecYaml?: string;
  widgetStructure?: string;
  isGenerating?: boolean;
  screenFilePath?: string;
  className?: string;
  routeName?: string;
}

interface AppConfig extends Omit<BaseAppConfig, 'customPages'> {
  customPages: CustomPage[];
}

interface GeneratedProject {
  files: Array<{path: string; content: string}>;
  previewApproved?: boolean;
}

const availablePages = [
  'Splash Screen',
  'Login',
  'Register', 
  'Home',
  'Profile',
  'Settings',
  'Chat',
  'Notifications',
  'Search',
  'Dashboard',
  'About'
];

const sidebarItems = [
  { icon: Home, label: 'Dashboard', active: true },
  { icon: FolderOpen, label: 'My Projects' }
];

export default function EnhancedDashboard() {
  const [currentStep, setCurrentStep] = useState<'configure' | 'preview' | 'generate' | 'complete'>('configure');
  const [appConfig, setAppConfig] = useState<AppConfig>({
    appName: '',
    description: '',
    theme: 'light',
    colors: {
      primary: '#667EEA',
      secondary: '#4F46E5',
      accent: '#06B6D4'
    },
    pages: ['Splash Screen', 'Home'],
    customPages: []
  });
  
  const [appIcon, setAppIcon] = useState<File | null>(null);
  const [features, setFeatures] = useState({
    firebase: false,
    supabaseDb: false,
    offlineMode: false
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<GeneratedProject | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [buildResult, setBuildResult] = useState<{success: boolean, projectId: string, previewUrl: string, message: string} | null>(null);
  const [showPageDialog, setShowPageDialog] = useState(false);
  const [pageForm, setPageForm] = useState({ name: '', description: '' });
  const [isGeneratingPage, setIsGeneratingPage] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Configuration handlers
  const handleDescriptionChange = (value: string) => {
    setAppConfig(prev => ({ ...prev, description: value }));
  };

  const handleThemeChange = (theme: 'light' | 'dark' | 'custom') => {
    setAppConfig(prev => ({ ...prev, theme }));
  };

  const handleColorChange = (colorType: 'primary' | 'secondary' | 'accent', value: string) => {
    setAppConfig(prev => ({
      ...prev,
      colors: {
        ...prev.colors,
        [colorType]: value
      }
    }));
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setAppIcon(file);
  };

  const handleFeatureToggle = (feature: keyof typeof features) => {
    setFeatures(prev => ({
      ...prev,
      [feature]: !prev[feature]
    }));
  };

  const handleAppNameChange = (value: string) => {
    setAppConfig(prev => ({ ...prev, appName: value }));
  };

  const handleCustomPageAdd = () => {
    setPageForm({ name: '', description: '' });
    setShowPageDialog(true);
  };

  const generateCustomPageWithAI = async () => {
    if (!pageForm.name.trim() || !pageForm.description.trim()) {
      setError('Please provide both page name and description');
      return;
    }

    setIsGeneratingPage(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-page', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: pageForm.name,
          description: pageForm.description,
          projectContext: `${appConfig.appName}: ${appConfig.description}`,
          generateForScreensFolder: true
        }),
      });

      const result = await response.json();
      
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to generate page');
      }

      const screenFileName = pageForm.name.toLowerCase().replace(/\s+/g, '_') + '_screen.dart';
      const className = pageForm.name.replace(/\s+/g, '') + 'Screen';
      const routeName = '/' + pageForm.name.toLowerCase().replace(/\s+/g, '_');

      const newPage: CustomPage = {
        name: pageForm.name,
        description: pageForm.description,
        code: result.code,
        pubspecYaml: result.pubspecYaml,
        widgetStructure: result.widgetStructure,
        screenFilePath: `lib/screens/${screenFileName}`,
        className: className,
        routeName: routeName
      };

      setAppConfig(prev => ({
        ...prev,
        customPages: [...prev.customPages, newPage]
      }));

      setShowPageDialog(false);
      setPageForm({ name: '', description: '' });
      
    } catch (error) {
      console.error('Page generation failed:', error);
      setError(`AI Generation Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      
      // Add basic page as fallback
      const fallbackPage: CustomPage = {
        name: pageForm.name,
        description: pageForm.description,
        code: `// AI generation failed, but page structure created\n// ${pageForm.description}`,
        screenFilePath: `lib/screens/${pageForm.name.toLowerCase().replace(/\s+/g, '_')}_screen.dart`,
        className: pageForm.name.replace(/\s+/g, '') + 'Screen',
        routeName: '/' + pageForm.name.toLowerCase().replace(/\s+/g, '_')
      };

      setAppConfig(prev => ({
        ...prev,
        customPages: [...prev.customPages, fallbackPage]
      }));

      setShowPageDialog(false);
      setPageForm({ name: '', description: '' });
    } finally {
      setIsGeneratingPage(false);
    }
  };

  const handleCustomPageRemove = (index: number) => {
    setAppConfig(prev => ({
      ...prev,
      customPages: prev.customPages.filter((_, i) => i !== index)
    }));
  };

  const handlePageToggle = (page: string) => {
    setAppConfig(prev => ({
      ...prev,
      pages: prev.pages.includes(page)
        ? prev.pages.filter(p => p !== page)
        : [...prev.pages, page]
    }));
  };

  const buildPrompt = (): string => {
    return `Create a complete, professional Flutter project with the following specifications:

**App Name:** ${appConfig.appName}

**App Description:** ${appConfig.description}

**Design Requirements:**
- Theme: ${appConfig.theme} theme
- Primary Color: ${appConfig.colors.primary}
- Secondary Color: ${appConfig.colors.secondary}  
- Accent Color: ${appConfig.colors.accent}
- Use Material 3 design system
- Modern, beautiful UI with animations
- Child-friendly and playful design
- Smooth transitions and interactions

**App Icon:**
${appIcon ? `- Custom app icon provided (${appIcon.name}) - integrate into assets/icons/ folder and reference in pubspec.yaml` : '- Generate default app icon and configure properly'}

**Features to Include:**
${features.firebase ? '- Complete Firebase integration (authentication, firestore database, storage, analytics - set up all necessary configurations and link properly in the app)' : ''}
${features.supabaseDb ? '- Supabase Database integration with proper connection setup' : ''}
${features.offlineMode ? '- Offline mode capability with local storage' : ''}

**Standard Pages to Generate:**
${appConfig.pages.map(page => `- ${page} page (create fully functional page with proper navigation and interactive elements)`).join('\n')}

**Custom Pages to Generate:**
${appConfig.customPages.map(page => {
  if (page.code) {
    return `- ${page.name} page: Use this pre-generated Flutter code exactly as provided:
      File Path: ${page.screenFilePath || `lib/screens/${page.name.toLowerCase().replace(/\s+/g, '_')}_screen.dart`}
      Class Name: ${page.className || page.name.replace(/\s+/g, '') + 'Screen'}
      Route Name: ${page.routeName || '/' + page.name.toLowerCase().replace(/\s+/g, '_')}
      
      CODE:
      ${page.code}
      
      ${page.pubspecYaml ? `ADDITIONAL DEPENDENCIES FOR PUBSPEC.YAML:\n${page.pubspecYaml}` : ''}`;
  } else {
    return `- ${page.name} page: ${page.description} (implement this page according to the description with proper UI and functionality)`;
  }
}).join('\n\n')}

**Technical Requirements:**
- Complete Flutter project structure with lib/main.dart
- Professional code with proper state management (Provider/Riverpod)
- Responsive design for all screen sizes
- Smooth animations and transitions between screens
- Material 3 components and styling with the specified color scheme
- Proper navigation setup with route management
- Clean, readable, and maintainable code with comments
- Include complete pubspec.yaml with all necessary dependencies
- Proper folder structure (screens/, widgets/, models/, services/, etc.)
- State management for theme switching (light/dark modes)
- Interactive elements that work properly (buttons, forms, navigation)

**CRITICAL: Use Pre-Generated Code:** For custom pages that include pre-generated Flutter code, use the provided code EXACTLY as specified. Create the files at the exact paths mentioned, use the specified class names, and integrate the routes properly. Do not regenerate or modify the pre-generated code - it's already optimized with Material 3 design, animations, and proper functionality.

**Important:** Generate separate Dart files for each screen/page with proper navigation between them. Each screen should be fully functional with the specified color scheme and modern Material 3 design.

Please generate a complete, production-ready Flutter application that matches these specifications with beautiful design, smooth user experience, and professional code structure.`;
  };

  const handlePreviewApp = () => {
    if (!appConfig.appName.trim() || !appConfig.description.trim()) {
      setError('Please provide app name and description');
      return;
    }
    setCurrentStep('preview');
    setError(null);
  };

  const handleApprovePreview = async () => {
    setCurrentStep('generate');
    await generateApp(true);
  };

  const generateApp = async (previewApproved: boolean = false) => {
    setIsGenerating(true);
    setError(null);
    setGeneratedResult(null);

    try {
      const prompt = buildPrompt();
      
      const response = await fetch('/api/generate-app', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate app');
      }

      const result = await response.json();
      
      if (result.success && result.files) {
        setGeneratedResult({ 
          files: result.files,
          previewApproved: previewApproved 
        });
        setCurrentStep('complete');
      } else {
        throw new Error(result.error || 'Failed to generate complete app');
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setCurrentStep('configure');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleBuildProject = async () => {
    if (!generatedResult || !generatedResult.files || generatedResult.files.length === 0) {
      setError('No generated project to build');
      return;
    }

    try {
      setIsGenerating(true);
      const response = await fetch('/api/build-flutter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          files: generatedResult.files,
          projectName: appConfig.appName
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        setBuildResult(result);
      } else {
        throw new Error(result.details || 'Failed to build project');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Build failed');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!generatedResult || !generatedResult.files || generatedResult.files.length === 0) {
      alert('No files available for download');
      return;
    }

    try {
      const zip = new JSZip();
      
      generatedResult.files.forEach(file => {
        zip.file(file.path, file.content);
      });

      const zipBlob = await zip.generateAsync({ type: "blob" });
      
      const element = document.createElement("a");
      element.href = URL.createObjectURL(zipBlob);
      element.download = `${appConfig.appName || 'Flutter'}-Project-${Date.now()}.zip`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      
      URL.revokeObjectURL(element.href);
    } catch (error) {
      console.error("Download error:", error);
      alert('Error preparing download');
    }
  };

  const handleStartOver = () => {
    setCurrentStep('configure');
    setGeneratedResult(null);
    setBuildResult(null);
    setError(null);
  };

  const renderConfigurationStep = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Configuration Form */}
      <div className="space-y-6">
        {/* App Name */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              App Name
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              placeholder="Enter your app name (e.g., My Amazing App)"
              value={appConfig.appName}
              onChange={(e) => handleAppNameChange(e.target.value)}
              className="w-full"
            />
          </CardContent>
        </Card>

        {/* Description */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="w-5 h-5" />
              App Description
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Describe your app in detail. What should it do? Who is it for? What features should it have?"
              value={appConfig.description}
              onChange={(e) => handleDescriptionChange(e.target.value)}
              className="min-h-32 resize-none"
            />
          </CardContent>
        </Card>

        {/* Theme & Color */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Theme & Styling
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Theme</label>
              <Select value={appConfig.theme} onValueChange={handleThemeChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light Theme</SelectItem>
                  <SelectItem value="dark">Dark Theme</SelectItem>
                  <SelectItem value="custom">Custom Theme</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {(['primary', 'secondary', 'accent'] as const).map((colorType) => (
                <div key={colorType}>
                  <label className="block text-sm font-medium mb-2 capitalize">{colorType} Color</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={appConfig.colors[colorType]}
                      onChange={(e) => handleColorChange(colorType, e.target.value)}
                      className="w-12 h-10 rounded-lg border border-gray-300 cursor-pointer"
                    />
                    <span className="font-mono text-sm text-gray-600">
                      {appConfig.colors[colorType]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* App Icon Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              App Icon
            </CardTitle>
          </CardHeader>
          <CardContent>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              ref={fileInputRef}
              className="hidden"
            />
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="w-full"
            >
              {appIcon ? appIcon.name : 'Upload App Icon'}
            </Button>
          </CardContent>
        </Card>

        {/* Features */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckSquare className="w-5 h-5" />
              Features
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="firebase"
                checked={features.firebase}
                onCheckedChange={() => handleFeatureToggle('firebase')}
              />
              <label htmlFor="firebase" className="text-sm font-medium">
                Firebase (Authentication, Database, Storage)
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="supabase"
                checked={features.supabaseDb}
                onCheckedChange={() => handleFeatureToggle('supabaseDb')}
              />
              <label htmlFor="supabase" className="text-sm font-medium">
                Supabase Database
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="offline"
                checked={features.offlineMode}
                onCheckedChange={() => handleFeatureToggle('offlineMode')}
              />
              <label htmlFor="offline" className="text-sm font-medium">
                Offline Mode
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Pages */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="w-5 h-5" />
              Pages to Include
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-3">Standard Pages</h4>
              <div className="grid grid-cols-2 gap-3">
                {availablePages.map((page) => (
                  <div key={page} className="flex items-center space-x-2">
                    <Checkbox
                      id={page}
                      checked={appConfig.pages.includes(page)}
                      onCheckedChange={() => handlePageToggle(page)}
                    />
                    <label htmlFor={page} className="text-sm font-medium">
                      {page}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            <Separator />
            
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium">Custom Pages</h4>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleCustomPageAdd}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Page
                </Button>
              </div>
              
              {appConfig.customPages.length > 0 ? (
                <div className="space-y-2">
                  {appConfig.customPages.map((page, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium text-sm">{page.name}</div>
                        <div className="text-xs text-muted-foreground">{page.description}</div>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleCustomPageRemove(index)}
                        className="ml-2"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">No custom pages added yet.</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Preview Button */}
        <Button
          onClick={handlePreviewApp}
          disabled={!appConfig.appName.trim() || !appConfig.description.trim()}
          className="w-full h-12 text-lg font-semibold"
          style={{ backgroundColor: appConfig.colors.primary }}
        >
          <Eye className="w-5 h-5 mr-2" />
          Preview My App
        </Button>
      </div>

      {/* Live Preview */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Live Preview</CardTitle>
            <p className="text-sm text-muted-foreground">
              See how your app will look with the current settings
            </p>
          </CardHeader>
          <CardContent>
            <FlutterPreviewFrame appConfig={appConfig} />
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderPreviewStep = () => (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">Preview Your App</h2>
        <p className="text-muted-foreground">
          Interact with your app preview below. Navigate between screens, toggle themes, and test functionality.
        </p>
      </div>

      <Alert>
        <Zap className="h-4 w-4" />
        <AlertDescription>
          Click on different screen buttons to navigate through your app. All colors, themes, and content are based on your configuration.
        </AlertDescription>
      </Alert>

      <div className="flex justify-center">
        <FlutterPreviewFrame appConfig={appConfig} />
      </div>

      <div className="flex justify-center space-x-4">
        <Button variant="outline" onClick={() => setCurrentStep('configure')}>
          <ArrowLeft className="w-4 w-4 mr-2" />
          Back to Configure
        </Button>
        <Button onClick={handleApprovePreview} className="bg-green-600 hover:bg-green-700">
          <CheckCircle className="w-4 w-4 mr-2" />
          Looks Good! Generate Project
        </Button>
      </div>
    </div>
  );

  const renderGenerateStep = () => (
    <div className="max-w-2xl mx-auto text-center space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Generating Your App</h2>
        <p className="text-muted-foreground">
          Our AI is creating your Flutter project with all the screens and functionality you specified.
        </p>
      </div>

      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
        <div className="text-center">
          <p className="font-medium">Creating Flutter project files...</p>
          <p className="text-sm text-muted-foreground">This may take a few minutes</p>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );

  const renderCompleteStep = () => (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-3xl font-bold mb-2">Your App is Ready! 🎉</h2>
        <p className="text-muted-foreground">
          Your Flutter project has been generated successfully with all the screens and features you requested.
        </p>
      </div>

      {generatedResult && (
        <Card>
          <CardHeader>
            <CardTitle>Project Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Generated Files</h4>
                <p className="text-2xl font-bold text-green-600">{generatedResult.files.length}</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Screens Created</h4>
                <p className="text-2xl font-bold text-blue-600">
                  {appConfig.pages.length + appConfig.customPages.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button onClick={handleDownload} className="flex items-center">
          <Download className="w-4 h-4 mr-2" />
          Download ZIP
        </Button>
        <Button onClick={handleBuildProject} variant="outline" disabled={isGenerating}>
          {isGenerating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Play className="w-4 h-4 mr-2" />}
          Build & Preview
        </Button>
        <Button onClick={handleStartOver} variant="outline">
          Create Another App
        </Button>
      </div>

      {buildResult && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            Project built successfully! 
            <a 
              href={buildResult.previewUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="ml-2 text-blue-600 hover:underline"
            >
              View Live Preview →
            </a>
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-background/80 backdrop-blur-sm shadow-lg border-r border-border/40">
        <div className="p-6">
          <nav className="space-y-2">
            {sidebarItems.map((item, index) => (
              <div
                key={index}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-colors ${
                  item.active 
                    ? 'bg-primary/10 text-primary border border-primary/20' 
                    : 'hover:bg-muted/50 text-muted-foreground hover:text-foreground'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </div>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-background/60 backdrop-blur-sm border-b border-border/40 px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Flutter App Builder</h1>
              <p className="text-muted-foreground">Create interactive Flutter apps with AI assistance</p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                Step {currentStep === 'configure' ? 1 : currentStep === 'preview' ? 2 : currentStep === 'generate' ? 3 : 4} of 4
              </Badge>
              <Badge variant="secondary" className="bg-green-500/10 text-green-600">
                Interactive Preview
              </Badge>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 p-8 overflow-auto">
          {currentStep === 'configure' && renderConfigurationStep()}
          {currentStep === 'preview' && renderPreviewStep()}
          {currentStep === 'generate' && renderGenerateStep()}
          {currentStep === 'complete' && renderCompleteStep()}
        </div>
      </div>

      {/* AI Page Generation Dialog */}
      <Dialog open={showPageDialog} onOpenChange={setShowPageDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              🚀 Create AI-Powered Flutter Page
            </DialogTitle>
            <DialogDescription>
              Describe your page and AI will generate a complete Flutter widget with Material 3 design, animations, and proper functionality - just like Login, Signup, and Notifications templates.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="page-name" className="text-sm font-medium">
                Page Name
              </label>
              <Input
                id="page-name"
                placeholder="e.g., Profile Settings, Shopping Cart, Messages"
                value={pageForm.name}
                onChange={(e) => setPageForm(prev => ({ ...prev, name: e.target.value }))}
                disabled={isGeneratingPage}
              />
              {pageForm.name && (
                <p className="text-xs text-muted-foreground">
                  Will create: <code>{pageForm.name.toLowerCase().replace(/\s+/g, '_')}_screen.dart</code>
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="page-description" className="text-sm font-medium">
                Page Description & UI Requirements
              </label>
              <Textarea
                id="page-description"
                placeholder="Example: 'A profile settings page with user avatar at top, name and email text fields, theme toggle switch, notification preferences section, logout button at bottom, and smooth animations. Use modern Material 3 cards and purple gradient colors.'"
                rows={5}
                value={pageForm.description}
                onChange={(e) => setPageForm(prev => ({ ...prev, description: e.target.value }))}
                disabled={isGeneratingPage}
              />
              <div className="bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-900/20 dark:to-blue-900/20 p-3 rounded-lg">
                <div className="text-sm">💡 <strong>AI Tips:</strong></div>
                <div className="text-xs mt-1 space-y-1">
                  <div>• Specify UI components: buttons, forms, cards, lists</div>
                  <div>• Mention colors, animations, and styling preferences</div>
                  <div>• Describe layout: columns, rows, spacing</div>
                  <div>• Include functionality: navigation, validation, interactions</div>
                </div>
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowPageDialog(false)}
              disabled={isGeneratingPage}
            >
              Cancel
            </Button>
            <Button
              onClick={generateCustomPageWithAI}
              disabled={isGeneratingPage || !pageForm.name.trim() || !pageForm.description.trim()}
              className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700"
            >
              {isGeneratingPage ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  🧠 AI Generating Flutter Page...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  ✨ Generate with AI
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}