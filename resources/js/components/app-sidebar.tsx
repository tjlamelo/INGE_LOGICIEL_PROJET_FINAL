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
import { dashboard as adminDashboard } from '@/routes/admin/index';
import { index as adminPermissions } from '@/routes/admin/permissions';
import { index as classeIndex } from '@/routes/classes';
import { index as eleveIndex } from '@/routes/eleves';
import { index as enseignantIndex } from '@/routes/enseignants';
import { index as enseignementIndex } from '@/routes/enseignements';
import { index as matiereIndex } from '@/routes/matieres';
import { index as noteIndex } from '@/routes/notes';
import { index as trimestreIndex } from '@/routes/trimestres';
import { index as userImportIndex } from '@/routes/user/import';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
// Importation des icônes corrigée
import { 
    BookOpen, 
    Folder, 
    LayoutDashboard, 
    ShieldCheck,     
    Upload,          
    Users,           
    GraduationCap,   
    Calendar,        
    Presentation,    // ✅ Icône de remplacement pour Chalkboard
    FileText,        
    FileBarChart     
} from 'lucide-react';
import AppLogo from './app-logo';
 
// ✅ Définir le type NavItem avec roles
const mainNavItems: NavItem[] = [
    { 
        title: 'Dashboard', 
        href: dashboard(), 
        icon: LayoutDashboard,   
        roles: [    
            'student',
            'teacher',
            'general_supervisor',
            'censor',
            'principal',
            'guest'
        ], 
    },
    {
        title: 'Dashboard Admin',
        href: adminDashboard(),
        icon: LayoutDashboard,   
        roles: ['admin'],
    },
    {
        title: 'Permissions',
        href: adminPermissions(),
        icon: ShieldCheck,       
        // roles: ['admin'],
    },
    {
        title: 'Import',
        href: userImportIndex(),
        icon: Upload,            
        roles: ['admin', 'teacher'],
    },
    {
        title: 'Matières',
        href: matiereIndex(),
        icon: BookOpen,          
        roles: ['admin', 'enseignant'],
    },
    {
        title: 'Classes',
        href: classeIndex(),
        icon: Users,             
        roles: ['admin', 'teacher'],
    },
    {
        title: 'Élèves',
        href: eleveIndex(),
        icon: GraduationCap,     
        roles: ['admin', 'enseignant'],
    },
    {
        title: 'Enseignants',
        href: enseignantIndex(),
        icon: Users,             
        roles: ['admin'],
    },
    {
        title: 'Trimestres',
        href: trimestreIndex(),
        icon: Calendar,          
        roles: ['admin', 'enseignant'],
    },
    {
        title: 'Enseignements',
        href: enseignementIndex(),
        icon: Presentation,      // ✅ Icône corrigée ici
        roles: ['admin', 'teacher'],
    },
    {
        title: 'Notes',
        href: noteIndex(),
        icon: FileText,          
        roles: ['admin', 'teacher'],
    },
    {
        title: 'Bulletins',
        href:  '/bulletins',
        icon: FileBarChart,      
        roles: ['admin', 'teacher'],
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

// ✅ Définir ton type pour props côté client
interface MyProps {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
            roles: string[]; // ou string si tu utilises Spatie
        } | null;
    };
    [key: string]: any; // pour toutes les autres props Inertia
}

export function AppSidebar() {
    const { auth } = usePage<MyProps>().props;

    const roles: string[] = auth.user?.roles || [];

    // ✅ Filtrer les menus selon les rôles
    const filteredNavItems = mainNavItems.filter((item) => {
        if (!item.roles) return true; // pas de restriction, visible pour tous
        return item.roles.some((role) => roles.includes(role));
    });

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
                <NavMain items={filteredNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}