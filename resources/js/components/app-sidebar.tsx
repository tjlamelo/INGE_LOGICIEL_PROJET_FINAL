import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid } from 'lucide-react';
import AppLogo from './app-logo';
import { index } from '@/routes/user/import'
import { dashboard as adminDashboard } from '@/routes/admin/index'  ;
import { index as adminPermissions } from '@/routes/admin/permissions'; 
import { index as matiereIndex } from '@/routes/matieres';
import {index as classeIndex } from '@/routes/classes';
import {index as eleveIndex } from '@/routes/eleves';
import {index as enseignantIndex } from '@/routes/enseignants';
import {index as trimestreIndex}   from '@/routes/trimestres';
import {index as enseignementIndex}   from '@/routes/enseignements';
import {index as noteIndex}   from '@/routes/notes';
const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Admin Dashboard',
        href: adminDashboard(),
        icon: LayoutGrid,
    },
    
    {
        title: 'Admin Permissions',
        href: adminPermissions(),
        icon: LayoutGrid,
    },
    {
        title: 'Import',
        href: index(),
        icon: LayoutGrid,
    },
    {
        title: 'Matiere',
        href: matiereIndex(),
        icon: LayoutGrid,
    },
    {
        title: 'Classe',
        href: classeIndex(),
        icon: LayoutGrid,
    },
    
    {
        title: 'Eleve',
        href: eleveIndex(),
        icon: LayoutGrid,
    },
    {
        title: 'Enseignant',
        href: enseignantIndex(),
        icon: LayoutGrid,
    },
    {
        title: 'Trimestre',
        href: trimestreIndex(),
        icon: LayoutGrid,
    },
    {
        title: 'Enseignement',
        href: enseignementIndex(),
        icon: LayoutGrid,
    },
    {
        title: 'Note',
        href: noteIndex(),
        icon: LayoutGrid,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
