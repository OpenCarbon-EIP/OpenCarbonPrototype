import '../models/offer_model.dart';
import '../services/offer_api_service.dart';

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
    } catch (e) {
      throw Exception('Failed to load offers');
    }
  }
}