import 'package:flutter/material.dart';
import 'package:flutter_poc/ui/widgets/button.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:provider/provider.dart';
import 'package:http/http.dart' as http;

import '../data/services/login_api_service.dart';
import '../data/repositories/login_repository.dart';
import '../data/services/login_auth_service.dart';
import '../viewmodels/login_viewmodel.dart';

class LoginView extends StatelessWidget {
  const LoginView({super.key});

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (_) {
        final httpClient = http.Client();
        const iosOptions = IOSOptions(
          accessibility: KeychainAccessibility.first_unlock,
        );
        final auth = FlutterSecureStorage(iOptions: iosOptions);
        final service = LoginApiService(httpClient);
        final authService = LoginAuthService(auth);
        final repository = LoginRepositoryImpl(service, authService);
        final vm = LoginViewModel(repository);
        return vm;
      },
      child: _LoginViewBody(),
    );
  }
}

class _LoginViewBody extends StatefulWidget {
  const _LoginViewBody();

  @override
  State<_LoginViewBody> createState() => _LoginViewBodyState();
}

class _LoginViewBodyState extends State<_LoginViewBody> {
  late final TextEditingController _emailController;
  late final TextEditingController _passwordController;

  @override
  void initState() {
    super.initState();
    _emailController = TextEditingController();
    _passwordController = TextEditingController();
  }

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final vm = context.watch<LoginViewModel>();

    return Scaffold(
      body: Column(
        children: [
          SizedBox(
            height: MediaQuery.of(context).size.height * 0.4,
            child: Container(),
          ),
          SizedBox(
            height: MediaQuery.of(context).size.height * 0.3,
            child: Column(
              children: [
                const Spacer(),
                TextField(
                  controller: _emailController,
                  decoration: const InputDecoration(labelText: 'Email'),
                ),
                TextField(
                  controller: _passwordController,
                  decoration: const InputDecoration(labelText: 'Mot de passe'),
                  obscureText: true,
                ),
                if (vm.error != null)
                  Text(vm.error!, style: const TextStyle(color: Colors.red)),
                const Spacer(),
              ],
            ),
          ),

          SafeArea(
            child: vm.isLoading
                ? const CircularProgressIndicator()
                : SmallButton(
                    text: 'Se connecter',
                    onPressed: () {
                      vm.login(_emailController.text, _passwordController.text);
                    },
                  ),
          ),
        ],
      ),
    );
  }
}
