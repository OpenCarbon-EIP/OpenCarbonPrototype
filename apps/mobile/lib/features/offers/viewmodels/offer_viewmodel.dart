import 'package:flutter/foundation.dart';
import 'package:flutter_poc/core/errors/app_errors.dart';
import 'package:flutter_poc/features/offers/data/repositories/offer_repository.dart';
import 'package:flutter_poc/features/offers/domain/entity/offer_entity.dart';

class OffersViewModel extends ChangeNotifier {
  OffersViewModel(this._repository);

  final OfferRepository _repository;

  List<OfferEntity> _offers = [];
  bool _isLoading = false;
  String? _error;
  List<String> _sectors = [];
  List<String> _companies = [];

  List<OfferEntity> get offers => _offers;
  List<String> get sectors => _sectors;
  List<String> get companies => _companies;

  bool get isLoading => _isLoading;

  String? get error => _error;

  Future<void> loadOffers() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      _offers = await _repository.getOffers();
      _sectors = _offers
        .map((o) => o.company?.industrySector?.trim())
        .whereType<String>()
        .where((value) => value.isNotEmpty)
        .toSet()
        .toList()
        ..sort();
      _companies = _offers
        .map((o) => o.company?.companyName?.trim())
        .whereType<String>()
        .where((value) => value.isNotEmpty)
        .toSet()
        .toList()
        ..sort();
    } on AuthFailure catch (e) {
      _error = e.toString();
    } on Exception catch (_) {
      _error = 'Une erreur est survenue';
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> apply(String idOffer) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      await _repository.apply(idOffer);
    } on UnauthorizedFailure catch (e) {
      _error = e.toString();
    } on AuthFailure catch (e) {
      _error = e.toString();
    } on NotFoundFailure catch (e) {
      _error = e.toString();
    } on Exception catch (_) {
      _error = 'Une erreur est survenue.';
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
}
