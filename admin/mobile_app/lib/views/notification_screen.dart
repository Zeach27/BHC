import 'package:flutter/material.dart';

class NotificationScreen extends StatelessWidget {
  const NotificationScreen({super.key});

  @override
  Widget build(BuildContext context) {
    // Mock notifications data
    final notifications = [
      {'title': 'Appointment Reminder', 'message': 'You have an appointment tomorrow at 10 AM.', 'time': '2 hours ago'},
      {'title': 'Vaccination Due', 'message': 'Your child\'s vaccination is due next week.', 'time': '1 day ago'},
      {'title': 'Prenatal Checkup', 'message': 'Schedule your prenatal checkup.', 'time': '3 days ago'},
    ];

    return Scaffold(
      appBar: AppBar(
        title: const Text('Notifications'),
      ),
      body: ListView.builder(
        itemCount: notifications.length,
        itemBuilder: (context, index) {
          final notification = notifications[index];
          return ListTile(
            leading: const Icon(Icons.notifications),
            title: Text(notification['title']!),
            subtitle: Text(notification['message']!),
            trailing: Text(notification['time']!),
          );
        },
      ),
    );
  }
}