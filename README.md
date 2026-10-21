# 🎯 Class 10 Personal Study Planner | Abhishek's Board Mission 2026

A modern, responsive, gamified web & Android application built for **Abhishek's Class 10 CBSE Board Exam preparation** (20 October – 25 November 2026).

---

## 📱 Android App (APK)

The standalone Android APK has been generated and is ready to install directly on Abhishek's Android phone:

- **APK File:** [`Abhishek-Study-Planner.apk`](file:///d:/Study%20planner/Abhishek-Study-Planner.apk) (approx. 4.1 MB)
- **Package ID:** `com.abhishek.studyplanner`
- **Target OS:** Android 7.0 (API 24) to Android 15+ (API 36)
- **100% Offline:** Runs without internet; sounds, coin animations, Pomodoro timer, progress gauge, and data persistence work completely offline.

### How to Install on Phone:
1. Send `Abhishek-Study-Planner.apk` to the phone (via WhatsApp, USB Cable, Bluetooth, or Google Drive).
2. Tap the APK file on the phone to install (allow "Install unknown apps" if prompted).
3. Open **Abhishek Study Planner** and start tracking!

---

## 🌟 Key Features

- **✨ Welcome Screen & Splash Loader**:
  - Animated 3D coin mascot with "Welcome Abhishek! 🎯".
  - Dedicated mother's blessings message & animated progress bar.
- **🪙 Gamification & Coins System**:
  - Earn **+10 coins** per task completed with floating coin animations & arcade sound effects.
  - Streak tracking & Scholar rank progression (*Novice Scholar 🥉* ➔ *Focused Learner 🥈* ➔ *Board Champion 🥇* ➔ *Super Topper 🏆*).
  - Canvas confetti particle celebration upon milestone/day completion.
- **📅 Interactive Day-Wise Calendar**:
  - Full October & November 2026 interactive calendar grid.
  - Color-coded day status (Completed, In Progress, Catch-up).
  - Interactive day preview panel with quick task completion.
- **📚 37-Day Comprehensive Roadmap**:
  - Complete 74-task syllabus covering Maths, Chemistry, Physics, Biology, SST, English, Hindi, and IT.
  - Color-coded badges with custom icons.
  - Real-time search across chapters and topics.
  - Filter by subject (*Maths, Chemistry, Physics, Biology, SST, English, Hindi, IT, Catch-up*).
- **⏱️ Pomodoro Focus Timer**:
  - 25m Focus, 5m Quick Break, and 15m Long Break modes.
  - Circular SVG progress dial with audio chime alerts.
- **⏰ Daily Timetable with Live Detection**:
  - Complete daily routine from 4:30 AM to 9:30 PM.
  - Auto-highlights the active time slot in real-time.
- **📌 8 Golden Study Rules**:
  - Topper's mindset rules for conceptual clarity and consistent practice.
- **💾 Offline & Auto-Save**:
  - All checkboxes and coins persist in `localStorage`.
  - Runs 100% offline with zero external dependencies.
- **🖨️ Print & PDF Ready**:
  - Clean printable layout without web navigation buttons.

---

## 💻 Web Version

You can also run the web version on any PC:

```bash
# In Windows PowerShell:
Start-Process "index.html"
```
Or open [`index.html`](file:///d:/Study%20planner/index.html) in your browser.

---

## 📁 File Structure

```
├── Abhishek-Study-Planner.apk # Standalone Android APK (Ready to install)
├── index.html                 # Semantic HTML5 web application
├── style.css                  # Modern glassmorphism, animations, and responsive styles
├── data.js                    # Complete 37-day syllabus data, timetable, and rules
├── app.js                     # Audio synthesis (Web Audio API), confetti, coins, calendar, timer
├── capacitor.config.json      # Capacitor Android config
├── android/                   # Full native Android Studio project
└── README.md                  # Documentation
```
