import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:trendy_closet/core/constants.dart';
import 'package:trendy_closet/viewmodels/auth_viewmodel.dart';
import 'package:trendy_closet/widgets/loading_indicator.dart';
import 'package:trendy_closet/widgets/trendy_button.dart';
import 'package:trendy_closet/widgets/trendy_text_field.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  bool _obscurePassword = true;

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  void _showErrorSnackBar(BuildContext context, String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: Theme.of(context).colorScheme.error,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Welcome Back!'),
        automaticallyImplyLeading: false, // No back button on login/register
      ),
      body: Consumer<AuthViewModel>(
        builder: (context, authViewModel, child) {
          if (authViewModel.isLoading) {
            return const LoadingIndicator(message: 'Logging in...');
          }
          return SingleChildScrollView(
            padding: const EdgeInsets.all(24.0),
            child: Form(
              key: _formKey,
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: AnimateList(
                  interval: 100.ms,
                  effects: [FadeEffect(duration: 300.ms), SlideEffect(curve: Curves.easeOut)],
                  children: [
                    const SizedBox(height: 40),
                    Text(
                      'TrendyCloset',
                      style: Theme.of(context).textTheme.displaySmall?.copyWith(
                            fontWeight: FontWeight.bold,
                            color: AppColors.primary,
                          ),
                    ),
                    const SizedBox(height: 16),
                    Text(
                      'Your all-in-one fashion shopping app',
                      style: Theme.of(context).textTheme.titleMedium?.copyWith(
                            color: AppColors.darkTextSecondary,
                          ),
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 40),
                    TrendyTextField(
                      controller: _emailController,
                      labelText: 'Email',
                      hintText: 'Enter your email address',
                      keyboardType: TextInputType.emailAddress,
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'Please enter your email';
                        }
                        if (!RegExp(r"^[a-zA-Z0-9.a-zA-Z0-9.!#$%&'*+-/=?^_`{|}~]+@[a-zA-Z0-9]+\.[a-zA-Z]+")
                            .hasMatch(value)) {
                          return 'Please enter a valid email address';
                        }
                        return null;
                      },
                    ),
                    const SizedBox(height: 20),
                    TrendyTextField(
                      controller: _passwordController,
                      labelText: 'Password',
                      hintText: 'Enter your password',
                      obscureText: _obscurePassword,
                      suffixIcon: IconButton(
                        icon: Icon(
                          _obscurePassword ? Icons.visibility_off : Icons.visibility,
                          color: AppColors.darkTextSecondary,
                        ),
                        onPressed: () {
                          setState(() {
                            _obscurePassword = !_obscurePassword;
                          });
                        },
                      ),
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'Please enter your password';
                        }
                        if (value.length < 6) {
                          return 'Password must be at least 6 characters long';
                        }
                        return null;
                      },
                    ),
                    const SizedBox(height: 30),
                    TrendyButton(
                      text: 'Login',
                      onPressed: () async {
                        if (_formKey.currentState?.validate() ?? false) {
                          await authViewModel.signIn(
                            _emailController.text.trim(),
                            _passwordController.text.trim(),
                          );
                          if (authViewModel.errorMessage != null) {
                            _showErrorSnackBar(context, authViewModel.errorMessage!);
                            authViewModel.clearErrorMessage();
                          }
                        }
                      },
                      isLoading: authViewModel.isLoading,
                    ),
                    const SizedBox(height: 20),
                    TextButton(
                      onPressed: () {
                        // TODO: Implement Forgot Password logic
                        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
                          content: Text('Forgot Password functionality coming soon!'),
                        ));
                      },
                      child: Text(
                        'Forgot Password?',
                        style: Theme.of(context).textTheme.labelLarge?.copyWith(
                              color: AppColors.primary,
                            ),
                      ),
                    ),
                    const SizedBox(height: 20),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          "Don't have an account?",
                          style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                                color: AppColors.darkTextSecondary,
                              ),
                        ),
                        TextButton(
                          onPressed: () => context.go(AppRoutes.register),
                          child: Text(
                            'Register',
                            style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                                  color: AppColors.accent,
                                  fontWeight: FontWeight.bold,
                                ),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}
