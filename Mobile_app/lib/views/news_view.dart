import 'package:flutter/material.dart';
import '../utils/theme.dart';
import 'news_details_view.dart';

class NewsView extends StatefulWidget {
  const NewsView({Key? key}) : super(key: key);

  @override
  State<NewsView> createState() => _NewsViewState();
}

class _NewsViewState extends State<NewsView> {
  String _selectedCategory = 'All';
  final List<String> _categories = ['All', 'Health Alert', 'Events', 'General'];

  final List<Map<String, dynamic>> _newsItems = [
    {
      'tag': 'HEALTH ALERT',
      'title': 'Dengue Prevention Drive',
      'description': 'Dahil sa pag-ulan, mag-ingat sa mga nakatambak na tubig. Isagawa ang 4S strategy sa inyong bakuran.',
      'time': '2 hours ago',
      'isPinned': true,
      'color': Colors.red,
    },
    {
      'tag': 'HEALTH ALERT',
      'title': 'Libreng Bakuna para sa Sanggol',
      'description': 'Magkakaroon ng libreng pagbabakuna ngayong darating na Lunes, alas-otso ng...',
      'time': '3 hours ago',
      'isPinned': false,
      'color': Colors.red,
    },
    {
      'tag': 'EVENTS',
      'title': 'Buntis Congress 2026',
      'description': 'Inaanyayahan ang lahat ng mga nagdadalang-tao na dumalo sa ating annu...',
      'time': '5 hours ago',
      'isPinned': false,
      'color': Colors.orange,
    },
    {
      'tag': 'GENERAL',
      'title': 'New Schedule of Consultations',
      'description': 'Simula sa susunod na buwan, magkakaroon tayo ng bagong oras para sa regular check-...',
      'time': '1 day ago',
      'isPinned': false,
      'color': Colors.green,
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      body: SafeArea(
        child: Column(
          children: [
            const SizedBox(height: 16),
            _buildCategories(),
            const SizedBox(height: 16),
            Expanded(
              child: ListView.separated(
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
                itemCount: _newsItems.length,
                separatorBuilder: (context, index) => const SizedBox(height: 16),
                itemBuilder: (context, index) {
                  final item = _newsItems[index];
                  return _buildNewsCard(item);
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildCategories() {
    return SizedBox(
      height: 40,
      child: ListView.separated(
        padding: const EdgeInsets.symmetric(horizontal: 20),
        scrollDirection: Axis.horizontal,
        itemCount: _categories.length,
        separatorBuilder: (context, index) => const SizedBox(width: 8),
        itemBuilder: (context, index) {
          final category = _categories[index];
          final isSelected = _selectedCategory == category;
          return GestureDetector(
            onTap: () {
              setState(() {
                _selectedCategory = category;
              });
            },
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              decoration: BoxDecoration(
                color: isSelected ? AppTheme.primaryBlue : Theme.of(context).colorScheme.surface,
                borderRadius: BorderRadius.circular(20),
                border: isSelected ? null : Border.all(color: Theme.of(context).textTheme.bodyMedium!.color!.withOpacity(0.2)),
              ),
              alignment: Alignment.center,
              child: Text(
                category,
                style: TextStyle(
                  color: isSelected ? Colors.white : Theme.of(context).textTheme.bodyMedium?.color,
                  fontWeight: FontWeight.w700,
                  fontSize: 13,
                ),
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildNewsCard(Map<String, dynamic> item) {
    final Color tagColor = item['color'];
    final bool isPinned = item['isPinned'];

    return GestureDetector(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => NewsDetailsView(item: item),
          ),
        );
      },
      child: Container(
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
        child: IntrinsicHeight(
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Left Accent Border
              Container(
                width: 5,
                decoration: BoxDecoration(
                  color: tagColor,
                  borderRadius: const BorderRadius.only(
                    topLeft: Radius.circular(20),
                    bottomLeft: Radius.circular(20),
                  ),
                ),
              ),
              Expanded(
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(16, 20, 16, 20),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                            decoration: BoxDecoration(
                              color: tagColor.withOpacity(0.15),
                              borderRadius: BorderRadius.circular(6),
                            ),
                            child: Text(
                              item['tag'],
                              style: TextStyle(
                                color: Theme.of(context).brightness == Brightness.dark 
                                  ? tagColor.withOpacity(0.9) 
                                  : tagColor,
                                fontSize: 10,
                                fontWeight: FontWeight.w800,
                                letterSpacing: 0.5,
                              ),
                            ),
                          ),
                          Icon(
                            isPinned ? Icons.push_pin : Icons.share_outlined,
                            color: isPinned ? const Color(0xFF926B25) : Theme.of(context).textTheme.bodyMedium?.color?.withOpacity(0.5),
                            size: 20,
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),
                      Text(
                        item['title'],
                        style: TextStyle(
                          color: Theme.of(context).textTheme.bodyLarge?.color,
                          fontSize: 16,
                          fontWeight: FontWeight.w800,
                          height: 1.2,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        item['description'],
                        style: TextStyle(
                          color: Theme.of(context).textTheme.bodyMedium?.color,
                          fontSize: 12,
                          fontWeight: FontWeight.w500,
                          height: 1.4,
                        ),
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),
                      const SizedBox(height: 16),
                      Row(
                        children: [
                          Icon(
                            Icons.access_time_filled,
                            size: 14,
                            color: Theme.of(context).textTheme.bodyMedium?.color?.withOpacity(0.5),
                          ),
                          const SizedBox(width: 6),
                          Text(
                            item['time'],
                            style: TextStyle(
                              color: Theme.of(context).textTheme.bodyMedium?.color?.withOpacity(0.7),
                              fontSize: 11,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
