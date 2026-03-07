import 'package:flutter_poc/features/login/data/services/login_auth_service.dart';

import '../services/login_api_service.dart';

abstract class LoginRepository {
  Future<void> login(String email, String password);
}

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
        throw Exception('No access token received');
      }
      await _authService.saveToken(accessToken);
    } catch (e) {
      throw Exception('Failed to login');
    }
  }
}
