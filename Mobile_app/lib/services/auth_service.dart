import 'dart:convert';
import 'package:http/http.dart' as http;
import 'dart:io';

class AuthService {
  static const String baseUrl = String.fromEnvironment(
    'API_BASE_URL',
    defaultValue: 'http://127.0.0.1:5000/api',
  );

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

  Future<Map<String, dynamic>> updateProfileImage(
    File imageFile,
    String token,
    String userId,
  ) async {
    final request = http.MultipartRequest(
      'POST',
      Uri.parse('$baseUrl/users/$userId/upload-profile-image'),
    );

    request.headers['Authorization'] = 'Bearer $token';
    request.files.add(await http.MultipartFile.fromPath('profileImage', imageFile.path));

    final response = await request.send();
    final responseBody = await response.stream.bytesToString();
    Map<String, dynamic>? responseData;
    try {
      responseData = jsonDecode(responseBody) as Map<String, dynamic>;
    } catch (_) {
      responseData = null;
    }

    if (response.statusCode == 200) {
      return responseData ?? <String, dynamic>{};
    } else {
      throw Exception(
        responseData?['message'] ??
            responseData?['error'] ??
            'Server error: ${response.statusCode}',
      );
    }
  }
}

