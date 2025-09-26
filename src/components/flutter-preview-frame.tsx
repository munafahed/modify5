"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Smartphone, 
  ArrowLeft, 
  ArrowRight,
  Home, 
  User, 
  Settings, 
  Search, 
  Bell, 
  MessageCircle,
  Info,
  LogIn,
  UserPlus,
  BarChart3,
  Palette,
  Sun,
  Moon,
  Zap,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Star,
  Heart,
  Shield,
  Rocket
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface AppConfig {
  appName: string;
  description: string;
  theme: 'light' | 'dark' | 'custom';
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  pages: string[];
  customPages: Array<{ name: string; description: string }>;
}

export interface PreviewScreenProps {
  appConfig: AppConfig;
  onNavigate: (screenName: string) => void;
  currentTheme: 'light' | 'dark';
  onThemeToggle: () => void;
}

// Individual screen components
const SplashScreen = ({ appConfig, onNavigate }: PreviewScreenProps) => (
  <div 
    className="flex flex-col items-center justify-center h-full relative overflow-hidden"
    style={{ 
      background: `linear-gradient(135deg, ${appConfig.colors.primary}, ${appConfig.colors.secondary})` 
    }}
  >
    {/* Animated background elements */}
    <motion.div
      className="absolute inset-0 opacity-10"
      initial={{ rotate: 0 }}
      animate={{ rotate: 360 }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
    >
      <div className="w-full h-full bg-gradient-to-br from-white/20 to-transparent rounded-full transform scale-150" />
    </motion.div>
    
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.8, type: "spring" }}
      className="text-6xl mb-4 relative z-10"
    >
      📱
    </motion.div>
    <motion.h1 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="text-white text-2xl font-bold mb-2 text-center px-4 relative z-10"
    >
      {appConfig.appName}
    </motion.h1>
    <motion.p 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6 }}
      className="text-white/90 text-center px-6 relative z-10"
    >
      Welcome to your app!
    </motion.p>
    
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.5 }}
      className="relative z-10"
    >
      <Button
        onClick={() => onNavigate('Onboarding')}
        className="mt-8 bg-white/20 hover:bg-white/30 text-white border border-white/30 transition-all duration-300 hover:scale-105"
      >
        Get Started
      </Button>
    </motion.div>
    
    {/* Auto-advance to onboarding after 3 seconds */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 3 }}
      className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white/60 text-sm"
    >
      Tap anywhere to continue
    </motion.div>
  </div>
);

// Interactive Onboarding Screens with Swipe Functionality
const OnboardingScreen = ({ appConfig, onNavigate, currentTheme }: PreviewScreenProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);

  const onboardingSlides = [
    {
      icon: <Star className="h-16 w-16" />,
      title: "Welcome to " + appConfig.appName,
      description: "Discover amazing features and get started with your new app experience.",
      color: appConfig.colors.primary
    },
    {
      icon: <Rocket className="h-16 w-16" />,
      title: "Powerful Features",
      description: "Everything you need is right at your fingertips. Explore and create with ease.",
      color: appConfig.colors.secondary
    },
    {
      icon: <Shield className="h-16 w-16" />,
      title: "Safe & Secure",
      description: "Your data is protected with industry-leading security measures.",
      color: appConfig.colors.accent
    },
    {
      icon: <Heart className="h-16 w-16" />,
      title: "You'll Love It",
      description: "Join thousands of users who love using " + appConfig.appName + " daily.",
      color: appConfig.colors.primary
    }
  ];

  const nextSlide = () => {
    if (currentSlide < onboardingSlides.length - 1) {
      setCurrentSlide(prev => prev + 1);
    } else {
      onNavigate(appConfig.pages.includes('Home') ? 'Home' : appConfig.pages[1] || 'Login');
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
  };

  const skipOnboarding = () => {
    onNavigate(appConfig.pages.includes('Home') ? 'Home' : appConfig.pages[1] || 'Login');
  };

  const currentSlideData = onboardingSlides[currentSlide];

  return (
    <div className={cn("h-full flex flex-col", currentTheme === 'dark' ? 'bg-gray-900' : 'bg-gray-50')}>
      {/* Header with Skip button */}
      <div className="flex justify-between items-center p-4">
        <div className="w-16" />
        <div className="flex space-x-1">
          {onboardingSlides.map((_, index) => (
            <div
              key={index}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                index === currentSlide 
                  ? "bg-current" 
                  : currentTheme === 'dark' ? "bg-gray-600" : "bg-gray-300"
              )}
              style={{ color: index === currentSlide ? currentSlideData.color : undefined }}
            />
          ))}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={skipOnboarding}
          className="text-gray-500 hover:text-gray-700"
        >
          Skip
        </Button>
      </div>

      {/* Swipeable content area */}
      <div className="flex-1 relative overflow-hidden">
        <motion.div
          className="h-full flex"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.1}
          onDrag={(event, info) => setDragOffset(info.offset.x)}
          onDragEnd={(event, info) => {
            setDragOffset(0);
            if (info.offset.x > 100 && currentSlide > 0) {
              prevSlide();
            } else if (info.offset.x < -100 && currentSlide < onboardingSlides.length - 1) {
              nextSlide();
            }
          }}
          animate={{ x: -currentSlide * 100 + '%' }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {onboardingSlides.map((slide, index) => (
            <motion.div
              key={index}
              className="w-full h-full flex-shrink-0 flex flex-col justify-center items-center px-8"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: index === currentSlide ? 1 : 0.3,
                scale: index === currentSlide ? 1 : 0.8
              }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className="mb-8 text-white flex items-center justify-center w-24 h-24 rounded-full"
                style={{ backgroundColor: slide.color }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {slide.icon}
              </motion.div>
              
              <motion.h2
                className={cn(
                  "text-3xl font-bold mb-4 text-center",
                  currentTheme === 'dark' ? 'text-white' : 'text-gray-800'
                )}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {slide.title}
              </motion.h2>
              
              <motion.p
                className={cn(
                  "text-lg text-center leading-relaxed",
                  currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                )}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {slide.description}
              </motion.p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Navigation footer */}
      <div className="p-6 flex justify-between items-center">
        <Button
          variant="outline"
          onClick={prevSlide}
          disabled={currentSlide === 0}
          className="flex items-center space-x-2"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Back</span>
        </Button>

        <div className="flex space-x-2">
          {currentSlide === onboardingSlides.length - 1 ? (
            <Button
              onClick={() => onNavigate(appConfig.pages.includes('Home') ? 'Home' : 'Login')}
              className="flex items-center space-x-2 px-8"
              style={{ backgroundColor: currentSlideData.color }}
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>Get Started</span>
            </Button>
          ) : (
            <Button
              onClick={nextSlide}
              className="flex items-center space-x-2"
              style={{ backgroundColor: currentSlideData.color }}
            >
              <span>Next</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Swipe hint */}
      <motion.div
        className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-xs text-gray-400"
        initial={{ opacity: 1 }}
        animate={{ opacity: currentSlide === 0 ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      >
        Swipe left or right to navigate
      </motion.div>
    </div>
  );
};

const LoginScreen = ({ appConfig, onNavigate, currentTheme }: PreviewScreenProps) => (
  <div className={cn("h-full flex flex-col", currentTheme === 'dark' ? 'bg-gray-900' : 'bg-white')}>
    <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
      <Button variant="ghost" size="sm" onClick={() => onNavigate('Home')}>
        <ArrowLeft className="h-4 w-4" />
      </Button>
      <h1 className="text-xl font-semibold">Sign In</h1>
      <div className="w-8" />
    </div>
    
    <div className="flex-1 flex flex-col justify-center px-6">
      <div className="text-center mb-8">
        <div 
          className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
          style={{ backgroundColor: appConfig.colors.primary }}
        >
          <LogIn className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Welcome Back</h2>
        <p className="text-gray-600 dark:text-gray-300">Sign in to your account</p>
      </div>
      
      <div className="space-y-4">
        <div>
          <input 
            type="email" 
            placeholder="Email"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={{ borderColor: appConfig.colors.primary + '40' }}
          />
        </div>
        <div>
          <input 
            type="password" 
            placeholder="Password"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={{ borderColor: appConfig.colors.primary + '40' }}
          />
        </div>
        
        <Button 
          className="w-full py-3 text-white font-semibold rounded-lg"
          style={{ backgroundColor: appConfig.colors.primary }}
          onClick={() => onNavigate('Home')}
        >
          Sign In
        </Button>
        
        <div className="text-center">
          <Button 
            variant="link" 
            className="text-sm"
            onClick={() => onNavigate('Register')}
          >
            Don't have an account? Sign Up
          </Button>
        </div>
      </div>
    </div>
  </div>
);

const RegisterScreen = ({ appConfig, onNavigate }: PreviewScreenProps) => (
  <div className="h-full flex flex-col bg-white dark:bg-gray-900">
    <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
      <Button variant="ghost" size="sm" onClick={() => onNavigate('Login')}>
        <ArrowLeft className="h-4 w-4" />
      </Button>
      <h1 className="text-xl font-semibold">Sign Up</h1>
      <div className="w-8" />
    </div>
    
    <div className="flex-1 flex flex-col justify-center px-6">
      <div className="text-center mb-8">
        <div 
          className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
          style={{ backgroundColor: appConfig.colors.secondary }}
        >
          <UserPlus className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Create Account</h2>
        <p className="text-gray-600 dark:text-gray-300">Join us today</p>
      </div>
      
      <div className="space-y-4">
        <input 
          type="text" 
          placeholder="Full Name"
          className="w-full p-3 border rounded-lg"
        />
        <input 
          type="email" 
          placeholder="Email"
          className="w-full p-3 border rounded-lg"
        />
        <input 
          type="password" 
          placeholder="Password"
          className="w-full p-3 border rounded-lg"
        />
        
        <Button 
          className="w-full py-3 text-white font-semibold rounded-lg"
          style={{ backgroundColor: appConfig.colors.secondary }}
          onClick={() => onNavigate('Home')}
        >
          Create Account
        </Button>
        
        <div className="text-center">
          <Button 
            variant="link" 
            className="text-sm"
            onClick={() => onNavigate('Login')}
          >
            Already have an account? Sign In
          </Button>
        </div>
      </div>
    </div>
  </div>
);

const HomeScreen = ({ appConfig, onNavigate, currentTheme, onThemeToggle }: PreviewScreenProps) => (
  <div className={cn("h-full flex flex-col", currentTheme === 'dark' ? 'bg-gray-900' : 'bg-white')}>
    <div 
      className="px-6 py-4 text-white"
      style={{ background: `linear-gradient(135deg, ${appConfig.colors.primary}, ${appConfig.colors.secondary})` }}
    >
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{appConfig.appName}</h1>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onThemeToggle}
            className="text-white hover:bg-white/20"
          >
            {currentTheme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
            <Bell className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <p className="text-white/90 mt-2">{appConfig.description}</p>
    </div>
    
    <div className="flex-1 p-4">
      <div className="grid grid-cols-2 gap-4 mb-6">
        {appConfig.pages.includes('Dashboard') && (
          <Card className="p-4 cursor-pointer hover:shadow-md transition-shadow" onClick={() => onNavigate('Dashboard')}>
            <div className="flex items-center space-x-3">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: appConfig.colors.primary + '20' }}
              >
                <BarChart3 className="h-5 w-5" style={{ color: appConfig.colors.primary }} />
              </div>
              <div>
                <h3 className="font-semibold">Dashboard</h3>
                <p className="text-sm text-gray-500">View stats</p>
              </div>
            </div>
          </Card>
        )}
        
        {appConfig.pages.includes('Profile') && (
          <Card className="p-4 cursor-pointer hover:shadow-md transition-shadow" onClick={() => onNavigate('Profile')}>
            <div className="flex items-center space-x-3">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: appConfig.colors.secondary + '20' }}
              >
                <User className="h-5 w-5" style={{ color: appConfig.colors.secondary }} />
              </div>
              <div>
                <h3 className="font-semibold">Profile</h3>
                <p className="text-sm text-gray-500">Your account</p>
              </div>
            </div>
          </Card>
        )}
      </div>
      
      <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
      <div className="space-y-3">
        {appConfig.pages.includes('Search') && (
          <Button 
            variant="outline" 
            className="w-full justify-start"
            onClick={() => onNavigate('Search')}
          >
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        )}
        {appConfig.pages.includes('Chat') && (
          <Button 
            variant="outline" 
            className="w-full justify-start"
            onClick={() => onNavigate('Chat')}
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Messages
          </Button>
        )}
        {appConfig.pages.includes('Settings') && (
          <Button 
            variant="outline" 
            className="w-full justify-start"
            onClick={() => onNavigate('Settings')}
          >
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        )}
        {appConfig.customPages.map(page => (
          <Button 
            key={page.name}
            variant="outline" 
            className="w-full justify-start"
            onClick={() => onNavigate(page.name)}
          >
            <Zap className="h-4 w-4 mr-2" />
            {page.name}
          </Button>
        ))}
      </div>
    </div>
  </div>
);

const ProfileScreen = ({ appConfig, onNavigate }: PreviewScreenProps) => (
  <div className="h-full flex flex-col bg-white dark:bg-gray-900">
    <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
      <Button variant="ghost" size="sm" onClick={() => onNavigate('Home')}>
        <ArrowLeft className="h-4 w-4" />
      </Button>
      <h1 className="text-xl font-semibold">Profile</h1>
      <div className="w-8" />
    </div>
    
    <div className="flex-1 p-4">
      <div className="text-center mb-6">
        <div 
          className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center"
          style={{ backgroundColor: appConfig.colors.primary }}
        >
          <User className="h-10 w-10 text-white" />
        </div>
        <h2 className="text-xl font-bold">John Doe</h2>
        <p className="text-gray-600">john.doe@example.com</p>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <span>Account Settings</span>
          <Button variant="ghost" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <span>Notifications</span>
          <Button variant="ghost" size="sm">
            <Bell className="h-4 w-4" />
          </Button>
        </div>
        {appConfig.pages.includes('About') && (
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <span>About</span>
            <Button variant="ghost" size="sm" onClick={() => onNavigate('About')}>
              <Info className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  </div>
);

// Add more screen components for Settings, Search, Chat, etc.
const GenericScreen = ({ screenName, description, appConfig, onNavigate }: PreviewScreenProps & { screenName: string; description?: string }) => (
  <div className="h-full flex flex-col bg-white dark:bg-gray-900">
    <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
      <Button variant="ghost" size="sm" onClick={() => onNavigate('Home')}>
        <ArrowLeft className="h-4 w-4" />
      </Button>
      <h1 className="text-xl font-semibold">{screenName}</h1>
      <div className="w-8" />
    </div>
    
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
      <div 
        className="w-16 h-16 rounded-full mb-4 flex items-center justify-center"
        style={{ backgroundColor: appConfig.colors.accent + '20' }}
      >
        <Zap className="h-8 w-8" style={{ color: appConfig.colors.accent }} />
      </div>
      <h2 className="text-xl font-bold mb-2">{screenName} Page</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-4">
        {description || `This is the ${screenName.toLowerCase()} screen of your app.`}
      </p>
      {!description && (
        <p className="text-sm text-gray-500">
          Content will be customized based on your requirements.
        </p>
      )}
    </div>
  </div>
);

interface FlutterPreviewFrameProps {
  appConfig: AppConfig;
  className?: string;
}

export function FlutterPreviewFrame({ appConfig, className }: FlutterPreviewFrameProps) {
  const [currentScreen, setCurrentScreen] = useState('Splash Screen');
  const [previewTheme, setPreviewTheme] = useState<'light' | 'dark'>('light');
  
  // Auto-transition from splash to onboarding after 3 seconds
  useEffect(() => {
    if (currentScreen === 'Splash Screen') {
      const timer = setTimeout(() => {
        handleNavigate('Onboarding');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [currentScreen]);

  const handleNavigate = (screenName: string) => {
    // Allow navigation to both core screens and configured screens
    const coreScreens = ['Splash Screen', 'Onboarding'];
    const configuredScreens = [...appConfig.pages, ...appConfig.customPages.map(page => page.name)];
    const allowedScreens = [...coreScreens, ...configuredScreens];
    
    if (allowedScreens.includes(screenName)) {
      setCurrentScreen(screenName);
    }
  };

  const handleThemeToggle = () => {
    setPreviewTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const renderScreen = () => {
    const screenProps: PreviewScreenProps = {
      appConfig,
      onNavigate: handleNavigate,
      currentTheme: previewTheme,
      onThemeToggle: handleThemeToggle
    };

    // Check if it's a custom page first
    const customPage = appConfig.customPages.find(page => page.name === currentScreen);
    if (customPage) {
      return <GenericScreen {...screenProps} screenName={customPage.name} description={customPage.description} />;
    }

    switch (currentScreen) {
      case 'Splash Screen':
        return <SplashScreen {...screenProps} />;
      case 'Onboarding':
        return <OnboardingScreen {...screenProps} />;
      case 'Login':
        return <LoginScreen {...screenProps} />;
      case 'Register':
        return <RegisterScreen {...screenProps} />;
      case 'Home':
        return <HomeScreen {...screenProps} />;
      case 'Profile':
        return <ProfileScreen {...screenProps} />;
      default:
        return <GenericScreen {...screenProps} screenName={currentScreen} />;
    }
  };

  // Include core screens and filter configured screens plus custom pages
  const coreScreens = ['Splash Screen', 'Onboarding'];
  const configuredScreens = [
    ...appConfig.pages,
    ...appConfig.customPages.map(page => page.name)
  ];
  
  const availableScreens = [
    ...coreScreens,
    ...configuredScreens.filter(screen => !coreScreens.includes(screen))
  ].filter((screen, index, arr) => arr.indexOf(screen) === index); // Remove duplicates

  const currentScreenIndex = availableScreens.indexOf(currentScreen);
  
  const navigateToPrevious = () => {
    const prevIndex = currentScreenIndex > 0 ? currentScreenIndex - 1 : availableScreens.length - 1;
    handleNavigate(availableScreens[prevIndex]);
  };
  
  const navigateToNext = () => {
    const nextIndex = currentScreenIndex < availableScreens.length - 1 ? currentScreenIndex + 1 : 0;
    handleNavigate(availableScreens[nextIndex]);
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Enhanced Navigation Header */}
      <div className="space-y-4">
        {/* Carousel Navigation Controls */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={navigateToPrevious}
            className="flex items-center space-x-2"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Previous</span>
          </Button>
          
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="text-xs px-3 py-1">
              {currentScreenIndex + 1} of {availableScreens.length}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={handleThemeToggle}
              className="flex items-center space-x-1"
            >
              {previewTheme === 'light' ? <Moon className="h-3 w-3" /> : <Sun className="h-3 w-3" />}
              <span className="hidden sm:inline">{previewTheme === 'light' ? 'Dark' : 'Light'}</span>
            </Button>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={navigateToNext}
            className="flex items-center space-x-2"
          >
            <span>Next</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Screen Tabs */}
        <div className="flex flex-wrap gap-2 justify-center">
          {availableScreens.map((screen, index) => (
            <Button
              key={screen}
              variant={currentScreen === screen ? "default" : "outline"}
              size="sm"
              onClick={() => handleNavigate(screen)}
              className={cn(
                "text-xs transition-all duration-200",
                currentScreen === screen 
                  ? "scale-105 shadow-md" 
                  : "hover:scale-102"
              )}
              style={{
                backgroundColor: currentScreen === screen ? appConfig.colors.primary : undefined,
                borderColor: currentScreen === screen ? appConfig.colors.primary : undefined
              }}
            >
              {screen}
            </Button>
          ))}
        </div>

        {/* Progress indicator */}
        <div className="flex justify-center space-x-1">
          {availableScreens.map((_, index) => (
            <div
              key={index}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300 cursor-pointer",
                index === currentScreenIndex 
                  ? "bg-current scale-125" 
                  : "bg-gray-300 hover:bg-gray-400"
              )}
              style={{ color: index === currentScreenIndex ? appConfig.colors.primary : undefined }}
              onClick={() => handleNavigate(availableScreens[index])}
            />
          ))}
        </div>
      </div>

      {/* Phone Frame */}
      <div className="mx-auto relative">
        <div className="relative">
          {/* Phone frame */}
          <div className="w-[320px] h-[640px] bg-black rounded-[2.5rem] p-2 shadow-2xl">
            <div className={cn("w-full h-full rounded-[2rem] overflow-hidden relative", previewTheme === 'dark' ? 'bg-gray-900 dark' : 'bg-white')}>
              {/* Status bar */}
              <div className="absolute top-0 left-0 right-0 h-8 bg-black/10 flex items-center justify-center z-10">
                <div className="w-20 h-1 bg-black/20 rounded-full"></div>
              </div>
              
              {/* Screen content */}
              <div className="pt-8 h-full overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentScreen}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="h-full"
                  >
                    {renderScreen()}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Current screen indicator */}
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
            <Badge 
              variant="secondary" 
              className="text-xs"
              style={{ backgroundColor: appConfig.colors.primary + '20', color: appConfig.colors.primary }}
            >
              <Smartphone className="h-3 w-3 mr-1" />
              {currentScreen}
            </Badge>
          </div>

          {/* Screen transition indicator */}
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <span>Swipe or use controls to navigate</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive controls help */}
      <div className="text-center text-sm text-gray-500">
        <p>✨ Interactive Preview: Navigate between screens to see your app flow</p>
      </div>
    </div>
  );
}