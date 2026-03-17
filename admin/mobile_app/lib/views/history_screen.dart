import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../utils/constants.dart';
import '../utils/helpers.dart';
import '../viewmodels/prenatal_viewmodel.dart';
import '../viewmodels/immunization_viewmodel.dart';

class HistoryScreen extends StatefulWidget {
  const HistoryScreen({super.key});

  @override
  State<HistoryScreen> createState() => _HistoryScreenState();
}

class _HistoryScreenState extends State<HistoryScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<PrenatalViewModel>().loadRecords('1');
      context.read<ImmunizationViewModel>().loadRecords('1');
    });
  }

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 2,
      child: Scaffold(
        appBar: AppBar(
          title: const Text('Health History'),
          bottom: const TabBar(
            tabs: [
              Tab(text: 'Prenatal'),
              Tab(text: 'Immunization'),
            ],
          ),
        ),
        body: TabBarView(
          children: [
            _buildPrenatalHistory(),
            _buildImmunizationHistory(),
          ],
        ),
      ),
    );
  }

  Widget _buildPrenatalHistory() {
    return Consumer<PrenatalViewModel>(
      builder: (context, viewModel, child) {
        if (viewModel.isLoading) {
          return const Center(child: CircularProgressIndicator());
        }

        return ListView.builder(
          padding: const EdgeInsets.all(16.0),
          itemCount: viewModel.records.length,
          itemBuilder: (context, index) {
            final record = viewModel.records[index];
            return Card(
              margin: const EdgeInsets.only(bottom: 12.0),
              child: ListTile(
                leading: Icon(
                  Icons.pregnant_woman,
                  color: AppColors.primary,
                ),
                title: Text('Prenatal Checkup'),
                subtitle: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(DateHelper.formatDate(record.date)),
                    Text('Health Worker: ${record.midwifeOrDoctor}'),
                    Text('Location: ${record.healthCenter}'),
                  ],
                ),
                trailing: Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 8,
                    vertical: 4,
                  ),
                  decoration: BoxDecoration(
                    color: record.status == 'Completed'
                        ? AppColors.secondary
                        : AppColors.accent,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    record.status,
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 12,
                    ),
                  ),
                ),
              ),
            );
          },
        );
      },
    );
  }

  Widget _buildImmunizationHistory() {
    return Consumer<ImmunizationViewModel>(
      builder: (context, viewModel, child) {
        if (viewModel.isLoading) {
          return const Center(child: CircularProgressIndicator());
        }

        return ListView.builder(
          padding: const EdgeInsets.all(16.0),
          itemCount: viewModel.records.length,
          itemBuilder: (context, index) {
            final record = viewModel.records[index];
            return Card(
              margin: const EdgeInsets.only(bottom: 12.0),
              child: ListTile(
                leading: Icon(
                  Icons.vaccines,
                  color: AppColors.primary,
                ),
                title: Text(record.vaccineName),
                subtitle: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Recommended Age: ${record.recommendedAge}'),
                    if (record.appointmentDate != null)
                      Text('Date: ${DateHelper.formatDate(record.appointmentDate!)}'),
                  ],
                ),
                trailing: Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 8,
                    vertical: 4,
                  ),
                  decoration: BoxDecoration(
                    color: record.status == 'Completed'
                        ? AppColors.secondary
                        : record.status == 'Upcoming'
                            ? AppColors.accent
                            : Colors.grey,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    record.status,
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 12,
                    ),
                  ),
                ),
              ),
            );
          },
        );
      },
    );
  }
}