import 'dart:convert';
import 'package:flutter_poc/core/errors/app_errors.dart';
import 'package:flutter_poc/features/offers/data/models/offer_model.dart';
import 'package:http/http.dart' as http;

class OfferApiService {
  OfferApiService(this._httpClient);

  final http.Client _httpClient;

  Future<OfferModel> getOffers(String token) async {
    final uri = Uri.http('localhost:3000', '/offers/list');
    final response = await _httpClient.get(
      uri,
      headers: {
        'Authorization': 'Bearer $token',
        'Content-Type': 'application/json',
      },
    );

    if (response.statusCode != 200) {
      switch (response.statusCode) {
        case 401:
          throw AuthFailure("Vous n'êtes pas autorisé(e) à voir les offres.");
        default:
          throw Exception('Erreur pendant le chargement des opportunités');
      }
    }

    final decoded = json.decode(response.body) as Map<String, dynamic>;

    return OfferModel.fromJson(decoded);
  }
}
