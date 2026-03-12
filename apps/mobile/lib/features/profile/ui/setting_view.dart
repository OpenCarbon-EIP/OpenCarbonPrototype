import 'package:flutter/material.dart';
import 'package:flutter_poc/core/colors/app_colors.dart';
import 'package:flutter_poc/core/svg/app_svg.dart';
import 'package:flutter_poc/core/typo/app_typography.dart';
import 'package:flutter_poc/features/profile/domain/entity/profile_entity.dart';
import 'package:flutter_poc/ui/widgets/button.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:flutter_poc/core/auth/auth_provider.dart';
import 'package:provider/provider.dart';

class SettingView extends StatelessWidget {
  const SettingView({super.key, required this.profile});

  final Profile profile;

  @override
  Widget build(BuildContext context) => Scaffold(
    body: Padding(
      padding: const EdgeInsets.symmetric(horizontal: 32.0, vertical: 46),
      child: Column(
        spacing: 24,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            spacing: 32,
            children: [
              GestureDetector(
                onTap: () {
                  Navigator.pop(context);
                },
                child: SvgPicture.string(AppSvg.arrowLeft),
              ),
              Center(
                child: Text('Paramètres', style: AppTypography.subheadingLarge.copyWith(color: AppColors.primaryLight)),
              ),
            ],
          ),
          const Divider(),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('Modifier votre nom', style: AppTypography.subheadingMedium.copyWith(color: AppColors.primaryLight)),
              SvgPicture.string(AppSvg.arrowRight),
            ],
          ),
          const Divider(),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Modifier votre adresse mail',
                style: AppTypography.subheadingMedium.copyWith(color: AppColors.primaryLight),
              ),
              SvgPicture.string(AppSvg.arrowRight),
            ],
          ),
          const Divider(),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Modifier votre mot de passe',
                style: AppTypography.subheadingMedium.copyWith(color: AppColors.primaryLight),
              ),
              SvgPicture.string(AppSvg.arrowRight),
            ],
          ),
          const Divider(),
          const Spacer(),
          Center(
            child: SmallButton(
              text: 'Se déconnecter',
              color: AppColors.danger,
              onPressed: () {
                Navigator.pop(context);
                context.read<AuthProvider>().logout();
              },
            ),
          ),
        ],
      ),
    ),
  );
}
