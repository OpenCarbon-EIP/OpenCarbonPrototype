import 'package:flutter/material.dart';
import 'package:flutter_poc/core/colors/app_colors.dart';

class MessagesView extends StatelessWidget {
  const MessagesView({super.key});

  @override
  Widget build(BuildContext context) => Scaffold(
    appBar: AppBar(title: const Text('Messages')),
    backgroundColor: AppColors.backgroundLight,
    body: Container(),
  );
}
