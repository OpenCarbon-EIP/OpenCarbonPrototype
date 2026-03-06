import 'package:flutter/material.dart';
import 'package:flutter_poc/core/colors/app_colors.dart';

class Dashboard extends StatelessWidget {
  const Dashboard({super.key});

  @override
  Widget build(BuildContext context) {
    return Center( // Plus besoin de Scaffold ni de AppNavbar ici
      child: Text('Dashboard!', selectionColor: AppColors.primaryLight),
    );
  }
}