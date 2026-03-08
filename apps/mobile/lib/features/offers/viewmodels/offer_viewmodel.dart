// lib/viewmodels/offers_viewmodel.dart
import 'package:flutter/foundation.dart';
import 'package:flutter_poc/features/offers/data/models/offer_model.dart';
import 'package:flutter_poc/features/offers/data/repositories/offer_repository.dart';

class OffersViewModel extends ChangeNotifier {
  OffersViewModel(this._repository);

  final OfferRepository _repository;

  List<OfferModel> _offers = [];
  bool _isLoading = false;
  String? _error;

  List<OfferModel> get offers => _offers;
  bool get isLoading => _isLoading;
  String? get error => _error;

  Future<void> loadOffers() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      _offers = await _repository.getOffers();
    } on Exception catch (_) {
      _error = 'Une erreur est survenue';
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
}
