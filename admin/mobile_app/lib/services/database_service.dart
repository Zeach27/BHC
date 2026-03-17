import 'package:sqflite/sqflite.dart';
import 'package:path/path.dart';
import '../models/user_model.dart';
import '../models/event_model.dart';
import '../models/prenatal_model.dart';
import '../models/immunization_model.dart';
import '../models/appointment_model.dart';

class DatabaseService {
  static final DatabaseService _instance = DatabaseService._internal();
  factory DatabaseService() => _instance;
  DatabaseService._internal();

  Database? _database;

  Future<Database> get database async {
    if (_database != null) return _database!;
    _database = await _initDatabase();
    return _database!;
  }

  Future<Database> _initDatabase() async {
    String path = join(await getDatabasesPath(), 'chems.db');
    return await openDatabase(
      path,
      version: 1,
      onCreate: _onCreate,
    );
  }

  Future<void> _onCreate(Database db, int version) async {
    await db.execute('''
      CREATE TABLE users (
        id TEXT PRIMARY KEY,
        fullName TEXT,
        birthdate TEXT,
        gender TEXT,
        address TEXT,
        phoneNumber TEXT,
        barangay TEXT,
        isPregnant INTEGER,
        numberOfChildren INTEGER,
        bloodType TEXT,
        babyName TEXT,
        babyBirthdate TEXT,
        babyGender TEXT
      )
    ''');

    await db.execute('''
      CREATE TABLE events (
        id TEXT PRIMARY KEY,
        title TEXT,
        date TEXT,
        location TEXT,
        description TEXT,
        isRegistered INTEGER
      )
    ''');

    await db.execute('''
      CREATE TABLE prenatal_records (
        id TEXT PRIMARY KEY,
        userId TEXT,
        date TEXT,
        midwifeOrDoctor TEXT,
        healthCenter TEXT,
        status TEXT
      )
    ''');

    await db.execute('''
      CREATE TABLE immunization_records (
        id TEXT PRIMARY KEY,
        userId TEXT,
        vaccineName TEXT,
        recommendedAge TEXT,
        appointmentDate TEXT,
        status TEXT
      )
    ''');

    await db.execute('''
      CREATE TABLE appointments (
        id TEXT PRIMARY KEY,
        userId TEXT,
        type TEXT,
        date TEXT,
        healthWorker TEXT,
        location TEXT,
        status TEXT
      )
    ''');
  }

  // User operations
  Future<void> insertUser(User user) async {
    final db = await database;
    await db.insert('users', user.toMap(), conflictAlgorithm: ConflictAlgorithm.replace);
  }

  Future<User?> getUser(String id) async {
    final db = await database;
    final maps = await db.query('users', where: 'id = ?', whereArgs: [id]);
    if (maps.isNotEmpty) {
      return User.fromMap(maps.first);
    }
    return null;
  }

  // Event operations
  Future<void> insertEvent(HealthEvent event) async {
    final db = await database;
    await db.insert('events', event.toMap(), conflictAlgorithm: ConflictAlgorithm.replace);
  }

  Future<List<HealthEvent>> getEvents() async {
    final db = await database;
    final maps = await db.query('events');
    return maps.map((map) => HealthEvent.fromMap(map)).toList();
  }

  // Prenatal operations
  Future<void> insertPrenatalRecord(PrenatalRecord record) async {
    final db = await database;
    await db.insert('prenatal_records', record.toMap(), conflictAlgorithm: ConflictAlgorithm.replace);
  }

  Future<List<PrenatalRecord>> getPrenatalRecords(String userId) async {
    final db = await database;
    final maps = await db.query('prenatal_records', where: 'userId = ?', whereArgs: [userId]);
    return maps.map((map) => PrenatalRecord.fromMap(map)).toList();
  }

  // Immunization operations
  Future<void> insertImmunizationRecord(ImmunizationRecord record) async {
    final db = await database;
    await db.insert('immunization_records', record.toMap(), conflictAlgorithm: ConflictAlgorithm.replace);
  }

  Future<List<ImmunizationRecord>> getImmunizationRecords(String userId) async {
    final db = await database;
    final maps = await db.query('immunization_records', where: 'userId = ?', whereArgs: [userId]);
    return maps.map((map) => ImmunizationRecord.fromMap(map)).toList();
  }

  // Appointment operations
  Future<void> insertAppointment(Appointment appointment) async {
    final db = await database;
    await db.insert('appointments', appointment.toMap(), conflictAlgorithm: ConflictAlgorithm.replace);
  }

  Future<List<Appointment>> getAppointments(String userId) async {
    final db = await database;
    final maps = await db.query('appointments', where: 'userId = ?', whereArgs: [userId]);
    return maps.map((map) => Appointment.fromMap(map)).toList();
  }
}