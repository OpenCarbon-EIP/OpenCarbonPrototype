import 'package:flutter/material.dart';
import 'package:flutter_poc/core/auth/auth_provider.dart';
import 'package:flutter_poc/features/login/ui/login_view.dart';
import 'package:flutter_poc/features/main_page/ui/main_screen_view.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:provider/provider.dart';

void main() {
  const iosOptions = IOSOptions(
    accessibility: KeychainAccessibility.first_unlock,
  );
  const storage = FlutterSecureStorage(iOptions: iosOptions);

  runApp(
    ChangeNotifierProvider(
      create: (_) => AuthProvider(storage),
      child: const MainApp(),
    ),
  );
}

class MainApp extends StatelessWidget {
  const MainApp({super.key});

  @override
  Widget build(BuildContext context) => const MaterialApp(
    title: 'Flutter POC',
    debugShowCheckedModeBanner: false,
    home: AuthWrapper(),
  );
}

class AuthWrapper extends StatelessWidget {
  const AuthWrapper({super.key});

  @override
  Widget build(BuildContext context) => Consumer<AuthProvider>(
    builder: (context, auth, _) {
      if (!auth.isInitialized) {
        return const Scaffold(body: Center(child: CircularProgressIndicator()));
      }

      if (auth.isAuthenticated) {
        return const MainScreen();
      }

      return const LoginView();
    },
  );
}
