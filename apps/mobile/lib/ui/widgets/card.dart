import 'package:flutter/material.dart';
import 'package:flutter_poc/core/colors/app_colors.dart';
import 'package:flutter_poc/core/typo/app_typography.dart';

class CustomCard extends StatelessWidget {
  final int index;
  final String title;
  final String date;
  final String description;
  final Function(int) onCardSelected;

  const CustomCard({
    super.key,
    required this.index,
    required this.title,
    required this.date,
    required this.description,
    required this.onCardSelected,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => onCardSelected(index),
      child: Container(
        width: 360,
        height: 160,
        padding: const EdgeInsets.all(24),
        decoration: BoxDecoration(
          color: AppColors.backgroundLight,
          borderRadius: BorderRadius.circular(8),
          border: Border.all(color: AppColors.borderInput, width: 1),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          spacing: 24.0,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(title, style: AppTypography.bodyMedium),
                    Text(
                      date,
                      style: AppTypography.bodySmall.copyWith(
                        color: AppColors.textDark,
                      ),
                    ),
                  ],
                ),
                SizedBox(
                  width: 65,
                  height: 30,
                  child: Stack(
                    children: [
                      Positioned(
                        left:34,
                        child: CircleAvatar(
                          radius: 15,
                          backgroundColor: AppColors.primaryLight,
                          child: Text(
                            "AG",
                            style: AppTypography.bodySmall.copyWith(
                              color: AppColors.textLight,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ),
                      Positioned(
                        left: 17,
                        child: CircleAvatar(
                          radius:15,
                          backgroundColor: AppColors.primaryLight,
                          child: Text(
                            "EL",
                            style: AppTypography.bodySmall.copyWith(
                              color: AppColors.textLight,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ),
                      Positioned(
                        left: 0,
                        child: CircleAvatar(
                          radius: 15,
                          backgroundColor: AppColors.primaryLight,
                          child: Text(
                            "QL",
                            style: AppTypography.bodySmall.copyWith(
                              color: AppColors.textLight,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            Text(description, style: AppTypography.bodySmall, maxLines: 2, overflow: TextOverflow.ellipsis),
          ],
        ),
      ),
    );
  }
}
