import 'package:flutter/material.dart';
import '../models/prenatal_model.dart';
import '../services/database_service.dart';

class PrenatalViewModel extends ChangeNotifier {
  final DatabaseService _databaseService = DatabaseService();

  List<PrenatalRecord> _records = [];
  bool _isLoading = false;

  List<PrenatalRecord> get records => _records;
  bool get isLoading => _isLoading;

  int get completedCount => _records.where((r) => r.status == 'Completed').length;
  int get upcomingCount => _records.where((r) => r.status == 'Upcoming').length;

  Future<void> loadRecords(String userId) async {
    _isLoading = true;
    notifyListeners();

    _records = await _databaseService.getPrenatalRecords(userId);

    _isLoading = false;
    notifyListeners();
  }

  Future<void> addRecord(PrenatalRecord record) async {
    await _databaseService.insertPrenatalRecord(record);
    _records.add(record);
    notifyListeners();
  }
}