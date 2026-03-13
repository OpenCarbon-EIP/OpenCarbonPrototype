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
import 'package:shadcn_ui/shadcn_ui.dart';

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

class _OffersViewBody extends StatefulWidget {
  const _OffersViewBody();

  @override
  State<_OffersViewBody> createState() => _OffersViewBodyState();
}

class _OffersViewBodyState extends State<_OffersViewBody> {
  final TextEditingController _searchController = TextEditingController();
  String? selectedSector;
  String? selectedCompany;
  String sectorSearchQuery = '';
  String companySearchQuery = '';

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final vm = context.watch<OffersViewModel>();
    final offers = vm.offers;
    final sectors = vm.sectors;
    final companies = vm.companies;

    // final filteredOffers = offers.where((o) {
    //   final matchesSector = selectedSector == null ||
    //       o.company?.industrySector == selectedSector;
    //   final matchesCompany = selectedCompany == null ||
    //       o.company?.companyName == selectedCompany;
    //   final matchesSearch = _searchController.text.isEmpty ||
    //       o.title.toLowerCase().contains(_searchController.text.toLowerCase()) ||
    //       o.description.toLowerCase().contains(_searchController.text.toLowerCase());
    //   return matchesSector && matchesCompany && matchesSearch;
    // }).toList();

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
                showModalBottomSheet<Widget>(
                  context: context,
                  isScrollControlled: true,
                  builder: (context) => SafeArea(
                    child: SizedBox(
                      height: MediaQuery.of(context).size.height * 0.7,
                      width: double.infinity,
                      child: Padding(
                        padding: const EdgeInsets.all(16.0),
                        child: Column(
                          children: [
                            Expanded(
                              child: SingleChildScrollView(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  spacing: 13,
                                  children: [
                                    Text('FILTRES', style: AppTypography.headingMedium),
                                    const Divider(),
                                    Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      spacing: 8,
                                      children: [
                                        Text('Recherche :', style: AppTypography.label),
                                        ShadInput(
                                          placeholder: const Text('Rechercher...'),
                                          controller: _searchController,
                                        ),
                                      ],
                                    ),
                                    Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      spacing: 8,
                                      children: [
                                        Text('Secteurs :', style: AppTypography.label),
                                        SizedBox(
                                          width: double.infinity,
                                          child: Builder(
                                            builder: (context) {
                                              final filteredSectors = sectors
                                                .where((s) => s.toLowerCase().contains(sectorSearchQuery.toLowerCase()))
                                                .toList();
                                              return ShadSelect<String>.withSearch(
                                                placeholder: const Text('Sélectionnez un secteur'),
                                                searchPlaceholder: const Text('Rechercher des secteurs...'),
                                                options: [
                                                  if (filteredSectors.isEmpty)
                                                    const Padding(
                                                      padding: EdgeInsets.symmetric(vertical: 24),
                                                      child: Text('Aucun secteur trouvé'),
                                                    ),
                                                  ...filteredSectors.map((sector) => ShadOption(
                                                    value: sector,
                                                    child: Text(sector),
                                                  )),
                                                ],
                                                selectedOptionBuilder: (context, value) =>
                                                  Text(value, style: AppTypography.bodyMedium),
                                                onSearchChanged: (value) {
                                                  setState(() => sectorSearchQuery = value);
                                                },
                                                onChanged: (value) {
                                                  setState(() => selectedSector = value);
                                                },
                                              );
                                            },
                                          ),
                                        ),
                                        if (selectedSector != null)
                                          ShadBadge.outline(
                                            backgroundColor: AppColors.backgroundLight,
                                            foregroundColor: AppColors.primaryLight,
                                            child: Text(selectedSector!),
                                          ),
                                      ],
                                    ),
                                    Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      spacing: 8,
                                      children: [
                                        Text('Entreprises :', style: AppTypography.label),
                                        SizedBox(
                                          width: double.infinity,
                                          child: Builder(
                                            builder: (context) {
                                              final filteredCompanies = companies
                                                .where((c) => c.toLowerCase().contains(companySearchQuery.toLowerCase()))
                                                .toList();
                                              return ShadSelect<String>.withSearch(
                                                placeholder: const Text('Sélectionnez une entreprise'),
                                                searchPlaceholder: const Text('Rechercher des entreprises...'),
                                                options: [
                                                  if (filteredCompanies.isEmpty)
                                                    const Padding(
                                                      padding: EdgeInsets.symmetric(vertical: 24),
                                                      child: Text('Aucune entreprise trouvée'),
                                                    ),
                                                  ...filteredCompanies.map((company) => ShadOption(
                                                    value: company,
                                                    child: Text(company),
                                                  )),
                                                ],
                                                selectedOptionBuilder: (context, value) =>
                                                  Text(value, style: AppTypography.bodyMedium),
                                                onSearchChanged: (value) {
                                                  setState(() => companySearchQuery = value);
                                                },
                                                onChanged: (value) {
                                                  setState(() => selectedCompany = value);
                                                },
                                              );
                                            },
                                          ),
                                        ),
                                        if (selectedCompany != null)
                                          ShadBadge.outline(
                                            backgroundColor: AppColors.backgroundLight,
                                            foregroundColor: AppColors.primaryLight,
                                            child: Text(selectedCompany!),
                                          ),
                                      ],
                                    ),
                                  ],
                                ),
                              ),
                            ),
                            Row(
                              spacing: 8,
                              children: [
                                SmallButton(
                                  text: 'Réinitialiser',
                                  onPressed: () {
                                    setState(() {
                                      selectedSector = null;
                                      selectedCompany = null;
                                      sectorSearchQuery = '';
                                      companySearchQuery = '';
                                      _searchController.clear();
                                    });
                                    Navigator.pop(context);
                                  },
                                ),
                                SmallButton(
                                  text: 'Appliquer',
                                  onPressed: () => Navigator.pop(context),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                );
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
                      padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
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
                                height: MediaQuery.of(context).size.height * 0.4,
                                width: double.infinity,
                                child: Padding(
                                  padding: const EdgeInsets.all(16.0),
                                  child: Column(
                                    children: [
                                      Expanded(
                                        child: SingleChildScrollView(
                                          child: Column(
                                            crossAxisAlignment: CrossAxisAlignment.start,
                                            spacing: 13,
                                            children: [
                                              Text(selectedOffer.title, style: AppTypography.headingLarge),
                                              const Divider(),
                                              Row(
                                                spacing: 16,
                                                children: [
                                                  Text(
                                                    selectedOffer.company?.companyName ??
                                                        "Nom de l'entreprise non spécifié",
                                                    style: AppTypography.headingMedium,
                                                  ),
                                                  selectedOffer.company?.logoUrl == null ||
                                                          selectedOffer.company?.logoUrl?.isEmpty == true
                                                      ? CircleAvatar(
                                                          radius: 15,
                                                          backgroundColor: AppColors.primaryLight,
                                                          child: Text(
                                                            selectedOffer.company?.companyName.substring(0, 2) ?? 'Nom',
                                                            style: AppTypography.bodySmall.copyWith(
                                                              color: AppColors.textLight,
                                                              fontWeight: FontWeight.bold,
                                                            ),
                                                          ),
                                                        )
                                                      : CircleAvatar(
                                                          radius: 15,
                                                          backgroundColor: AppColors.primaryLight,
                                                          child: Image.network(selectedOffer.company!.logoUrl!),
                                                        ),
                                                ],
                                              ),
                                              Text(
                                                'Date limite: ${selectedOffer.deadline}',
                                                style: AppTypography.bodyMedium,
                                              ),
                                              Text(
                                                'Description: ${selectedOffer.description}',
                                                style: AppTypography.bodyMedium,
                                              ),
                                            ],
                                          ),
                                        ),
                                      ),
                                      SmallButton(
                                        text: 'Postuler',
                                        onPressed: () async {
                                          await vm.apply(selectedOffer.id);
                                          if (context.mounted && vm.error == null) {
                                            Navigator.pop(context);
                                          }
                                        },
                                      ),
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