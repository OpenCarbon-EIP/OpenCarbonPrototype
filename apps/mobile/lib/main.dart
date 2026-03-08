import 'package:flutter/material.dart';
import 'package:flutter_poc/features/login/ui/login_view.dart';
import 'package:flutter_poc/features/main_page/ui/main_screen_view.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

void main() {
  runApp(const MainApp());
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

  Future<bool> _isLoggedIn() async {
    const iosOptions = IOSOptions(
      accessibility: KeychainAccessibility.first_unlock,
    );
    const storage = FlutterSecureStorage(iOptions: iosOptions);

    final token = await storage.read(key: 'auth_token');
    return token != null;
  }

  @override
  Widget build(BuildContext context) => FutureBuilder<bool>(
    future: _isLoggedIn(),
    builder: (context, snapshot) {
      if (snapshot.connectionState == ConnectionState.waiting) {
        return const Scaffold(body: Center(child: CircularProgressIndicator()));
      }

      if (snapshot.data == true) {
        return const MainScreen();
      }

      return const LoginView();
    },
  );
}
