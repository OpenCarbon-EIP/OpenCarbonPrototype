import 'dart:convert';

import 'package:http/http.dart' as http;
import '../models/login_response_model.dart';

class LoginApiService {
  LoginApiService(this._httpClient);

  final http.Client _httpClient;

  Future<LoginResponseModel> login(String email, String password) async {
    print("Je suis dans le service");
    print(email);
    print(password);
    final uri = Uri.http('localhost:3000', '/auth/login'); // adapte l’URL
    final response = await _httpClient.post(uri, body: {
      'email': email,
      'password': password,
    });

    if (response.statusCode != 200) {
      throw Exception(response.statusCode);
    }
    print(response.body + "Voici la réponse du serveur");
    final data = json.decode(response.body);
    print("J'ai réussi");
    return LoginResponseModel.fromJson(data);
  }
}