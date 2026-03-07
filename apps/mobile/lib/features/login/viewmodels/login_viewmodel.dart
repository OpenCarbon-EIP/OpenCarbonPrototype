import 'package:flutter/foundation.dart';
import '../data/repositories/login_repository.dart';

class LoginViewModel extends ChangeNotifier {
  LoginViewModel(this._repository);

  final LoginRepository _repository;

  bool _isLoading = false;
  String? _error;

  bool get isLoading => _isLoading;
  String? get error => _error;

  Future<void> login(String email, String password) async {
    _isLoading = true;
    _error = null;
    notifyListeners();
    try {
      await _repository.login(email, password);
    } catch (e) {
      _error = 'Une erreur est survenue.';
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
}
