import 'package:flutter/material.dart';
import '../models/event_model.dart';
import '../services/api_service.dart';

class EventsViewModel extends ChangeNotifier {
  final ApiService _apiService = ApiService();

  List<HealthEvent> _events = [];
  bool _isLoading = false;

  List<HealthEvent> get events => _events;
  bool get isLoading => _isLoading;

  Future<void> loadEvents() async {
    _isLoading = true;
    notifyListeners();

    _events = await _apiService.fetchEvents();

    _isLoading = false;
    notifyListeners();
  }

  Future<void> registerForEvent(String eventId) async {
    // Mock registration
    final eventIndex = _events.indexWhere((e) => e.id == eventId);
    if (eventIndex != -1) {
      _events[eventIndex] = HealthEvent(
        id: _events[eventIndex].id,
        title: _events[eventIndex].title,
        date: _events[eventIndex].date,
        location: _events[eventIndex].location,
        description: _events[eventIndex].description,
        isRegistered: true,
      );
      notifyListeners();
    }
  }
}