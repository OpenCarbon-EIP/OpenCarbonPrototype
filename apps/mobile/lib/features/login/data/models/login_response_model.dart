class LoginResponseModel {
  final bool success;
  final LoginResponseData? data;
  final String message;
  final String? error;
  final int? statusCode;

  LoginResponseModel({
    required this.success,
    this.data,
    required this.message,
    this.error,
    this.statusCode,
  });

  factory LoginResponseModel.fromJson(Map<String, dynamic> json) {
    return LoginResponseModel(
      success: json['success'] as bool,
      data: json['data'] != null
          ? LoginResponseData.fromJson(json['data'])
          : null,
      message: json['message'] as String,
      error: json['error'] as String?,
      statusCode: json['statusCode'] as int?,
    );
  }
}

class LoginResponseData {
  final String accessToken;
  final LoginUser user;

  LoginResponseData({
    required this.accessToken,
    required this.user,
  });

  factory LoginResponseData.fromJson(Map<String, dynamic> json) {
    return LoginResponseData(
      accessToken: json['access_token'],
      user: LoginUser.fromJson(json['user']),
    );
  }
}

class LoginUser {
  final String id;
  final String email;
  final String role;
  final String name;

  LoginUser({
    required this.id,
    required this.email,
    required this.role,
    required this.name,
  });

  factory LoginUser.fromJson(Map<String, dynamic> json) {
    return LoginUser(
      id: json['id'],
      email: json['email'],
      role: json['role'],
      name: json['name'],
    );
  }
}