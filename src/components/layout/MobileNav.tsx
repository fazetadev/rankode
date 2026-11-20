import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Code2, Trophy, User, Award } from 'lucide-react';

const NAV_ITEMS = [
  { to: '/', label: 'Inicio', icon: LayoutDashboard, end: true },
  { to: '/challenges', label: 'Desafíos', icon: Code2, end: false },
  { to: '/ranking', label: 'Ranking', icon: Trophy, end: true },
  { to: '/profile', label: 'Perfil', icon: User, end: true },
  { to: '/ranks', label: 'Rangos', icon: Award, end: true },
];

export function MobileNav() {
  return (
    <nav
      aria-label="Navegación móvil"
      className="fixed bottom-0 inset-x-0 z-40 flex h-14 items-center justify-around border-t border-[#27272A] bg-[#09090B]/95 backdrop-blur-sm md:hidden"
    >
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-0.5 px-2 py-1 text-[11px] font-medium transition-colors ${
                isActive ? 'text-[#8B5CF6]' : 'text-[#A1A1AA] hover:text-[#FAFAFA]'
              }`
            }
          >
            <Icon aria-hidden="true" className="h-4 w-4" />
            <span className="whitespace-nowrap">{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}
