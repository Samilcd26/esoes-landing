"use client";
import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { useCurrentUser } from "@/hooks/useAuth";
import { LoaderOne } from "@/components/ui/loader";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/api/client";

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'user' | 'admin' | 'organizer';
  created_at: string;
}

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  );
};

export const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newOrganizerEmail, setNewOrganizerEmail] = useState("");
  const [processing, setProcessing] = useState(false);
  
  const { data: currentUser, isLoading: isUserLoading } = useCurrentUser();

  // Kullanıcıları yükle
  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error loading users:', error);
      alert('Kullanıcılar yüklenirken hata oluştu!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser?.role === 'admin') {
      loadUsers();
    }
  }, [currentUser]);

  // Rol değiştir
  const updateUserRole = async (userId: string, newRole: 'user' | 'admin' | 'organizer') => {
    if (!currentUser || currentUser.role !== 'admin') {
      alert('Bu işlem için admin yetkisi gerekiyor!');
      return;
    }

    setUpdating(userId);
    try {
      const { error } = await supabase
        .from('users')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;

      // Local state'i güncelle
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));

      alert(`Kullanıcı rolü "${newRole}" olarak güncellendi!`);
    } catch (error) {
      console.error('Error updating user role:', error);
      alert('Rol güncellenirken hata oluştu!');
    } finally {
      setUpdating(null);
    }
  };

  // Email ile admin yap
  const makeUserAdmin = async (email: string) => {
    if (!email.trim()) {
      alert('Email adresi gerekiyor!');
      return;
    }

    setProcessing(true);
    try {
      const { data, error } = await supabase
        .rpc('make_user_admin', { user_email: email });

      if (error) throw error;

      alert(data);
      setNewAdminEmail("");
      loadUsers(); // Listeyi yenile
    } catch (error) {
      console.error('Error making user admin:', error);
      alert('Admin yapılırken hata oluştu!');
    } finally {
      setProcessing(false);
    }
  };

  // Email ile organizer yap
  const makeUserOrganizer = async (email: string) => {
    if (!email.trim()) {
      alert('Email adresi gerekiyor!');
      return;
    }

    setProcessing(true);
    try {
      const { data, error } = await supabase
        .rpc('make_user_organizer', { user_email: email });

      if (error) throw error;

      alert(data);
      setNewOrganizerEmail("");
      loadUsers(); // Listeyi yenile
    } catch (error) {
      console.error('Error making user organizer:', error);
      alert('Organizer yapılırken hata oluştu!');
    } finally {
      setProcessing(false);
    }
  };

  if (isUserLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoaderOne />
      </div>
    );
  }

  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="shadow-input mx-auto w-full max-w-4xl rounded-none bg-white p-6 md:rounded-2xl md:p-8 dark:bg-black">
        <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">
            ⚠️ Bu sayfaya erişmek için admin yetkisine sahip olmanız gerekiyor!
          </p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="shadow-input mx-auto w-full max-w-6xl rounded-none bg-white p-6 md:rounded-2xl md:p-8 dark:bg-black"
    >
      <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200 mb-2">
        Kullanıcı Yönetimi
      </h2>
      <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-6">
        Kullanıcı rollerini yönetin ve yetkileri düzenleyin
      </p>

      {/* Hızlı Rol Atama */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Admin Yap */}
        <div className="p-4 bg-gray-50 dark:bg-gray-900/20 rounded-lg">
          <h3 className="font-semibold text-neutral-800 dark:text-neutral-200 mb-3">
            Admin Yap
          </h3>
          <LabelInputContainer className="mb-3">
            <Label htmlFor="admin-email">Email Adresi</Label>
            <Input
              id="admin-email"
              type="email"
              value={newAdminEmail}
              onChange={(e) => setNewAdminEmail(e.target.value)}
              placeholder="admin@example.com"
              className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-neutral-800 px-3 py-2 text-gray-900 dark:text-white placeholder-gray-500"
            />
          </LabelInputContainer>
          <HoverBorderGradient className="w-full">
            <button
              type="button"
              onClick={() => makeUserAdmin(newAdminEmail)}
              disabled={processing}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-white font-medium rounded-lg bg-transparent"
            >
              {processing ? <LoaderOne /> : "Admin Yap"}
            </button>
          </HoverBorderGradient>
        </div>

        {/* Organizer Yap */}
        <div className="p-4 bg-gray-50 dark:bg-gray-900/20 rounded-lg">
          <h3 className="font-semibold text-neutral-800 dark:text-neutral-200 mb-3">
            Organizer Yap
          </h3>
          <LabelInputContainer className="mb-3">
            <Label htmlFor="organizer-email">Email Adresi</Label>
            <Input
              id="organizer-email"
              type="email"
              value={newOrganizerEmail}
              onChange={(e) => setNewOrganizerEmail(e.target.value)}
              placeholder="organizer@example.com"
              className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-neutral-800 px-3 py-2 text-gray-900 dark:text-white placeholder-gray-500"
            />
          </LabelInputContainer>
          <HoverBorderGradient className="w-full">
            <button
              type="button"
              onClick={() => makeUserOrganizer(newOrganizerEmail)}
              disabled={processing}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-white font-medium rounded-lg bg-transparent"
            >
              {processing ? <LoaderOne /> : "Organizer Yap"}
            </button>
          </HoverBorderGradient>
        </div>
      </div>

      {/* Kullanıcı Listesi */}
      <div>
        <h3 className="font-semibold text-neutral-800 dark:text-neutral-200 mb-4">
          Tüm Kullanıcılar ({users.length})
        </h3>
        
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <LoaderOne />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th className="px-6 py-3">Kullanıcı</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Rol</th>
                  <th className="px-6 py-3">Kayıt Tarihi</th>
                  <th className="px-6 py-3">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                      {user.first_name} {user.last_name}
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                      {user.email}
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn("px-2 py-1 text-xs font-semibold rounded-full",
                        user.role === 'admin' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                        user.role === 'organizer' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                        'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                      )}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                      {new Date(user.created_at).toLocaleDateString('tr-TR')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {user.role !== 'admin' && (
                          <button
                            onClick={() => updateUserRole(user.id, 'admin')}
                            disabled={updating === user.id}
                            className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                          >
                            {updating === user.id ? '...' : 'Admin'}
                          </button>
                        )}
                        {user.role !== 'organizer' && (
                          <button
                            onClick={() => updateUserRole(user.id, 'organizer')}
                            disabled={updating === user.id}
                            className="px-2 py-1 text-xs bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:opacity-50"
                          >
                            {updating === user.id ? '...' : 'Organizer'}
                          </button>
                        )}
                        {user.role !== 'user' && (
                          <button
                            onClick={() => updateUserRole(user.id, 'user')}
                            disabled={updating === user.id}
                            className="px-2 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50"
                          >
                            {updating === user.id ? '...' : 'User'}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  );
}; 