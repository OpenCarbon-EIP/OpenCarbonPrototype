import '../../data/repositories/login_repository.dart';

class LoginUseCase {
  final LoginRepository _repository;

  LoginUseCase(this._repository);

  Future<void> call(String email, String password) async {
    try {
      return await _repository.login(email, password);
    } catch (e) {
      throw Exception('Failed to login');
    }
  }
}