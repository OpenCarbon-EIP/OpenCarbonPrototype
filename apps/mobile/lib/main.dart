import 'package:flutter/material.dart';
import 'package:flutter_poc/core/colors/app_colors.dart';
import 'package:flutter_poc/ui/widgets/app_navbar.dart';

void main() {
  runApp(const MainApp());
}

class MainApp extends StatelessWidget {
  const MainApp({super.key});

  @override
  Widget build(BuildContext context) {
    return const MaterialApp(
      home: Scaffold(
        extendBody: true,
        bottomNavigationBar: AppNavbar(),
        backgroundColor: AppColors.backgroundLight,
        body: Center(
          child: Text('Open Carbon!', selectionColor: AppColors.primaryLight),
        ),
      ),
    );
  }
}
