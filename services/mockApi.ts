
import { Role, Doctor, Patient, User, AnalyticsData, Alert, RegistrationData, LoggedInUser, DoctorPatientMessage } from '../types';

const doctors: Doctor[] = [
  { id: 'doc-1', name: 'Dr. Evelyn Reed', username: 'ereed', password: 'password123', role: Role.Doctor, specialization: 'Cardiology', contact: 'ereed@hospital.com', patients: ['patient-1', 'patient-3'] },
  { id: 'doc-2', name: 'Dr. Samuel Chen', username: 'schen', password: 'password123', role: Role.Doctor, specialization: 'Neurology', contact: 'schen@hospital.com', patients: ['patient-2'] },
];

const patients: Patient[] = [
  { id: 'patient-1', name: 'John Doe', username: 'jdoe', password: 'password123', role: Role.Patient, age: 45, gender: 'Male', caseType: 'Cardiology', assignedDoctorId: 'doc-1' },
  { id: 'patient-2', name: 'Jane Smith', username: 'jsmith', password: 'password123', role: Role.Patient, age: 34, gender: 'Female', caseType: 'Neurology', assignedDoctorId: 'doc-2' },
  { id: 'patient-3', name: 'Peter Jones', username: 'pjones', password: 'password123', role: Role.Patient, age: 62, gender: 'Male', caseType: 'General', assignedDoctorId: 'doc-1' },
];

const managementUser: User = {
    id: 'mgmt-1',
    name: 'Sarah Wilson',
    username: 'swilson',
    password: 'password123',
    role: Role.Management
};

let allUsers: (Patient | Doctor | User)[] = [...doctors, ...patients, managementUser];

let messages: DoctorPatientMessage[] = [
    { id: 'msg-1', senderId: 'patient-1', receiverId: 'doc-1', text: 'Hi Dr. Reed, I have a question about my medication.', timestamp: new Date(Date.now() - 5 * 60000), read: true },
    { id: 'msg-2', senderId: 'doc-1', receiverId: 'patient-1', text: 'Hello John, of course. What is your question?', timestamp: new Date(Date.now() - 4 * 60000), read: true },
    { id: 'msg-3', senderId: 'patient-1', receiverId: 'doc-1', text: 'Should I take it before or after meals?', timestamp: new Date(Date.now() - 3 * 60000), read: false },
    { id: 'msg-4', senderId: 'patient-2', receiverId: 'doc-2', text: 'Good morning, Dr. Chen. I wanted to report that my headaches have subsided.', timestamp: new Date(Date.now() - 10 * 60000), read: true },
    { id: 'msg-5', senderId: 'doc-2', receiverId: 'patient-2', text: 'That\'s excellent news, Jane. Please continue to monitor your symptoms and let me know if anything changes.', timestamp: new Date(Date.now() - 9 * 60000), read: true },
];

const analytics: AnalyticsData = {
    totalPatients: [
        { month: 'Jan', count: 180 }, { month: 'Feb', count: 195 }, { month: 'Mar', count: 210 },
        { month: 'Apr', count: 205 }, { month: 'May', count: 220 }, { month: 'Jun', count: 230 }
    ],
    genderDistribution: [
        { name: 'Male', value: 125 }, { name: 'Female', value: 105 }
    ],
    caseTypeDistribution: [
        { name: 'Cardiology', value: 60 }, { name: 'Orthopedics', value: 45 },
        { name: 'General', value: 80 }, { name: 'Neurology', value: 45 }
    ],
    alertStatistics: [
        { day: 'Mon', count: 5 }, { day: 'Tue', count: 8 }, { day: 'Wed', count: 3 },
        { day: 'Thu', count: 10 }, { day: 'Fri', count: 7 }, { day: 'Sat', count: 12 }, { day: 'Sun', count: 9 }
    ]
};

const mockRequest = <T,>(data: T, delay = 500): Promise<T> => 
  new Promise(resolve => setTimeout(() => resolve(JSON.parse(JSON.stringify(data))), delay));

export const api = {
  login: (username: string, password: string): Promise<LoggedInUser | null> => {
    const user = allUsers.find(u => u.username === username && u.password === password);
    if (user) {
        // Don't send password back to client
        const { password: _, ...userWithoutPassword } = user;
        return mockRequest(userWithoutPassword as LoggedInUser);
    }
    return mockRequest(null);
  },
  register: (data: RegistrationData): Promise<Patient | null> => {
      if (allUsers.some(u => u.username === data.username)) {
          // Username already exists
          return mockRequest(null);
      }
      const newPatient: Patient = {
          ...data,
          id: `patient-${Date.now()}`,
          role: Role.Patient,
          assignedDoctorId: 'doc-1', // Assign to a default doctor
      };
      patients.push(newPatient);
      allUsers.push(newPatient);
      
      const { password, ...userWithoutPassword } = newPatient;
      return mockRequest(userWithoutPassword as Patient);
  },
  getPatient: (id: string) => mockRequest(patients.find(p => p.id === id)),
  getDoctor: (id: string) => mockRequest(doctors.find(d => d.id === id)),
  getDoctorPatients: (doctorId: string) => {
    const doctor = doctors.find(d => d.id === doctorId);
    if (!doctor) return mockRequest([]);
    const doctorPatients = patients.filter(p => doctor.patients.includes(p.id));
    return mockRequest(doctorPatients);
  },
  getAnalytics: () => mockRequest(analytics),
  getConversation: (participant1Id: string, participant2Id: string) => {
    const conversation = messages.filter(m => 
        (m.senderId === participant1Id && m.receiverId === participant2Id) ||
        (m.senderId === participant2Id && m.receiverId === participant1Id)
    ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    return mockRequest(conversation);
  },
  sendMessage: (senderId: string, receiverId: string, text: string): Promise<DoctorPatientMessage> => {
    const newMessage: DoctorPatientMessage = {
        id: `msg-${Date.now()}`,
        senderId,
        receiverId,
        text,
        timestamp: new Date(),
        read: false,
    };
    messages.push(newMessage);
    return mockRequest(newMessage);
  },
  getDoctorConversations: (doctorId: string) => {
      const conversations: Record<string, { patient: Patient, lastMessage: DoctorPatientMessage, unreadCount: number }> = {};

      const doctorMessages = messages.filter(m => m.senderId === doctorId || m.receiverId === doctorId);

      for (const message of doctorMessages) {
          const patientId = message.senderId === doctorId ? message.receiverId : message.senderId;
          if (!patients.some(p => p.id === patientId)) continue; 

          if (!conversations[patientId] || new Date(conversations[patientId].lastMessage.timestamp).getTime() < new Date(message.timestamp).getTime()) {
              const patient = patients.find(p => p.id === patientId);
              if (patient) {
                  conversations[patientId] = {
                      patient,
                      lastMessage: message,
                      unreadCount: 0,
                  };
              }
          }
      }
      
      for (const message of doctorMessages) {
          if (message.receiverId === doctorId && !message.read) {
              const patientId = message.senderId;
              if (conversations[patientId]) {
                  conversations[patientId].unreadCount++;
              }
          }
      }

      const conversationList = Object.values(conversations).sort((a,b) => new Date(b.lastMessage.timestamp).getTime() - new Date(a.lastMessage.timestamp).getTime());
      
      return mockRequest(conversationList);
  },
  markMessagesAsRead: (senderId: string, receiverId: string) => {
      messages.forEach(m => {
          if (m.senderId === senderId && m.receiverId === receiverId && !m.read) {
              m.read = true;
          }
      });
      return mockRequest(true);
  },
};