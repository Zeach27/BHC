import 'package:flutter/material.dart';
import '../models/user_model.dart';
import '../services/database_service.dart';

class RegistrationScreen extends StatefulWidget {
  const RegistrationScreen({super.key});

  @override
  State<RegistrationScreen> createState() => _RegistrationScreenState();
}

class _RegistrationScreenState extends State<RegistrationScreen> {
  final _formKey = GlobalKey<FormState>();
  final _databaseService = DatabaseService();

  // Resident Information
  String _fullName = '';
  DateTime _birthdate = DateTime.now();
  String _gender = 'Female';
  String _address = '';
  String _phoneNumber = '';

  // Health Information
  bool _isPregnant = false;
  int _numberOfChildren = 0;
  String _bloodType = 'O+';

  // Baby Information
  String _babyName = '';
  DateTime _babyBirthdate = DateTime.now();
  String _babyGender = 'Female';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Registration'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Resident Information',
                style: Theme.of(context).textTheme.titleLarge?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 16),
              TextFormField(
                decoration: const InputDecoration(
                  labelText: 'Full Name',
                  border: OutlineInputBorder(),
                ),
                validator: (value) => value?.isEmpty ?? true ? 'Required' : null,
                onSaved: (value) => _fullName = value!,
              ),
              const SizedBox(height: 16),
              // Birthdate picker would go here
              DropdownButtonFormField<String>(
                value: _gender,
                decoration: const InputDecoration(
                  labelText: 'Gender',
                  border: OutlineInputBorder(),
                ),
                items: ['Male', 'Female', 'Other'].map((gender) {
                  return DropdownMenuItem(
                    value: gender,
                    child: Text(gender),
                  );
                }).toList(),
                onChanged: (value) => setState(() => _gender = value!),
              ),
              const SizedBox(height: 16),
              TextFormField(
                decoration: const InputDecoration(
                  labelText: 'Address',
                  border: OutlineInputBorder(),
                ),
                validator: (value) => value?.isEmpty ?? true ? 'Required' : null,
                onSaved: (value) => _address = value!,
              ),
              const SizedBox(height: 16),
              TextFormField(
                decoration: const InputDecoration(
                  labelText: 'Phone Number',
                  border: OutlineInputBorder(),
                ),
                validator: (value) => value?.isEmpty ?? true ? 'Required' : null,
                onSaved: (value) => _phoneNumber = value!,
              ),
              const SizedBox(height: 24),
              Text(
                'Health Information',
                style: Theme.of(context).textTheme.titleLarge?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 16),
              SwitchListTile(
                title: const Text('Are you pregnant?'),
                value: _isPregnant,
                onChanged: (value) => setState(() => _isPregnant = value),
              ),
              const SizedBox(height: 16),
              TextFormField(
                decoration: const InputDecoration(
                  labelText: 'Number of Children',
                  border: OutlineInputBorder(),
                ),
                keyboardType: TextInputType.number,
                initialValue: _numberOfChildren.toString(),
                onSaved: (value) => _numberOfChildren = int.tryParse(value!) ?? 0,
              ),
              const SizedBox(height: 16),
              DropdownButtonFormField<String>(
                value: _bloodType,
                decoration: const InputDecoration(
                  labelText: 'Blood Type',
                  border: OutlineInputBorder(),
                ),
                items: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((type) {
                  return DropdownMenuItem(
                    value: type,
                    child: Text(type),
                  );
                }).toList(),
                onChanged: (value) => setState(() => _bloodType = value!),
              ),
              if (_isPregnant) ...[
                const SizedBox(height: 24),
                Text(
                  'Baby Information',
                  style: Theme.of(context).textTheme.titleLarge?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 16),
                TextFormField(
                  decoration: const InputDecoration(
                    labelText: 'Baby Name',
                    border: OutlineInputBorder(),
                  ),
                  onSaved: (value) => _babyName = value ?? '',
                ),
                const SizedBox(height: 16),
                DropdownButtonFormField<String>(
                  value: _babyGender,
                  decoration: const InputDecoration(
                    labelText: 'Baby Gender',
                    border: OutlineInputBorder(),
                  ),
                  items: ['Male', 'Female'].map((gender) {
                    return DropdownMenuItem(
                      value: gender,
                      child: Text(gender),
                    );
                  }).toList(),
                  onChanged: (value) => setState(() => _babyGender = value!),
                ),
              ],
              const SizedBox(height: 24),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: _submitForm,
                  child: const Text('Submit'),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _submitForm() async {
    if (_formKey.currentState?.validate() ?? false) {
      _formKey.currentState?.save();

      final user = User(
        id: DateTime.now().toString(),
        fullName: _fullName,
        birthdate: _birthdate,
        gender: _gender,
        address: _address,
        phoneNumber: _phoneNumber,
        barangay: 'Sample Barangay', // Would be selected
        isPregnant: _isPregnant,
        numberOfChildren: _numberOfChildren,
        bloodType: _bloodType,
        babyName: _isPregnant ? _babyName : null,
        babyBirthdate: _isPregnant ? _babyBirthdate : null,
        babyGender: _isPregnant ? _babyGender : null,
      );

      await _databaseService.insertUser(user);

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Registration successful!')),
        );
        Navigator.pop(context);
      }
    }
  }
}