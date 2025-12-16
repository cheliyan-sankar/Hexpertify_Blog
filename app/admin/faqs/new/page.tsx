'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AdminNav from '@/components/admin/AdminNav';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import { createFAQ, fetchAllPosts } from '@/lib/actions';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewFAQPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [blogSlugs, setBlogSlugs] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: 'General',
    order: 0,
    published: false,
    relatedTo: 'homepage',
  });

  useEffect(() => {
    loadBlogSlugs();
  }, []);

  const loadBlogSlugs = async () => {
    try {
      const posts = await fetchAllPosts();
      const slugs = posts.map(post => post.slug);
      setBlogSlugs(slugs);
    } catch (error) {
      console.error('Error loading blog slugs:', error);
    }
  };

  const generateId = (question: string) => {
    return question
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const id = generateId(formData.question);

      const metadata = {
        question: formData.question,
        answer: formData.answer,
        category: formData.category,
        order: formData.order,
        published: formData.published,
        createdAt: new Date().toISOString(),
        relatedTo: formData.relatedTo,
      };

      const result = await createFAQ(id, metadata);

      if (!result.success) {
        throw new Error(result.error || 'Failed to create FAQ');
      }

      router.push('/admin/faqs');
    } catch (err: any) {
      setError(err.message || 'Failed to create FAQ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <AdminNav />

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link href="/admin/faqs">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft size={18} className="mr-2" />
              Back to FAQs
            </Button>
          </Link>

          <Card>
            <CardHeader>
              <CardTitle>Create New FAQ</CardTitle>
              <CardDescription>Add a new frequently asked question</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="question">Question *</Label>
                  <Input
                    id="question"
                    value={formData.question}
                    onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                    placeholder="Enter the question"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="answer">Answer *</Label>
                  <Textarea
                    id="answer"
                    value={formData.answer}
                    onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                    placeholder="Enter the answer"
                    rows={5}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      placeholder="e.g., General, Booking, Pricing"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="relatedTo">Related To *</Label>
                    <Select
                      value={formData.relatedTo}
                      onValueChange={(value) => setFormData({ ...formData, relatedTo: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select page" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="homepage">Homepage</SelectItem>
                        {blogSlugs.length > 0 && (
                          <>
                            <SelectItem value="__divider__" disabled className="text-xs font-semibold text-gray-500">
                              Blog Posts
                            </SelectItem>
                            {blogSlugs.map((slug) => (
                              <SelectItem key={slug} value={slug}>
                                {slug}
                              </SelectItem>
                            ))}
                          </>
                        )}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500">
                      Choose where this FAQ should appear (homepage or specific blog post)
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="order">Display Order</Label>
                    <Input
                      id="order"
                      type="number"
                      value={formData.order}
                      onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                      placeholder="0"
                    />
                    <p className="text-xs text-gray-500">
                      Lower numbers appear first
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="published"
                    checked={formData.published}
                    onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
                  />
                  <Label htmlFor="published" className="cursor-pointer">
                    Publish immediately
                  </Label>
                </div>

                <div className="flex gap-4">
                  <Button
                    type="submit"
                    disabled={loading}
                    style={{ backgroundColor: '#450BC8' }}
                  >
                    {loading ? 'Creating...' : 'Create FAQ'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push('/admin/faqs')}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </main>
      </div>
    </ProtectedRoute>
  );
}
