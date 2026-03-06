import 'package:flutter/material.dart';
import 'package:flutter_poc/ui/views/dashboard.dart';
import 'package:flutter_poc/ui/views/messages_view.dart';
import 'package:flutter_poc/ui/views/offers_view.dart';
import 'package:flutter_poc/ui/widgets/app_navbar.dart';
import 'package:flutter_poc/core/colors/app_colors.dart';

class MainScreen extends StatefulWidget {
  const MainScreen({super.key});

  @override
  State<MainScreen> createState() => _MainScreenState();
}

class _MainScreenState extends State<MainScreen> {
  int _currentIndex = 0;

  // Liste des vues de l'application
  final List<Widget> _views = [
    const Dashboard(),
    const OffersView(),
    const MessagesView(),
    const Center(child: Text("Profile")),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      extendBody: true,
      backgroundColor: AppColors.backgroundLight,
      body: _views[_currentIndex], 
      bottomNavigationBar: AppNavbar(
        selectedIndex: _currentIndex,
        onItemSelected: (index) {
          setState(() {
            _currentIndex = index;
          });
        },
      ),
    );
  }
}