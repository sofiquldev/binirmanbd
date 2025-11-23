import Link from 'next/link';
import { UserCircle, Settings, Moon, LogOut } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export function AppUserDropdownMenu({ trigger }) {
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();

  const handleThemeToggle = (checked) => {
    setTheme(checked ? 'dark' : 'light');
  };

  const handleLogout = async () => {
    await logout();
  };

  const getUserInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getUserRole = () => {
    if (!user?.abilities || user.abilities.length === 0) return null;
    const roles = user.abilities.filter((a) =>
      ['super-admin', 'candidate-admin', 'team-member', 'volunteer'].includes(a)
    );
    return roles[0] || null;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" side="bottom" align="end">
        {/* Header */}
        <div className="flex items-center justify-between p-3">
          <div className="flex items-center gap-2">
            <Avatar className="size-9 border-2 border-green-500">
              <AvatarFallback className="bg-accent/60 text-foreground font-semibold">
                {getUserInitials(user?.name)}
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col">
              <Link
                href="/profile"
                className="text-sm text-mono hover:text-primary font-semibold"
              >
                {user?.name || 'User'}
              </Link>
              <a
                href={`mailto:${user?.email}`}
                className="text-xs text-muted-foreground hover:text-primary"
              >
                {user?.email}
              </a>
            </div>
          </div>
          {getUserRole() && (
            <Badge variant="primary" appearance="light" size="sm">
              {getUserRole()?.replace('-', ' ')}
            </Badge>
          )}
        </div>

        <DropdownMenuSeparator />

        {/* Menu Items */}
        <DropdownMenuItem asChild>
          <Link href="/profile" className="flex items-center gap-2">
            <UserCircle className="size-4" />
            My Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/profile" className="flex items-center gap-2">
            <Settings className="size-4" />
            Account Settings
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Footer */}
        <DropdownMenuItem
          className="flex items-center gap-2"
          onSelect={(event) => event.preventDefault()}
        >
          <Moon className="size-4" />
          <div className="flex items-center gap-2 justify-between grow">
            Dark Mode
            <Switch
              size="sm"
              checked={theme === 'dark'}
              onCheckedChange={handleThemeToggle}
            />
          </div>
        </DropdownMenuItem>
        <div className="p-2 mt-1">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={handleLogout}
          >
            <LogOut className="size-4 me-2" />
            Logout
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

