'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Plus, Eye, Edit, Trash2, Search, ArrowLeft } from 'lucide-react';
import AdminNav from '@/components/admin/AdminNav';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import { fetchAllFAQs, deleteFAQ, togglePublishFAQ } from '@/lib/actions';
import { memo } from 'react';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  published: boolean;
  order: number;
  relatedTo: string;
}

function FAQsPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [filteredFaqs, setFilteredFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const loadFAQs = useCallback(async () => {
    try {
      const data = await fetchAllFAQs();
      setFaqs(data);
    } catch (error) {
      console.error('Error fetching FAQs:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const filterFAQs = useCallback(() => {
    let filtered = [...faqs];

    if (searchQuery) {
      filtered = filtered.filter(
        (faq) =>
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredFaqs(filtered);
  }, [faqs, searchQuery]);

  useEffect(() => {
    loadFAQs();
  }, [loadFAQs]);

  useEffect(() => {
    filterFAQs();
  }, [filterFAQs]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this FAQ?')) return;

    try {
      await deleteFAQ(id);
      loadFAQs();
    } catch (error) {
      console.error('Error deleting FAQ:', error);
    }
  };

  const togglePublish = async (id: string) => {
    try {
      await togglePublishFAQ(id);
      loadFAQs();
    } catch (error) {
      console.error('Error updating FAQ:', error);
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
              <h1 className="text-3xl font-bold text-gray-900">Manage FAQs</h1>
              <p className="text-gray-600 mt-2">
                {filteredFaqs.length} of {faqs.length} FAQs
              </p>
            </div>
            <Link href="/admin/faqs/new">
              <Button className="flex items-center gap-2" style={{ backgroundColor: '#450BC8' }}>
                <Plus size={20} />
                New FAQ
              </Button>
            </Link>
          </div>

          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  placeholder="Search FAQs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>All FAQs</CardTitle>
              <CardDescription>Manage frequently asked questions</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">Loading FAQs...</div>
              ) : filteredFaqs.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No FAQs found</div>
              ) : (
                <div className="space-y-4">
                  {filteredFaqs.map((faq) => (
                    <div
                      key={faq.id}
                      className="flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900">{faq.question}</h3>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{faq.answer}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span>{faq.category}</span>
                          <span>•</span>
                          <span>Page: {faq.relatedTo}</span>
                          <span>•</span>
                          <span>Order: {faq.order}</span>
                          <span>•</span>
                          <span className={faq.published ? 'text-green-600' : 'text-orange-600'}>
                            {faq.published ? 'Published' : 'Draft'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => togglePublish(faq.id)}
                          title={faq.published ? 'Unpublish' : 'Publish'}
                        >
                          <Eye size={16} />
                        </Button>
                        <Link href={`/admin/faqs/edit/${faq.id}`}>
                          <Button variant="outline" size="sm">
                            <Edit size={16} />
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(faq.id)}
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
        </main>
      </div>
    </ProtectedRoute>
  );
}

export default memo(FAQsPage);
