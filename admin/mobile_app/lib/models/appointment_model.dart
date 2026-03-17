class Appointment {
  final String id;
  final String userId;
  final String type; // 'Prenatal', 'Immunization', 'Consultation'
  final DateTime date;
  final String healthWorker;
  final String location;
  final String status; // 'Upcoming', 'Completed'

  Appointment({
    required this.id,
    required this.userId,
    required this.type,
    required this.date,
    required this.healthWorker,
    required this.location,
    required this.status,
  });

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'userId': userId,
      'type': type,
      'date': date.toIso8601String(),
      'healthWorker': healthWorker,
      'location': location,
      'status': status,
    };
  }

  factory Appointment.fromMap(Map<String, dynamic> map) {
    return Appointment(
      id: map['id'],
      userId: map['userId'],
      type: map['type'],
      date: DateTime.parse(map['date']),
      healthWorker: map['healthWorker'],
      location: map['location'],
      status: map['status'],
    );
  }
}