import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../utils/theme.dart';
import '../viewmodels/theme_viewmodel.dart';
import '../viewmodels/auth_viewmodel.dart';
import 'login_view.dart';

class ProfileView extends StatelessWidget {
  const ProfileView({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      body: SingleChildScrollView(
        child: Column(
          children: [
            _buildProfileHeader(context),
            Padding(
              padding: const EdgeInsets.all(20.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  _buildIDCard(context),
                  const SizedBox(height: 24),
                  _buildMenuSection(context, 'ACCOUNT & RECORDS', [
                    _MenuOption(icon: Icons.person_outline, label: 'Personal Information', onTap: () {}),
                    _MenuOption(icon: Icons.folder_shared_outlined, label: 'My Health Records', onTap: () {}),
                    _MenuOption(icon: Icons.family_restroom, label: 'Family Members', onTap: () {}),
                  ]),
                  const SizedBox(height: 24),
                  _buildMenuSection(context, 'SETTINGS', [
                    _MenuOption(icon: Icons.notifications_outlined, label: 'Notifications', onTap: () {}),
                    _MenuOption(icon: Icons.language, label: 'Language (Tagalog/English)', onTap: () {}),
                    _MenuOption(icon: Icons.lock_outline, label: 'Privacy & Security', onTap: () {}),
                    _MenuOption(
                        icon: Icons.dark_mode_outlined,
                        label: 'Dark Mode',
                        trailing: Consumer<ThemeViewModel>(
                          builder: (context, themeProvider, child) {
                            return Switch(
                              value: themeProvider.themeMode == ThemeMode.dark,
                              onChanged: (val) {
                                themeProvider.toggleTheme();
                              },
                              activeColor: AppTheme.primaryBlue,
                            );
                          },
                        ),
                        onTap: () {
                          context.read<ThemeViewModel>().toggleTheme();
                        }),
                  ]),
                  const SizedBox(height: 24),
                  _buildMenuSection(context, 'SUPPORT', [
                    _MenuOption(icon: Icons.help_outline, label: 'Help Center & FAQs', onTap: () {}),
                    _MenuOption(icon: Icons.feedback_outlined, label: 'Submit Feedback', onTap: () {}),
                  ]),
                  const SizedBox(height: 32),
                  _buildLogoutButton(context),
                  const SizedBox(height: 48),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildProfileHeader(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: AppTheme.primaryBlue,
        gradient: AppTheme.primaryGradient,
        borderRadius: const BorderRadius.only(
          bottomLeft: Radius.circular(32),
          bottomRight: Radius.circular(32),
        ),
        boxShadow: [
          BoxShadow(
            color: AppTheme.primaryBlue.withOpacity(0.3),
            blurRadius: 15,
            offset: const Offset(0, 8),
          )
        ],
      ),
      padding: const EdgeInsets.fromLTRB(20, 60, 20, 40),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'My Profile',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 24,
                  fontWeight: FontWeight.w800,
                ),
              ),
              IconButton(
                icon: const Icon(Icons.edit, color: Colors.white),
                onPressed: () {},
                style: IconButton.styleFrom(backgroundColor: Colors.white.withOpacity(0.2)),
              )
            ],
          ),
          const SizedBox(height: 24),
          Row(
            children: [
              Container(
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  border: Border.all(color: Colors.white, width: 3),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.1),
                      blurRadius: 10,
                      offset: const Offset(0, 4),
                    )
                  ],
                ),
                child: const CircleAvatar(
                  radius: 40,
                  backgroundImage: NetworkImage('https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=250&auto=format&fit=crop'),
                  backgroundColor: Colors.white,
                ),
              ),
              const SizedBox(width: 20),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Maria Santos',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 22,
                        fontWeight: FontWeight.w800,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      'Purok 4, Barangay San Jose',
                      style: TextStyle(
                        color: Colors.white.withOpacity(0.8),
                        fontSize: 13,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(
                        color: const Color(0xFF34D399).withOpacity(0.2), // Light green tint
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: const [
                          Icon(Icons.check_circle, color: Color(0xFF34D399), size: 14),
                          SizedBox(width: 6),
                          Text(
                            'Verified Resident',
                            style: TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.w700),
                          )
                        ],
                      ),
                    )
                  ],
                ),
              )
            ],
          )
        ],
      ),
    );
  }

  Widget _buildIDCard(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surface,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.04),
            blurRadius: 10,
            offset: const Offset(0, 4),
          )
        ],
      ),
      padding: const EdgeInsets.all(20),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: AppTheme.primaryBlue.withOpacity(0.1),
              borderRadius: BorderRadius.circular(12),
            ),
            child: const Icon(Icons.qr_code_2, color: AppTheme.primaryBlue, size: 28),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Health ID: CHEMS-2025-001',
                  style: TextStyle(
                    color: Theme.of(context).textTheme.bodyLarge?.color,
                    fontSize: 14,
                    fontWeight: FontWeight.w800,
                  ),
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 4),
                Text(
                  'Tap to view digital ID barcode',
                  style: TextStyle(
                    color: Theme.of(context).textTheme.bodyMedium?.color,
                    fontSize: 11,
                    fontWeight: FontWeight.w500,
                  ),
                  overflow: TextOverflow.ellipsis,
                ),
              ],
            ),
          ),
          const SizedBox(width: 8),
          Icon(Icons.chevron_right, color: Theme.of(context).textTheme.bodyMedium?.color),
        ],
      ),
    );
  }

  Widget _buildMenuSection(BuildContext context, String title, List<_MenuOption> options) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.only(left: 8, bottom: 8),
          child: Text(
            title,
            style: TextStyle(
              color: Theme.of(context).textTheme.bodyMedium?.color,
              fontSize: 11,
              fontWeight: FontWeight.w800,
              letterSpacing: 1.0,
            ),
          ),
        ),
        Container(
          decoration: BoxDecoration(
            color: Theme.of(context).colorScheme.surface,
            borderRadius: BorderRadius.circular(20),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.04),
                blurRadius: 10,
                offset: const Offset(0, 4),
              )
            ],
          ),
          child: Column(
            children: List.generate(options.length, (index) {
              final isLast = index == options.length - 1;
              return Column(
                children: [
                  ListTile(
                    leading: Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: Theme.of(context).scaffoldBackgroundColor,
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Icon(options[index].icon, color: Theme.of(context).textTheme.bodyMedium?.color, size: 20),
                    ),
                    title: Text(
                      options[index].label,
                      style: TextStyle(
                        color: Theme.of(context).textTheme.bodyLarge?.color,
                        fontSize: 14,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                    trailing: options[index].trailing ?? Icon(Icons.chevron_right, color: Theme.of(context).textTheme.bodyMedium?.color),
                    onTap: options[index].onTap,
                    contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
                  ),
                  if (!isLast)
                    Divider(height: 1, indent: 60, endIndent: 16, color: Theme.of(context).textTheme.bodyMedium?.color?.withOpacity(0.1)),
                ],
              );
            }),
          ),
        ),
      ],
    );
  }

  Widget _buildLogoutButton(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return ElevatedButton(
      style: ElevatedButton.styleFrom(
        backgroundColor: isDark ? const Color(0xFF7f1d1d) : const Color(0xFFFEE2E2), 
        foregroundColor: isDark ? const Color(0xFFfecaca) : const Color(0xFFDC2626), 
        elevation: 0,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        padding: const EdgeInsets.symmetric(vertical: 16),
      ),
      onPressed: () async {
        final viewModel = context.read<AuthViewModel>();
        await viewModel.logout();
        if (context.mounted) {
           Navigator.of(context).pushAndRemoveUntil(
             MaterialPageRoute(builder: (_) => const LoginView()),
             (route) => false,
           );
        }
      },
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: const [
          Icon(Icons.logout, size: 20),
          SizedBox(width: 8),
          Text(
            'Log Out',
            style: TextStyle(
              fontSize: 15,
              fontWeight: FontWeight.w800,
            ),
          ),
        ],
      ),
    );
  }
}

class _MenuOption {
  final IconData icon;
  final String label;
  final VoidCallback onTap;
  final Widget? trailing;

  _MenuOption({required this.icon, required this.label, required this.onTap, this.trailing});
}
