class User {
  final String id;
  final String fullName;
  final DateTime birthdate;
  final String gender;
  final String address;
  final String phoneNumber;
  final String barangay;
  final bool isPregnant;
  final int numberOfChildren;
  final String bloodType;
  final String? babyName;
  final DateTime? babyBirthdate;
  final String? babyGender;

  User({
    required this.id,
    required this.fullName,
    required this.birthdate,
    required this.gender,
    required this.address,
    required this.phoneNumber,
    required this.barangay,
    required this.isPregnant,
    required this.numberOfChildren,
    required this.bloodType,
    this.babyName,
    this.babyBirthdate,
    this.babyGender,
  });

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'fullName': fullName,
      'birthdate': birthdate.toIso8601String(),
      'gender': gender,
      'address': address,
      'phoneNumber': phoneNumber,
      'barangay': barangay,
      'isPregnant': isPregnant ? 1 : 0,
      'numberOfChildren': numberOfChildren,
      'bloodType': bloodType,
      'babyName': babyName,
      'babyBirthdate': babyBirthdate?.toIso8601String(),
      'babyGender': babyGender,
    };
  }

  factory User.fromMap(Map<String, dynamic> map) {
    return User(
      id: map['id'],
      fullName: map['fullName'],
      birthdate: DateTime.parse(map['birthdate']),
      gender: map['gender'],
      address: map['address'],
      phoneNumber: map['phoneNumber'],
      barangay: map['barangay'],
      isPregnant: map['isPregnant'] == 1,
      numberOfChildren: map['numberOfChildren'],
      bloodType: map['bloodType'],
      babyName: map['babyName'],
      babyBirthdate: map['babyBirthdate'] != null ? DateTime.parse(map['babyBirthdate']) : null,
      babyGender: map['babyGender'],
    );
  }
}