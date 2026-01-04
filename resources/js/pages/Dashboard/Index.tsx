import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import AdminDashboard from './AdminDashboard';
 import StudentDashboard from './StudentDashboard';
import TeacherDashboard from './TeacherDashboard';
 
// import FormTeacherDashboard from './FormTeacherDashboard';
import GeneralSupervisorDashboard from './GeneralSupervisorDashboard';
import CensorDashboard from './CensorDashboard';
import PrincipalDashboard from './PrincipalDashboard';
import GuestDashboard from './GuestDashboard';

interface DashboardProps {
    dashboardData: any;
    userRole: string;
    userName: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard({ dashboardData, userRole, userName }: DashboardProps) {
    const renderDashboard = () => {
        switch (userRole) {
            case 'admin':
                return <AdminDashboard data={dashboardData} userName={userName} />;
            case 'student':
                return <StudentDashboard data={dashboardData} userName={userName} />;
            case 'teacher':
                return <TeacherDashboard data={dashboardData} userName={userName} />;
            case 'general_supervisor':
                return <GeneralSupervisorDashboard data={dashboardData} userName={userName} />;
            case 'censor':
                return <CensorDashboard data={dashboardData} userName={userName} />;
            case 'principal':
                return <PrincipalDashboard data={dashboardData} userName={userName} />;
            case 'guest':
            default:
                return <GuestDashboard data={dashboardData} userName={userName} />;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="p-6">
                {renderDashboard()}
            </div>
        </AppLayout>
    );
}