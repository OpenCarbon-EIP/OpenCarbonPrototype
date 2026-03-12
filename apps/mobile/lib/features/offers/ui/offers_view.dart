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
        vm.getCompanyOffers();
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
  int _currentTab = 1;
  late final TextEditingController _titleController;
  late final TextEditingController _descriptionController;
  late final TextEditingController _locationController;
  late final TextEditingController _budgetController;
  final date = DateTime.now();

  @override
  void initState() {
    super.initState();
    _titleController = TextEditingController();
    _descriptionController = TextEditingController();
    _locationController = TextEditingController();
    _budgetController = TextEditingController();
  }

  @override
  void dispose() {
    _titleController.dispose();
    _descriptionController.dispose();
    _locationController.dispose();
    _budgetController.dispose();

    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final vm = context.watch<OffersViewModel>();
    final offers = _currentTab == 1 ? vm.offers : vm.companyOffers;

    return Scaffold(
      appBar: AppBar(
        backgroundColor: AppColors.backgroundLight,
        elevation: 0,
        centerTitle: false,
        title: Text('Opportunités', style: AppTypography.subheadingLarge),
        actions: [
          Container(
            padding: const EdgeInsets.only(right: 16.0),
            child: _currentTab == 1
                ? SmallButtonWithIcon(
                    text: 'Filtrer',
                    svgIcon: AppSvg.svgFilter,
                    onPressed: () {
                      // TODO : Utilise le ViewModel pour filtrer plus tard
                    },
                  )
                : SmallButtonWithIcon(
                    text: 'Créer une offre',
                    svgIcon: AppSvg.plus,
                    onPressed: () {
                      showModalBottomSheet<Widget>(
                        context: context,
                        isScrollControlled: true,
                        useSafeArea: true,
                        builder: (context) {
                          final mediaQuery = MediaQuery.of(context);
                          return Container(
                            constraints: BoxConstraints(maxHeight: mediaQuery.size.height * 0.9),
                            decoration: const BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
                            ),
                            child: Column(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Padding(
                                  padding: const EdgeInsets.only(top: 8, bottom: 8),
                                  child: Container(
                                    width: 40,
                                    height: 4,
                                    decoration: BoxDecoration(
                                      color: Colors.grey[400],
                                      borderRadius: BorderRadius.circular(2),
                                    ),
                                  ),
                                ),
                                const Divider(height: 1),
                                Expanded(
                                  child: SingleChildScrollView(
                                    padding: const EdgeInsets.all(32.0),
                                    child: Column(
                                      spacing: 16,
                                      children: [
                                        Text(
                                          'Créer une nouvelle mission',
                                          style: AppTypography.headingLarge.copyWith(color: AppColors.primaryLight),
                                        ),
                                        const Divider(),
                                        ShadInput(
                                          placeholder: const Text('Titre de la mission'),
                                          controller: _titleController,
                                        ),
                                        ShadTextarea(
                                          placeholder: const Text('Description de la mission'),
                                          controller: _descriptionController,
                                        ),
                                        ShadInput(
                                          placeholder: const Text('Localisation'),
                                          controller: _locationController,
                                        ),
                                        ShadInput(placeholder: const Text('Budget'), controller: _budgetController),
                                        ShadCalendar(
                                          selected: date,
                                          fromMonth: DateTime(date.year - 1),
                                          toMonth: DateTime(date.year, 12),
                                        ),
                                        SmallButton(
                                          text: "Publier l'offre",
                                          onPressed: () async {
                                            await vm.createOffer(
                                              _titleController.text,
                                              _descriptionController.text,
                                              _locationController.text,
                                              double.parse(_budgetController.text),
                                              date,
                                            );

                                            if (context.mounted) {
                                              if (vm.error == null) {
                                                Navigator.pop(context);
                                                await vm.getCompanyOffers();
                                                await vm.loadOffers();
                                              } else {
                                                ScaffoldMessenger.of(
                                                  context,
                                                ).showSnackBar(SnackBar(content: Text(vm.error!)));
                                              }
                                            }
                                          },
                                        ),
                                      ],
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          );
                        },
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
          ShadTabs(
            value: _currentTab,
            onChanged: (int value) => setState(() => _currentTab = value),
            tabs: const [
              ShadTab(value: 1, child: Text('Consultant')),
              ShadTab(value: 2, child: Text('Entreprise')),
            ],
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
