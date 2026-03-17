import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/immunization_model.dart';
import '../utils/constants.dart';
import '../viewmodels/immunization_viewmodel.dart';

class ImmunizationScreen extends StatefulWidget {
  const ImmunizationScreen({super.key});

  @override
  State<ImmunizationScreen> createState() => _ImmunizationScreenState();
}

class _ImmunizationScreenState extends State<ImmunizationScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<ImmunizationViewModel>().loadRecords('1');
    });
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<ImmunizationViewModel>(
      builder: (context, viewModel, child) {
        final vaccines = [
          {'name': 'BCG', 'age': 'At birth'},
          {'name': 'Hepatitis B', 'age': 'At birth'},
          {'name': 'DPT', 'age': '2, 4, 6 months'},
          {'name': 'Polio', 'age': '2, 4, 6 months'},
          {'name': 'Measles', 'age': '9 months'},
        ];

        return ListView.builder(
          padding: const EdgeInsets.all(16.0),
          itemCount: vaccines.length,
          itemBuilder: (context, index) {
            final vaccine = vaccines[index];
            final record = viewModel.records.cast<dynamic>().firstWhere(
              (r) => r.vaccineName == vaccine['name'],
              orElse: () => null,
            ) as ImmunizationRecord?;

            return Card(
              margin: const EdgeInsets.only(bottom: 16.0),
              child: ListTile(
                leading: const Icon(
                  Icons.vaccines,
                  color: AppColors.primary,
                ),
                title: Text(vaccine['name']!),
                subtitle: Text('Recommended age: ${vaccine['age']}'),
                trailing: Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 8,
                    vertical: 4,
                  ),
                  decoration: BoxDecoration(
                    color: record?.status == 'Completed'
                        ? AppColors.secondary
                        : record?.status == 'Upcoming'
                            ? AppColors.accent
                            : Colors.grey,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    record?.status ?? 'Not Scheduled',
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