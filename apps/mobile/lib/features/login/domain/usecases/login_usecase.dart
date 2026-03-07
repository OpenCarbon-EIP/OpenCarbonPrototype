import '../../data/repositories/login_repository.dart';

/*
*  login_usecase.dart
*
*  This file implements the LoginUseCase class, which serves as the business logic layer for the login feature. 
*  It interacts with the LoginRepository to perform the login operation and handles any exceptions that may occur during the process.
*/
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