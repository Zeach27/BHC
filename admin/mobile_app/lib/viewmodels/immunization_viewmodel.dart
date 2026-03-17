import 'package:flutter/material.dart';
import '../models/immunization_model.dart';
import '../services/database_service.dart';

class ImmunizationViewModel extends ChangeNotifier {
  final DatabaseService _databaseService = DatabaseService();

  List<ImmunizationRecord> _records = [];
  bool _isLoading = false;

  List<ImmunizationRecord> get records => _records;
  bool get isLoading => _isLoading;

  int get completedCount => _records.where((r) => r.status == 'Completed').length;
  int get upcomingCount => _records.where((r) => r.status == 'Upcoming').length;

  Future<void> loadRecords(String userId) async {
    _isLoading = true;
    notifyListeners();

    _records = await _databaseService.getImmunizationRecords(userId);

    _isLoading = false;
    notifyListeners();
  }

  Future<void> addRecord(ImmunizationRecord record) async {
    await _databaseService.insertImmunizationRecord(record);
    _records.add(record);
    notifyListeners();
  }
}