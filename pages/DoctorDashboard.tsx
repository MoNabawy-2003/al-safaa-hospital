import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { Layout } from '../components/Layout';
import { Doctor, Patient, Alert, VitalSign, VitalHistoryPoint, DoctorPatientMessage } from '../types';
import { api } from '../services/mockApi';
import { useVitals } from '../hooks/useVitals';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Brush } from 'recharts';
import { DoctorAppointmentsView } from '../components/DoctorAppointmentsView';
import { useNotification } from '../context/NotificationContext';

// Icons
// FIX: Corrected the malformed viewBox attribute in the SVG definition.
const PatientListIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const AlertIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>;
const MessageIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>;
const AppointmentIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/></svg>;
const SendIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>;
const HeartIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-red-500"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>;
const TempIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-orange-500"><path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0z"/></svg>;
const BPIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-blue-500"><circle cx="12" cy="12" r="10"></circle><path d="M12 18a6 6 0 0 0 6-6"/></svg>;
const O2Icon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-teal-500"><path d="M12.25 21.16a10.05 10.05 0 0 1-5.18-1.74 2.43 2.43 0 0 1-1.33-2.18l-1.2-6.52a2.43 2.43 0 0 1 .53-2.17 10.05 10.05 0 0 1 14.86 6.31 2.43 2.43 0 0 1-2.17 2.72l-6.52 1.2a2.43 2.43 0 0 1-.99.28z"/><path d="M22 2S15 2 12 5"/><path d="M2 22s7 0 10-3"/></svg>;
const CalendarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-indigo-500"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>;
const GenderIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-pink-500"><path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z"></path><path d="M12 11.25V16.5"></path><path d="M12 8.25V6"></path><path d="M9.75 14.25h4.5"></path></svg>;
const CaseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-emerald-500"><path d="M8 3H5a2 2 0 0 0-2 2v3h18V5a2 2 0 0 0-2-2h-3"></path><path d="M9 3V1h6v2"></path><rect x="3" y="8" width="18" height="12" rx="2"></rect><line x1="12" y1="11" x2="12" y2="17"></line><line x1="9" y1="14" x2="15" y2="14"></line></svg>;


const VitalsCard: React.FC<{ vital: VitalSign }> = ({ vital }) => {
    const icons = {
        'Heart Rate': <HeartIcon/>,
        'Temperature': <TempIcon/>,
        'Blood Pressure': <BPIcon/>,
        'SpO2': <O2Icon/>,
    };
    const isCritical = vital.value < vital.thresholds.min || vital.value > vital.thresholds.max;

    return (
        <div className="relative group [perspective:1000px]">
            {isCritical && (
                <div className="absolute -inset-0.5 bg-red-500 rounded-xl blur opacity-75 animate-pulse"></div>
            )}
            <div className={`relative bg-gradient-to-br from-white to-slate-50 p-6 rounded-xl shadow-lg flex items-center transition-all duration-300 border-4 group-hover:shadow-2xl group-hover:[transform:translateZ(10px)_scale(1.02)] ${isCritical ? 'border-red-500' : 'border-transparent'}`}>
                <div className="mr-5">{icons[vital.name]}</div>
                <div>
                    <p className="text-slate-500 text-sm font-medium">{vital.name}</p>
                    <p className={`text-4xl font-bold ${isCritical ? 'text-red-600' : 'text-slate-800'}`}>
                        {vital.value} <span className="text-xl font-normal text-slate-600">{vital.unit}</span>
                    </p>
                </div>
            </div>
        </div>
    )
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const getUnit = (name: string) => {
      if (name === 'Heart Rate') return 'BPM';
      if (name === 'SpO2') return '%';
      return '';
    };

    return (
      <div className="bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-xl border border-slate-200">
        <p className="label text-sm font-bold text-slate-800 mb-1">{`Time: ${label}`}</p>
        {payload.map((p: any, index: number) => (
          <p key={index} style={{ color: p.stroke }} className="text-sm font-medium">
            {`${p.name}: ${p.value.toFixed(1)} ${getUnit(p.name)}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const PatientDetailView: React.FC<{ patient: Patient; onAlert: (alert: Alert) => void; onBack: () => void; }> = ({ patient, onAlert, onBack }) => {
    const { vitals, history } = useVitals(patient, onAlert);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    const chartData: Record<VitalSign['name'], VitalHistoryPoint[]> = history;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h2 className="text-2xl font-bold text-slate-800">Monitoring: {patient.name}</h2>
                <button onClick={onBack} className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition w-full sm:w-auto">
                    &larr; Back to Patient List
                </button>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-sky-500">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Patient Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="flex items-center gap-4">
                        <div className="bg-indigo-100 p-3 rounded-full"><CalendarIcon /></div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Age</p>
                            <p className="text-xl font-semibold text-slate-800">{patient.age}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="bg-pink-100 p-3 rounded-full"><GenderIcon /></div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Gender</p>
                            <p className="text-xl font-semibold text-slate-800">{patient.gender}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="bg-emerald-100 p-3 rounded-full"><CaseIcon /></div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Case Type</p>
                            <p className="text-xl font-semibold text-slate-800">{patient.caseType}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {vitals.map(v => <VitalsCard key={v.name} vital={v} />)}
            </div>
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-semibold text-slate-800 mb-4">Vitals History (Last 30 mins)</h3>
                 <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={chartData['Heart Rate']} margin={isMobile ? { top: 5, right: 5, left: -20, bottom: 0 } : { top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-slate-300"/>
                        <XAxis 
                            dataKey="time" 
                            stroke="#64748b" 
                            tick={{ fontSize: isMobile ? 10 : 12, fill: 'currentColor' }}
                            className="text-slate-600"
                            tickLine={false}
                        />
                        <YAxis 
                            yAxisId="left" 
                            stroke="#ef4444" 
                            domain={['dataMin - 5', 'dataMax + 5']} 
                            tick={{ fontSize: isMobile ? 10 : 12 }} 
                        />
                        <YAxis 
                            yAxisId="right" 
                            orientation="right" 
                            stroke="#14b8a6" 
                            domain={[90, 100]} 
                            tick={{ fontSize: isMobile ? 10 : 12 }} 
                        />
                        <Tooltip content={<CustomTooltip />} />
                        {!isMobile && <Legend />}
                        <Line yAxisId="left" type="monotone" dataKey="value" name="Heart Rate" stroke="#ef4444" strokeWidth={2} dot={false} />
                        <Line yAxisId="right" type="monotone" data={chartData['SpO2']} dataKey="value" name="SpO2" stroke="#14b8a6" strokeWidth={2} dot={false} />
                        <Brush dataKey="time" height={30} stroke="#3b82f6" fill="rgba(59, 130, 246, 0.2)" tickFormatter={() => ''}/>
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

const MessagingView: React.FC<{ doctor: Doctor }> = ({ doctor }) => {
  type ConversationSummary = { patient: Patient, lastMessage: DoctorPatientMessage, unreadCount: number };
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [messages, setMessages] = useState<DoctorPatientMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const fetchConversations = useCallback(async () => {
    const convos = await api.getDoctorConversations(doctor.id);
    setConversations(convos);
  }, [doctor.id]);

  const fetchMessages = useCallback(async (patientId: string) => {
    const conversation = await api.getConversation(patientId, doctor.id);
    setMessages(conversation);
    await api.markMessagesAsRead(patientId, doctor.id);
    await fetchConversations(); 
  }, [doctor.id, fetchConversations]);

  useEffect(() => {
    fetchConversations();
    const intervalId = setInterval(fetchConversations, 5000);
    return () => clearInterval(intervalId);
  }, [fetchConversations]);

  useEffect(() => {
    if (selectedPatient) {
      fetchMessages(selectedPatient.id);
      const intervalId = setInterval(() => fetchMessages(selectedPatient.id), 3000);
      return () => clearInterval(intervalId);
    }
  }, [selectedPatient, fetchMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  const handleSelectConversation = (patient: Patient) => {
    setSelectedPatient(patient);
  };

  const handleSend = async () => {
    if (!input.trim() || !selectedPatient || isLoading) return;
    setIsLoading(true);
    setInput('');
    await api.sendMessage(doctor.id, selectedPatient.id, input.trim());
    await fetchMessages(selectedPatient.id);
    setIsLoading(false);
  };
  
  return (
    <div className="bg-white rounded-xl shadow-md h-[calc(100vh-8rem)] sm:h-[calc(100vh-10rem)] flex overflow-hidden">
      {/* Conversation List */}
      <div className={`w-full sm:w-1/3 flex-shrink-0 border-r border-slate-200 flex flex-col transition-transform duration-300 ease-in-out ${selectedPatient ? '-translate-x-full sm:translate-x-0' : 'translate-x-0'}`}>
        <div className="p-4 border-b">
          <h3 className="text-xl font-semibold text-slate-800">Messages</h3>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.length > 0 ? conversations.map(convo => (
            <button key={convo.patient.id} onClick={() => handleSelectConversation(convo.patient)} className={`w-full text-left p-4 border-b border-slate-100 hover:bg-slate-50 ${selectedPatient?.id === convo.patient.id ? 'bg-sky-50' : ''}`}>
              <div className="flex justify-between items-center">
                <p className="font-semibold text-slate-800">{convo.patient.name}</p>
                {convo.unreadCount > 0 && <span className="bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">{convo.unreadCount}</span>}
              </div>
              <p className="text-sm text-slate-500 truncate">{convo.lastMessage.text}</p>
            </button>
          )) : <p className="p-4 text-slate-500">No conversations yet.</p>}
        </div>
      </div>
       {/* Chat View */}
      <div className={`w-full sm:w-2/3 flex-shrink-0 flex flex-col transition-transform duration-300 ease-in-out ${selectedPatient ? '-translate-x-full sm:translate-x-0' : 'translate-x-0'}`}>
        {selectedPatient ? (
          <>
            <div className="p-4 border-b flex items-center">
               <button onClick={() => setSelectedPatient(null)} className="sm:hidden mr-4 p-2 rounded-full hover:bg-slate-100">
                    &larr;
                </button>
              <h3 className="text-xl font-semibold text-slate-800">Chat with {selectedPatient.name}</h3>
            </div>
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              {messages.map(msg => (
                <div key={msg.id} className={`flex items-end gap-2 ${msg.senderId === doctor.id ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-lg px-4 py-3 rounded-2xl ${msg.senderId === doctor.id ? 'bg-sky-500 text-white rounded-br-none' : 'bg-slate-200 text-slate-800 rounded-bl-none'}`}>
                    <p>{msg.text}</p>
                    <p className="text-xs opacity-70 mt-1 text-right">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>
              ))}
               <div ref={messagesEndRef} />
            </div>
            <div className="p-4 border-t bg-slate-50">
              <div className="flex items-center gap-2">
                <input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleSend()} placeholder="Type your message..." className="w-full px-4 py-2 border text-slate-800 rounded-full focus:outline-none focus:ring-2 focus:ring-sky-500" disabled={isLoading}/>
                <button onClick={handleSend} disabled={isLoading} className="bg-sky-500 text-white p-3 rounded-full hover:bg-sky-600 disabled:bg-sky-300 transition"><SendIcon/></button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 hidden sm:flex items-center justify-center text-slate-500 text-center p-4">
            <p>Select a conversation to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};


export const DoctorDashboard: React.FC = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('Patients');
    const [patients, setPatients] = useState<Patient[]>([]);
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [conversations, setConversations] = useState<{patient: Patient, lastMessage: DoctorPatientMessage, unreadCount: number}[]>([]);
    const { addToast } = useNotification();
    const notifiedMessagesRef = useRef<Set<string>>(new Set());
    
    const doctor = user as Doctor;

    useEffect(() => {
        api.getDoctorPatients(doctor.id).then(setPatients);

        const fetchConvos = async () => {
            const convos = await api.getDoctorConversations(doctor.id);
            setConversations(convos);

            convos.forEach(convo => {
                if (convo.unreadCount > 0 && convo.lastMessage.senderId !== doctor.id && !notifiedMessagesRef.current.has(convo.lastMessage.id)) {
                    const shortMessage = convo.lastMessage.text.length > 40 ? `${convo.lastMessage.text.substring(0, 40)}...` : convo.lastMessage.text;
                    addToast(`New message from ${convo.patient.name}: "${shortMessage}"`);
                    notifiedMessagesRef.current.add(convo.lastMessage.id);
                }
            });
        };
        fetchConvos();
        const intervalId = setInterval(fetchConvos, 5000);
        return () => clearInterval(intervalId);
    }, [doctor.id, addToast]);

    const handleNewAlert = useCallback((newAlert: Alert) => {
        setAlerts(prevAlerts => {
            if (prevAlerts.some(a => a.patientId === newAlert.patientId && a.vital === newAlert.vital)) {
                 return prevAlerts.map(a => a.patientId === newAlert.patientId && a.vital === newAlert.vital ? newAlert : a);
            }
            return [newAlert, ...prevAlerts];
        });
    }, []);

    const handleSelectPatientFromAppointment = (patientId: string) => {
        const patient = patients.find(p => p.id === patientId);
        if (patient) {
            setSelectedPatient(patient);
            setActiveTab('Patients');
        }
    };

    const totalUnread = conversations.reduce((sum, convo) => sum + convo.unreadCount, 0);

    const sidebarItems = [
        { name: 'Patients', icon: <PatientListIcon />, onClick: () => { setActiveTab('Patients'); setSelectedPatient(null); } },
        { name: 'Appointments', icon: <AppointmentIcon />, onClick: () => { setActiveTab('Appointments'); setSelectedPatient(null); } },
        { name: 'Messages', icon: <div className="relative"><MessageIcon /><span className={`absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center transition-opacity ${totalUnread > 0 ? 'opacity-100' : 'opacity-0'}`}>{totalUnread}</span></div>, onClick: () => { setActiveTab('Messages'); setSelectedPatient(null); } },
        { name: 'Alerts', icon: <div className="relative"><AlertIcon /><span className={`absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center transition-opacity ${alerts.length > 0 ? 'opacity-100' : 'opacity-0'}`}>{alerts.length}</span></div>, onClick: () => { setActiveTab('Alerts'); setSelectedPatient(null); } }
    ];

    const renderPatientList = () => (
        <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-semibold text-slate-800 mb-4">Assigned Patients</h3>
            <div className="space-y-3">
                {patients.map(p => (
                    <button key={p.id} onClick={() => setSelectedPatient(p)} className="w-full text-left p-4 rounded-lg bg-slate-50 hover:bg-sky-100 border border-slate-200 hover:border-sky-300 transition-transform duration-150 active:scale-[0.98] flex justify-between items-center">
                        <div>
                            <p className="font-semibold text-slate-800">{p.name}, {p.age}</p>
                            <p className="text-sm text-slate-500">{p.caseType}</p>
                        </div>
                        <span className="text-sm font-medium text-sky-600">View Details &rarr;</span>
                    </button>
                ))}
            </div>
        </div>
    );

    const renderAlerts = () => (
        <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-semibold text-slate-800 mb-4">Critical Alerts ({alerts.length})</h3>
            <div className="space-y-3 max-h-[calc(100vh-16rem)] overflow-y-auto">
                {alerts.length === 0 ? <p className="text-slate-500">No active alerts.</p> :
                 alerts.map(a => (
                    <div key={a.id} className="p-4 rounded-lg bg-red-50 border border-red-200">
                        <p className="font-bold text-red-700">{a.message}</p>
                        <p className="text-sm text-red-600">Patient: {a.patientName} | Value: {a.value}</p>
                        <p className="text-xs text-slate-500 mt-1">{a.timestamp.toLocaleString()}</p>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderContent = () => {
        if (activeTab === 'Appointments') return <DoctorAppointmentsView doctor={doctor} onSelectPatient={handleSelectPatientFromAppointment} />;
        if (activeTab === 'Messages') return <MessagingView doctor={doctor} />;
        if (activeTab === 'Alerts') return renderAlerts();

        if (selectedPatient) {
            return <PatientDetailView patient={selectedPatient} onAlert={handleNewAlert} onBack={() => setSelectedPatient(null)} />;
        }
        return renderPatientList();
    };

    return (
        <Layout sidebarItems={sidebarItems} activeItem={selectedPatient ? 'Patients' : activeTab}>
            {renderContent()}
        </Layout>
    );
};