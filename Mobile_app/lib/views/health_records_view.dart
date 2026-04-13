import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../utils/theme.dart';

class HealthRecordsView extends StatelessWidget {
  const HealthRecordsView({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final textColor = Theme.of(context).textTheme.bodyLarge?.color ?? Colors.black;
    final textMutedColor = Theme.of(context).textTheme.bodyMedium?.color ?? Colors.grey;
    final primaryColor = isDark ? AppTheme.primaryLight : AppTheme.primaryBlue;

    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      appBar: AppBar(
        title: const Text('My Health Records'),
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: Icon(Icons.arrow_back, color: textColor),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: Column(
        children: [
          // Search Bar
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 8.0),
            child: Container(
              decoration: BoxDecoration(
                color: Theme.of(context).colorScheme.surface,
                borderRadius: BorderRadius.circular(16),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.04),
                    blurRadius: 10,
                    offset: const Offset(0, 4),
                  ),
                ],
                border: Border.all(
                  color: isDark ? const Color(0xFF334155) : const Color(0xFFF1F5F9),
                  width: 1.5,
                ),
              ),
              child: TextField(
                decoration: InputDecoration(
                  hintText: 'Search activities, doctors, or clinics',
                  hintStyle: GoogleFonts.inter(
                    color: textMutedColor,
                    fontSize: 15,
                  ),
                  prefixIcon: Icon(Icons.search, color: textMutedColor),
                  border: InputBorder.none,
                  enabledBorder: InputBorder.none,
                  focusedBorder: InputBorder.none,
                  contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
                ),
              ),
            ),
          ),
          
          const SizedBox(height: 16),
          
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 24.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _buildSectionHeader('TODAY', primaryColor),
                  const SizedBox(height: 12),
                  _buildRecordCard(
                    context,
                    icon: Icons.medical_services_outlined,
                    title: 'Consultation with ...',
                    subtitle: '10:30 AM • Makati Medical Center',
                    badgeText: 'Completed',
                    badgeType: _BadgeType.success,
                    primaryColor: primaryColor,
                  ),
                  const SizedBox(height: 12),
                  _buildRecordCard(
                    context,
                    icon: Icons.science_outlined,
                    title: 'Blood Test Result Uplo...',
                    subtitle: '09:15 AM • Hi-Precision Lab',
                    badgeText: 'View',
                    badgeType: _BadgeType.neutral,
                    primaryColor: primaryColor,
                  ),
                  
                  const SizedBox(height: 24),
                  _buildSectionHeader('YESTERDAY', primaryColor),
                  const SizedBox(height: 12),
                  _buildRecordCard(
                    context,
                    icon: Icons.vaccines_outlined,
                    title: 'Vaccination - Pen...',
                    subtitle: '02:00 PM • BHC City Clinic',
                    badgeText: 'Completed',
                    badgeType: _BadgeType.success,
                    primaryColor: primaryColor,
                  ),
                  
                  const SizedBox(height: 24),
                  _buildSectionHeader('LAST WEEK', primaryColor),
                  const SizedBox(height: 12),
                  _buildRecordCard(
                    context,
                    icon: Icons.receipt_long_outlined,
                    title: 'Prescription Renewal',
                    subtitle: 'Mar 08 • Dr. Sy Office',
                    badgeText: 'Pending',
                    badgeType: _BadgeType.warning,
                    primaryColor: primaryColor,
                  ),
                  const SizedBox(height: 12),
                  _buildRecordCard(
                    context,
                    icon: Icons.payments_outlined,
                    title: 'Bill Payment - Lab ...',
                    subtitle: 'Mar 06 • Online Payment',
                    badgeText: 'P1,250.00',
                    badgeType: _BadgeType.success, // Using success color for payment amounts
                    primaryColor: primaryColor,
                  ),
                  const SizedBox(height: 48),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSectionHeader(String text, Color primaryColor) {
    return Padding(
      padding: const EdgeInsets.only(left: 4.0),
      child: Text(
        text,
        style: GoogleFonts.inter(
          fontSize: 12,
          fontWeight: FontWeight.w800,
          color: primaryColor,
          letterSpacing: 1.2,
        ),
      ),
    );
  }

  Widget _buildRecordCard(
    BuildContext context, {
    required IconData icon,
    required String title,
    required String subtitle,
    required String badgeText,
    required _BadgeType badgeType,
    required Color primaryColor,
  }) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final textColor = Theme.of(context).textTheme.bodyLarge?.color ?? Colors.black;
    final textMutedColor = Theme.of(context).textTheme.bodyMedium?.color ?? Colors.grey;
    final surfaceColor = Theme.of(context).colorScheme.surface;

    // Define colors based on badge type
    Color badgeTextColor;
    Color badgeBgColor;

    switch (badgeType) {
      case _BadgeType.success:
        badgeTextColor = const Color(0xFF059669); // Emerald
        badgeBgColor = isDark ? const Color(0xFF059669).withOpacity(0.15) : const Color(0xFFD1FAE5);
        break;
      case _BadgeType.warning:
        badgeTextColor = const Color(0xFFD97706); // Amber
        badgeBgColor = isDark ? const Color(0xFFD97706).withOpacity(0.15) : const Color(0xFFFEF3C7);
        break;
      case _BadgeType.neutral:
      default:
        badgeTextColor = textMutedColor;
        badgeBgColor = isDark ? const Color(0xFF334155) : const Color(0xFFF1F5F9);
        break;
    }

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: surfaceColor,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.03),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          // Icon Container
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: isDark ? primaryColor.withOpacity(0.15) : AppTheme.primarySoft,
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(icon, color: primaryColor, size: 24),
          ),
          const SizedBox(width: 16),
          
          // Text Content
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: GoogleFonts.inter(
                    color: textColor,
                    fontSize: 15,
                    fontWeight: FontWeight.w700,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 4),
                Text(
                  subtitle,
                  style: GoogleFonts.inter(
                    color: textMutedColor,
                    fontSize: 12,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ],
            ),
          ),
          const SizedBox(width: 8),
          
          // Badge
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
            decoration: BoxDecoration(
              color: badgeBgColor,
              borderRadius: BorderRadius.circular(20),
            ),
            child: Text(
              badgeText,
              style: GoogleFonts.inter(
                color: badgeTextColor,
                fontSize: 11,
                fontWeight: FontWeight.w700,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

enum _BadgeType { success, warning, neutral }
