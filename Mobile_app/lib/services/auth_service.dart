import 'dart:convert';
import 'package:http/http.dart' as http;
import 'dart:io';

class AuthService {
  // localhost works on real Android devices when adb reverse is enabled.
  static const String baseUrl = 'http://localhost:5000/api';

  Future<Map<String, dynamic>> login(String email, String password) async {
    final response = await http.post(
      Uri.parse('$baseUrl/auth/login'),
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: jsonEncode(<String, String>{'email': email, 'password': password}),
    );

    if (response.statusCode == 200) {
      final responseData = jsonDecode(response.body);
      return responseData;
    } else if (response.statusCode == 400) {
      final responseData = jsonDecode(response.body);
      throw Exception(responseData['message'] ?? 'Invalid credentials');
    } else {
      throw Exception('Server error: ${response.statusCode}');
    }
  }

  Future<Map<String, dynamic>> register(
    String name,
    String email,
    String password,
    String role,
    String? phone,
    String? birthdate,
    String? gender,
    String? civilStatus,
    String? barangay,
    String? street,
  ) async {
    final response = await http.post(
      Uri.parse('$baseUrl/auth/register'),
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: jsonEncode(<String, dynamic>{
        'name': name,
        'email': email,
        'password': password,
        'role': role,
        'phone': phone,
        'birthdate': birthdate,
        'gender': gender,
        'civilStatus': civilStatus,
        'barangay': barangay,
        'street': street,
      }),
    );

    if (response.statusCode == 201) {
      final responseData = jsonDecode(response.body);
      return responseData;
    } else if (response.statusCode == 400) {
      final responseData = jsonDecode(response.body);
      throw Exception(responseData['message'] ?? 'Registration failed');
    } else {
      throw Exception('Server error: ${response.statusCode}');
    }
  }

  Future<Map<String, dynamic>> updateProfileImage(File imageFile, String token, String userId) async {
    final request = http.MultipartRequest(
      'POST',
      Uri.parse('$baseUrl/users/$userId/upload-profile-image'),
    );

    request.headers['Authorization'] = 'Bearer $token';
    request.files.add(await http.MultipartFile.fromPath('profileImage', imageFile.path));

    final response = await request.send();
    final responseBody = await response.stream.bytesToString();

    if (response.statusCode == 200) {
      final responseData = jsonDecode(responseBody);
      return responseData;
    } else if (response.statusCode == 400) {
      final responseData = jsonDecode(responseBody);
      throw Exception(responseData['message'] ?? 'Upload failed');
    } else {
      throw Exception('Server error: ${response.statusCode}');
    }
  }

  Future<Map<String, dynamic>> updateUser(String userId, Map<String, dynamic> data) async {
    final response = await http.put(
      Uri.parse('$baseUrl/users/$userId'),
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: jsonEncode(data),
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Failed to update user: ${response.statusCode}');
    }
  }
}

