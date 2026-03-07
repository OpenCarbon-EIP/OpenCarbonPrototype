class OfferModel {
  final bool success;
  final OfferData? data;
  final String message;
  final String? error;
  final int? statusCode;

  OfferModel({
    required this.success,
    this.data,
    required this.message,
    this.error,
    this.statusCode,
  });

  factory OfferModel.fromJson(Map<String, dynamic> json) {
    return OfferModel(
      success: json['success'] as bool,
      data: json['data'] != null
          ? OfferData.fromJson(json['data'])
          : null,
      message: json['message'] as String,
      error: json['error'] as String?,
      statusCode: json['statusCode'] as int?,
    );
  }
}

class OfferData {
  final String id;
  final String title;
  final String description;
  final double budget;
  final String deadline;
  final String status;
  final String location;
  final String idCompany;
  final CompanyData? company;

  OfferData({
    required this.id,
    required this.title,
    required this.description,
    required this.budget,
    required this.deadline,
    required this.status,
    required this.location,
    required this.idCompany,
    this.company,
  });

  factory OfferData.fromJson(Map<String, dynamic> json) {
    return OfferData(
      id: json['id'] as String,
      title: json['title'] as String,
      description: json['description'] as String,
      budget: (json['budget'] as num).toDouble(),
      deadline: json['deadline'] as String,
      status: json['status'] as String,
      location: json['location'] as String,
      idCompany: json['id_company'] as String,
    );
  }
}

class CompanyData {
  final String id;
  final String companyName;
  final String industrySector;
  final int companySize;
  final String description;
  final String logoUrl;
  final String idUser;
  final UserData? user;

  CompanyData({
    required this.id,
    required this.companyName,
    required this.industrySector,
    required this.companySize,
    required this.description,
    required this.logoUrl,
    required this.idUser,
    this.user,
  });

  factory CompanyData.fromJson(Map<String, dynamic> json) {
    return CompanyData(
      id: json['id'] as String,
      companyName: json['company_name'] as String,
      industrySector: json['industry_sector'] as String,
      companySize: json['company_size'] as int,
      description: json['description'] as String,
      logoUrl: json['logo_url'] as String,
      idUser: json['id_user'] as String,
      user: json['user'] != null ? UserData.fromJson(json['user']) : null,
    );
  }
}

class UserData {
  final String id;
  final String email;
  final String role;
  final String name;

  UserData({
    required this.id,
    required this.email,
    required this.role,
    required this.name,
  });

  factory UserData.fromJson(Map<String, dynamic> json) {
    return UserData(
      id: json['id'] as String,
      email: json['email'] as String,
      role: json['role'] as String,
      name: json['name'] as String,
    );
  }
}