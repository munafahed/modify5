import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:trendy_closet/core/constants.dart';
import 'package:trendy_closet/viewmodels/auth_viewmodel.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  @override
  void initState() {
    super.initState();
    _navigateToNextScreen();
  }

  void _navigateToNextScreen() async {
    // Give some time for the animation and service initialization
    await Future.delayed(2.seconds); // Wait for 2 seconds animation

    if (!mounted) return;

    final authViewModel = Provider.of<AuthViewModel>(context, listen: false);
    // Wait for authentication state to be determined
    // The AuthViewModel's listener already handles this, we just need to ensure it has time to update
    await Future.microtask(() {}); // A small delay to ensure listeners process

    if (authViewModel.isLoggedIn) {
      context.go(AppRoutes.home);
    } else {
      context.go(AppRoutes.login);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Theme.of(context).colorScheme.background,
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: AnimateList(
            interval: 200.ms,
            effects: [FadeEffect(duration: 500.ms), SlideEffect(curve: Curves.easeOut)],
            children: [
              Icon(
                Icons.shopify_rounded, // A playful icon for a fashion app
                size: 120,
                color: AppColors.primary,
              ).animate().scale(delay: 500.ms, duration: 800.ms, curve: Curves.easeOutBack),
              const SizedBox(height: 24),
              Text(
                AppConstants.appName,
                style: Theme.of(context).textTheme.displayMedium?.copyWith(
                      fontWeight: FontWeight.bold,
                      color: AppColors.darkText,
                      letterSpacing: 1.5,
                    ),
              ).animate().fadeIn(delay: 800.ms, duration: 600.ms).slide(begin: const Offset(0, 0.5)),
              const SizedBox(height: 12),
              Text(
                AppConstants.appDescription.split(',')[0], // Take first part for splash
                textAlign: TextAlign.center,
                style: Theme.of(context).textTheme.titleMedium?.copyWith(
                      color: AppColors.darkTextSecondary,
                    ),
              ).animate().fadeIn(delay: 1000.ms, duration: 600.ms).slide(begin: const Offset(0, 0.5)),
              const SizedBox(height: 40),
              CircularProgressIndicator(
                valueColor: AlwaysStoppedAnimation<Color>(AppColors.accent),
                strokeWidth: 3,
              ).animate().fadeIn(delay: 1500.ms, duration: 500.ms),
            ],
          ),
        ),
      ),
    );
  }
}
