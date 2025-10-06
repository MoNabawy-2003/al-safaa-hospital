
import { useState, useEffect, useCallback, useRef } from 'react';
import { VitalSign, VitalHistoryPoint, Patient, Alert } from '../types';

const INITIAL_VITALS: VitalSign[] = [
  { name: 'Heart Rate', value: 80, unit: 'BPM', thresholds: { min: 50, max: 120 } },
  { name: 'Temperature', value: 37.0, unit: '°C', thresholds: { min: 36.1, max: 37.8 } },
  { name: 'Blood Pressure', value: 120, unit: 'mmHg', thresholds: { min: 90, max: 140 } },
  { name: 'SpO2', value: 98, unit: '%', thresholds: { min: 95, max: 100 } },
];

export const useVitals = (patient: Patient | null, onAlert: (alert: Alert) => void) => {
  const [vitals, setVitals] = useState<VitalSign[]>(INITIAL_VITALS);
  const historyRef = useRef<Record<VitalSign['name'], VitalHistoryPoint[]>>({
    'Heart Rate': [],
    'Temperature': [],
    'Blood Pressure': [],
    'SpO2': [],
  });

  const generateHistory = (name: VitalSign['name'], baseValue: number) => {
    const history: VitalHistoryPoint[] = [];
    let value = baseValue;
    for (let i = 29; i >= 0; i--) {
        const time = new Date(Date.now() - i * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        value += (Math.random() - 0.5) * (name === 'Temperature' ? 0.2 : 4);
        history.push({ time, value: parseFloat(value.toFixed(1)) });
    }
    return history;
  };
  
  useEffect(() => {
    if (patient) {
        historyRef.current = {
            'Heart Rate': generateHistory('Heart Rate', 80),
            'Temperature': generateHistory('Temperature', 37.0),
            'Blood Pressure': generateHistory('Blood Pressure', 120),
            'SpO2': generateHistory('SpO2', 98),
        };
    }
  }, [patient]);


  const simulateVitals = useCallback(() => {
    if (!patient) return;

    setVitals(prevVitals => {
      const newVitals = prevVitals.map(vital => {
        let newValue = vital.value;
        switch (vital.name) {
          case 'Heart Rate':
            newValue += (Math.random() - 0.5) * 3;
            break;
          case 'Temperature':
            newValue += (Math.random() - 0.5) * 0.1;
            break;
          case 'Blood Pressure':
            newValue += (Math.random() - 0.5) * 4;
            break;
          case 'SpO2':
            newValue += (Math.random() - 0.5) * 0.5;
            newValue = Math.max(90, Math.min(100, newValue));
            break;
        }

        newValue = parseFloat(newValue.toFixed(1));

        if (newValue < vital.thresholds.min || newValue > vital.thresholds.max) {
          onAlert({
            id: `alert-${Date.now()}`,
            patientName: patient.name,
            patientId: patient.id,
            vital: vital.name,
            value: newValue,
            timestamp: new Date(),
            message: `${vital.name} is ${newValue < vital.thresholds.min ? 'critically low' : 'critically high'}`,
          });
        }
        
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const newHistory = [...historyRef.current[vital.name], { time, value: newValue }].slice(-30);
        historyRef.current[vital.name] = newHistory;

        return { ...vital, value: newValue };
      });
      return newVitals;
    });
  }, [patient, onAlert]);

  useEffect(() => {
    if (patient) {
      const intervalId = setInterval(simulateVitals, 3000);
      return () => clearInterval(intervalId);
    }
  }, [patient, simulateVitals]);

  return { vitals, history: historyRef.current };
};
