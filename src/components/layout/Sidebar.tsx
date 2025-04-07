
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Users, LogOut } from 'lucide-react';

const Sidebar: React.FC = () => {
  const { pathname } = useLocation();
  const { isAdmin, isTelecaller, logout } = useAuth();

  return (
    <aside className="flex flex-col w-64 h-screen bg-sidebar border-r border-border">
      <div className="p-4 border-b border-border">
        <h1 className="text-2xl font-bold text-primary">LeadNexus CRM</h1>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {isAdmin && (
          <Link to="/dashboard">
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start text-left font-normal",
                pathname === "/dashboard" ? "bg-accent text-accent-foreground" : ""
              )}
            >
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          </Link>
        )}

        {(isAdmin || isTelecaller) && (
          <Link to="/telecaller">
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start text-left font-normal",
                pathname === "/telecaller" ? "bg-accent text-accent-foreground" : ""
              )}
            >
              <Users className="mr-2 h-4 w-4" />
              Lead Management
            </Button>
          </Link>
        )}
      </nav>

      <div className="p-4 border-t border-border">
        <Button variant="ghost" className="w-full justify-start text-left font-normal" onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;
