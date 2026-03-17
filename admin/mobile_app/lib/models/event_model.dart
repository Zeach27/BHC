class HealthEvent {
  final String id;
  final String title;
  final DateTime date;
  final String location;
  final String description;
  final bool isRegistered;

  HealthEvent({
    required this.id,
    required this.title,
    required this.date,
    required this.location,
    required this.description,
    this.isRegistered = false,
  });

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'title': title,
      'date': date.toIso8601String(),
      'location': location,
      'description': description,
      'isRegistered': isRegistered ? 1 : 0,
    };
  }

  factory HealthEvent.fromMap(Map<String, dynamic> map) {
    return HealthEvent(
      id: map['id'],
      title: map['title'],
      date: DateTime.parse(map['date']),
      location: map['location'],
      description: map['description'],
      isRegistered: map['isRegistered'] == 1,
    );
  }
}
