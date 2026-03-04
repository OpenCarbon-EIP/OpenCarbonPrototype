import 'package:flutter/material.dart';
import 'package:flutter_poc/core/colors/app_colors.dart';
import 'package:flutter_poc/core/svg/app_svg.dart';
import 'package:flutter_svg/flutter_svg.dart';

class AppNavbar extends StatefulWidget {
  const AppNavbar({super.key});

  @override
  State<AppNavbar> createState() => _AppNavbarState();
}

class _AppNavbarState extends State<AppNavbar> {
  int isSelected = 0;
  
  Alignment _getAlignmentForIndex(int index) {
    switch (index) {
      case 0:
        return const Alignment(-1.0, 0.0);
      case 1:
        return const Alignment(-0.33, 0.0);
      case 2:
        return const Alignment(0.33, 0.0);
      case 3:
        return const Alignment(1.0, 0.0);
      default:
        return const Alignment(-1.0, 0.0);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 20),
      child: Center(
        heightFactor: 1,
        child: Container(
          width: 347,
          height: 71,
          padding: const EdgeInsets.symmetric(horizontal: 2.5),
          decoration: BoxDecoration(
            color: AppColors.backgroundLight,
            borderRadius: BorderRadius.circular(22.5),
            border: Border.all(color: AppColors.borderInput, width: 1),
          ),
          child: Stack(
            children: [
              AnimatedAlign(
                duration: const Duration(milliseconds: 300),
                curve:
                    Curves.easeOutCubic,
                alignment: _getAlignmentForIndex(isSelected),
                child: Container(
                  width: 85,
                  height: 65,
                  decoration: BoxDecoration(
                    color: AppColors.primaryLight,
                    borderRadius: BorderRadius.circular(20),
                  ),
                ),
              ),

              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  _buildNavItem(
                    isSelected == 0
                        ? AppSvg.svgHomeFilled
                        : AppSvg.svgHomeStroke,
                    index: 0,
                  ),
                  _buildNavItem(
                    isSelected == 1
                        ? AppSvg.svgMessageFilled
                        : AppSvg.svgMessageStroke,
                    index: 1,
                  ),
                  _buildNavItem(
                    isSelected == 2
                        ? AppSvg.svgSettingFilled
                        : AppSvg.svgSettingStroke,
                    index: 2,
                  ),
                  _buildNavItem(
                    isSelected == 3
                        ? AppSvg.svgProfileFilled
                        : AppSvg.svgProfileStroke,
                    index: 3,
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildNavItem(String svgData, {required int index}) {
    final bool isCurrentSelected = isSelected == index;

    return GestureDetector(
      onTap: () {
        setState(() {
          isSelected = index;
        });
      },
      child: Container(
        width: 85,
        height: 65,
        color: Colors.transparent,
        child: Center(
          child: SvgPicture.string(
            svgData,
            colorFilter: ColorFilter.mode(
              isCurrentSelected ? AppColors.textLight : AppColors.primaryLight,
              BlendMode.srcIn,
            ),
          ),
        ),
      ),
    );
  }
}
