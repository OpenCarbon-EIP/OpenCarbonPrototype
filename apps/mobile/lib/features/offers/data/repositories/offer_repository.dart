import 'package:flutter_poc/features/offers/data/models/offer_model.dart';
import 'package:flutter_poc/features/offers/data/services/offer_api_service.dart';

abstract class OfferRepository {
  Future<List<OfferModel>> getOffers();
}

class OfferRepositoryImpl implements OfferRepository {
  OfferRepositoryImpl(this._api);

  final OfferApiService _api;

  @override
  Future<List<OfferModel>> getOffers() {
    try {
      return _api.getOffers();
    } on Exception catch (_) {
      throw Exception('Failed to load offers');
    }
  }
}