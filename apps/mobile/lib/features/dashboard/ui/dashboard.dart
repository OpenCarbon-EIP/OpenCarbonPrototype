import 'package:flutter/material.dart';
import 'package:flutter_poc/core/auth/auth_provider.dart';
import 'package:flutter_poc/ui/widgets/button.dart';
import 'package:provider/provider.dart';

class Dashboard extends StatelessWidget {
  const Dashboard({super.key});

  @override
  Widget build(BuildContext context) => Center(
    child: SmallButton(
      text: 'Se déconnecter',
          onPressed: () => context.read<AuthProvider>().logout(),
    ),
  );
}
