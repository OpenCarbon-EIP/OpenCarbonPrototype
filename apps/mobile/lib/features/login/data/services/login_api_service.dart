import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/login_response_model.dart';

/*
*  login_api_service.dart
*  This file implements the LoginApiService class, which is responsible 
*  for making HTTP requests to the login endpoint of the API. 
*  
*  It uses the http package to send a POST request with the user's email and password, 
*  and it parses the response into a LoginResponseModel.
*/
class LoginApiService {
  LoginApiService(this._httpClient);

  final http.Client _httpClient;

  Future<LoginResponseModel> login(String email, String password) async {
    final uri = Uri.http('localhost:3000', '/auth/login');
    final response = await _httpClient.post(uri, body: {
      'email': email,
      'password': password,
    });

    if (response.statusCode != 200) {
      throw Exception(response.statusCode);
    }
    final data = json.decode(response.body);
    return LoginResponseModel.fromJson(data);
  }
}