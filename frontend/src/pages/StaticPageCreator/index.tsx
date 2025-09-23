import React, { useState, useRef, useEffect } from 'react';
import FormInput from '../../components/Base/Form/FormInput';
import FormLabel from '../../components/Base/Form/FormLabel';
import Button from '../../components/Base/Button';
import Ckeditor from '../../components/Base/Ckeditor/ClassicEditor';
import { FileText, Plus, Edit, Trash2, Eye, Calendar, Globe, Code, Type } from 'lucide-react';
import hljs from 'highlight.js';
import jsBeautify from 'js-beautify';
import '@/assets/css/vendors/highlight.css';

interface StaticPage {
  id: string;
  title: string;
  slug: string;
  content: string;
  status: 'published' | 'draft';
  createdAt: string;
  updatedAt: string;
}

interface PageForm {
  title: string;
  slug: string;
  content: string;
  status: 'published' | 'draft';
}

const initialPages: StaticPage[] = [
  {
    id: '1',
    title: 'Hakkımızda',
    slug: 'hakkimizda',
    content: '<h1>Hakkımızda</h1><p>Bu örnek bir sayfa içeriğidir.</p>',
    status: 'published',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20'
  },
  {
    id: '2',
    title: 'Gizlilik Politikası',
    slug: 'gizlilik-politikasi',
    content: '<h1>Gizlilik Politikası</h1><p>Gizlilik politikası içeriği...</p>',
    status: 'draft',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-18'
  }
];

const StaticPageCreator: React.FC = () => {
  const [pages, setPages] = useState<StaticPage[]>(initialPages);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<StaticPage | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewPage, setPreviewPage] = useState<StaticPage | null>(null);
  const [editorMode, setEditorMode] = useState<'visual' | 'code'>('visual');
  const codeEditorRef = useRef<HTMLTextAreaElement>(null);

  const [pageForm, setPageForm] = useState<PageForm>({
    title: '',
    slug: '',
    content: '',
    status: 'draft'
  });

  const resetForm = () => {
    setPageForm({
      title: '',
      slug: '',
      content: '',
      status: 'draft'
    });
    setEditingPage(null);
    setEditorMode('visual');
  };

  const formatCode = () => {
    if (pageForm.content) {
      const formatted = jsBeautify.html(pageForm.content, {
        indent_size: 2,
        wrap_line_length: 120,
        preserve_newlines: true,
        max_preserve_newlines: 2
      });
      setPageForm(prev => ({ ...prev, content: formatted }));
    }
  };

  const switchEditorMode = (mode: 'visual' | 'code') => {
    setEditorMode(mode);
    if (mode === 'code' && codeEditorRef.current) {
      // Apply syntax highlighting when switching to code mode
      setTimeout(() => {
        if (codeEditorRef.current) {
          hljs.highlightElement(codeEditorRef.current);
        }
      }, 100);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const openModal = (page?: StaticPage) => {
    if (page) {
      setEditingPage(page);
      setPageForm({
        title: page.title,
        slug: page.slug,
        content: page.content,
        status: page.status
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

  const openPreview = (page: StaticPage) => {
    setPreviewPage(page);
    setIsPreviewOpen(true);
  };

  const closePreview = () => {
    setIsPreviewOpen(false);
    setPreviewPage(null);
  };

  const handleTitleChange = (value: string) => {
    setPageForm(prev => ({
      ...prev,
      title: value,
      slug: editingPage ? prev.slug : generateSlug(value)
    }));
  };

  const handleSavePage = async () => {
    if (!pageForm.title.trim() || !pageForm.slug.trim()) {
      alert('Lütfen başlık ve slug alanlarını doldurun.');
      return;
    }

    // Check for duplicate slug
    const existingPage = pages.find(p =>
      p.slug === pageForm.slug && p.id !== editingPage?.id
    );
    if (existingPage) {
      alert('Bu slug zaten kullanılıyor. Lütfen farklı bir slug girin.');
      return;
    }

    setIsSaving(true);
    try {
      const now = new Date().toISOString().split('T')[0];

      if (editingPage) {
        // Update existing page
        setPages(prev => prev.map(page =>
          page.id === editingPage.id
            ? { ...page, ...pageForm, updatedAt: now }
            : page
        ));
      } else {
        // Add new page
        const newPage: StaticPage = {
          id: Date.now().toString(),
          ...pageForm,
          createdAt: now,
          updatedAt: now
        };
        setPages(prev => [...prev, newPage]);
      }

      // TODO: Implement API call
      console.log('Saving page:', pageForm);
      closeModal();
      alert(editingPage ? 'Sayfa güncellendi!' : 'Sayfa oluşturuldu!');
    } catch (error) {
      console.error('Save error:', error);
      alert('Kaydetme sırasında bir hata oluştu!');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeletePage = async (pageId: string) => {
    const page = pages.find(p => p.id === pageId);
    if (!confirm(`"${page?.title}" sayfasını silmek istediğinizden emin misiniz?`)) {
      return;
    }

    try {
      setPages(prev => prev.filter(page => page.id !== pageId));
      // TODO: Implement API call
      console.log('Deleting page:', pageId);
      alert('Sayfa silindi!');
    } catch (error) {
      console.error('Delete error:', error);
      alert('Silme sırasında bir hata oluştu!');
    }
  };

  const filteredPages = pages.filter(page => {
    const matchesSearch = page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         page.slug.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || page.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'draft': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <FileText className="w-6 h-6" />
              Statik Sayfa Oluşturucu
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Statik sayfalar oluşturun ve yönetin
            </p>
          </div>
          <Button
            variant="primary"
            onClick={() => openModal()}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Yeni Sayfa Oluştur
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <FormLabel htmlFor="search">Arama</FormLabel>
            <FormInput
              id="search"
              type="text"
              placeholder="Sayfa başlığı veya slug ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
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
              <option value="published">Yayınlanmış</option>
              <option value="draft">Taslak</option>
            </select>
          </div>
        </div>
      </div>

      {/* Pages Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Sayfa
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Slug
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Durum
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Oluşturulma
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Güncelleme
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredPages.map((page) => (
                <tr key={page.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                          <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {page.title}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      <Globe className="w-3 h-3" />
                      /{page.slug}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(page.status)}`}>
                      {page.status === 'published' ? 'Yayınlanmış' : 'Taslak'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {page.createdAt}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {page.updatedAt}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="soft-secondary"
                        onClick={() => openPreview(page)}
                        className="text-gray-600 hover:text-gray-900 p-1"
                        title="Önizleme"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="soft-secondary"
                        onClick={() => openModal(page)}
                        className="text-blue-600 hover:text-blue-900 p-1"
                        title="Düzenle"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="soft-secondary"
                        onClick={() => handleDeletePage(page.id)}
                        className="text-red-600 hover:text-red-900 p-1"
                        title="Sil"
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

        {filteredPages.length === 0 && (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Sayfa bulunamadı</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Arama kriterlerinize uygun sayfa bulunamadı.
            </p>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                {editingPage ? 'Sayfa Düzenle' : 'Yeni Sayfa Oluştur'}
              </h3>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <FormLabel htmlFor="pageTitle">Sayfa Başlığı</FormLabel>
                    <FormInput
                      id="pageTitle"
                      type="text"
                      value={pageForm.title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      placeholder="Sayfa başlığını girin"
                    />
                  </div>

                  <div>
                    <FormLabel htmlFor="pageSlug">Slug (URL)</FormLabel>
                    <FormInput
                      id="pageSlug"
                      type="text"
                      value={pageForm.slug}
                      onChange={(e) => setPageForm(prev => ({ ...prev, slug: e.target.value }))}
                      placeholder="sayfa-url-slug"
                    />
                  </div>
                </div>

                <div>
                  <FormLabel htmlFor="pageStatus">Durum</FormLabel>
                  <select
                    id="pageStatus"
                    value={pageForm.status}
                    onChange={(e) => setPageForm(prev => ({ ...prev, status: e.target.value as 'published' | 'draft' }))}
                    className="w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                  >
                    <option value="draft">Taslak</option>
                    <option value="published">Yayınla</option>
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <FormLabel htmlFor="pageContent">İçerik</FormLabel>
                    <div className="flex items-center gap-2">
                      {editorMode === 'code' && (
                        <Button
                          type="button"
                          variant="soft-secondary"
                          onClick={formatCode}
                          className="text-xs px-3 py-1 flex items-center gap-1"
                        >
                          <Code className="w-3 h-3" />
                          Kodu Biçimlendir
                        </Button>
                      )}
                      <div className="flex rounded-md border border-gray-300 dark:border-gray-700 overflow-hidden">
                        <button
                          type="button"
                          onClick={() => switchEditorMode('visual')}
                          className={`px-3 py-1 text-xs flex items-center gap-1 transition-colors ${
                            editorMode === 'visual'
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                          }`}
                        >
                          <Type className="w-3 h-3" />
                          Görsel
                        </button>
                        <button
                          type="button"
                          onClick={() => switchEditorMode('code')}
                          className={`px-3 py-1 text-xs flex items-center gap-1 transition-colors ${
                            editorMode === 'code'
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                          }`}
                        >
                          <Code className="w-3 h-3" />
                          Kod
                        </button>
                      </div>
                    </div>
                  </div>

                  {editorMode === 'visual' ? (
                    <div className="border border-gray-300 dark:border-gray-700 rounded-md">
                      <Ckeditor
                        value={pageForm.content}
                        onChange={(data: string) => setPageForm(prev => ({ ...prev, content: data }))}
                        config={{
                          toolbar: {
                            items: [
                              'heading', '|',
                              'bold', 'italic', 'underline', 'strikethrough', '|',
                              'fontSize', 'fontColor', 'fontBackgroundColor', '|',
                              'alignment', '|',
                              'numberedList', 'bulletedList', '|',
                              'outdent', 'indent', '|',
                              'link', 'blockQuote', 'insertTable', '|',
                              'undo', 'redo', '|',
                              'sourceEditing'
                            ]
                          },
                          heading: {
                            options: [
                              { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
                              { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
                              { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
                              { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' }
                            ]
                          },
                          fontSize: {
                            options: ['tiny', 'small', 'default', 'big', 'huge']
                          }
                        }}
                        className="min-h-96"
                      />
                    </div>
                  ) : (
                    <div className="border border-gray-300 dark:border-gray-700 rounded-md overflow-hidden">
                      <div className="bg-gray-50 dark:bg-gray-800 px-3 py-2 border-b border-gray-300 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">HTML Kod Editörü</span>
                          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                            <kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">Ctrl+A</kbd>
                            <span>Tümünü Seç</span>
                          </div>
                        </div>
                      </div>
                      <textarea
                        ref={codeEditorRef}
                        value={pageForm.content}
                        onChange={(e) => setPageForm(prev => ({ ...prev, content: e.target.value }))}
                        className="w-full h-96 p-4 font-mono text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-0 resize-none focus:ring-0 focus:outline-none"
                        placeholder="HTML kodunuzu buraya yazın..."
                        style={{
                          fontFamily: 'Monaco, Menlo, "Ubuntu Mono", Consolas, source-code-pro, monospace',
                          lineHeight: '1.5',
                          tabSize: 2
                        }}
                        onKeyDown={(e) => {
                          // Handle tab key for indentation
                          if (e.key === 'Tab') {
                            e.preventDefault();
                            const start = e.currentTarget.selectionStart;
                            const end = e.currentTarget.selectionEnd;
                            const value = e.currentTarget.value;
                            const newValue = value.substring(0, start) + '  ' + value.substring(end);
                            e.currentTarget.value = newValue;
                            e.currentTarget.selectionStart = e.currentTarget.selectionEnd = start + 2;
                            setPageForm(prev => ({ ...prev, content: newValue }));
                          }
                        }}
                      />
                    </div>
                  )}
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
                  onClick={handleSavePage}
                  disabled={isSaving}
                >
                  {isSaving ? 'Kaydediliyor...' : (editingPage ? 'Güncelle' : 'Oluştur')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {isPreviewOpen && previewPage && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-full max-w-6xl shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Önizleme: {previewPage.title}
                </h3>
                <div className="flex items-center gap-3">
                  <div className="flex rounded-md border border-gray-300 dark:border-gray-700 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setEditorMode('visual')}
                      className={`px-3 py-1 text-xs flex items-center gap-1 transition-colors ${
                        editorMode === 'visual'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      <Eye className="w-3 h-3" />
                      Önizleme
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditorMode('code')}
                      className={`px-3 py-1 text-xs flex items-center gap-1 transition-colors ${
                        editorMode === 'code'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      <Code className="w-3 h-3" />
                      Kaynak Kod
                    </button>
                  </div>
                  <Button
                    variant="secondary"
                    onClick={closePreview}
                  >
                    Kapat
                  </Button>
                </div>
              </div>

              {editorMode === 'visual' ? (
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-gray-50 dark:bg-gray-900">
                  <div
                    className="prose prose-sm max-w-none dark:prose-invert"
                    dangerouslySetInnerHTML={{ __html: previewPage.content }}
                  />
                </div>
              ) : (
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 dark:bg-gray-800 px-3 py-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400">HTML Kaynak Kodu</span>
                  </div>
                  <pre className="p-4 bg-gray-900 text-gray-100 overflow-x-auto max-h-96">
                    <code
                      className="text-sm language-html"
                      dangerouslySetInnerHTML={{
                        __html: hljs.highlight(
                          jsBeautify.html(previewPage.content, {
                            indent_size: 2,
                            wrap_line_length: 80,
                            preserve_newlines: true,
                            max_preserve_newlines: 2
                          }),
                          { language: 'html' }
                        ).value
                      }}
                    />
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaticPageCreator;