'use client';

import { useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, Trash2, ArrowLeft } from 'lucide-react';
import AdminNav from '@/components/admin/AdminNav';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import { fetchAllCategories, createCategory, removeCategoryAction } from '@/lib/actions';
import Link from 'next/link';
import { memo } from 'react';

function CategoriesPage() {
  const [categories, setCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadCategories = useCallback(async () => {
    try {
      const data = await fetchAllCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.trim()) return;

    setError('');
    setSuccess('');
    setActionLoading(true);

    try {
      const result = await createCategory(newCategory.trim());
      if (result.success) {
        setSuccess('Category added successfully!');
        setNewCategory('');
        await loadCategories();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(result.error || 'Failed to add category');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to add category');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteCategory = async (category: string) => {
    if (!confirm(`Are you sure you want to delete the "${category}" category?`)) return;

    setError('');
    setSuccess('');
    setActionLoading(true);

    try {
      const result = await removeCategoryAction(category);
      if (result.success) {
        setSuccess('Category deleted successfully!');
        await loadCategories();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(result.error || 'Failed to delete category');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to delete category');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <AdminNav />

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link href="/admin/dashboard">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft size={18} className="mr-2" />
              Back to Dashboard
            </Button>
          </Link>

          <Card>
            <CardHeader>
              <CardTitle>Manage Categories</CardTitle>
              <CardDescription>
                Add or remove blog post categories. The "All" category cannot be deleted.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="border-green-500 text-green-700 bg-green-50">
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleAddCategory} className="flex gap-3">
                <Input
                  type="text"
                  placeholder="Enter new category name"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  disabled={actionLoading}
                  className="flex-1"
                />
                <Button
                  type="submit"
                  disabled={actionLoading || !newCategory.trim()}
                  style={{ backgroundColor: '#450BC8' }}
                  className="flex items-center gap-2"
                >
                  <Plus size={18} />
                  Add Category
                </Button>
              </form>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Current Categories ({categories.length})
                </h3>

                {loading ? (
                  <div className="text-center py-8">Loading categories...</div>
                ) : categories.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No categories found
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {categories.map((category) => (
                      <div
                        key={category}
                        className="flex items-center justify-between p-4 border rounded-lg bg-white hover:bg-gray-50 transition-colors"
                      >
                        <span className="font-medium text-gray-900">{category}</span>
                        {category !== 'All' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteCategory(category)}
                            disabled={actionLoading}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 size={16} />
                          </Button>
                        )}
                        {category === 'All' && (
                          <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                            Default
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </ProtectedRoute>
  );
}

export default memo(CategoriesPage);
