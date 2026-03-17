import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../utils/helpers.dart';
import '../viewmodels/profile_viewmodel.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<ProfileViewModel>().loadUser('1');
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Profile'),
      ),
      body: Consumer<ProfileViewModel>(
        builder: (context, viewModel, child) {
          if (viewModel.isLoading) {
            return const Center(child: CircularProgressIndicator());
          }

          final user = viewModel.user;
          if (user == null) {
            return const Center(child: Text('User not found'));
          }

          return SingleChildScrollView(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const CircleAvatar(
                      radius: 50,
                      child: Icon(Icons.person, size: 50),
                    ),
                    const SizedBox(width: 16),
                    IconButton(
                      icon: const Icon(Icons.notifications, size: 30),
                      onPressed: () {
                        Navigator.pushNamed(context, '/notifications');
                      },
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                Text(
                  user.fullName,
                  style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 24),
                _buildInfoCard('Age', '${DateHelper.calculateAge(user.birthdate)} years old'),
                _buildInfoCard('Address', user.address),
                _buildInfoCard('Phone', user.phoneNumber),
                _buildInfoCard('Barangay', user.barangay),
                _buildInfoCard('Blood Type', user.bloodType),
                if (user.isPregnant) ...[
                  _buildInfoCard('Pregnancy Status', 'Yes'),
                  if (user.babyName != null) _buildInfoCard('Baby Name', user.babyName!),
                  if (user.babyBirthdate != null)
                    _buildInfoCard('Baby Birthdate', DateHelper.formatDate(user.babyBirthdate!)),
                  if (user.babyGender != null) _buildInfoCard('Baby Gender', user.babyGender!),
                ],
                const SizedBox(height: 24),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: () {
                      // Edit profile functionality
                    },
                    child: const Text('Edit Profile'),
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }

  Widget _buildInfoCard(String label, String value) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12.0),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Row(
          children: [
            Text(
              '$label: ',
              style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                fontWeight: FontWeight.bold,
              ),
            ),
            Expanded(
              child: Text(
                value,
                style: Theme.of(context).textTheme.bodyLarge,
              ),
            ),
          ],
        ),
      ),
    );
  }
}