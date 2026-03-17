import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';
import 'utils/constants.dart';
import 'viewmodels/home_viewmodel.dart';
import 'viewmodels/events_viewmodel.dart';
import 'viewmodels/prenatal_viewmodel.dart';
import 'viewmodels/immunization_viewmodel.dart';
import 'viewmodels/profile_viewmodel.dart';
import 'views/home_screen.dart';
import 'views/events_screen.dart';
import 'views/prenatal_screen.dart';
import 'views/immunization_screen.dart';
import 'views/profile_screen.dart';
import 'views/login_screen.dart';
import 'views/signup_screen.dart';
import 'views/registration_screen.dart';
import 'views/qr_screen.dart';
import 'views/history_screen.dart';
import 'views/notification_screen.dart';
import 'views/splash_screen.dart';
import 'services/notification_service.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await NotificationService.initialize();
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => HomeViewModel()),
        ChangeNotifierProvider(create: (_) => EventsViewModel()),
        ChangeNotifierProvider(create: (_) => PrenatalViewModel()),
        ChangeNotifierProvider(create: (_) => ImmunizationViewModel()),
        ChangeNotifierProvider(create: (_) => ProfileViewModel()),
      ],
      child: MaterialApp(
        title: AppStrings.appTitle,
        theme: ThemeData(
          primaryColor: AppColors.primary,
          scaffoldBackgroundColor: AppColors.background,
          cardColor: AppColors.cardBackground,
          textTheme: GoogleFonts.poppinsTextTheme(),
          appBarTheme: AppBarTheme(
            backgroundColor: AppColors.primary,
            titleTextStyle: GoogleFonts.poppins(
              fontSize: 20,
              fontWeight: FontWeight.w600,
              color: Colors.white,
            ),
          ),
          bottomNavigationBarTheme: BottomNavigationBarThemeData(
            selectedItemColor: AppColors.primary,
            unselectedItemColor: AppColors.textSecondary,
          ),
          elevatedButtonTheme: ElevatedButtonThemeData(
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.primary,
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(AppConstants.borderRadius),
              ),
            ),
          ),
          cardTheme: const CardThemeData(
            elevation: AppConstants.cardElevation,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.all(Radius.circular(AppConstants.borderRadius)),
            ),
          ),
        ),
        home: SplashScreen(),
        routes: {
          '/home': (context) => MainScreen(),
          '/login': (context) => const LoginScreen(),
          '/signup': (context) => const SignupScreen(),
          '/registration': (context) => RegistrationScreen(),
          '/qr': (context) => const QrScreen(),
          '/history': (context) => HistoryScreen(),
          '/notifications': (context) => const NotificationScreen(),
          '/splash': (context) => SplashScreen(),
        },
      ),
    );
  }
}

class MainScreen extends StatefulWidget {
  const MainScreen({super.key});

  @override
  State<MainScreen> createState() => _MainScreenState();
}

class _MainScreenState extends State<MainScreen> {
  int _selectedIndex = 0;

  static const List<Widget> _screens = [
    HomeScreen(),
    EventsScreen(),
    PrenatalScreen(),
    ImmunizationScreen(),
  ];

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(AppStrings.appTitle),
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications),
            onPressed: () {
              Navigator.pushNamed(context, '/notifications');
            },
          ),
          PopupMenuButton<String>(
            onSelected: (value) {
              switch (value) {
                case 'profile':
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (context) => const ProfileScreen()),
                  );
                  break;
                case 'registration':
                  Navigator.pushNamed(context, '/registration');
                  break;
                case 'qr':
                  Navigator.pushNamed(context, '/qr');
                  break;
                case 'history':
                  Navigator.pushNamed(context, '/history');
                  break;
                case 'logout':
                  Navigator.pushReplacementNamed(context, '/login');
                  break;
              }
            },
            itemBuilder: (BuildContext context) => [
              const PopupMenuItem<String>(
                value: 'profile',
                child: Row(
                  children: [
                    Icon(Icons.person, size: 20),
                    SizedBox(width: 8),
                    Text('Profile'),
                  ],
                ),
              ),
              const PopupMenuItem<String>(
                value: 'registration',
                child: Row(
                  children: [
                    Icon(Icons.app_registration, size: 20),
                    SizedBox(width: 8),
                    Text('Registration'),
                  ],
                ),
              ),
              const PopupMenuItem<String>(
                value: 'qr',
                child: Row(
                  children: [
                    Icon(Icons.qr_code, size: 20),
                    SizedBox(width: 8),
                    Text('QR Code'),
                  ],
                ),
              ),
              const PopupMenuItem<String>(
                value: 'history',
                child: Row(
                  children: [
                    Icon(Icons.history, size: 20),
                    SizedBox(width: 8),
                    Text('History'),
                  ],
                ),
              ),
              const PopupMenuItem<String>(
                value: 'logout',
                child: Row(
                  children: [
                    Icon(Icons.logout, size: 20),
                    SizedBox(width: 8),
                    Text('Logout'),
                  ],
                ),
              ),
            ],
            child: const CircleAvatar(
              backgroundColor: Colors.white,
              child: Icon(Icons.person, color: AppColors.primary),
            ),
          ),
        ],
      ),
      body: _screens[_selectedIndex],
      bottomNavigationBar: BottomNavigationBar(
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.home),
            label: 'Home',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.event),
            label: 'Events',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.pregnant_woman),
            label: 'Prenatal',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.vaccines),
            label: 'Immunization',
          ),
        ],
        currentIndex: _selectedIndex,
        onTap: _onItemTapped,
      ),
    );
  }
}
