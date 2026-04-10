import 'package:flutter/material.dart';
import '../models/announcement.dart';
import '../models/event.dart';
import '../services/api_service.dart';
import '../utils/theme.dart';
import 'news_details_view.dart';

class HomeView extends StatefulWidget {
  const HomeView({super.key});

  @override
  State<HomeView> createState() => _HomeViewState();
}

class _HomeViewState extends State<HomeView> {
  Announcement? _healthAlert;
  EventItem? _nextEvent;
  bool _isLoading = true;
  bool _hasError = false;
  String? _errorMessage;

  @override
  void initState() {
    super.initState();
    _loadHomeContent();
  }

  Future<void> _loadHomeContent() async {
    try {
      final announcements = await ApiService().fetchAnnouncements();
      final events = await ApiService().fetchEvents();

      final healthAlerts = announcements
          .where((item) => item.category == 'Health Alert')
          .toList();
      healthAlerts.sort((a, b) => b.createdAt.compareTo(a.createdAt));

      final upcomingEvents = events.where((event) {
        final date = _parseDate(event.date);
        return date != null && !date.isBefore(DateTime.now());
      }).toList();
      upcomingEvents.sort((a, b) {
        final aDate = _parseDate(a.date) ?? DateTime(2100);
        final bDate = _parseDate(b.date) ?? DateTime(2100);
        return aDate.compareTo(bDate);
      });

      setState(() {
        _healthAlert = healthAlerts.isNotEmpty ? healthAlerts.first : null;
        _nextEvent = upcomingEvents.isNotEmpty ? upcomingEvents.first : (events.isNotEmpty ? events.first : null);
        _isLoading = false;
        _hasError = false;
        _errorMessage = null;
      });
    } catch (error) {
      setState(() {
        _isLoading = false;
        _hasError = true;
        _errorMessage = error.toString();
      });
    }
  }

  Future<void> _refreshHome() async {
    await _loadHomeContent();
  }

  DateTime? _parseDate(String? dateString) {
    if (dateString == null || dateString.isEmpty) return null;
    return DateTime.tryParse(dateString);
  }

  String _formatEventDate(EventItem event) {
    final date = _parseDate(event.date);
    if (date == null) {
      return 'TBA';
    }
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ];
    final month = months[date.month - 1];
    final day = date.day.toString().padLeft(2, '0');
    final time = event.startTime != null && event.startTime!.isNotEmpty ? event.startTime : 'TBA';
    return '$month $day • $time';
  }

  Color _categoryColor(String category) {
    switch (category) {
      case 'Health Alert':
        return const Color(0xFFEF4444);
      case 'Event':
        return const Color(0xFFF59E0B);
      default:
        return AppTheme.primaryBlue;
    }
  }

  String _shortenContent(String content) {
    final trimmed = content.trim();
    if (trimmed.length <= 90) return trimmed;
    return '${trimmed.substring(0, 90).trim()}...';
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      body: RefreshIndicator(
        onRefresh: _refreshHome,
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                const SizedBox(height: 16),
                _buildGreeting(context),
                const SizedBox(height: 16),
                _buildAlertBanner(context),
                const SizedBox(height: 24),
                _buildSectionTitle(context, 'Quick Actions'),
                const SizedBox(height: 16),
                _buildQuickActionsGrid(context),
                const SizedBox(height: 24),
                _buildSectionTitle(context, 'Next Appointment'),
                const SizedBox(height: 16),
                _buildNextAppointmentCard(context),
                const SizedBox(height: 24),
                _buildSectionTitle(context, 'Barangay Events', actionText: 'View all'),
                const SizedBox(height: 16),
                _buildEventCard(context),
                const SizedBox(height: 24),
                _buildHealthTipCard(context),
                const SizedBox(height: 32),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildGreeting(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        const CircleAvatar(
          radius: 24,
          backgroundImage: NetworkImage('https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop'),
          backgroundColor: AppTheme.primaryLight,
        ),
        const SizedBox(width: 12),
        Expanded(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Magandang araw,',
                style: TextStyle(
                  color: Theme.of(context).textTheme.bodyMedium?.color,
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                ),
              ),
              Text(
                'Maria! 👋',
                style: TextStyle(
                  color: Theme.of(context).textTheme.bodyLarge?.color,
                  fontSize: 18,
                  fontWeight: FontWeight.w800,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildAlertBanner(BuildContext context) {
    final hasAlert = _healthAlert != null;
    final title = hasAlert ? _healthAlert!.title : 'Dengue Awareness\nWeek';
    final description = hasAlert
        ? (_healthAlert!.content.isNotEmpty ? _healthAlert!.content : 'Keep your surroundings clean.\nImplement the 4S strategy today\nto protect your family.')
        : 'Keep your surroundings clean.\nImplement the 4S strategy today\nto protect your family.';
    final actionColor = hasAlert ? _categoryColor(_healthAlert!.category) : const Color(0xFFF59E0B);
    final tagColor = hasAlert ? _categoryColor(_healthAlert!.category) : Colors.red;

    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: AppTheme.primaryGradient,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: AppTheme.primaryBlue.withOpacity(0.3),
            blurRadius: 15,
            offset: const Offset(0, 8),
          )
        ],
      ),
      child: Stack(
        children: [
          Positioned(
            right: -10,
            bottom: -15,
            child: Icon(
              Icons.campaign,
              size: 100,
              color: Colors.white.withOpacity(0.1),
            ),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.2),
                  borderRadius: BorderRadius.circular(6),
                ),
                child: const Text(
                  'PUBLIC HEALTH ALERT',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 10,
                    fontWeight: FontWeight.w800,
                    letterSpacing: 0.5,
                  ),
                ),
              ),
              const SizedBox(height: 12),
              Text(
                title,
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 22,
                  fontWeight: FontWeight.w800,
                  height: 1.2,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                description,
                style: const TextStyle(
                  color: Colors.white70,
                  fontSize: 12,
                  fontWeight: FontWeight.w500,
                  height: 1.4,
                ),
              ),
              const SizedBox(height: 16),
              ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: actionColor,
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                  elevation: 0,
                  padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
                ),
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => NewsDetailsView(
                        item: {
                          'tag': 'PUBLIC HEALTH ALERT',
                          'title': title,
                          'description': description,
                          'time': hasAlert
                              ? _healthAlert!.createdAt.toIso8601String()
                              : DateTime.now().toIso8601String(),
                          'isPinned': hasAlert && _healthAlert!.priority == 'High',
                          'color': tagColor,
                          'content': description,
                          'createdAt': hasAlert ? _healthAlert!.createdAt.toIso8601String() : DateTime.now().toIso8601String(),
                          'author': hasAlert ? _healthAlert!.author : 'Barangay Health Center',
                        },
                      ),
                    ),
                  );
                },
                child: const Text(
                  'Learn More',
                  style: TextStyle(fontSize: 12, fontWeight: FontWeight.w800),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildSectionTitle(BuildContext context, String title, {String? actionText}) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      crossAxisAlignment: CrossAxisAlignment.end,
      children: [
        Text(
          title,
          style: TextStyle(
            color: Theme.of(context).textTheme.bodyLarge?.color,
            fontSize: 16,
            fontWeight: FontWeight.w800,
          ),
        ),
        if (actionText != null)
          Text(
            actionText,
            style: const TextStyle(
              color: AppTheme.primaryBlue,
              fontSize: 12,
              fontWeight: FontWeight.w700,
            ),
          )
      ],
    );
  }

  Widget _buildQuickActionsGrid(BuildContext context) {
    return GridView.count(
      crossAxisCount: 2,
      crossAxisSpacing: 16,
      mainAxisSpacing: 16,
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      childAspectRatio: 1.3,
      children: [
        _buildActionCard(context, Icons.folder_shared, 'My Records', AppTheme.primaryBlue),
        _buildActionCard(context, Icons.calendar_month, 'Book Visit', const Color(0xFFD97706)),
        _buildActionCard(context, Icons.medical_services, 'Emergency', const Color(0xFFDC2626)),
        _buildActionCard(context, Icons.vaccines, 'Vaccines', const Color(0xFF9333EA)),
      ],
    );
  }

  Widget _buildActionCard(BuildContext context, IconData icon, String title, Color color) {
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
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: color.withOpacity(0.1),
              shape: BoxShape.circle,
            ),
            child: Icon(icon, color: color, size: 24),
          ),
          const SizedBox(height: 12),
          Text(
            title,
            style: TextStyle(
              color: Theme.of(context).textTheme.bodyLarge?.color,
              fontSize: 12,
              fontWeight: FontWeight.w700,
            ),
          )
        ],
      ),
    );
  }

  Widget _buildNextAppointmentCard(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surface,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.04),
            blurRadius: 10,
            offset: const Offset(0, 4),
          )
        ],
      ),
      child: IntrinsicHeight(
        child: Row(
          children: [
            Container(
              width: 8,
              decoration: const BoxDecoration(
                color: Color(0xFFD97706), 
                borderRadius: BorderRadius.only(
                  topLeft: Radius.circular(16),
                  bottomLeft: Radius.circular(16),
                ),
              ),
            ),
            Expanded(
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Row(
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Prenatal Care',
                            style: TextStyle(
                              color: Theme.of(context).textTheme.bodyLarge?.color,
                              fontSize: 14,
                              fontWeight: FontWeight.w800,
                            ),
                          ),
                          const SizedBox(height: 8),
                          Row(
                            children: [
                              Icon(Icons.calendar_today, size: 14, color: Theme.of(context).textTheme.bodyMedium?.color),
                              const SizedBox(width: 6),
                              Text('Oct 12, 9:00 AM', style: TextStyle(color: Theme.of(context).textTheme.bodyMedium?.color, fontSize: 12, fontWeight: FontWeight.w500)),
                            ],
                          ),
                          const SizedBox(height: 4),
                          Row(
                            children: [
                              Icon(Icons.location_on, size: 14, color: Theme.of(context).textTheme.bodyMedium?.color),
                              const SizedBox(width: 6),
                              Text('Health Center - Room 3', style: TextStyle(color: Theme.of(context).textTheme.bodyMedium?.color, fontSize: 12, fontWeight: FontWeight.w500)),
                            ],
                          ),
                        ],
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: const Color(0xFFD97706).withOpacity(0.1),
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(Icons.medical_information, color: Color(0xFFD97706), size: 24),
                    )
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildEventCard(BuildContext context) {
    final hasEvent = _nextEvent != null;
    final title = hasEvent ? _nextEvent!.title : 'Senior Citizens Wellness Day';
    final description = hasEvent
        ? (_nextEvent!.description?.isNotEmpty == true ? _nextEvent!.description! : _nextEvent!.location ?? 'Barangay health event')
        : 'Free Check-up & Zumba Session';
    final badgeText = hasEvent ? _formatEventDate(_nextEvent!) : 'Oct 15 • 7:00 AM';

    return Container(
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surface,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.04),
            blurRadius: 10,
            offset: const Offset(0, 4),
          )
        ],
      ),
      padding: const EdgeInsets.all(12),
      child: Row(
        children: [
          ClipRTRoundedRectangle(
            borderRadius: BorderRadius.circular(10),
            child: Image.network(
              'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=150&auto=format&fit=crop',
              width: 70,
              height: 70,
              fit: BoxFit.cover,
            ),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: TextStyle(
                    color: Theme.of(context).textTheme.bodyLarge?.color,
                    fontSize: 13,
                    fontWeight: FontWeight.w800,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  description.isNotEmpty ? description : 'Barangay health event',
                  style: TextStyle(
                    color: Theme.of(context).textTheme.bodyMedium?.color,
                    fontSize: 11,
                    fontStyle: FontStyle.italic,
                  ),
                ),
                const SizedBox(height: 8),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: AppTheme.primaryBlue.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: Text(badgeText, style: const TextStyle(color: AppTheme.primaryBlue, fontSize: 10, fontWeight: FontWeight.w700)),
                )
              ],
            ),
          )
        ],
      ),
    );
  }

  Widget _buildHealthTipCard(BuildContext context) {
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
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(6),
                decoration: const BoxDecoration(
                  color: Color(0xFFF59E0B),
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.lightbulb, color: Colors.white, size: 16),
              ),
              const SizedBox(width: 10),
              Text(
                'Health Tip of the Day',
                style: TextStyle(
                  color: Theme.of(context).textTheme.bodyLarge?.color,
                  fontSize: 14,
                  fontWeight: FontWeight.w800,
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Text(
            '"Staying hydrated is key for seniors. Try to drink at least 8 glasses of water a day, even if you don\'t feel thirsty, to maintain energy and kidney health."',
            style: TextStyle(
              color: Theme.of(context).textTheme.bodyMedium?.color,
              fontSize: 12,
              fontStyle: FontStyle.italic,
              height: 1.5,
            ),
          ),
          const SizedBox(height: 16),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('WELLNESS GUIDE', style: TextStyle(color: Theme.of(context).textTheme.bodyMedium?.color, fontSize: 10, fontWeight: FontWeight.w800, letterSpacing: 0.5)),
              Row(
                children: const [
                  Text('Share Tip', style: TextStyle(color: AppTheme.primaryBlue, fontSize: 11, fontWeight: FontWeight.w700)),
                  SizedBox(width: 4),
                  Icon(Icons.share, size: 12, color: AppTheme.primaryBlue),
                ],
              )
            ],
          )
        ],
      ),
    );
  }
}

class ClipRTRoundedRectangle extends StatelessWidget {
  final Widget child;
  final BorderRadius borderRadius;

  const ClipRTRoundedRectangle({super.key, required this.child, required this.borderRadius});

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      borderRadius: borderRadius,
      child: child,
    );
  }
}
