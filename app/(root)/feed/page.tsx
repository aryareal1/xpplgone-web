import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, Calendar, Filter, Plus, X, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle,} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

const FeedLayout = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [showPostModal, setShowPostModal] = useState(false);

  // Form state - nanti di-hook ke API
  const [formData, setFormData] = useState({
    author: '',
    content: '',
    category: 'pengumuman',
    image: null,
  });

  const categories = [
    { id: 'all', name: 'Semua', variant: 'secondary' },
    { id: 'pengumuman', name: 'Pengumuman', variant: 'destructive' },
    { id: 'tugas', name: 'Tugas', variant: 'default' },
    { id: 'kegiatan', name: 'Kegiatan', variant: 'default' },
    { id: 'diskusi', name: 'Diskusi', variant: 'secondary' },
  ];

  // Posts dari database - nanti fetch dari API
  const posts = [];

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitPost = () => {
    if (!formData.author.trim() || !formData.content.trim()) {
      alert('Nama dan konten post tidak boleh kosong!');
      return;
    }

    console.log('Data untuk API:', formData);

    setShowPostModal(false);
    setFormData({
      author: '',
      content: '',
      category: 'pengumuman',
      image: null,
    });
  };

  const handleLike = (postId) => {
    // TODO: POST /api/posts/:id/like
    console.log('Like post ID:', postId);
  };

  const handleComment = (postId) => {
    console.log('Comment on post ID:', postId);
  };

  const handleShare = (postId) => {
    console.log('Share post ID:', postId);
  };

  const filteredPosts =
    activeFilter === 'all' ? posts : posts.filter((post) => post.category === activeFilter);

  const getCategoryVariant = (categoryId: string) => {
    const variants = {
      pengumuman: 'destructive',
      tugas: 'default',
      kegiatan: 'default',
      diskusi: 'secondary',
    };
    return variants[categoryId] || 'default';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-background sticky top-0 z-10 border-b shadow-sm">
        <div className="mx-auto max-w-4xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Feed Kelas</h1>
              <p className="text-muted-foreground text-sm">X PPLG 1 - SMK N 1 Kandeman</p>
            </div>
            <Dialog open={showPostModal} onOpenChange={setShowPostModal}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Post Baru</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Buat Post Baru</DialogTitle>
                  <DialogDescription>
                    Bagikan informasi, tugas, atau diskusi dengan teman-teman kelas
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="author">Nama Kamu</Label>
                    <Input
                      id="author"
                      value={formData.author}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                      placeholder="Masukkan nama kamu..."
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Kategori</Label>
                    <div className="flex flex-wrap gap-2">
                      {categories
                        .filter((c) => c.id !== 'all')
                        .map((cat) => (
                          <Badge
                            key={cat.id}
                            variant={
                              formData.category === cat.id ? getCategoryVariant(cat.id) : 'outline'
                            }
                            className="cursor-pointer"
                            onClick={() => setFormData({ ...formData, category: cat.id })}
                          >
                            {cat.name}
                          </Badge>
                        ))}
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="content">Konten Post</Label>
                    <Textarea
                      id="content"
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      placeholder="Apa yang ingin kamu bagikan?"
                      rows={6}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="image">Gambar (Opsional)</Label>
                    {formData.image ? (
                      <div className="relative">
                        <Image src={formData.image} alt="Preview" className="w-full rounded-lg" />
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2"
                          onClick={() => setFormData({ ...formData, image: null })}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <label className="hover:bg-accent flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <ImageIcon className="text-muted-foreground mb-2 h-8 w-8" />
                          <p className="text-muted-foreground text-sm">Klik untuk upload gambar</p>
                        </div>
                        <input
                          id="image"
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowPostModal(false)}>
                    Batal
                  </Button>
                  <Button onClick={handleSubmitPost}>Post Sekarang</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-6">
        {/* Filter Categories */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filter Kategori
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <Badge
                  key={cat.id}
                  variant={
                    activeFilter === cat.id
                      ? cat.id === 'all'
                        ? 'secondary'
                        : getCategoryVariant(cat.id)
                      : 'outline'
                  }
                  className="cursor-pointer px-4 py-2"
                  onClick={() => setActiveFilter(cat.id)}
                >
                  {cat.name}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Empty State */}
        <Card className="p-12 text-center">
          <div className="flex flex-col items-center">
            <div className="bg-accent mb-4 flex h-20 w-20 items-center justify-center rounded-full">
              <MessageCircle className="text-primary h-10 w-10" />
            </div>
            <CardTitle className="mb-2">Belum ada post</CardTitle>
            <CardDescription className="mb-6">
              Mulai berbagi informasi, tugas, atau diskusi dengan teman-teman kelas
            </CardDescription>
            <Dialog open={showPostModal} onOpenChange={setShowPostModal}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Buat Post Pertama
                </Button>
              </DialogTrigger>
            </Dialog>
          </div>
        </Card>

        {/* Info Box untuk Developer */}
        <Card className="mt-6 border-dashed">
          <CardHeader>
            <CardTitle className="text-sm">💻 Untuk Developer</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground space-y-2 text-sm">
            <p>
              <strong>API Endpoints yang perlu dibuat:</strong>
            </p>
            <ul className="ml-2 list-inside list-disc space-y-1">
              <li>
                <code>GET /api/posts?category={'{filter}'}</code> - Fetch posts
              </li>
              <li>
                <code>POST /api/posts</code> - Create post baru
              </li>
              <li>
                <code>POST /api/posts/:id/like</code> - Like/unlike post
              </li>
              <li>
                <code>GET /api/posts/:id/comments</code> - Get comments
              </li>
            </ul>
            <p className="mt-4">
              <strong>Struktur data POST request:</strong>
            </p>
            <pre className="bg-muted mt-2 overflow-x-auto rounded p-3 text-xs">
              {`{
  "author": "string",
  "content": "string",
  "category": "pengumuman" | "tugas" | "kegiatan" | "diskusi",
  "image": "base64 string" | null
}`}
            </pre>
            <p className="mt-4">
              <strong>Struktur data response (posts):</strong>
            </p>
            <pre className="bg-muted mt-2 overflow-x-auto rounded p-3 text-xs">
              {`{
  "id": number,
  "author": "string",
  "avatar": "string (2 huruf)",
  "timestamp": "string",
  "category": "string",
  "content": "string",
  "image": "url" | null,
  "likes": number,
  "comments": number,
  "isLiked": boolean
}`}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FeedLayout;
