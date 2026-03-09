import 'package:flutter/material.dart';
import 'package:flutter_poc/core/colors/app_colors.dart';
import 'package:flutter_poc/core/svg/app_svg.dart';
import 'package:flutter_poc/core/typo/app_typography.dart';
import 'package:flutter_poc/features/offers/data/repositories/offer_repository.dart';
import 'package:flutter_poc/features/offers/data/services/offer_api_service.dart';
import 'package:flutter_poc/features/offers/data/services/offer_auth_service.dart';
import 'package:flutter_poc/features/offers/viewmodels/offer_viewmodel.dart';
import 'package:flutter_poc/ui/widgets/button.dart';
import 'package:flutter_poc/ui/widgets/card.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:http/http.dart' as http;
import 'package:provider/provider.dart';

class OffersView extends StatelessWidget {
  const OffersView({super.key});

  @override
  Widget build(BuildContext context) => Provider<http.Client>(
    create: (_) => http.Client(),
    dispose: (_, client) => client.close(),
    child: ChangeNotifierProvider(
      create: (context) {
        final service = OfferApiService(context.read<http.Client>());
        final authService = OfferAuthService(const FlutterSecureStorage());
        final repository = OfferRepositoryImpl(service, authService);
        final vm = OffersViewModel(repository);
        vm.loadOffers();
        return vm;
      },
      child: const _OffersViewBody(),
    ),
  );
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
                // TODO : Utilise le ViewModel pour filtrer plus tard
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
                  delegate: SliverChildBuilderDelegate((context, index) {
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
                        title: offer.title,
                        deadline: offer.deadline,
                        description: offer.description,
                        onCardSelected: (selectedIndex) {
                          final selectedOffer = offers[selectedIndex];
                          showModalBottomSheet<Widget>(
                            context: context,
                            isScrollControlled: true,
                            builder: (context) => SafeArea(
                              child: SizedBox(
                                height:
                                    MediaQuery.of(context).size.height * 0.85,
                                width: double.infinity,
                                child: Padding(
                                  padding: const EdgeInsets.all(16.0),
                                  child: Column(
                                    children: [
                                      Expanded(
                                        child: SingleChildScrollView(
                                          child: Column(
                                            crossAxisAlignment:
                                                CrossAxisAlignment.start,
                                            spacing: 13,
                                            children: [
                                              Text(
                                                selectedOffer.title,
                                                style: AppTypography
                                                    .headingMedium
                                                    .copyWith(
                                                      color: AppColors
                                                          .primaryLight,
                                                    ),
                                              ),
                                              Text(
                                                selectedOffer.company?.companyName ?? "Nom de l'entreprise non spécifié",
                                                style: AppTypography
                                                    .headingMedium
                                                    .copyWith(
                                                  color: AppColors
                                                      .primaryLight,
                                                ),
                                              ),
                                              Text(
                                                'Date limite: ${selectedOffer.deadline}',
                                                style: AppTypography.bodyMedium
                                                    .copyWith(
                                                      color: AppColors
                                                          .primaryLight,
                                                    ),
                                              ),
                                              Text(
                                                'Description: ${selectedOffer.description}',
                                                style: AppTypography.bodyMedium
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
                                          // TODO: Implémenter la logique de postulation (demander aux mecs du back de le faire)
                                        },
                                      ),
                                      const SizedBox(height: 20),
                                    ],
                                  ),
                                ),
                              ),
                            ),
                          );
                        },
                      ),
                    );
                  }, childCount: offers.length + 1),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
