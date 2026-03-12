import 'dart:convert';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_poc/core/constants/app_constants.dart';
import 'package:flutter_poc/core/errors/app_errors.dart';
import 'package:flutter_poc/features/profile/data/models/profile_model.dart';
import 'package:http/http.dart' as http;


class ProfileApiService {
  ProfileApiService(this._httpClient);

  final http.Client _httpClient;

  Future<ProfileModel> getProfile(String token) async {
    final String? dbPath = dotenv.env[AppConstants.dbPath];
    if (dbPath == null) {
      throw EnvironmentFailure();
    }
    final uri = Uri.http(dbPath, '/users/me');
    final response = await _httpClient.get(
      uri,
      headers: {'Authorization': 'Bearer $token', 'Content-Type': 'application/json'},
    );

    if (response.statusCode != 200) {
      switch (response.statusCode) {
        case 401:
          throw UnauthorizedFailure("Vous n'êtes pas autorisé(e) à voir les offres.");
        default:
          throw Exception('Erreur pendant le chargement des opportunités');
      }
    }

    final decoded = json.decode(response.body) as Map<String, dynamic>;

    return ProfileModel.fromJson(decoded);
  }
}