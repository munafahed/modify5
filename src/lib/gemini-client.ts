export interface PageGenerationRequest {
  name: string;
  description: string;
  projectContext?: string;
  themeColors?: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

export interface PageGenerationResponse {
  success: boolean;
  code: string;
  pubspecYaml: string;
  widgetStructure: string;
  error?: string;
}

// DON'T DELETE THIS COMMENT
// Following javascript_gemini integration blueprint
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function generateFlutterPage(request: PageGenerationRequest): Promise<PageGenerationResponse> {
  try {
    const themeColors = request.themeColors || {
      primary: '#5D3FD3',
      secondary: '#6C63FF', 
      accent: '#FF6B6B'
    };

    const prompt = `Generate a PROFESSIONAL, BEAUTIFUL Flutter page in Dart code that matches FlutterFlow's design quality. Create a modern, visually stunning interface with animations and Material 3 design.

**Page Name:** ${request.name}
**Description:** ${request.description}
${request.projectContext ? `**Project Context:** ${request.projectContext}` : ''}

**THEME COLORS TO USE:**
- Primary Color: ${themeColors.primary}
- Secondary Color: ${themeColors.secondary}  
- Accent Color: ${themeColors.accent}

**STRICT DESIGN REQUIREMENTS (Follow FlutterFlow Standards):**

🎨 **Visual Design:**
- Use Material 3 design system with provided theme colors
- Apply beautiful gradients using the theme colors above
- Add rounded corners (BorderRadius.circular(12.0)) and soft shadows
- Use ONLY the provided theme colors for consistent branding
- Add proper elevation and depth with shadows
- Ensure high contrast and accessibility
- Use Theme.of(context).colorScheme for dynamic theming support

🎭 **Animations & Interactions:**
- Add smooth fade-in animations for page content
- Use Hero animations for transitions
- Include bounce/scale animations for buttons
- Add loading animations with CircularProgressIndicator
- Implement smooth transitions between states

📱 **Layout & Responsiveness:**
- Create responsive layouts that work on all screen sizes
- Use proper spacing (16.0, 24.0, 32.0 padding/margins)
- Implement clean, organized widget hierarchy
- Center important content appropriately
- Use ListView/Column/Row with proper alignment

🧩 **UI Components:**
- Use modern Material 3 components (Card, FilledButton, etc.)
- Add beautiful icons from Material Icons
- Include proper app bars with gradients
- Use attractive text styles with proper hierarchy
- Add floating action buttons with animations

🎪 **Child-Friendly Features:**
- Bright, cheerful color combinations
- Large, easy-to-tap buttons
- Fun icons and illustrations
- Smooth, delightful animations
- Clear, readable fonts (minimum 16sp)

**CODE STRUCTURE REQUIREMENTS:**
1. Generate complete Flutter app with main() function and MaterialApp
2. Import 'package:flutter/material.dart'
3. Use proper Dart naming: ClassNameScreen extends StatefulWidget  
4. Implement State<ClassNameScreen> with SingleTickerProviderStateMixin for animations
5. Add animation controllers in initState() and dispose them properly
6. Include realistic sample data that matches the page description
7. Use proper form validation with GlobalKey<FormState>
8. Follow Material 3 design patterns with provided theme colors
9. Add accessibility semantics for screen readers
10. Use const constructors where possible for performance

**SPECIFIC IMPLEMENTATION:**
- Create a Scaffold with AppBar using theme colors
- Add main body with SafeArea and proper padding
- Use Container/Card widgets with rounded decorations
- Implement Column/ListView/GridView for content layout  
- Add FloatingActionButton with theme colors
- Include fade-in and slide animations using AnimationController
- Use Theme.of(context).colorScheme.primary for primary color
- Use Theme.of(context).colorScheme.secondary for secondary color
- Add shadows (elevation: 4.0) and rounded corners
- Include proper form validation for input fields
- Add accessibility labels (semanticsLabel) for screen readers
- Use realistic placeholder data that matches the page description

**COLOR USAGE EXAMPLES:**
- AppBar: backgroundColor: Theme.of(context).colorScheme.primary
- Cards: color: Theme.of(context).colorScheme.primaryContainer  
- Buttons: style: ElevatedButton.styleFrom(backgroundColor: Theme.of(context).colorScheme.primary)
- Text: style: TextStyle(color: Theme.of(context).colorScheme.onPrimary)
- FloatingActionButton: backgroundColor: Theme.of(context).colorScheme.secondary

**OUTPUT FORMAT:**
Return a JSON object with exactly these fields:
{
  "code": "Complete Flutter lib/main.dart with all imports and functions",
  "pubspecYaml": "Complete pubspec.yaml with all required dependencies",
  "widgetStructure": "Clean hierarchical widget tree structure"
}

**IMPORTANT:** Generate code that looks as professional and beautiful as FlutterFlow's output - with smooth animations, modern design, child-friendly colors, and proper Material 3 styling. The result should be visually stunning and production-ready.`;

    // Check if API key is configured
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY environment variable is not set');
    }

    // Use the Google GenAI SDK as per blueprint
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
    });

    const rawText = response.text;
    
    if (!rawText) {
      throw new Error("Empty response from Gemini API");
    }
    
    // Try to parse as JSON, fallback to structured parsing if needed
    let parsedData;
    try {
      parsedData = JSON.parse(rawText);
    } catch {
      // Fallback: extract code and pubspec from text response
      const codeMatch = rawText.match(/```dart([\s\S]*?)```/);
      const pubspecMatch = rawText.match(/```yaml([\s\S]*?)```/) || rawText.match(/```([\s\S]*?)```/);
      
      parsedData = {
        code: codeMatch ? codeMatch[1].trim() : generateFallbackCode(request.name, request.description, request.themeColors),
        pubspecYaml: pubspecMatch ? pubspecMatch[1].trim() : generateFallbackPubspec(request.name),
        widgetStructure: generateWidgetStructure(request.name)
      };
    }

    return {
      success: true,
      code: parsedData.code || generateFallbackCode(request.name, request.description, request.themeColors),
      pubspecYaml: parsedData.pubspecYaml || generateFallbackPubspec(request.name),
      widgetStructure: parsedData.widgetStructure || generateWidgetStructure(request.name)
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      success: false,
      code: generateFallbackCode(request.name, request.description, request.themeColors),
      pubspecYaml: generateFallbackPubspec(request.name),
      widgetStructure: generateWidgetStructure(request.name),
      error: error instanceof Error ? error.message : "Unknown error occurred"
    };
  }
}

// Professional FlutterFlow-quality fallback functions
function generateFallbackCode(pageName: string, description: string, themeColors?: { primary: string; secondary: string; accent: string }): string {
  const className = pageName.replace(/\s+/g, '') + 'Page';
  
  // Use default theme colors if not provided
  const colors = themeColors || {
    primary: '#5D3FD3',
    secondary: '#6C63FF', 
    accent: '#FF6B6B'
  };
  
  return `import 'package:flutter/material.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: '${pageName}',
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(
          seedColor: Color(int.parse('0xFF' + '${colors.primary}'.substring(1))),
          brightness: Brightness.light,
        ),
        fontFamily: 'Roboto',
      ),
      debugShowCheckedModeBanner: false,
      home: ${className}(),
    );
  }
}

class ${className} extends StatefulWidget {
  const ${className}({super.key});

  @override
  State<${className}> createState() => _${className}State();
}

class _${className}State extends State<${className}> 
    with TickerProviderStateMixin {
  late AnimationController _fadeController;
  late AnimationController _scaleController;
  late Animation<double> _fadeAnimation;
  late Animation<double> _scaleAnimation;

  @override
  void initState() {
    super.initState();
    _fadeController = AnimationController(
      duration: const Duration(milliseconds: 1000),
      vsync: this,
    );
    _scaleController = AnimationController(
      duration: const Duration(milliseconds: 800),
      vsync: this,
    );
    
    _fadeAnimation = Tween<double>(
      begin: 0.0,
      end: 1.0,
    ).animate(CurvedAnimation(
      parent: _fadeController,
      curve: Curves.easeInOut,
    ));
    
    _scaleAnimation = Tween<double>(
      begin: 0.5,
      end: 1.0,
    ).animate(CurvedAnimation(
      parent: _scaleController,
      curve: Curves.elasticOut,
    ));
    
    _fadeController.forward();
    Future.delayed(const Duration(milliseconds: 300), () {
      _scaleController.forward();
    });
  }

  @override
  void dispose() {
    _fadeController.dispose();
    _scaleController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [
              Theme.of(context).colorScheme.primary,
              Theme.of(context).colorScheme.secondary,
            ],
          ),
        ),
        child: SafeArea(
          child: FadeTransition(
            opacity: _fadeAnimation,
            child: Center(
              child: Padding(
                padding: const EdgeInsets.all(32.0),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    ScaleTransition(
                      scale: _scaleAnimation,
                      child: Container(
                        padding: const EdgeInsets.all(24.0),
                        decoration: BoxDecoration(
                          color: Colors.white.withOpacity(0.95),
                          borderRadius: BorderRadius.circular(24.0),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withOpacity(0.2),
                              spreadRadius: 8,
                              blurRadius: 20,
                              offset: const Offset(0, 8),
                            ),
                          ],
                        ),
                        child: Column(
                          children: [
                            Container(
                              padding: const EdgeInsets.all(20.0),
                              decoration: BoxDecoration(
                                gradient: LinearGradient(
                                  colors: [Theme.of(context).colorScheme.primary, Theme.of(context).colorScheme.secondary],
                                ),
                                borderRadius: BorderRadius.circular(20.0),
                              ),
                              child: const Icon(
                                Icons.auto_awesome,
                                size: 48,
                                color: Colors.white,
                              ),
                            ),
                            const SizedBox(height: 24),
                            Text(
                              '${pageName}',
                              style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                                fontWeight: FontWeight.bold,
                                color: const Color(0xFF2D3748),
                              ),
                              textAlign: TextAlign.center,
                            ),
                            const SizedBox(height: 16),
                            Text(
                              '${description}',
                              style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                                color: const Color(0xFF4A5568),
                                height: 1.6,
                              ),
                              textAlign: TextAlign.center,
                            ),
                            const SizedBox(height: 32),
                            SizedBox(
                              width: double.infinity,
                              child: ElevatedButton(
                                onPressed: () {
                                  ScaffoldMessenger.of(context).showSnackBar(
                                    SnackBar(
                                      content: Text('Welcome to ${pageName}!'),
                                      behavior: SnackBarBehavior.floating,
                                      backgroundColor: Theme.of(context).colorScheme.primary,
                                    ),
                                  );
                                },
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: Theme.of(context).colorScheme.primary,
                                  foregroundColor: Colors.white,
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: 32.0,
                                    vertical: 16.0,
                                  ),
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(16.0),
                                  ),
                                  elevation: 8,
                                ),
                                child: const Text(
                                  'Get Started',
                                  style: TextStyle(
                                    fontSize: 18,
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 48),
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 24.0,
                        vertical: 12.0,
                      ),
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.2),
                        borderRadius: BorderRadius.circular(12.0),
                      ),
                      child: const Text(
                        'Built with Flutter & Material 3',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 14,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}`;
}

function generateFallbackPubspec(pageName: string): string {
  return `name: ${pageName.toLowerCase().replace(/\s+/g, '_')}
description: A professional Flutter application for ${pageName}

publish_to: 'none'

version: 1.0.0+1

environment:
  sdk: '>=3.0.0 <4.0.0'
  flutter: ">=3.10.0"

dependencies:
  flutter:
    sdk: flutter
  cupertino_icons: ^1.0.6
  google_fonts: ^6.1.0
  lottie: ^2.6.0
  animated_text_kit: ^4.2.2

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.1

flutter:
  uses-material-design: true
  
  # assets:
  #   - images/
  #   - animations/

  fonts:
    - family: Roboto
      fonts:
        - asset: fonts/Roboto-Regular.ttf
        - asset: fonts/Roboto-Bold.ttf
          weight: 700
`;
}

function generateWidgetStructure(pageName: string): string {
  return `MaterialApp
├── Scaffold
│   ├── AppBar
│   │   └── Text
│   └── Center
│       └── Column
│           ├── Icon
│           ├── SizedBox
│           ├── Text
│           ├── SizedBox
│           └── Padding
│               └── Text`;
}