"use client";
import { useState, useRef } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { useCurrentUser } from "@/hooks/useAuth";
import { 
  useDepartments, 
  useDepartmentStatistics, 
  useUsersWithDepartment, 
  useUsersWithoutDepartment,
  useCreateDepartment,
  useUpdateDepartment,
  useDeleteDepartment,
  useAssignUserToDepartment,
  useRemoveUserFromDepartment
} from "@/hooks/useDepartments";
import { LoaderOne } from "@/components/ui/loader";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FileUpload, FileUploadRef } from "@/components/ui/file-upload";
import { CreateDepartmentRequest, UpdateDepartmentRequest, Department, User } from "@/lib/types/api";

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

// Departman Formu Bileşeni
const DepartmentForm = ({ 
  department, 
  onSuccess, 
  onCancel 
}: { 
  department?: Department; 
  onSuccess?: () => void; 
  onCancel?: () => void; 
}) => {
  const [formData, setFormData] = useState<CreateDepartmentRequest>({
    name: department?.name || "",
    description: department?.description || "",
    image_url: department?.image_url || "",
  });

  const [errors, setErrors] = useState<Partial<CreateDepartmentRequest>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createMutation = useCreateDepartment();
  const updateMutation = useUpdateDepartment();
  const fileUploadRef = useRef<FileUploadRef>(null);

  const handleInputChange = (field: keyof CreateDepartmentRequest, value: string) => {
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
    const newErrors: Partial<CreateDepartmentRequest> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Departman adı gereklidir";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Departman açıklaması gereklidir";
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

      // Eğer yeni dosya seçilmişse önce yükle
      if (fileUploadRef.current?.hasPendingFiles()) {
        try {
          console.log("Yeni dosya yükleniyor...");
          const uploadResponses = await fileUploadRef.current.uploadFiles();
          if (uploadResponses.length > 0) {
            const uploadResponse = uploadResponses[0]; // FileUploadResponse
            const uploadedFile = uploadResponse.file; // UploadedFile
            const imageUrl = uploadedFile.cdnUrl || "";
            console.log("Yüklenen dosya URL'si:", { uploadResponse, uploadedFile, imageUrl });
            finalFormData.image_url = imageUrl;
          }
        } catch (uploadError) {
          console.error("File upload error:", uploadError);
          alert('Dosya yükleme hatası! Lütfen tekrar deneyin.');
          setIsSubmitting(false);
          return;
        }
      }

      console.log("Form gönderiliyor:", finalFormData);

      if (department) {
        // Update existing department
        await updateMutation.mutateAsync({
          id: department.id,
          data: finalFormData
        });
      } else {
        // Create new department
        await createMutation.mutateAsync(finalFormData);
      }

      alert(department ? "Departman başarıyla güncellendi!" : "Departman başarıyla oluşturuldu!");
      
      // Başarılı yükleme sonrası dosya listesini temizle
      fileUploadRef.current?.clearFiles();
      
      onSuccess?.();
    } catch (error) {
      console.error("Department form error:", error);
      alert(`Hata: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: department?.name || "",
      description: department?.description || "",
      image_url: department?.image_url || "",
    });
    setErrors({});
    // Dosya listesini de temizle
    fileUploadRef.current?.clearFiles();
  };

  return (
    <div className="shadow-input mx-auto w-full max-w-2xl rounded-none bg-white p-6 md:rounded-2xl md:p-8 dark:bg-black">
      <h3 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
        {department ? "Departman Düzenle" : "Yeni Departman Oluştur"}
      </h3>

      <form className="my-6" onSubmit={handleSubmit}>
        {/* Name */}
        <LabelInputContainer className="mb-4">
          <Label htmlFor="name">Departman Adı *</Label>
          <Input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            placeholder="Departman adını girin"
            className={cn(
              "mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-neutral-800 px-3 py-2 text-gray-900 dark:text-white placeholder-gray-500 focus:border-gray-900 dark:focus:border-gray-100 focus:outline-none focus:ring-1 focus:ring-gray-900 dark:focus:ring-gray-100",
              errors.name && "border-red-500 focus:border-red-500"
            )}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </LabelInputContainer>

        {/* Description */}
        <LabelInputContainer className="mb-4">
          <Label htmlFor="description">Departman Açıklaması *</Label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            placeholder="Departman açıklamasını girin"
            rows={3}
            className={cn(
              "mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-neutral-800 px-3 py-2 text-gray-900 dark:text-white placeholder-gray-500 focus:border-gray-900 dark:focus:border-gray-100 focus:outline-none focus:ring-1 focus:ring-gray-900 dark:focus:ring-gray-100 resize-none",
              errors.description && "border-red-500 focus:border-red-500"
            )}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
          )}
        </LabelInputContainer>

        {/* Image Upload */}
        <LabelInputContainer className="mb-4">
          <Label htmlFor="image">Departman Görseli</Label>
          <div className="mt-2 space-y-4">
            {formData.image_url && (
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 overflow-hidden rounded-lg">
                  <img 
                    src={formData.image_url} 
                    alt="Mevcut departman görseli" 
                    className="h-full w-full object-cover"
                  />
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Mevcut departman görseli
                </span>
              </div>
            )}
            <FileUpload
              ref={fileUploadRef}
              onUploadComplete={(files) => {
                if (files.length > 0) {
                  const uploadResponse = files[0]; // Bu bir FileUploadResponse
                  const uploadedFile = uploadResponse.file; // Bu bir UploadedFile
                  const imageUrl = uploadedFile.cdnUrl || "";
                  console.log("Dosya yüklendi:", { uploadResponse, uploadedFile, imageUrl });
                  handleInputChange("image_url", imageUrl);
                }
              }}
              maxSize={10} // 10MB
              accept="image/*"
              maxFiles={1}
              topic="departments"
              autoUpload={false}
            />
          </div>
        </LabelInputContainer>

        {/* Action Buttons */}
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
          <HoverBorderGradient
            containerClassName="flex-1"
            className="bg-black text-white dark:bg-white dark:text-black group/btn relative block w-full h-10 rounded-md font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
          >
            <button
              type="submit"
              disabled={isSubmitting}
              className="relative z-10 flex h-full w-full items-center justify-center text-sm font-medium transition-colors disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <LoaderOne />
                  {department ? "Güncelleniyor..." : "Oluşturuluyor..."}
                </>
              ) : (
                department ? "Departmanı Güncelle" : "Departman Oluştur"
              )}
            </button>
            <BottomGradient />
          </HoverBorderGradient>

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

// Kullanıcı Departman Atama Bileşeni
const UserDepartmentAssignment = () => {
  const { data: usersWithDepartment, isLoading: loadingWithDept } = useUsersWithDepartment();
  const { data: usersWithoutDepartment, isLoading: loadingWithoutDept } = useUsersWithoutDepartment();
  const { data: departments } = useDepartments();
  const assignMutation = useAssignUserToDepartment();
  const removeMutation = useRemoveUserFromDepartment();

  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>("");

  const handleAssignUser = async () => {
    if (!selectedUserId || !selectedDepartmentId) {
      alert("Lütfen kullanıcı ve departman seçin!");
      return;
    }

    try {
      await assignMutation.mutateAsync({
        userId: selectedUserId,
        departmentId: selectedDepartmentId
      });
      alert("Kullanıcı başarıyla departmana atandı!");
      setSelectedUserId("");
      setSelectedDepartmentId("");
    } catch (error) {
      console.error("Assign user error:", error);
      alert(`Hata: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
    }
  };

  const handleRemoveUser = async (userId: string) => {
    if (!confirm("Bu kullanıcıyı departmandan çıkarmak istediğinizden emin misiniz?")) {
      return;
    }

    try {
      await removeMutation.mutateAsync(userId);
      alert("Kullanıcı başarıyla departmandan çıkarıldı!");
    } catch (error) {
      console.error("Remove user error:", error);
      alert(`Hata: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
    }
  };

  if (loadingWithDept || loadingWithoutDept) {
    return <LoaderOne />;
  }

  return (
    <div className="space-y-8">
      {/* User Assignment Form */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-neutral-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Kullanıcı Departman Atama
        </h3>
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="user-select">Kullanıcı Seç</Label>
            <select
              id="user-select"
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-neutral-800 px-3 py-2 text-gray-900 dark:text-white focus:border-gray-900 dark:focus:border-gray-100 focus:outline-none focus:ring-1 focus:ring-gray-900 dark:focus:ring-gray-100"
            >
              <option value="">Kullanıcı Seçin</option>
              {usersWithoutDepartment?.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.first_name} {user.last_name} ({user.email})
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <Label htmlFor="department-select">Departman Seç</Label>
            <select
              id="department-select"
              value={selectedDepartmentId}
              onChange={(e) => setSelectedDepartmentId(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-neutral-800 px-3 py-2 text-gray-900 dark:text-white focus:border-gray-900 dark:focus:border-gray-100 focus:outline-none focus:ring-1 focus:ring-gray-900 dark:focus:ring-gray-100"
            >
              <option value="">Departman Seçin</option>
              {departments?.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="mt-4">
          <HoverBorderGradient
            containerClassName="w-full sm:w-auto"
            className="bg-blue-600 text-white dark:bg-blue-700 group/btn relative block w-full h-10 rounded-md font-medium sm:w-auto sm:px-6"
          >
            <button
              onClick={handleAssignUser}
              disabled={!selectedUserId || !selectedDepartmentId || assignMutation.isPending}
              className="relative z-10 flex h-full w-full items-center justify-center text-sm font-medium transition-colors disabled:opacity-50"
            >
              {assignMutation.isPending ? (
                <>
                  <LoaderOne />
                  Atanıyor...
                </>
              ) : (
                "Kullanıcıyı Ata"
              )}
            </button>
          </HoverBorderGradient>
        </div>
      </div>

      {/* Users with Departments */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-neutral-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Departmanlı Kullanıcılar
        </h3>
        
        {usersWithDepartment && usersWithDepartment.length > 0 ? (
          <div className="space-y-4">
            {usersWithDepartment.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between rounded-lg border border-gray-100 p-4 dark:border-gray-700"
              >
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 overflow-hidden rounded-full bg-gray-200 dark:bg-neutral-700">
                    {user.avatar_url     ? (
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
    <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {user.first_name} {user.last_name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {user.email}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {user.department?.name || 'Departman Yok'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {user.role === 'admin' ? 'Admin' : user.role === 'organizer' ? 'Organizatör' : 'Kullanıcı'}
                    </p>
                  </div>
                  
                  <button
                    onClick={() => handleRemoveUser(user.id)}
                    disabled={removeMutation.isPending}
                    className="rounded-md bg-red-600 px-3 py-2 text-xs font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
                  >
                    {removeMutation.isPending ? (
                      <LoaderOne />
                    ) : (
                      "Çıkar"
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">
            Henüz departmana atanmış kullanıcı bulunmuyor.
          </p>
        )}
      </div>
    </div>
  );
};

export default function DepartmentManagementPage() {
  const { data: currentUser, isLoading: isLoadingUser } = useCurrentUser();
  const { data: departments, isLoading: isLoadingDepartments } = useDepartments();
  const { data: departmentStatistics } = useDepartmentStatistics();
  const [activeTab, setActiveTab] = useState<'overview' | 'create' | 'assign'>('overview');
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);

  const deleteMutation = useDeleteDepartment();

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

  const handleDeleteDepartment = async (id: string, name: string) => {
    if (!confirm(`"${name}" departmanını silmek istediğinizden emin misiniz?`)) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(id);
      alert("Departman başarıyla silindi!");
    } catch (error) {
      console.error("Department deletion error:", error);
      alert(`Hata: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
    }
  };

  const handleEditDepartment = (department: Department) => {
    setEditingDepartment(department);
    setActiveTab('create');
  };

  const handleFormSuccess = () => {
    setEditingDepartment(null);
    setActiveTab('overview');
  };

  const handleFormCancel = () => {
    setEditingDepartment(null);
    setActiveTab('overview');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Departman Yönetimi
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Departmanları yönetin ve kullanıcıları departmanlara atayın.
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8">
            <button
              onClick={() => {
                setActiveTab('overview');
                setEditingDepartment(null);
              }}
              className={cn(
                "whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium",
                activeTab === 'overview'
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              )}
            >
              Genel Bakış
            </button>
            
            <button
              onClick={() => {
                setActiveTab('create');
                setEditingDepartment(null);
              }}
              className={cn(
                "whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium",
                activeTab === 'create'
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              )}
            >
              {editingDepartment ? 'Departman Düzenle' : 'Departman Oluştur'}
            </button>
            
            <button
              onClick={() => {
                setActiveTab('assign');
                setEditingDepartment(null);
              }}
              className={cn(
                "whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium",
                activeTab === 'assign'
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              )}
            >
              Kullanıcı Atama
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
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Department Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {departmentStatistics?.map((stat) => (
                <div key={stat.department_id} className="bg-white dark:bg-neutral-800 p-6 rounded-xl shadow-lg">
                  <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mb-4">
                    {stat.department_name}
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Toplam Üye:</span>
                      <span className="font-medium text-neutral-800 dark:text-neutral-200">
                        {stat.member_count}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Admin:</span>
                      <span className="font-medium text-red-600 dark:text-red-400">
                        {stat.admin_count}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Organizatör:</span>
                      <span className="font-medium text-blue-600 dark:text-blue-400">
                        {stat.organizer_count}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Kullanıcı:</span>
                      <span className="font-medium text-green-600 dark:text-green-400">
                        {stat.user_count}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Department List */}
            <div className="shadow-input mx-auto w-full max-w-6xl rounded-none bg-white p-6 md:rounded-2xl md:p-8 dark:bg-black">
              <h3 className="text-xl font-bold text-neutral-800 dark:text-neutral-200 mb-6">
                Departmanlar
              </h3>
              
              {isLoadingDepartments ? (
                <div className="flex items-center justify-center p-8">
                  <LoaderOne />
                </div>
              ) : departments && departments.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {departments.map((department) => (
                    <div key={department.id} className="bg-gray-50 dark:bg-neutral-900 p-6 rounded-lg">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mb-2">
                            {department.name}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            {department.description}
                          </p>
                        </div>
                        {department.image_url && (
                          <div className="ml-4 h-16 w-16 overflow-hidden rounded-lg">
                            <img 
                              src={department.image_url} 
                              alt={department.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditDepartment(department)}
                          className="flex-1 px-3 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        >
                          Düzenle
                        </button>
                        <button
                          onClick={() => handleDeleteDepartment(department.id, department.name)}
                          disabled={deleteMutation.isPending}
                          className="flex-1 px-3 py-2 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50"
                        >
                                                     {deleteMutation.isPending ? <LoaderOne /> : "Sil"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">
                    Henüz departman eklenmemiş.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
        
        {activeTab === 'create' && (
          <DepartmentForm 
            department={editingDepartment || undefined}
            onSuccess={handleFormSuccess}
            onCancel={handleFormCancel}
          />
        )}
        
        {activeTab === 'assign' && (
          <UserDepartmentAssignment />
        )}
      </motion.div>
    </div>
  );
}
