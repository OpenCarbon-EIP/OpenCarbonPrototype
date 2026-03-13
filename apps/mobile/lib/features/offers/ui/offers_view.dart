import 'package:flutter/material.dart';
import 'package:flutter_poc/core/auth/auth_provider.dart';
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
import 'package:intl/intl.dart';
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

        final authProvider = context.read<AuthProvider>();

        if (authProvider.isCompany) {
          vm.getCompanyOffers();
          vm.loadOffers();
        } else {
          vm.loadOffers();
        }

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
  DateTime _selectedDate = DateTime.now();

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
                                          selected: _selectedDate,
                                          fromMonth: DateTime(_selectedDate.year - 1),
                                          toMonth: DateTime(_selectedDate.year, 12),
                                          onChanged: (value) {
                                            if (value != null) {
                                              setState(() => _selectedDate = value);
                                            }
                                          },
                                        ),
                                        SmallButton(
                                          text: "Publier l'offre",
                                          color: AppColors.primaryLight,
                                          onPressed: () async {
                                            await vm.createOffer(
                                              _titleController.text,
                                              _descriptionController.text,
                                              _locationController.text,
                                              double.parse(_budgetController.text),
                                              _selectedDate,
                                            );

                                            if (context.mounted) {
                                              if (vm.error == null) {
                                                Navigator.pop(context);
                                                await vm.getCompanyOffers();
                                                await vm.loadOffers();
                                                _titleController.clear();
                                                _descriptionController.clear();
                                                _locationController.clear();
                                                _budgetController.clear();
                                                _selectedDate = DateTime.now();
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
                        companyName: offer.company?.companyName ?? '',
                        onCardSelected: (selectedIndex) {
                          final selectedOffer = offers[selectedIndex];
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
                                  children: <Widget>[
                                    // Petite barre "drag handle"
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
                                      child: Padding(
                                        padding: const EdgeInsets.all(32),
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
                                                        CircleAvatar(
                                                          radius: 15,
                                                          backgroundColor: AppColors.primaryLight,
                                                          child: Text(
                                                            (selectedOffer.company?.companyName ?? 'N/A').length >= 2
                                                                ? selectedOffer.company!.companyName
                                                                      .substring(0, 2)
                                                                      .toUpperCase()
                                                                : (selectedOffer.company?.companyName ?? 'N/A')
                                                                      .toUpperCase(),
                                                            style: AppTypography.bodySmall.copyWith(
                                                              color: AppColors.textLight,
                                                              fontWeight: FontWeight.bold,
                                                            ),
                                                          ),
                                                        ),
                                                      ],
                                                    ),
                                                    Text(
                                                      'Date limite: ${DateFormat('dd/MM/yyyy').format(selectedOffer.deadline)}',
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
                                            const SizedBox(height: 16),
                                            _currentTab == 1
                                                ? SmallButton(
                                                    text: 'Postuler',
                                                    color: AppColors.primaryLight,
                                                    onPressed: () async {
                                                      await vm.apply(selectedOffer.id);
                                                      if (context.mounted) {
                                                        if (vm.error == null) {
                                                          Navigator.pop(context);
                                                        } else {
                                                          ScaffoldMessenger.of(context).showSnackBar(
                                                            SnackBar(
                                                              content: Text(vm.error!),
                                                              backgroundColor: AppColors.danger,
                                                            ),
                                                          );
                                                        }
                                                      }
                                                    },
                                                  )
                                                : SmallButton(
                                                    text: "Supprimer l'offre",
                                                    color: AppColors.danger,
                                                    onPressed: () async {
                                                      await vm.deleteOffer(selectedOffer.id);
                                                      if (context.mounted) {
                                                        Navigator.pop(context);
                                                        if (vm.error == null) {
                                                          ScaffoldMessenger.of(context).showSnackBar(
                                                            const SnackBar(
                                                              content: Text('Offre supprimée avec succès'),
                                                              backgroundColor: AppColors.primaryLight,
                                                            ),
                                                          );
                                                          await vm.getCompanyOffers();
                                                          await vm.loadOffers();
                                                        } else {
                                                          ScaffoldMessenger.of(context).showSnackBar(
                                                            SnackBar(
                                                              content: Text(vm.error!),
                                                              backgroundColor: AppColors.danger,
                                                            ),
                                                          );
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
