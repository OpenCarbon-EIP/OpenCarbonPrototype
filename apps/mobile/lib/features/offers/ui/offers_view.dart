// lib/ui/views/offers_view.dart
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'package:flutter_poc/core/colors/app_colors.dart';
import 'package:flutter_poc/core/typo/app_typography.dart';
import 'package:flutter_poc/ui/widgets/button.dart';
import 'package:flutter_poc/ui/widgets/card.dart';
import 'package:flutter_poc/core/svg/app_svg.dart';

import '../viewmodels/offer_viewmodel.dart';
import '../data/services/offer_api_service.dart';
import '../data/repositories/offer_repository.dart';
import 'package:http/http.dart' as http;

class OffersView extends StatelessWidget {
  const OffersView({super.key});

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (_) {
        final httpClient = http.Client();
        final service = OfferApiService(httpClient);
        final repository = OfferRepositoryImpl(service);
        final vm = OffersViewModel(repository);
        vm.loadOffers();
        return vm;
      },
      child: const _OffersViewBody(),
    );
  }
}

class _OffersViewBody extends StatelessWidget {
  const _OffersViewBody();

  @override
  Widget build(BuildContext context) {
    final vm = context.watch<OffersViewModel>();
    final offers = vm.offers;

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
                // Utilise le ViewModel pour filtrer plus tard
              },
            ),
          ),
        ],
      ),
      backgroundColor: AppColors.backgroundLight,
      body: Column(
        children: [
          if (vm.isLoading) const LinearProgressIndicator(),
          if (vm.error != null)
            Padding(
              padding: const EdgeInsets.all(8.0),
              child: Text(vm.error!, style: const TextStyle(color: Colors.red)),
            ),
          Expanded(
            child: CustomScrollView(
              slivers: [
                SliverList(
                  delegate: SliverChildBuilderDelegate(
                    (context, index) {
                      if (index == offers.length) {
                        return const SizedBox(height: 110);
                      }

                      final offer = offers[index];

                      return Padding(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 16.0,
                          vertical: 8.0,
                        ),
                        child: CustomCard(
                          index: index,
                          title: offer.data?.title ?? 'Titre non disponible',
                          deadline: offer.data?.deadline ?? 'Deadline non disponible',
                          description: offer.data?.description ?? 'Description non disponible',
                          onCardSelected: (selectedIndex) {
                            final selectedOffer = offers[selectedIndex];
                            if (selectedOffer.data == null) return;

                            showModalBottomSheet(
                              context: context,
                              isScrollControlled: true,
                              builder: (context) {
                                return SafeArea(
                                  child: SizedBox(
                                    height: MediaQuery.of(context).size.height * 0.85,
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
                                                crossAxisAlignment: CrossAxisAlignment.start,
                                                spacing: 13,
                                                children: [
                                                  Text(
                                                    selectedOffer.data?.title ?? 'Titre non disponible',
                                                    style: AppTypography.headingMedium.copyWith(
                                                      color: AppColors.primaryLight,
                                                    ),
                                                  ),
                                                  Text(
                                                    'Deadline: ${selectedOffer.data?.deadline ?? 'Deadline non disponible'}',
                                                    style: AppTypography.bodyMedium.copyWith(
                                                      color: AppColors.primaryLight,
                                                    ),
                                                  ),
                                                  Text(
                                                    'Description: ${selectedOffer.data?.description ?? 'Description non disponible'}',
                                                    style: AppTypography.bodyMedium.copyWith(
                                                      color: AppColors.primaryLight,
                                                    ),
                                                  ),
                                                ],
                                              ),
                                            ),
                                          ),
                                          SmallButton(
                                            text: 'Postuler',
                                            onPressed: () {
                                              // TODO: Implémenter la logique de postulation (demander aux mecs du back de le faire)
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
                    },
                    childCount: offers.length + 1,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
