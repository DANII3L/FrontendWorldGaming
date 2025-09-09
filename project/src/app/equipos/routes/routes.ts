import { ShieldHalf, User } from 'lucide-react';
import { NavigationItem } from '../../shared/interface/navigation';

export const equiposRoutes: NavigationItem = {
  name: 'Equipos',
  href: '/worldGaming/equipos',
  icon: ShieldHalf,
  children: [
    { name: 'Gestionar Equipos', href: '/worldGaming/equipos', icon: ShieldHalf },
    { name: 'Mi Equipo', href: '/worldGaming/equipos/mi-equipo', icon: User },
  ]
};