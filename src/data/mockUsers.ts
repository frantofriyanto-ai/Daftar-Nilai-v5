import { UserAccount } from '../types';

export const MOCK_USERS: UserAccount[] = [
  {
    id: 'user_guru_1',
    name: 'Budi Santoso, M.Pd',
    email: 'budi.santoso@sekolah.sch.id',
    nip: '19850315 201001 1 004',
    role: 'teacher',
    avatarInitials: 'BS',
    title: 'Wali Kelas 12-A',
    assignedClasses: ['Kelas 12-A']
  },
  {
    id: 'user_guru_2',
    name: 'Siti Nurhaliza, S.Pd',
    email: 'siti.nurhaliza@sekolah.sch.id',
    nip: '19900822 201502 2 008',
    role: 'teacher',
    avatarInitials: 'SN',
    title: 'Wali Kelas 11-MIPA 1',
    assignedClasses: ['Kelas 11-MIPA 1']
  },
  {
    id: 'user_admin_1',
    name: 'Drs. H. Ahmad Wijaya, M.Si',
    email: 'ahmad.wijaya@sekolah.sch.id',
    nip: '19780512 200212 1 001',
    role: 'admin',
    avatarInitials: 'AW',
    title: 'Kepala Sekolah & Admin Kurikulum',
    assignedClasses: [] // empty array means full access to all classes
  },
  {
    id: 'user_admin_2',
    name: 'Admin Sistem Akademik',
    email: 'admin@sekolah.sch.id',
    nip: '19820101 200501 1 099',
    role: 'admin',
    avatarInitials: 'AD',
    title: 'Administrator SIM Akademik',
    assignedClasses: []
  }
];
