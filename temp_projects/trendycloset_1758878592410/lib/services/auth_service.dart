import 'package:firebase_auth/firebase_auth.dart';

/// Abstract class for authentication services to allow for different implementations (e.g., Firebase, Supabase).
abstract class AuthService {
  User? get currentUser;
  Stream<User?> get authStateChanges;

  Future<User?> signInWithEmailAndPassword(String email, String password);
  Future<User?> registerWithEmailAndPassword(String email, String password);
  Future<void> signOut();
  Future<void> sendPasswordResetEmail(String email);
  // Add other auth methods as needed (e.g., Google Sign-In, etc.)
}
