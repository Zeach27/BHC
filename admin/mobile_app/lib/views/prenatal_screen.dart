import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../utils/constants.dart';
import '../utils/helpers.dart';
import '../viewmodels/prenatal_viewmodel.dart';

class PrenatalScreen extends StatefulWidget {
  const PrenatalScreen({super.key});

  @override
  State<PrenatalScreen> createState() => _PrenatalScreenState();
}

class _PrenatalScreenState extends State<PrenatalScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<PrenatalViewModel>().loadRecords('1');
    });
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<PrenatalViewModel>(
      builder: (context, viewModel, child) {
        return Scaffold(
          body: viewModel.isLoading
              ? const Center(child: CircularProgressIndicator())
              : viewModel.records.isEmpty
                  ? Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const Icon(
                            Icons.pregnant_woman,
                            size: 64,
                            color: AppColors.textSecondary,
                          ),
                          const SizedBox(height: 16),
                          Text(
                            'No Prenatal Records',
                            style: Theme.of(context).textTheme.titleLarge?.copyWith(
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(height: 8),
                          Text(
                            'You have no prenatal checkup records yet.\nContact your health center to schedule an appointment.',
                            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                              color: AppColors.textSecondary,
                            ),
                            textAlign: TextAlign.center,
                          ),
                        ],
                      ),
                    )
                  : ListView.builder(
                      padding: const EdgeInsets.all(16.0),
                      itemCount: viewModel.records.length,
                      itemBuilder: (context, index) {
                        final record = viewModel.records[index];
                        return Card(
                          margin: const EdgeInsets.only(bottom: 16.0),
                          child: ListTile(
                            leading: const Icon(
                              Icons.pregnant_woman,
                              color: AppColors.primary,
                            ),
                            title: Text(
                              'Checkup with ${record.midwifeOrDoctor}',
                            ),
                            subtitle: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(DateHelper.formatDate(record.date)),
                                Text(record.healthCenter),
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
                    ),
        );
      },
    );
  }
}