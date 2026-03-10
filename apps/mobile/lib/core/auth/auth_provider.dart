import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class AuthProvider extends ChangeNotifier {
  AuthProvider(this._storage) {
    _checkToken();
  }

  final FlutterSecureStorage _storage;
  bool _isAuthenticated = false;
  bool _isInitialized = false;

  bool get isAuthenticated => _isAuthenticated;
  bool get isInitialized => _isInitialized;

  Future<void> _checkToken() async {
    final token = await _storage.read(key: 'auth_token');
    _isAuthenticated = token != null;
    _isInitialized = true;
    notifyListeners();
  }

  Future<void> loginSuccess() async {
    await _checkToken();
  }

  Future<void> logout() async {
    await _storage.delete(key: 'auth_token');
    _isAuthenticated = false;
    notifyListeners();
  }
}
