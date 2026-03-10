import 'package:flutter_poc/core/errors/app_errors.dart';
import 'package:flutter_poc/features/login/data/services/login_api_service.dart';
import 'package:flutter_poc/features/login/data/services/login_auth_service.dart';

abstract class LoginRepository {
  Future<void> login(String email, String password);
}

/*
*  login_repository.dart
*
*  This file implements the LoginRepository interface, 
* which handles the login logic by interacting with the LoginApiService 
* to perform the login request and the LoginAuthService to manage authentication tokens.
*/
class LoginRepositoryImpl implements LoginRepository {
  LoginRepositoryImpl(this._api, this._authService);

  final LoginApiService _api;
  final LoginAuthService _authService;

  @override
  Future<void> login(String email, String password) async {
    try {
      final response = await _api.login(email, password);
      final accessToken = response.data?.accessToken;
      if (accessToken == null) {
        throw AuthFailure("Le jeton de connexion n'a pas été bien envoyé. Réessayer.");
      }
      await _authService.saveToken(accessToken);
    } on AuthFailure catch (_) {
      rethrow;
    } on Exception catch (e) {
      throw Exception('Failed to login: ${e.toString()}');
    }
  }
}
