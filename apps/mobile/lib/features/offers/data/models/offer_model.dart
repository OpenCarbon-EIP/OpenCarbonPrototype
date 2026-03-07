class OfferModel {
  final String id;
  final String title;
  final String deadline;
  final String description;
  final String idCompany;
  final String location;
  final int budget;

  OfferModel({
    required this.id,
    required this.title,
    required this.deadline,
    required this.description,
    required this.idCompany,
    required this.location,
    required this.budget,
  });

  factory OfferModel.fromJson(Map<String, dynamic> json) {
    return OfferModel(
      id: json['id'] as String,
      title: json['title'] as String,
      deadline: json['deadline'] as String,
      description: json['description'] as String,
      idCompany: json['id_company'] as String,
      location: json['location'] as String,
      budget: json['budget'] as int,
    );
  }
}