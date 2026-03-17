import 'package:flutter/material.dart';
import '../models/user_model.dart';
import '../services/database_service.dart';

class ProfileViewModel extends ChangeNotifier {
  final DatabaseService _databaseService = DatabaseService();

  bool _isLoading = false;
  User? _user;

  bool get isLoading => _isLoading;
  User? get user => _user;

  Future<void> loadUser(String userId) async {
    _isLoading = true;
    notifyListeners();

    try {
      _user = await _databaseService.getUser(userId);
    } catch (_) {
      _user = null;
    }

    _isLoading = false;
    notifyListeners();
  }

  Future<void> updateProfile(User user) async {
    await _databaseService.insertUser(user);
    _user = user;
    notifyListeners();
  }
}
