import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_analytics/firebase_analytics.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:trendy_closet/app.dart';
import 'package:trendy_closet/firebase_options.dart';
import 'package:trendy_closet/services/firebase_auth_service.dart';
import 'package:trendy_closet/services/firestore_service.dart';
import 'package:trendy_closet/services/local_storage_service.dart';
import 'package:trendy_closet/services/supabase_service.dart';
import 'package:trendy_closet/viewmodels/auth_viewmodel.dart';
import 'package:trendy_closet/viewmodels/product_viewmodel.dart';
import 'package:trendy_closet/viewmodels/theme_provider.dart';
import 'package:trendy_closet/viewmodels/user_viewmodel.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Initialize Firebase
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );
  // Initialize Firebase Analytics (optional, for tracking app usage)
  FirebaseAnalytics.instance.logAppOpen();

  // Initialize Supabase
  await SupabaseService.init();

  // Initialize Local Storage Service
  await LocalStorageService.init();

  runApp(
    MultiProvider(
      providers: [
        // Services
        Provider<FirebaseAuthService>(create: (_) => FirebaseAuthService()),
        Provider<FirestoreService>(create: (_) => FirestoreService()),
        Provider<LocalStorageService>(create: (_) => LocalStorageService()),
        Provider<SupabaseService>(create: (_) => SupabaseService()),

        // ViewModels (dependent on services)
        ChangeNotifierProvider<AuthViewModel>(
          create: (context) => AuthViewModel(context.read<FirebaseAuthService>()),
        ),
        ChangeNotifierProvider<ThemeProvider>(
          create: (context) => ThemeProvider(context.read<LocalStorageService>()),
        ),
        ChangeNotifierProvider<UserViewModel>(
          create: (context) => UserViewModel(
            context.read<FirebaseAuthService>(),
            context.read<FirestoreService>(),
          ),
        ),
        ChangeNotifierProvider<ProductViewModel>(
          create: (context) => ProductViewModel(
            context.read<FirestoreService>(),
            context.read<LocalStorageService>(),
          ),
        ),
      ],
      child: const MyApp(),
    ),
  );
}
