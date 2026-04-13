import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../viewmodels/auth_viewmodel.dart';
import '../utils/theme.dart';

class EditPersonalInfoView extends StatefulWidget {
  const EditPersonalInfoView({Key? key}) : super(key: key);

  @override
  State<EditPersonalInfoView> createState() => _EditPersonalInfoViewState();
}

class _EditPersonalInfoViewState extends State<EditPersonalInfoView> {
  late TextEditingController _nameCtrl;
  late TextEditingController _phoneCtrl;
  late TextEditingController _birthdateCtrl;
  late TextEditingController _genderCtrl;
  late TextEditingController _civilStatusCtrl;
  late TextEditingController _barangayCtrl;

  @override
  void initState() {
    super.initState();
    final authViewModel = Provider.of<AuthViewModel>(context, listen: false);
    final userData = authViewModel.userData;

    _nameCtrl = TextEditingController(text: userData?['name'] ?? '');
    _phoneCtrl = TextEditingController(text: userData?['phone'] ?? '');
    _birthdateCtrl = TextEditingController(text: userData?['birthdate'] ?? '');
    _genderCtrl = TextEditingController(text: userData?['gender'] ?? '');
    _civilStatusCtrl = TextEditingController(text: userData?['civilStatus'] ?? '');
    _barangayCtrl = TextEditingController(text: userData?['barangay'] ?? '');
  }

  @override
  void dispose() {
    _nameCtrl.dispose();
    _phoneCtrl.dispose();
    _birthdateCtrl.dispose();
    _genderCtrl.dispose();
    _civilStatusCtrl.dispose();
    _barangayCtrl.dispose();
    super.dispose();
  }

  Future<void> _selectDate(BuildContext context) async {
    DateTime initialDate = DateTime.now();
    try {
      if (_birthdateCtrl.text.isNotEmpty) {
        initialDate = DateTime.parse(_birthdateCtrl.text);
      }
    } catch (_) {}

    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: initialDate,
      firstDate: DateTime(1900),
      lastDate: DateTime.now(),
      builder: (context, child) {
        return Theme(
          data: Theme.of(context).copyWith(
            colorScheme: ColorScheme.light(
              primary: AppTheme.primaryBlue,
            ),
          ),
          child: child!,
        );
      },
    );

    if (picked != null) {
      setState(() {
        _birthdateCtrl.text = "\${picked.year}-\${picked.month.toString().padLeft(2, '0')}-\${picked.day.toString().padLeft(2, '0')}";
      });
    }
  }

  void _submit() async {
    final viewModel = Provider.of<AuthViewModel>(context, listen: false);

    final newData = {
      'name': _nameCtrl.text.trim(),
      'phone': _phoneCtrl.text.trim(),
      'birthdate': _birthdateCtrl.text.trim(),
      'gender': _genderCtrl.text.trim(),
      'civilStatus': _civilStatusCtrl.text.trim(),
      'barangay': _barangayCtrl.text.trim(),
    };

    final success = await viewModel.updateProfile(newData);

    if (!mounted) return;

    if (success) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Profile updated successfully'), backgroundColor: Colors.green),
      );
      Navigator.pop(context);
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(viewModel.errorMessage ?? 'Update failed'), backgroundColor: Colors.red),
      );
    }
  }

  Widget _buildTextField(String label, TextEditingController controller, {bool readOnly = false, VoidCallback? onTap}) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: TextStyle(
            color: Theme.of(context).textTheme.bodyLarge?.color,
            fontSize: 13,
            fontWeight: FontWeight.w600,
          ),
        ),
        const SizedBox(height: 8),
        TextFormField(
          controller: controller,
          readOnly: readOnly,
          onTap: onTap,
          style: TextStyle(color: Theme.of(context).textTheme.bodyLarge?.color, fontSize: 15),
          decoration: InputDecoration(
            filled: true,
            fillColor: isDark ? Theme.of(context).colorScheme.surface : const Color(0xFFE2E8F0).withOpacity(0.5),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: BorderSide.none,
            ),
            contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
          ),
        ),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    final viewModel = Provider.of<AuthViewModel>(context);
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      appBar: AppBar(
        title: Text(
          'Edit Information',
          style: TextStyle(color: isDark ? Colors.white : AppTheme.primaryBlue, fontWeight: FontWeight.w800, fontSize: 18),
        ),
        backgroundColor: Theme.of(context).scaffoldBackgroundColor,
        elevation: 0,
        iconTheme: IconThemeData(color: isDark ? Colors.white : AppTheme.primaryBlue),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            _buildTextField('Full Name', _nameCtrl),
            const SizedBox(height: 20),
            _buildTextField('Mobile Number', _phoneCtrl),
            const SizedBox(height: 20),
            _buildTextField(
              'Date of Birth',
              _birthdateCtrl,
              readOnly: true,
              onTap: () => _selectDate(context),
            ),
            const SizedBox(height: 20),
            _buildTextField('Gender', _genderCtrl),
            const SizedBox(height: 20),
            _buildTextField('Civil Status', _civilStatusCtrl),
            const SizedBox(height: 20),
            _buildTextField('Barangay', _barangayCtrl),
            
            const SizedBox(height: 48),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: viewModel.isLoading ? null : _submit,
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.primaryBlue,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  elevation: 0,
                ),
                child: viewModel.isLoading
                    ? const SizedBox(width: 24, height: 24, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                    : const Text(
                        'Update Information',
                        style: TextStyle(fontWeight: FontWeight.w800, fontSize: 16),
                      ),
              ),
            ),
            const SizedBox(height: 40),
          ],
        ),
      ),
    );
  }
}
