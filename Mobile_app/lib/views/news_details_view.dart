import 'package:flutter/material.dart';
import '../utils/theme.dart';

class NewsDetailsView extends StatelessWidget {
  final Map<String, dynamic> item;

  const NewsDetailsView({Key? key, required this.item}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final tagColor = item['color'] ?? Colors.red;
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      appBar: AppBar(
        backgroundColor: Theme.of(context).scaffoldBackgroundColor,
        elevation: 0,
        scrolledUnderElevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: AppTheme.primaryBlue),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text(
          'Announcement',
          style: TextStyle(
            color: AppTheme.primaryBlue,
            fontWeight: FontWeight.w800,
            fontSize: 18,
          ),
        ),
        centerTitle: true,
        actions: [
          IconButton(
            icon: const Icon(Icons.share, color: AppTheme.primaryBlue),
            onPressed: () {},
          ),
        ],
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Container(
              height: 220,
              width: double.infinity,
              color: const Color(0xFF1F2937),
              child: Image.network(
                'https://images.unsplash.com/photo-1584362915806-0346bf86241a?q=80&w=1000&auto=format&fit=crop',
                fit: BoxFit.cover,
                errorBuilder: (context, error, stackTrace) => Container(
                  color: AppTheme.primarySoft,
                  child: const Center(
                    child: Icon(Icons.image_not_supported, color: AppTheme.primaryBlue, size: 40),
                  ),
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(20.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    decoration: BoxDecoration(
                      color: tagColor,
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Text(
                      item['tag'] ?? 'HEALTH ALERT',
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 10,
                        fontWeight: FontWeight.w800,
                        letterSpacing: 0.5,
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),
                  
                  Text(
                    item['title'] ?? 'Dengue Prevention Measures sa ating Barangay',
                    style: TextStyle(
                      color: Theme.of(context).textTheme.bodyLarge?.color,
                      fontSize: 22,
                      fontWeight: FontWeight.w800,
                      height: 1.2,
                    ),
                  ),
                  const SizedBox(height: 16),

                  Row(
                    children: [
                      const Icon(Icons.calendar_today, size: 14, color: AppTheme.primaryBlue),
                      const SizedBox(width: 6),
                      Text(
                        'Posted: March 25, 2025',
                        style: TextStyle(color: Theme.of(context).textTheme.bodyMedium?.color, fontSize: 12, fontWeight: FontWeight.w600),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      const Icon(Icons.access_time_filled, size: 14, color: Color(0xFFB45309)),
                      const SizedBox(width: 6),
                      Text(
                        'Expires: April 10, 2025',
                        style: TextStyle(color: Theme.of(context).textTheme.bodyMedium?.color, fontSize: 12, fontWeight: FontWeight.w600),
                      ),
                    ],
                  ),
                  const SizedBox(height: 20),
                  Divider(color: Theme.of(context).textTheme.bodyMedium?.color?.withOpacity(0.1)),
                  const SizedBox(height: 20),

                  Text(
                    _getMockContent(item['title'] ?? ''),
                    style: TextStyle(
                      color: Theme.of(context).textTheme.bodyLarge?.color,
                      fontSize: 14,
                      fontWeight: FontWeight.w500,
                      height: 1.6,
                    ),
                  ),
                  
                  const SizedBox(height: 24),

                  Container(
                    decoration: BoxDecoration(
                      color: isDark ? const Color(0xFF0F3224) : const Color(0xFFECFDF5),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: IntrinsicHeight(
                      child: Row(
                        children: [
                          Container(
                            width: 6,
                            decoration: const BoxDecoration(
                              color: Color(0xFF059669),
                              borderRadius: BorderRadius.only(
                                topLeft: Radius.circular(12),
                                bottomLeft: Radius.circular(12),
                              ),
                            ),
                          ),
                          Expanded(
                            child: Padding(
                              padding: const EdgeInsets.all(16.0),
                              child: Text(
                                'Huwag balewalain ang anumang sintomas. Kung makaranas ng mataas na lagnat sa loob ng higit sa dalawang araw, agad na pumunta sa ating Health Center o pinakamalapit na pagamutan para sa wastong pagsusuri at gamutan. Ang maagang pagtukoy sa sakit ay susi sa mabilis na paggaling.',
                                style: TextStyle(
                                  color: isDark ? const Color(0xFF6EE7B7) : const Color(0xFF064E3B),
                                  fontSize: 13,
                                  fontWeight: FontWeight.w600,
                                  height: 1.5,
                                ),
                              ),
                            ),
                          )
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 40),

                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(10),
                        decoration: BoxDecoration(
                          color: AppTheme.primaryBlue,
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: const Icon(Icons.business, color: Colors.white, size: 20),
                      ),
                      const SizedBox(width: 12),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'POSTED BY:',
                            style: TextStyle(
                              color: Theme.of(context).textTheme.bodyMedium?.color,
                              fontSize: 10,
                              fontWeight: FontWeight.w800,
                              letterSpacing: 0.5,
                            ),
                          ),
                          const Text(
                            'Barangay Health Center',
                            style: TextStyle(
                              color: AppTheme.primaryBlue,
                              fontSize: 14,
                              fontWeight: FontWeight.w800,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                  const SizedBox(height: 24),
                  
                  SizedBox(
                    width: double.infinity,
                    child: OutlinedButton.icon(
                      style: OutlinedButton.styleFrom(
                        foregroundColor: AppTheme.primaryBlue,
                        side: const BorderSide(color: AppTheme.primaryBlue, width: 1.5),
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                      onPressed: () {},
                      icon: const Icon(Icons.share),
                      label: const Text(
                        'Share this Announcement',
                        style: TextStyle(fontWeight: FontWeight.w700),
                      ),
                    ),
                  ),
                  const SizedBox(height: 40),
                ],
              ),
            )
          ],
        ),
      ),
    );
  }

  String _getMockContent(String title) {
    if (title.contains('Sanggol')) {
      return 'Mahalagang anunsyo para sa lahat ng mga magulang na may sanggol na wala pang isang taon! Ang Barangay Health Center ay magsasagawa ng malawakang programa para sa libreng pagbabakuna upang masiguro ang kalusugan ng ating mga chikiting.\n\n'
             'Dalhin po lamang ang inyong Baby Book at pumunta sa Health Center mula 8:00 AM hanggang 12:00 PM. Siguraduhing may suot na mask at sundin ang physical distancing sa loob ng pasilidad.\n\n'
             'Ang inyong pakikiisa ay lubos naming pinapahalagahan. Sama-sama nating protektahan ang kalusugan ng ating mga anak!';
    }
    
    return 'Mainit na pagbati sa lahat ng ating mga ka-Barangay. Dahil sa pagpasok ng panahon ng pag-ulan, muling nagpapaalala ang ating Barangay Health Center (BHC) tungkol sa panganib na dulot ng sakit na Dengue. Mahalaga ang kooperasyon ng bawat isa upang mapanatiling ligtas at malusog ang ating komunidad.\n\n'
           'Hinihikayat namin ang lahat na maging mapagmatyag sa paligid. Siguraduhin nating walang stagnant water o mga nakaimbak na tubig sa ating bakuran kung saan maaaring mangitlog ang mga lamok. Linisin ang mga gutter, plorera, at mga lumang gulong.\n\n'
           'Pinapayuhan din ang bawat pamilya na gumamit ng mosquito nets (kulambo) lalo na sa pagtulog ng mga bata, at magsuot ng mga damit na mahaba ang manggas para sa proteksyon.';
  }
}
