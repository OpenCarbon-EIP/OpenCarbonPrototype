import 'package:flutter/foundation.dart';
import 'package:flutter_poc/core/errors/app_errors.dart';
import 'package:flutter_poc/features/offers/data/repositories/offer_repository.dart';
import 'package:flutter_poc/features/offers/domain/entity/offer_entity.dart';

class OffersViewModel extends ChangeNotifier {
  OffersViewModel(this._repository);

  final OfferRepository _repository;

  List<OfferEntity> _offers = [];
  List<OfferEntity> _companyOffers = [];
  bool _isLoading = false;
  String? _error;

  List<OfferEntity> get offers => _offers;

  List<OfferEntity> get companyOffers => _companyOffers;

  bool get isLoading => _isLoading;

  String? get error => _error;

  Future<void> loadOffers() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      _offers = await _repository.getOffers();
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

  Future<void> getCompanyOffers() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      _companyOffers = await _repository.getCompanyOffers();
    } on AuthFailure catch (e) {
      _error = e.toString();
    } on NotFoundFailure catch (e) {
      _error = e.toString();
    } on Exception catch (_) {
      _error = 'Une erreur est survenue';
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> createOffer(String title, String description, String location, double budget, DateTime deadline) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      await _repository.createOffer(title, description, location, budget, deadline);
    } on AuthFailure catch (e) {
      _error = e.toString();
    } on NotFoundFailure catch (e) {
      _error = e.toString();
    } on Exception catch (_) {
      _error = 'Une erreur est survenue';
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
}
