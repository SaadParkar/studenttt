export type ScreenId =
  | 'splash'
  | 'welcome'
  | 'login'
  | 'otp'
  | 'auth_loading'
  | 'profile_setup'
  | 'auth_success'
  | 'onboarding'
  | 'home'
  | 'live_attendance'
  | 'today_attendance'
  | 'scanner'
  | 'timetable'
  | 'class_details'
  | 'assignments'
  | 'library'
  | 'attendance_analytics'
  | 'results'
  | 'goals'
  | 'events'
  | 'notifications'
  | 'profile'
  | 'settings'
  | 'credits';

export interface StudentProfile {
  name: string;
  idNumber: string;
  collegeName: string;
  department: string;
  semester: string;
  avatarUrl: string;
  email: string;
  overallAttendance: number; // e.g. 92
  cgpa: number; // e.g. 3.88
  totalCredits: number; // 114
  requiredCredits: number; // 140
  classRank: number; // 5
  totalStudentsInClass: number; // 128
  scholarshipEligible: boolean;
}

export interface StackedHeroCard {
  id: string;
  order: number;
  title: string;
  subtitle: string;
  accentColor: string; // gradient or hex class
  badgeText?: string;
  badgeType?: 'live' | 'due' | 'success' | 'info';
  iconName: string;
  statPrimary: string;
  statSecondary: string;
  locationOrTime?: string;
  ctaText: string;
  targetScreen: ScreenId;
  details: string;
}

export interface Lecture {
  id: string;
  code: string;
  title: string;
  professor: string;
  professorAvatar: string;
  room: string;
  building: string;
  startTime: string;
  endTime: string;
  duration: string;
  status: 'completed' | 'current' | 'upcoming' | 'missed';
  attendanceStatus: 'marked' | 'live' | 'missed' | 'pending';
  onlineMeetingUrl?: string;
  credits: number;
  attendancePercentage: number;
}

export interface Assignment {
  id: string;
  title: string;
  subject: string;
  faculty: string;
  dueDate: string;
  dueTime: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'Submitted' | 'Overdue' | 'Completed';
  readinessPercentage: number; // e.g. 85
  submissionFile?: string;
  submittedAt?: string;
}

export interface LibraryBook {
  id: string;
  title: string;
  author: string;
  coverImage: string;
  category: 'Textbook' | 'E-book' | 'Journal' | 'Paper';
  dueDate?: string;
  daysRemaining?: number;
  isDueSoon?: boolean;
  status: 'borrowed' | 'recommended' | 'returned';
  myRating?: number;
  finishedDate?: string;
}

export interface SubjectAttendance {
  subjectId: string;
  subjectName: string;
  code: string;
  attended: number;
  total: number;
  percentage: number;
  status: 'Safe' | 'Warning' | 'Danger';
  instructor: string;
}

export interface SubjectGrade {
  code: string;
  subjectName: string;
  grade: 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C+';
  gpaPoint: number;
  credits: number;
  tags: string[];
  semester: string;
}

export interface CampusEvent {
  id: string;
  title: string;
  category: 'Hackathon' | 'Guest Lecture' | 'Cultural' | 'Workshop';
  date: string;
  time: string;
  venue: string;
  organizer: string;
  attendeesCount: number;
  isRsvped: boolean;
  image: string;
}

export interface GoalItem {
  id: string;
  title: string;
  category: 'Attendance' | 'CGPA' | 'Assignment' | 'Credits';
  currentValue: number;
  targetValue: number;
  unit: string;
  deadline: string;
  isCompleted: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  dateGroup: 'TODAY' | 'YESTERDAY' | 'EARLIER THIS WEEK';
  category: 'Assignments' | 'Attendance' | 'Results' | 'System';
  isUnread: boolean;
  actionScreen?: ScreenId;
}

export interface OfflineAttendanceRecord {
  id: string;
  lectureId: string;
  lectureTitle: string;
  scannedAt: string;
  qrPayload: string;
  isSynced: boolean;
}

export interface AttendanceSessionRecord {
  sessionId: string;
  lectureId: string;
  lectureTitle: string;
  subjectCode: string;
  professor: string;
  room: string;
  scannedAtTime: string;
  status: 'PRESENT' | 'ABSENT' | 'PENDING';
  method: 'QR Code Camera' | '5-Digit OTP' | 'Manual Faculty Roll Call';
  deviceId: string;
  securityHash: string;
  locationVerified: boolean;
}
