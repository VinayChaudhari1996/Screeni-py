import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  Home, 
  TrendingUp, 
  Search, 
  Brain, 
  Calculator, 
  Settings,
  Info
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Screening', href: '/screening', icon: TrendingUp },
  { name: 'Similarity', href: '/similarity', icon: Search },
  { name: 'Prediction', href: '/prediction', icon: Brain },
  { name: 'Calculator', href: '/calculator', icon: Calculator },
  { name: 'Configuration', href: '/configuration', icon: Settings },
  { name: 'About', href: '/about', icon: Info },
];

export function Navigation() {
  return (
    <nav className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <div className="p-4">
        <ul className="space-y-2">
          {navigation.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  )
                }
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}