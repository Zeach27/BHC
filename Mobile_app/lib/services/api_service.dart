import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import '../models/announcement.dart';
import '../models/event.dart';
import '../models/user.dart';

class ApiService {
  static final String baseUrl = Platform.isAndroid
  ? 'http://localhost:5000/api'
      : 'http://localhost:5000/api';

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
    // TODO: Implement backend integration for fetching the user's next appointment
    return null;
  }
}
