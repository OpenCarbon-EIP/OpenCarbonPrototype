import 'package:flutter/material.dart';
import 'package:flutter_poc/ui/widgets/button.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class Dashboard extends StatelessWidget {
  const Dashboard({super.key});

  FlutterSecureStorage get _storage => const FlutterSecureStorage();
  @override
  Widget build(BuildContext context) => Center(
    child: SmallButton(text: 'Se déconnecter', onPressed: () async {
      try {
        await _storage.delete(key: 'auth_token');
      } catch (e) {
        print('Error deleting token: $e');
      }
    }),
  );
}
