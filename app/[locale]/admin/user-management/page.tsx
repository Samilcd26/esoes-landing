"use client";
import { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { useCurrentUser } from "@/hooks/useAuth";
import { 
  useDepartments, 
  useUsersWithDepartment
} from "@/hooks/useDepartments";
import { LoaderOne } from "@/components/ui/loader";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FileUpload, FileUploadRef } from "@/components/ui/file-upload";
import { User, Department } from "@/lib/types/api";
import { supabase } from "@/lib/api/client";

// Alt bileşenler
const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  );
};

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

// Yeni Kullanıcı Formu
interface CreateUserRequest {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  role: 'user' | 'organizer' | 'admin';
  department_id?: string;
  avatar_url?: string;
}

const UserForm = ({ 
  user, 
  onSuccess, 
  onCancel 
}: { 
  user?: User; 
  onSuccess?: () => void; 
  onCancel?: () => void; 
}) => {
  const [formData, setFormData] = useState<CreateUserRequest>({
    email: user?.email || "",
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    password: "",
    role: user?.role || "user",
    department_id: user?.department_id || "",
    avatar_url: user?.avatar_url || "",
  });

  // Update form data when user prop changes
  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email || "",
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        password: "",
        role: user.role || "user",
        department_id: user.department_id || "",
        avatar_url: user.avatar_url || "",
      });
    }
  }, [user]);

  const [errors, setErrors] = useState<Partial<CreateUserRequest>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileUploadRef = useRef<FileUploadRef>(null);

  const { data: departments } = useDepartments();

  const handleInputChange = (field: keyof CreateUserRequest, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<CreateUserRequest> = {};

    if (!formData.email.trim()) {
      newErrors.email = "E-posta adresi gereklidir";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Geçerli bir e-posta adresi girin";
    }

    if (!formData.first_name.trim()) {
      newErrors.first_name = "Ad gereklidir";
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = "Soyad gereklidir";
    }

    if (!user && !formData.password.trim()) {
      newErrors.password = "Şifre gereklidir";
    } else if (!user && formData.password.length < 6) {
      newErrors.password = "Şifre en az 6 karakter olmalıdır";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      let finalFormData = { ...formData };

      // Önce dosyaları yükle
      if (fileUploadRef.current?.hasPendingFiles()) {
        try {
          const uploadedFiles = await fileUploadRef.current.uploadFiles();
          if (uploadedFiles.length > 0) {
            const uploadedFile = uploadedFiles[0];
            // Supabase storage URL'ini oluştur
            const avatar_url = uploadedFile.publicUrl || uploadedFile.url || uploadedFile.cdnUrl || "";
            if (avatar_url) {
              finalFormData.avatar_url = avatar_url;
              console.log("Avatar uploaded successfully:", avatar_url);
            }
          }
        } catch (uploadError) {
          console.error("File upload error:", uploadError);
          alert('Dosya yükleme hatası! Lütfen tekrar deneyin.');
          setIsSubmitting(false);
          return;
        }
      }

      if (user) {
        // Update existing user
        const { error } = await supabase
          .from('users')
          .update({
            first_name: finalFormData.first_name,
            last_name: finalFormData.last_name,
            role: finalFormData.role,
            department_id: finalFormData.department_id || null,
            avatar_url: finalFormData.avatar_url,
          })
          .eq('id', user.id);

        if (error) throw error;
        alert("Kullanıcı başarıyla güncellendi!");
      } else {
        // Create new user
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: finalFormData.email,
          password: finalFormData.password,
        });

        if (authError) throw authError;

        if (authData.user) {
          // First check if user profile already exists
          const { data: existingUser } = await supabase
            .from('users')
            .select('id')
            .eq('id', authData.user.id)
            .single();

          if (existingUser) {
            // Update existing user profile
            const { error: updateError } = await supabase
              .from('users')
              .update({
                first_name: finalFormData.first_name,
                last_name: finalFormData.last_name,
                role: finalFormData.role,
                department_id: finalFormData.department_id || null,
                avatar_url: finalFormData.avatar_url,
              })
              .eq('id', authData.user.id);

            if (updateError) throw updateError;
          } else {
            // Create new user profile
            const { error: insertError } = await supabase
              .from('users')
              .insert({
                id: authData.user.id,
                email: finalFormData.email,
                first_name: finalFormData.first_name,
                last_name: finalFormData.last_name,
                role: finalFormData.role,
                department_id: finalFormData.department_id || null,
                avatar_url: finalFormData.avatar_url,
              });

            if (insertError) throw insertError;
          }
          
          alert("Kullanıcı başarıyla oluşturuldu!");
        }
      }

      // Sadece yeni kullanıcı oluştururken formu temizle
      if (!user) {
        setFormData({
          email: "",
          first_name: "",
          last_name: "",
          password: "",
          role: "user",
          department_id: "",
          avatar_url: "",
        });
        
        // FileUpload'ı da temizle
        if (fileUploadRef.current) {
          fileUploadRef.current.clearFiles();
        }
      }

      onSuccess?.();
    } catch (error) {
      console.error("User form error:", error);
      alert(`Hata: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      email: user?.email || "",
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
      password: "",
      role: user?.role || "user",
      department_id: user?.department_id || "",
      avatar_url: user?.avatar_url || "",
    });
    setErrors({});
  };

  return (
    <div className="shadow-input mx-auto w-full max-w-2xl rounded-none bg-white p-6 md:rounded-2xl md:p-8 dark:bg-black">
      <h3 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
        {user ? "Kullanıcı Düzenle" : "Yeni Kullanıcı Oluştur"}
      </h3>

      <form className="my-6" onSubmit={handleSubmit}>
        {/* Email */}
        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">E-posta Adresi *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            placeholder="kullanici@esoes.com"
            disabled={!!user}
            className={cn(
              "mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-neutral-800 px-3 py-2 text-gray-900 dark:text-white placeholder-gray-500 focus:border-gray-900 dark:focus:border-gray-100 focus:outline-none focus:ring-1 focus:ring-gray-900 dark:focus:ring-gray-100",
              errors.email && "border-red-500 focus:border-red-500",
              user && "opacity-50 cursor-not-allowed"
            )}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </LabelInputContainer>

        {/* First Name */}
        <LabelInputContainer className="mb-4">
          <Label htmlFor="first_name">Ad *</Label>
          <Input
            id="first_name"
            type="text"
            value={formData.first_name}
            onChange={(e) => handleInputChange("first_name", e.target.value)}
            placeholder="Kullanıcı adını girin"
            className={cn(
              "mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-neutral-800 px-3 py-2 text-gray-900 dark:text-white placeholder-gray-500 focus:border-gray-900 dark:focus:border-gray-100 focus:outline-none focus:ring-1 focus:ring-gray-900 dark:focus:ring-gray-100",
              errors.first_name && "border-red-500 focus:border-red-500"
            )}
          />
          {errors.first_name && (
            <p className="mt-1 text-sm text-red-600">{errors.first_name}</p>
          )}
        </LabelInputContainer>

        {/* Last Name */}
        <LabelInputContainer className="mb-4">
          <Label htmlFor="last_name">Soyad *</Label>
          <Input
            id="last_name"
            type="text"
            value={formData.last_name}
            onChange={(e) => handleInputChange("last_name", e.target.value)}
            placeholder="Kullanıcı soyadını girin"
            className={cn(
              "mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-neutral-800 px-3 py-2 text-gray-900 dark:text-white placeholder-gray-500 focus:border-gray-900 dark:focus:border-gray-100 focus:outline-none focus:ring-1 focus:ring-gray-900 dark:focus:ring-gray-100",
              errors.last_name && "border-red-500 focus:border-red-500"
            )}
          />
          {errors.last_name && (
            <p className="mt-1 text-sm text-red-600">{errors.last_name}</p>
          )}
        </LabelInputContainer>

        {/* Password (only for new users) */}
        {!user && (
          <LabelInputContainer className="mb-4">
            <Label htmlFor="password">Şifre *</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              placeholder="En az 6 karakter"
              className={cn(
                "mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-neutral-800 px-3 py-2 text-gray-900 dark:text-white placeholder-gray-500 focus:border-gray-900 dark:focus:border-gray-100 focus:outline-none focus:ring-1 focus:ring-gray-900 dark:focus:ring-gray-100",
                errors.password && "border-red-500 focus:border-red-500"
              )}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
          </LabelInputContainer>
        )}

        {/* Role */}
        <LabelInputContainer className="mb-4">
          <Label htmlFor="role">Rol *</Label>
          <select
            id="role"
            value={formData.role}
            onChange={(e) => handleInputChange("role", e.target.value)}
            className={cn(
              "mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-neutral-800 px-3 py-2 text-gray-900 dark:text-white focus:border-gray-900 dark:focus:border-gray-100 focus:outline-none focus:ring-1 focus:ring-gray-900 dark:focus:ring-gray-100"
            )}
          >
            <option value="user">Kullanıcı</option>
            <option value="organizer">Organizatör</option>
            <option value="admin">Admin</option>
          </select>
        </LabelInputContainer>

        {/* Department */}
        <LabelInputContainer className="mb-4">
          <Label htmlFor="department_id">Departman</Label>
          <select
            id="department_id"
            value={formData.department_id}
            onChange={(e) => handleInputChange("department_id", e.target.value)}
            className={cn(
              "mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-neutral-800 px-3 py-2 text-gray-900 dark:text-white focus:border-gray-900 dark:focus:border-gray-100 focus:outline-none focus:ring-1 focus:ring-gray-900 dark:focus:ring-gray-100"
            )}
          >
            <option value="">Departman Seçin</option>
            {departments?.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
        </LabelInputContainer>

        {/* Avatar Upload */}
        <LabelInputContainer className="mb-4">
          <Label htmlFor="avatar">Profil Fotoğrafı</Label>
          <div className="mt-2 space-y-4">
            {formData.avatar_url && (
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 overflow-hidden rounded-full">
                  <img 
                    src={formData.avatar_url} 
                    alt="Mevcut profil fotoğrafı" 
                    className="h-full w-full object-cover"
                  />
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Mevcut profil fotoğrafı
                </span>
              </div>
            )}
            <FileUpload
              ref={fileUploadRef}
              onUploadComplete={() => {}}
              maxSize={5} // 5MB
              accept="image/*"
              maxFiles={1}
              topic="user-avatars"
            />
          </div>
        </LabelInputContainer>

        {/* Action Buttons */}
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 relative h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] hover:bg-gradient-to-br hover:from-neutral-800 hover:to-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset] transition-all duration-200"
          >
            <span className="relative z-10 flex h-full w-full items-center justify-center text-sm">
              {isSubmitting ? (
                <>
                  <LoaderOne />
                  <span className="ml-2">{user ? "Güncelleniyor..." : "Oluşturuluyor..."}</span>
                </>
              ) : (
                user ? "Kullanıcıyı Güncelle" : "Kullanıcı Oluştur"
              )}
            </span>
            <BottomGradient />
          </button>

          <button
            type="button"
            onClick={handleReset}
            disabled={isSubmitting}
            className="group/btn relative flex h-10 w-full items-center justify-center rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 dark:border-gray-600 dark:bg-neutral-800 dark:text-gray-200 dark:hover:bg-neutral-700 sm:w-auto sm:px-4"
          >
            Temizle
          </button>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="group/btn relative flex h-10 w-full items-center justify-center rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 dark:border-gray-600 dark:bg-neutral-800 dark:text-gray-200 dark:hover:bg-neutral-700 sm:w-auto sm:px-4"
            >
              İptal
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

// Kullanıcı Listesi Bileşeni
const UsersList = ({ onEdit }: { onEdit: (user: User) => void }) => {
  const { data: users, isLoading, error } = useUsersWithDepartment();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");

  const { data: departments } = useDepartments();

  const filteredUsers = users?.filter(user => {
    const matchesSearch = searchTerm === "" || 
      user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = selectedRole === "" || user.role === selectedRole;
    const matchesDepartment = selectedDepartment === "" || user.department_id === selectedDepartment;

    return matchesSearch && matchesRole && matchesDepartment;
  });

  if (isLoading) return <LoaderOne />;
  if (error) return <div className="text-red-500">Kullanıcılar yüklenirken hata oluştu!</div>;

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <Label htmlFor="search">Ara</Label>
          <Input
            id="search"
            type="text"
            placeholder="Ad, soyad veya e-posta ile ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="role-filter">Rol</Label>
          <select
            id="role-filter"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-neutral-800 px-3 py-2 text-gray-900 dark:text-white focus:border-gray-900 dark:focus:border-gray-100 focus:outline-none focus:ring-1 focus:ring-gray-900 dark:focus:ring-gray-100"
          >
            <option value="">Tüm Roller</option>
            <option value="user">Kullanıcı</option>
            <option value="organizer">Organizatör</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div>
          <Label htmlFor="department-filter">Departman</Label>
          <select
            id="department-filter"
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-neutral-800 px-3 py-2 text-gray-900 dark:text-white focus:border-gray-900 dark:focus:border-gray-100 focus:outline-none focus:ring-1 focus:ring-gray-900 dark:focus:ring-gray-100"
          >
            <option value="">Tüm Departmanlar</option>
            {departments?.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Users Grid */}
      {filteredUsers && filteredUsers.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow dark:border-gray-700 dark:bg-neutral-800"
            >
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 overflow-hidden rounded-full bg-gray-200 dark:bg-neutral-700">
                  {user.avatar_url ? (
                    <img 
                      src={user.avatar_url} 
                      alt={`${user.first_name} ${user.last_name}`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-gray-500 dark:text-gray-400">
                      {user.first_name[0]}{user.last_name[0]}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                    {user.first_name} {user.last_name}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {user.email}
                  </p>
                </div>
              </div>
              
              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Rol:</span>
                  <span className={cn(
                    "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
                    user.role === 'admin' && "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
                    user.role === 'organizer' && "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
                    user.role === 'user' && "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  )}>
                    {user.role === 'admin' ? 'Admin' : user.role === 'organizer' ? 'Organizatör' : 'Kullanıcı'}
                  </span>
                </div>
                
                {user.department?.name && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Departman:</span>
                    <span className="text-xs text-gray-900 dark:text-white">
                      {user.department?.name}
                    </span>
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Kayıt:</span>
                  <span className="text-xs text-gray-900 dark:text-white">
                    {new Date(user.created_at).toLocaleDateString('tr-TR')}
                  </span>
                </div>
              </div>

              <div className="mt-4">
                <button
                  onClick={() => onEdit(user)}
                  className="w-full rounded-md bg-blue-600 px-3 py-2 text-xs font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Düzenle
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">
            {searchTerm || selectedRole || selectedDepartment 
              ? "Filtrelere uygun kullanıcı bulunamadı" 
              : "Henüz kullanıcı bulunmuyor"}
          </p>
        </div>
      )}
    </div>
  );
};

// Departman atama kısmı kaldırıldı - Kullanıcı formunda departman seçimi yapılabilir

export default function UserManagementPage() {
  const { data: currentUser, isLoading: isLoadingUser } = useCurrentUser();
  const [activeTab, setActiveTab] = useState<'list' | 'create'>('list');
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Admin kontrolü
  if (isLoadingUser) {
    return <LoaderOne />;
  }

  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Yetkisiz Erişim
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Bu sayfaya erişim için admin yetkisine sahip olmalısınız.
          </p>
        </div>
      </div>
    );
  }

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setActiveTab('create');
  };

  const handleFormSuccess = () => {
    setEditingUser(null);
    setActiveTab('list');
  };

  const handleFormCancel = () => {
    setEditingUser(null);
    setActiveTab('list');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Kullanıcı Yönetimi
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Sistem kullanıcılarını yönetin ve departmanlara atayın.
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8">
            <button
              onClick={() => {
                setActiveTab('list');
                setEditingUser(null);
              }}
              className={cn(
                "whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium",
                activeTab === 'list'
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              )}
            >
              Kullanıcı Listesi
            </button>
            
            <button
              onClick={() => {
                setActiveTab('create');
                setEditingUser(null);
              }}
              className={cn(
                "whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium",
                activeTab === 'create'
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              )}
            >
              {editingUser ? 'Kullanıcı Düzenle' : 'Kullanıcı Ekle'}
            </button>
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'list' && (
          <UsersList onEdit={handleEditUser} />
        )}
        
        {activeTab === 'create' && (
          <UserForm 
            user={editingUser || undefined}
            onSuccess={handleFormSuccess}
            onCancel={handleFormCancel}
          />
        )}
      </motion.div>
    </div>
  );
} 