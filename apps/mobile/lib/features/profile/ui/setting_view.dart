import 'package:flutter/material.dart';
import 'package:flutter_poc/core/colors/app_colors.dart';
import 'package:flutter_poc/core/typo/app_typography.dart';
import 'package:flutter_poc/features/profile/domain/entity/profile_entity.dart';

class SettingView extends StatelessWidget {
  const SettingView({super.key, required this.profile});

  final Profile profile;

  @override
  Widget build(BuildContext context) => Scaffold(
    body: Padding(
      padding: const EdgeInsets.symmetric(horizontal: 32.0, vertical: 46),
      child: Column(
        spacing: 32,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Paramètres', style: AppTypography.displayLarge.copyWith(color: AppColors.primaryLight)),
        ],
      ),
    )
  );
}
