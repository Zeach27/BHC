class ImmunizationRecord {
  final String id;
  final String userId;
  final String vaccineName;
  final String recommendedAge;
  final DateTime? appointmentDate;
  final String status; // 'Upcoming', 'Completed', 'Overdue'

  ImmunizationRecord({
    required this.id,
    required this.userId,
    required this.vaccineName,
    required this.recommendedAge,
    this.appointmentDate,
    required this.status,
  });

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'userId': userId,
      'vaccineName': vaccineName,
      'recommendedAge': recommendedAge,
      'appointmentDate': appointmentDate?.toIso8601String(),
      'status': status,
    };
  }

  factory ImmunizationRecord.fromMap(Map<String, dynamic> map) {
    return ImmunizationRecord(
      id: map['id'],
      userId: map['userId'],
      vaccineName: map['vaccineName'],
      recommendedAge: map['recommendedAge'],
      appointmentDate: map['appointmentDate'] != null ? DateTime.parse(map['appointmentDate']) : null,
      status: map['status'],
    );
  }
}