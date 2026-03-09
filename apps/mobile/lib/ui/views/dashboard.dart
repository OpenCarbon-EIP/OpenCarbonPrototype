import 'package:flutter/material.dart';
import 'package:flutter_poc/core/colors/app_colors.dart';
import 'package:flutter_poc/core/typo/app_typography.dart';

class Dashboard extends StatelessWidget {
  const Dashboard({super.key});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Text('Dashboard!', style: AppTypography.bodyMedium.copyWith(color: AppColors.primaryLight)),
    );
  }
}