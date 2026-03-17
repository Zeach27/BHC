class PrenatalRecord {
  final String id;
  final String userId;
  final DateTime date;
  final String midwifeOrDoctor;
  final String healthCenter;
  final String status; // 'Upcoming' or 'Completed'

  PrenatalRecord({
    required this.id,
    required this.userId,
    required this.date,
    required this.midwifeOrDoctor,
    required this.healthCenter,
    required this.status,
  });

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'userId': userId,
      'date': date.toIso8601String(),
      'midwifeOrDoctor': midwifeOrDoctor,
      'healthCenter': healthCenter,
      'status': status,
    };
  }

  factory PrenatalRecord.fromMap(Map<String, dynamic> map) {
    return PrenatalRecord(
      id: map['id'],
      userId: map['userId'],
      date: DateTime.parse(map['date']),
      midwifeOrDoctor: map['midwifeOrDoctor'],
      healthCenter: map['healthCenter'],
      status: map['status'],
    );
  }
}