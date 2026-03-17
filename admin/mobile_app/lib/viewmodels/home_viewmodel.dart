import 'package:flutter/material.dart';
import '../models/appointment_model.dart';
import '../models/event_model.dart';
import '../services/api_service.dart';

class HomeViewModel extends ChangeNotifier {
  final ApiService _apiService = ApiService();

  List<HealthEvent> _events = [];
  List<Appointment> _appointments = [];
  String _announcement = '';

  List<HealthEvent> get events => _events;
  List<Appointment> get appointments => _appointments;
  String get announcement => _announcement;

  int get upcomingEventsCount =>
      _events.where((e) => e.date.isAfter(DateTime.now())).length;

  int get completedPrenatalCount => _appointments
      .where((a) => a.type.toLowerCase() == 'prenatal' && a.status.toLowerCase() == 'completed')
      .length;

  int get upcomingVaccinesCount => _appointments
      .where((a) => a.type.toLowerCase() == 'immunization' && a.status.toLowerCase() == 'upcoming')
      .length;

  int get completedVaccinesCount => _appointments
      .where((a) => a.type.toLowerCase() == 'immunization' && a.status.toLowerCase() == 'completed')
      .length;

  Future<void> loadData(String userId) async {
    _events = await _apiService.fetchEvents();
    _appointments = await _apiService.fetchAppointments(userId);

    try {
      final announcements = await ApiService.getAnnouncements();
      if (announcements.isNotEmpty) {
        _announcement = announcements.first.toString();
      }
    } catch (_) {
      _announcement = 'Welcome to your health dashboard!';
    }

    notifyListeners();
  }
}
