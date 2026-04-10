import 'dart:convert';
import 'package:http/http.dart' as http;

class AuthService {
  // Assuming 10.0.2.2 for Android emulator testing against localhost
  static const String baseUrl = 'http://10.0.2.2:5000/api';

  Future<void> login(String email, String password) async {
    // Simulate network delay
    await Future.delayed(const Duration(seconds: 2));
    
    // Simulated logic since backend authRoutes are currently empty
    if (email == 'user@test.com' && password == 'password123') {
      return; // Success
    } else if (email.isEmpty || password.isEmpty) {
      throw Exception('Fields cannot be empty.');
    } else {
      throw Exception('Invalid credentials dummy check: use user@test.com / password123');
    }
  }

  Future<void> register(String name, String email, String password) async {
    // Simulate network delay
    await Future.delayed(const Duration(seconds: 2));
    
    if (name.isEmpty || email.isEmpty || password.isEmpty) {
      throw Exception('All fields must be filled.');
    }
    
    // Simulating success
    return;
  }
}
