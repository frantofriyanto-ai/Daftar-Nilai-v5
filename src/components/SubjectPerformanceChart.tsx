import React, { useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, CartesianGrid } from 'recharts';
import { Student, getSubjectFinalScore } from '../types';

interface SubjectPerformanceChartProps {
  students: Student[];
}

export const SubjectPerformanceChart: React.FC<SubjectPerformanceChartProps> = ({ students }) => {
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState('all');

  // Compute actual class average per subject using breakdown calculator
  const total = students.length || 1;
  
  const rawData = [
    {
      subjectKey: 'math',
      name: 'MTK',
      fullName: 'Matematika',
      avg: Math.round(students.reduce((acc, s) => acc + getSubjectFinalScore(s.grades.math), 0) / total),
      color: '#4B88E3'
    },
    {
      subjectKey: 'indonesian',
      name: 'B. Indo',
      fullName: 'Bahasa Indonesia',
      avg: Math.round(students.reduce((acc, s) => acc + getSubjectFinalScore(s.grades.indonesian), 0) / total),
      color: '#8A87B2'
    },
    {
      subjectKey: 'english',
      name: 'B. Bing',
      fullName: 'Bahasa Inggris',
      avg: Math.round(students.reduce((acc, s) => acc + getSubjectFinalScore(s.grades.english), 0) / total),
      color: '#0EA5E9'
    },
    {
      subjectKey: 'science',
      name: 'IPAS',
      fullName: 'IPAS (Sains)',
      avg: Math.round(students.reduce((acc, s) => acc + getSubjectFinalScore(s.grades.science), 0) / total),
      color: '#827DEB'
    },
    {
      subjectKey: 'pancasila',
      name: 'PPKn',
      fullName: 'Pendidikan Pancasila',
      avg: Math.round(students.reduce((acc, s) => acc + getSubjectFinalScore(s.grades.pancasila), 0) / total),
      color: '#4B88E3'
    },
    {
      subjectKey: 'arts',
      name: 'Seni',
      fullName: 'Seni Budaya',
      avg: Math.round(students.reduce((acc, s) => acc + getSubjectFinalScore(s.grades.arts), 0) / total),
      color: '#8A87B2'
    },
    {
      subjectKey: 'sundanese',
      name: 'B. Sunda',
      fullName: 'Bahasa Sunda',
      avg: Math.round(students.reduce((acc, s) => acc + getSubjectFinalScore(s.grades.sundanese), 0) / total),
      color: '#827DEB'
    },
    {
      subjectKey: 'cocurricular',
      name: 'Kokur.',
      fullName: 'Kokurikuler',
      avg: Math.round(students.reduce((acc, s) => acc + getSubjectFinalScore(s.grades.cocurricular), 0) / total),
      color: '#4B88E3'
    }
  ];

  const chartData = selectedSubjectFilter === 'all' 
    ? rawData 
    : rawData.filter(d => d.subjectKey === selectedSubjectFilter);

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">Performa Mata Pelajaran</h3>
          <p className="text-xs text-slate-500 mt-0.5">Perbandingan rata-rata nilai antar mata pelajaran</p>
        </div>
        <select
          value={selectedSubjectFilter}
          onChange={(e) => setSelectedSubjectFilter(e.target.value)}
          className="text-xs border border-slate-200 bg-slate-50 font-medium text-slate-700 px-3 py-1.5 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
        >
          <option value="all">Semua Mata Pelajaran</option>
          <option value="math">Matematika</option>
          <option value="indonesian">Bahasa Indonesia</option>
          <option value="english">Bahasa Inggris</option>
          <option value="science">IPAS (Sains)</option>
          <option value="pancasila">Pendidikan Pancasila</option>
          <option value="arts">Seni Budaya</option>
          <option value="sundanese">Bahasa Sunda</option>
          <option value="cocurricular">Kokurikuler</option>
        </select>
      </div>

      {/* Chart */}
      <div className="w-full h-64 min-h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
            <XAxis 
              dataKey="name" 
              tick={{ fill: '#64748B', fontSize: 11 }} 
              tickLine={false} 
              axisLine={{ stroke: '#CBD5E1' }} 
            />
            <YAxis 
              domain={[0, 100]} 
              ticks={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
              tick={{ fill: '#64748B', fontSize: 10 }} 
              tickLine={false} 
              axisLine={false} 
            />
            <Tooltip
              cursor={{ fill: 'rgba(241, 245, 249, 0.6)' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-slate-900 text-white p-2.5 rounded-lg text-xs shadow-lg">
                      <p className="font-semibold">{data.fullName}</p>
                      <p className="text-blue-300 mt-0.5">Average Score: <span className="font-bold text-white">{data.avg}</span></p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="avg" radius={[4, 4, 0, 0]} barSize={selectedSubjectFilter === 'all' ? 36 : 60}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
