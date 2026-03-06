import 'package:flutter/material.dart';
import 'package:flutter_poc/core/colors/app_colors.dart';
import 'package:flutter_poc/core/typo/app_typography.dart';
import 'package:flutter_svg/flutter_svg.dart';

class SmallButton extends StatelessWidget {
  final String text;
  final VoidCallback onPressed;

  const SmallButton({
    super.key,
    required this.text,
    required this.onPressed,
  });

  @override
  Widget build(BuildContext context) {
    return TextButton(
      onPressed: onPressed,
      style: TextButton.styleFrom(
        backgroundColor: AppColors.primaryLight,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(10),
        ),
        padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 0),
      ),
      child: Text(
        text,
        style: AppTypography.bodySmall.copyWith(color: AppColors.textLight),
      ),
    );
  }
}

class SmallButtonWithIcon extends StatelessWidget {
  final String text;
  final String svgIcon;
  final VoidCallback onPressed;

  const SmallButtonWithIcon({
    super.key,
    required this.text,
    required this.svgIcon,
    required this.onPressed,
  });

  @override
  Widget build(BuildContext context) {
    return TextButton(
      onPressed: onPressed,
      style: TextButton.styleFrom(
        backgroundColor: AppColors.primaryLight,
        padding: const EdgeInsets.fromLTRB(12, 0, 16, 0),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(10),
        ),
      ),
      child: Row(
        children: [
          SvgPicture.string(
            svgIcon,
            width: 15,
            height: 15,
          ),
          const SizedBox(width: 8),
          Text(text, style: AppTypography.bodySmall.copyWith(color: AppColors.textLight)),
        ],
      ),
    );
  }
}