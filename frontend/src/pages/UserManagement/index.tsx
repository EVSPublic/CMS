import React, { useState, useEffect } from 'react';
import FormInput from '../../components/Base/Form/FormInput';
import FormLabel from '../../components/Base/Form/FormLabel';
import Button from '../../components/Base/Button';
import Lucide from '../../components/Base/Lucide';
import { Users, Plus, Edit, Trash2, Mail, Shield, Calendar } from 'lucide-react';
import { usersService, User as ApiUser } from '../../services/users';
import { useScrollEffect } from '../../hooks/useScrollEffect';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  status: 'active' | 'inactive';
  createdAt: string;
  lastLogin?: string;
}

interface UserForm {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'editor' | 'viewer';
  status: 'active' | 'inactive';
}

const initialUsers: User[] = [];

const UserManagementPage: React.FC = () => {
  const isScrolled = useScrollEffect();
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [userForm, setUserForm] = useState<UserForm>({
    name: '',
    email: '',
    password: '',
    role: 'viewer',
    status: 'active'
  });

  // Load users on component mount
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await usersService.getUsers({ page: 1, pageSize: 100 }); // Load all users

      if (response.ok && response.data) {
        const apiUsers = response.data.users;
        const convertedUsers: User[] = apiUsers.map(u => ({
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role.toLowerCase() as 'admin' | 'editor' | 'viewer',
          status: u.status.toLowerCase() === 'active' ? 'active' : 'inactive',
          createdAt: new Date(u.createdAt).toISOString().split('T')[0],
          lastLogin: u.lastLogin ? new Date(u.lastLogin).toISOString().split('T')[0] : undefined
        }));

        setUsers(convertedUsers);
      }
    } catch (err) {
      setError('Kullanıcılar yüklenirken bir hata oluştu');
      console.error('Users load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setUserForm({
      name: '',
      email: '',
      password: '',
      role: 'viewer',
      status: 'active'
    });
    setEditingUser(null);
  };

  const openModal = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setUserForm({
        name: user.name,
        email: user.email,
        password: '', // Don't pre-fill password for editing
        role: user.role,
        status: user.status
      });
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleSaveUser = async () => {
    if (!userForm.name.trim() || !userForm.email.trim()) {
      alert('Lütfen tüm gerekli alanları doldurun.');
      return;
    }

    if (!editingUser && !userForm.password.trim()) {
      alert('Lütfen şifre alanını doldurun.');
      return;
    }

    setIsSaving(true);
    try {
      if (editingUser) {
        // Update existing user
        const response = await usersService.updateUser(editingUser.id, {
          name: userForm.name,
          email: userForm.email,
          role: userForm.role.charAt(0).toUpperCase() + userForm.role.slice(1), // Capitalize first letter
          status: userForm.status.charAt(0).toUpperCase() + userForm.status.slice(1)
        });

        if (response.ok) {
          await loadUsers(); // Reload to get updated list
          closeModal();
          alert('Kullanıcı güncellendi!');
        } else {
          alert('Kullanıcı güncellenirken bir hata oluştu: ' + (response.error?.message || 'Bilinmeyen hata'));
        }
      } else {
        // Create new user
        const response = await usersService.createUser({
          name: userForm.name,
          email: userForm.email,
          password: userForm.password,
          role: userForm.role.charAt(0).toUpperCase() + userForm.role.slice(1) // Capitalize first letter
        });

        if (response.ok) {
          await loadUsers(); // Reload to get updated list
          closeModal();
          alert('Kullanıcı eklendi!');
        } else {
          alert('Kullanıcı eklenirken bir hata oluştu: ' + (response.error?.message || 'Bilinmeyen hata'));
        }
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('Kaydetme sırasında bir hata oluştu!');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    // Get current user from localStorage
    const currentUserData = localStorage.getItem('user');
    if (currentUserData) {
      try {
        const currentUser = JSON.parse(currentUserData);
        if (currentUser.id === userId || currentUser.id === parseInt(userId)) {
          alert('Kendi hesabınızı silemezsiniz!');
          return;
        }
      } catch (e) {
        console.error('Error parsing current user:', e);
      }
    }

    const user = users.find(u => u.id === userId);
    if (!confirm(`"${user?.name}" kullanıcısını silmek istediğinizden emin misiniz?`)) {
      return;
    }

    try {
      const response = await usersService.deleteUser(userId);

      if (response.ok) {
        await loadUsers(); // Reload to get updated list
        alert('Kullanıcı silindi!');
      } else {
        console.error('Delete failed:', response.error);
        alert('Kullanıcı silinirken bir hata oluştu: ' + (response.error?.message || 'Bilinmeyen hata'));
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Silme sırasında bir hata oluştu!');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'editor': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'viewer': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'inactive': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Lucide icon="Loader2" className="mx-auto h-12 w-12 text-gray-400 animate-spin mb-3" />
            <p className="text-gray-500 dark:text-gray-400">Kullanıcılar yükleniyor...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-2xl font-semibold flex items-center gap-2 transition-colors ${
              isScrolled ? 'text-gray-900 dark:text-white' : 'text-white dark:text-white'
            }`}>
              <Users className="w-6 h-6" />
              Kullanıcı Yönetimi
            </h1>
            <p className={`mt-1 text-sm transition-colors ${
              isScrolled ? 'text-gray-600 dark:text-gray-400' : 'text-gray-200 dark:text-gray-300'
            }`}>
              Sistem kullanıcılarını yönetin ve yetkilendirin
            </p>
            {error && (
              <div className="mt-2 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}
          </div>
          <Button
            variant="primary"
            onClick={() => openModal()}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Yeni Kullanıcı Ekle
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <FormLabel htmlFor="search">Arama</FormLabel>
            <FormInput
              id="search"
              type="text"
              placeholder="İsim veya e-posta ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <FormLabel htmlFor="roleFilter">Rol</FormLabel>
            <select
              id="roleFilter"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            >
              <option value="all">Tüm Roller</option>
              <option value="admin">Admin</option>
              <option value="editor">Editör</option>
              <option value="viewer">Görüntüleyici</option>
            </select>
          </div>
          <div>
            <FormLabel htmlFor="statusFilter">Durum</FormLabel>
            <select
              id="statusFilter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            >
              <option value="all">Tüm Durumlar</option>
              <option value="active">Aktif</option>
              <option value="inactive">Pasif</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Kullanıcı
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Rol
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Durum
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Oluşturulma
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Son Giriş
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium gap-1 ${getRoleBadgeColor(user.role)}`}>
                      <Shield className="w-3 h-3" />
                      {user.role === 'admin' ? 'Admin' : user.role === 'editor' ? 'Editör' : 'Görüntüleyici'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(user.status)}`}>
                      {user.status === 'active' ? 'Aktif' : 'Pasif'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {user.createdAt}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {user.lastLogin || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="soft-secondary"
                        onClick={() => openModal(user)}
                        className="text-blue-600 hover:text-blue-900 p-1"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="soft-secondary"
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-600 hover:text-red-900 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Kullanıcı bulunamadı</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Arama kriterlerinize uygun kullanıcı bulunamadı.
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                {editingUser ? 'Kullanıcı Düzenle' : 'Yeni Kullanıcı Ekle'}
              </h3>

              <div className="space-y-4">
                <div>
                  <FormLabel htmlFor="userName">İsim</FormLabel>
                  <FormInput
                    id="userName"
                    type="text"
                    value={userForm.name}
                    onChange={(e) => setUserForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Kullanıcı adını girin"
                  />
                </div>

                <div>
                  <FormLabel htmlFor="userEmail">E-posta</FormLabel>
                  <FormInput
                    id="userEmail"
                    type="email"
                    value={userForm.email}
                    onChange={(e) => setUserForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="E-posta adresini girin"
                  />
                </div>

                {!editingUser && (
                  <div>
                    <FormLabel htmlFor="userPassword">Şifre</FormLabel>
                    <FormInput
                      id="userPassword"
                      type="password"
                      value={userForm.password}
                      onChange={(e) => setUserForm(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="Şifre girin (minimum 8 karakter)"
                    />
                  </div>
                )}

                <div>
                  <FormLabel htmlFor="userRole">Rol</FormLabel>
                  <select
                    id="userRole"
                    value={userForm.role}
                    onChange={(e) => setUserForm(prev => ({ ...prev, role: e.target.value as 'admin' | 'editor' | 'viewer' }))}
                    className="w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                  >
                    <option value="viewer">Görüntüleyici</option>
                    <option value="editor">Editör</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div>
                  <FormLabel htmlFor="userStatus">Durum</FormLabel>
                  <select
                    id="userStatus"
                    value={userForm.status}
                    onChange={(e) => setUserForm(prev => ({ ...prev, status: e.target.value as 'active' | 'inactive' }))}
                    className="w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                  >
                    <option value="active">Aktif</option>
                    <option value="inactive">Pasif</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 mt-6">
                <Button
                  variant="secondary"
                  onClick={closeModal}
                  disabled={isSaving}
                >
                  İptal
                </Button>
                <Button
                  variant="primary"
                  onClick={handleSaveUser}
                  disabled={isSaving}
                >
                  {isSaving ? 'Kaydediliyor...' : (editingUser ? 'Güncelle' : 'Ekle')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagementPage;