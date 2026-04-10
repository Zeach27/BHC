import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import '../models/announcement.dart';
import '../models/event.dart';

class ApiService {
  static final String baseUrl = Platform.isAndroid
      ? 'http://10.0.2.2:5000/api'
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
}
