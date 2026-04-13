import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import '../models/announcement.dart';
import '../models/event.dart';
import '../models/user.dart';

class ApiService {
  static final String baseUrl = const String.fromEnvironment(
    'API_BASE_URL',
    defaultValue: 'http://127.0.0.1:5000/api',
  );

  Future<List<Announcement>> fetchAnnouncements() async {
    final uri = Uri.parse('$baseUrl/announcements');
    final response = await http.get(uri);

    if (response.statusCode != 200) {
      throw Exception('Failed to load announcements');
    }

    final jsonList = jsonDecode(response.body) as List<dynamic>;
    return jsonList.map((json) => Announcement.fromJson(json as Map<String, dynamic>)).toList();
  }

  Future<List<EventItem>> fetchEvents() async {
    final uri = Uri.parse('$baseUrl/events');
    final response = await http.get(uri);

    if (response.statusCode != 200) {
      throw Exception('Failed to load events');
    }

    final jsonList = jsonDecode(response.body) as List<dynamic>;
    return jsonList.map((json) => EventItem.fromJson(json as Map<String, dynamic>)).toList();
  }

  Future<User> register(String email, String password, String name) async {
    final response = await http.post(
      Uri.parse('$baseUrl/auth/register'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'email': email, 'password': password, 'name': name}),
    );
    if (response.statusCode == 201) {
      final data = jsonDecode(response.body);
      return User.fromJson(data['user']);
    } else {
      throw Exception('Registration failed: ${jsonDecode(response.body)['message']}');
    }
  }

  Future<Map<String, dynamic>> login(String email, String password) async {
    final response = await http.post(
      Uri.parse('$baseUrl/auth/login'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'email': email, 'password': password}),
    );
    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      return {'user': User.fromJson(data['user']), 'token': data['token']};
    } else {
      throw Exception('Login failed: ${jsonDecode(response.body)['message']}');
    }
  }

  Future<Map<String, dynamic>?> fetchNextAppointmentForUser(Map<String, dynamic>? userData) async {
    if (userData == null) return null;

    final userId = (userData['_id'] ?? userData['id'])?.toString();
    final userName = (userData['name'] ?? '').toString().trim().toLowerCase();
    final userEmail = (userData['email'] ?? '').toString().trim().toLowerCase();

    List<dynamic> schedules = [];

    final isObjectId = userId != null && RegExp(r'^[a-fA-F0-9]{24}$').hasMatch(userId);
    if (isObjectId) {
      final byPatientResponse = await http.get(Uri.parse('$baseUrl/schedules/patient/$userId'));
      if (byPatientResponse.statusCode == 200) {
        schedules = jsonDecode(byPatientResponse.body) as List<dynamic>;
      }
    }

    if (schedules.isEmpty) {
      final allResponse = await http.get(Uri.parse('$baseUrl/schedules'));
      if (allResponse.statusCode != 200) {
        throw Exception('Failed to load schedules');
      }

      final allSchedules = jsonDecode(allResponse.body) as List<dynamic>;
      schedules = allSchedules.where((item) {
        final map = item as Map<String, dynamic>;
        final patient = map['patient'] is Map<String, dynamic>
            ? map['patient'] as Map<String, dynamic>
            : <String, dynamic>{};

        final patientId = (patient['_id'] ?? '').toString();
        final patientName = (map['patientName'] ?? patient['name'] ?? '').toString().trim().toLowerCase();
        final patientEmail = (patient['email'] ?? '').toString().trim().toLowerCase();

        final idMatch = userId != null && patientId == userId;
        final nameMatch = userName.isNotEmpty && patientName == userName;
        final emailMatch = userEmail.isNotEmpty && patientEmail == userEmail;

        return idMatch || nameMatch || emailMatch;
      }).toList();
    }

    if (schedules.isEmpty) return null;

    final now = DateTime.now();
    final upcoming = schedules.where((item) {
      final map = item as Map<String, dynamic>;
      final status = (map['status'] ?? 'Pending').toString();
      final dateRaw = (map['date'] ?? '').toString();
      final parsedDate = DateTime.tryParse(dateRaw);
      if (parsedDate == null) return false;

      final appointmentDay = DateTime(parsedDate.year, parsedDate.month, parsedDate.day);
      final today = DateTime(now.year, now.month, now.day);

      return status != 'Cancelled' && status != 'Completed' && !appointmentDay.isBefore(today);
    }).toList();

    if (upcoming.isEmpty) return null;

    upcoming.sort((a, b) {
      final aDate = DateTime.tryParse((a as Map<String, dynamic>)['date']?.toString() ?? '') ?? DateTime(2100);
      final bDate = DateTime.tryParse((b as Map<String, dynamic>)['date']?.toString() ?? '') ?? DateTime(2100);
      return aDate.compareTo(bDate);
    });

    return upcoming.first as Map<String, dynamic>;
  }
}
