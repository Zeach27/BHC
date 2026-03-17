import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../utils/constants.dart';
import '../utils/helpers.dart';
import '../viewmodels/home_viewmodel.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  @override
  void initState() {
    super.initState();
    // Load data for user '1' (mock)
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<HomeViewModel>().loadData('1');
    });
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<HomeViewModel>(
      builder: (context, viewModel, child) {
        return SingleChildScrollView(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Welcome Section
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(24.0),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [AppColors.primary, AppColors.secondary],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(AppConstants.borderRadius),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Welcome, User!',
                      style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      AppStrings.homeDescription,
                      style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                        color: Colors.white.withOpacity(0.9),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),

              // Today's Announcement
              Text(
                "Today's Announcement",
                style: Theme.of(context).textTheme.titleLarge?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 16),
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: viewModel.announcement.isEmpty
                      ? Text(
                          AppStrings.noAnnouncements,
                          style: Theme.of(context).textTheme.bodyMedium,
                        )
                      : Text(
                          viewModel.announcement,
                          style: Theme.of(context).textTheme.bodyMedium,
                        ),
                ),
              ),
              const SizedBox(height: 24),

              // Statistics Cards
              Text(
                'Dashboard',
                style: Theme.of(context).textTheme.titleLarge?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 16),
              SizedBox(
                height: 140,
                child: ListView(
                  scrollDirection: Axis.horizontal,
                  physics: const BouncingScrollPhysics(),
                  children: [
                    _buildStatCard(
                      'Upcoming Events',
                      viewModel.upcomingEventsCount.toString(),
                      Icons.event,
                    ),
                    const SizedBox(width: 12),
                    _buildStatCard(
                      'Completed Prenatal',
                      viewModel.completedPrenatalCount.toString(),
                      Icons.pregnant_woman,
                    ),
                    const SizedBox(width: 12),
                    _buildStatCard(
                      'Upcoming Vaccines',
                      viewModel.upcomingVaccinesCount.toString(),
                      Icons.vaccines,
                    ),
                    const SizedBox(width: 12),
                    _buildStatCard(
                      'Completed Vaccines',
                      viewModel.completedVaccinesCount.toString(),
                      Icons.check_circle,
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),

              // Upcoming Appointments
              Text(
                'Upcoming Appointments',
                style: Theme.of(context).textTheme.titleLarge?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 16),
              viewModel.appointments.isEmpty
                  ? Card(
                      child: Padding(
                        padding: const EdgeInsets.all(16.0),
                        child: Column(
                          children: [
                            Icon(
                              Icons.calendar_today,
                              size: 48,
                              color: AppColors.textSecondary,
                            ),
                            const SizedBox(height: 8),
                            Text(
                              AppStrings.noAppointments,
                              style: Theme.of(context).textTheme.titleMedium,
                            ),
                            const SizedBox(height: 8),
                            Text(
                              AppStrings.scheduleAppointments,
                              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                                color: AppColors.textSecondary,
                              ),
                              textAlign: TextAlign.center,
                            ),
                          ],
                        ),
                      ),
                    )
                  : ListView.builder(
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      itemCount: viewModel.appointments.length,
                      itemBuilder: (context, index) {
                        final appointment = viewModel.appointments[index];
                        return Card(
                          child: ListTile(
                            leading: Icon(
                              Icons.calendar_today,
                              color: AppColors.primary,
                            ),
                            title: Text(appointment.type),
                            subtitle: Text(
                              '${DateHelper.formatDate(appointment.date)} at ${appointment.location}',
                            ),
                            trailing: Text(
                              appointment.status,
                              style: TextStyle(
                                color: appointment.status == 'Upcoming'
                                    ? AppColors.accent
                                    : AppColors.secondary,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                        );
                      },
                    ),

            ],
          ),
        );
      },
    );
  }

  Widget _buildStatCard(String title, String count, IconData icon) {
    return SizedBox(
      width: 130,
      child: Card(
        child: Padding(
          padding: const EdgeInsets.all(12.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                icon,
                size: 24,
                color: AppColors.primary,
              ),
              const SizedBox(height: 6),
              Text(
                count,
                style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                  fontWeight: FontWeight.bold,
                  color: AppColors.primary,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                title,
                style: Theme.of(context).textTheme.bodySmall?.copyWith(
                  color: AppColors.textSecondary,
                ),
                textAlign: TextAlign.center,
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),
            ],
          ),
        ),
      ),
    );
  }
}