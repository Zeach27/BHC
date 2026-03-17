import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/event_model.dart';
import '../models/appointment_model.dart';

class ApiService {
  // Your backend server IP — must be reachable from your device/emulator
  static const String baseUrl = "http://192.168.1.10:5000/api";

  // ----------------- PATIENTS -----------------
  static Future<List<dynamic>> getPatients() async {
    final uri = Uri.parse("$baseUrl/patients");
    final response = await http.get(uri);
    if (response.statusCode == 200) return json.decode(response.body);
    throw Exception("Failed to load patients");
  }

  static Future<dynamic> addPatient(Map<String, dynamic> data) async {
    final uri = Uri.parse("$baseUrl/patients/add");
    final response = await http.post(
      uri,
      headers: {"Content-Type": "application/json"},
      body: json.encode(data),
    );
    if (response.statusCode == 200) return json.decode(response.body);
    throw Exception("Failed to add patient");
  }

  // ----------------- EVENTS -----------------
  Future<List<HealthEvent>> fetchEvents() async {
    final uri = Uri.parse("$baseUrl/events");
    final response = await http.get(uri);
    if (response.statusCode == 200) {
      final List<dynamic> data = json.decode(response.body);
      return data.map((e) => HealthEvent.fromMap(e)).toList();
    }
    throw Exception("Failed to fetch events");
  }

  // ----------------- APPOINTMENTS -----------------
  Future<List<Appointment>> fetchAppointments(String userId) async {
    final uri = Uri.parse("$baseUrl/appointments?userId=$userId");
    final response = await http.get(uri);
    if (response.statusCode == 200) {
      final List<dynamic> data = json.decode(response.body);
      return data.map((a) => Appointment.fromMap(a)).toList();
    }
    throw Exception("Failed to fetch appointments");
  }

  static Future<dynamic> bookAppointment(Map<String, dynamic> data) async {
    final uri = Uri.parse("$baseUrl/appointments/book");
    final response = await http.post(
      uri,
      headers: {"Content-Type": "application/json"},
      body: json.encode(data),
    );
    if (response.statusCode == 200) return json.decode(response.body);
    throw Exception("Failed to book appointment");
  }

  // ----------------- ANNOUNCEMENTS -----------------
  static Future<List<dynamic>> getAnnouncements() async {
    final uri = Uri.parse("$baseUrl/announcements");
    final response = await http.get(uri);
    if (response.statusCode == 200) return json.decode(response.body);
    throw Exception("Failed to load announcements");
  }
}