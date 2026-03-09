import 'package:flutter/material.dart';
import 'package:flutter_poc/core/colors/app_colors.dart';
import 'package:flutter_poc/core/typo/app_typography.dart';
import 'package:flutter_poc/ui/widgets/button.dart';
import 'package:flutter_poc/ui/widgets/card.dart';
import 'package:flutter_poc/core/svg/app_svg.dart';

class OffersData {
  OffersData({
    required this.title,
    required this.date,
    required this.description,
  });

  final String title;
  final String date;
  final String description;
}

final List<OffersData> offers = List.generate(
  5,
  (index) => OffersData(
    title: 'Offre $index',
    date: '2024-06-01',
    description: 'Description de l\'offre $index.',
  ),
);

class OffersView extends StatefulWidget {
  const OffersView({super.key});

  @override
  State<OffersView> createState() => _OffersViewState();
}

class _OffersViewState extends State<OffersView> {
  int get _itemCount => offers.length;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: AppColors.backgroundLight,
        elevation: 0,
        centerTitle: false,
        title: Text('Opportunités', style: AppTypography.subheadingLarge),
        actions: [
          Container(
            padding: const EdgeInsets.only(right: 16.0),
            child: SmallButtonWithIcon(
              text: 'Filtrer',
              svgIcon: AppSvg.svgFilter,
              onPressed: () {
                print('Filtrer button pressed');
              },
            ),
          ),
        ],
      ),
      backgroundColor: AppColors.backgroundLight,
      body: Column(
        children: [
          Expanded(
            child: CustomScrollView(
              slivers: [
                SliverList(
                  delegate: SliverChildBuilderDelegate((context, index) {
                    if (index == _itemCount) {
                      return const SizedBox(height: 110);
                    }
                    return Padding(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 16.0,
                        vertical: 8.0,
                      ),
                      child: CustomCard(
                        index: index,
                        title: offers[index].title,
                        date: offers[index].date,
                        description: offers[index].description,
                        onCardSelected: (selectedIndex) {
                          showModalBottomSheet(
                            context: context,
                            isScrollControlled: true,
                            builder: (BuildContext context) {
                              return SafeArea(
                                child: SizedBox(
                                  height:
                                      MediaQuery.of(context).size.height * 0.85,
                                  width: double.infinity,
                                  child: Padding(
                                    padding: const EdgeInsets.all(16.0),
                                    child: Column(
                                      children: [
                                        Text(
                                          'Détails de l\'offre $selectedIndex',
                                          style: AppTypography.caption.copyWith(
                                            color: AppColors.primaryLight,
                                          ),
                                        ),
                                        Expanded(
                                          child: SingleChildScrollView(
                                            child: Column(
                                              crossAxisAlignment:
                                                  CrossAxisAlignment.start,
                                              spacing: 13,
                                              children: [
                                                Text(
                                                  offers[selectedIndex].title,
                                                  style: AppTypography
                                                      .headingMedium
                                                      .copyWith(
                                                        color: AppColors
                                                            .primaryLight,
                                                      ),
                                                ),
                                                Text(
                                                  'Date: ${offers[selectedIndex].date}',
                                                  style: AppTypography
                                                      .bodyMedium
                                                      .copyWith(
                                                        color: AppColors
                                                            .primaryLight,
                                                      ),
                                                ),
                                                Text(
                                                  'Description: ${offers[selectedIndex].description}',
                                                  style: AppTypography
                                                      .bodyMedium
                                                      .copyWith(
                                                        color: AppColors
                                                            .primaryLight,
                                                      ),
                                                ),
                                              ],
                                            ),
                                          ),
                                        ),
                                        SmallButton(
                                          text: 'Postuler',
                                          onPressed: () {
                                            print(
                                              'Postuler button pressed for offer $selectedIndex',
                                            );
                                          },
                                        ),
                                        const SizedBox(height: 20),
                                      ],
                                    ),
                                  ),
                                ),
                              );
                            },
                          );
                        },
                      ),
                    );
                  }, childCount: _itemCount + 1),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
