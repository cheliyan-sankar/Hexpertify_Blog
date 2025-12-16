'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Plus, Edit, Trash2, Search, ArrowLeft, Globe } from 'lucide-react';
import AdminNav from '@/components/admin/AdminNav';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import { fetchAllSEO, deleteSEO } from '@/lib/actions';

interface SEOPage {
  page: string;
  title: string;
  description: string;
  updatedAt: string;
}

export default function SEOManagementPage() {
  const [seoPages, setSeoPages] = useState<SEOPage[]>([]);
  const [filteredPages, setFilteredPages] = useState<SEOPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadSEO();
  }, []);

  useEffect(() => {
    filterPages();
  }, [seoPages, searchQuery]);

  const loadSEO = async () => {
    try {
      const data = await fetchAllSEO();
      setSeoPages(data);
    } catch (error) {
      console.error('Error fetching SEO data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterPages = () => {
    let filtered = [...seoPages];

    if (searchQuery) {
      filtered = filtered.filter(
        (page) =>
          page.page.toLowerCase().includes(searchQuery.toLowerCase()) ||
          page.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredPages(filtered);
  };

  const handleDelete = async (page: string) => {
    if (!confirm(`Are you sure you want to delete SEO settings for "${page}"?`)) return;

    try {
      await deleteSEO(page);
      loadSEO();
    } catch (error) {
      console.error('Error deleting SEO:', error);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <AdminNav />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link href="/admin/dashboard">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft size={18} className="mr-2" />
              Back to Dashboard
            </Button>
          </Link>

          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">SEO Management</h1>
              <p className="text-gray-600 mt-2">
                {filteredPages.length} of {seoPages.length} pages
              </p>
            </div>
            <Link href="/admin/seo/new">
              <Button className="flex items-center gap-2" style={{ backgroundColor: '#450BC8' }}>
                <Plus size={20} />
                New SEO Page
              </Button>
            </Link>
          </div>

          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  placeholder="Search pages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>All SEO Pages</CardTitle>
              <CardDescription>Manage SEO metadata for all pages</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">Loading SEO data...</div>
              ) : filteredPages.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  {searchQuery ? 'No pages found' : 'No SEO pages configured yet. Create your first one!'}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredPages.map((seoPage) => (
                    <div
                      key={seoPage.page}
                      className="flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Globe size={24} className="text-purple-600" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">{seoPage.page}</h3>
                        <p className="text-sm font-medium text-gray-700 mt-1">{seoPage.title}</p>
                        <p className="text-sm text-gray-600 truncate mt-1">{seoPage.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span>Updated: {new Date(seoPage.updatedAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link href={`/admin/seo/edit/${seoPage.page}`}>
                          <Button variant="outline" size="sm">
                            <Edit size={16} />
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(seoPage.page)}
                        >
                          <Trash2 size={16} className="text-red-500" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Common Pages</CardTitle>
              <CardDescription>Quick links to configure SEO for common pages</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {['homepage', 'blog', 'about', 'services', 'contact', 'privacy', 'terms'].map((page) => {
                  const exists = seoPages.find(p => p.page === page);
                  return (
                    <Link key={page} href={`/admin/seo/edit/${page}`}>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                      >
                        <Globe size={16} className="mr-2" />
                        {page}
                        {!exists && (
                          <span className="ml-auto text-xs text-orange-600">Not configured</span>
                        )}
                      </Button>
                    </Link>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </ProtectedRoute>
  );
}
