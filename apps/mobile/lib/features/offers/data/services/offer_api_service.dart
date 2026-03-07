import 'package:http/http.dart' as http;
import '../models/offer_model.dart';
import 'dart:convert';

class OfferApiService {
  OfferApiService(this._httpClient);

  final http.Client _httpClient;

  Future<List<OfferModel>> getOffers() async {
    final uri = Uri.http('localhost:3000', '/offers/list');
    final response = await _httpClient.get(uri);

    if (response.statusCode != 200) {
      throw Exception('Failed to load offers');
    }

    final data = json.decode(response.body) as List;
    return data.map((json) => OfferModel.fromJson(json)).toList();
  }
}
