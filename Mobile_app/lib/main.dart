import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'utils/theme.dart';
import 'viewmodels/auth_viewmodel.dart';
import 'viewmodels/theme_viewmodel.dart';
import 'views/login_view.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthViewModel()),
        ChangeNotifierProvider(create: (_) => ThemeViewModel()),
      ],
      child: Consumer<ThemeViewModel>(
        builder: (context, themeProvider, child) {
          return MaterialApp(
            title: 'CHESMS User App',
            debugShowCheckedModeBanner: false,
            theme: AppTheme.themeData,
            darkTheme: AppTheme.darkThemeData,
            themeMode: themeProvider.themeMode,
            home: const LoginView(),
          );
        },
      ),
    );
  }
}
