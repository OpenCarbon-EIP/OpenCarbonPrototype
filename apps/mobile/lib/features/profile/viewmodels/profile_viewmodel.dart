import 'package:flutter/material.dart';
import 'package:flutter_poc/core/errors/app_errors.dart';
import 'package:flutter_poc/features/profile/data/repositories/profile_repository.dart';
import 'package:flutter_poc/features/profile/domain/entity/profile_entity.dart';

class ProfileViewModel extends ChangeNotifier {
  ProfileViewModel(this._repository);

  final ProfileRepository _repository;

  Profile? _profile;
  bool _isLoading = false;
  String? _error;

  Profile? get profile => _profile;
  bool get isLoading => _isLoading;
  String? get error => _error;

  Future<void> fetchProfile() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      _profile = await _repository.getProfile();
    } on UnauthorizedFailure catch (e) {
      _error = e.toString();
    } on Exception catch (e) {
      _error = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

}