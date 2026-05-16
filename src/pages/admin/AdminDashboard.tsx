import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Project, Category, Certification, Blog, Service
} from '../../types';
import { firestoreService } from '../../lib/firestore-service';
import { 
  Plus, Edit, Trash2, Layout, Award, FileText, 
  Settings, LogOut, ChevronRight, Save, X, Image as ImageIcon,
  Database, User
} from 'lucide-react';
import { auth } from '../../lib/firebase';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { ImageUpload } from '../../components/admin/ImageUpload';

type Tab = 'projects' | 'categories' | 'certifications' | 'blogs' | 'services' | 'settings';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('projects');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  const tabs: { id: Tab, label: string, icon: any }[] = [
    { id: 'projects', label: 'Projects', icon: Layout },
    { id: 'categories', label: 'Categories', icon: Settings },
    { id: 'certifications', label: 'Certifications', icon: Award },
    { id: 'blogs', label: 'Blogs', icon: FileText },
    { id: 'services', label: 'Services', icon: Database },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate('/admin/login');
        return;
      }

      if (user.email?.toLowerCase().endsWith('@gmail.com')) {
        setIsAdmin(true);
        loadData();
      } else {
        auth.signOut();
        navigate('/admin/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (isAdmin) {
      loadData();
    }
  }, [activeTab, isAdmin]);

  async function loadData() {
    setLoading(true);
    let results = await firestoreService.list(activeTab);
    
    if (activeTab === 'categories') {
      const allProjects = await firestoreService.list<Project>('projects');
      results = results.map((cat: any) => ({
        ...cat,
        count: allProjects.filter(p => p.category === cat.name).length
      }));
    }
    
    if (activeTab === 'settings' && results.length > 0) {
      // For settings, we usually only want one document
      setEditingItem(results[0]);
    }
    
    setData(results);
    setLoading(false);
  }

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/');
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      await firestoreService.delete(activeTab, id);
      loadData();
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const payload: any = {};
    formData.forEach((value, key) => {
      if (key === 'technologies' || key === 'skills' || key === 'keywords' || key === 'tags' || key === 'benefits') {
        payload[key] = (value as string).split(',').map(s => s.trim());
      } else if (key === 'published') {
        payload[key] = value === 'on';
      } else if (key === 'order' || key === 'count') {
        payload[key] = Number(value);
      } else {
        payload[key] = value;
      }
    });

    if (activeTab === 'settings') {
      const docId = editingItem?.id || 'global';
      await firestoreService.set(activeTab, docId, payload);
    } else if (editingItem?.id) {
      await firestoreService.update(activeTab, editingItem.id, payload);
    } else {
      await firestoreService.create(activeTab, payload);
    }
    
    setIsEditing(false);
    setEditingItem(null);
    loadData();
  };

  return (
    <div className="pt-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-[var(--text-muted)]">Manage your portfolio content</p>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
          >
            <LogOut size={20} /> Logout
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setIsEditing(false);
                }}
                className={`w-full flex items-center justify-between p-4 rounded-xl transition-all ${
                  activeTab === tab.id ? 'bg-brand-500 text-[var(--text-main)] shadow-lg shadow-brand-500/20' : 'glass text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <tab.icon size={20} />
                  <span className="font-bold">{tab.label}</span>
                </div>
                <ChevronRight size={16} className={activeTab === tab.id ? 'opacity-100' : 'opacity-0'} />
              </button>
            ))}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="glass rounded-3xl p-8 min-h-[600px]">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold capitalize">{activeTab}</h2>
                {activeTab !== 'settings' && (
                  <button 
                    onClick={() => {
                      setEditingItem({});
                      setIsEditing(true);
                    }}
                    className="bg-brand-500 hover:bg-brand-600 text-[var(--text-main)] p-2 rounded-lg flex items-center gap-2"
                  >
                    <Plus size={20} /> Add New
                  </button>
                )}
              </div>

              {loading ? (
                <div className="flex items-center justify-center h-40">
                  <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent [border-radius:var(--radius-full)] animate-spin" />
                </div>
              ) : (
                <div className="space-y-4">
                  {data.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-[var(--bg-card)]/[0.02] hover:bg-[var(--bg-card)]/[0.05] transition-all">
                      <div className="flex items-center gap-4">
                        {item.thumbnail || item.image || item.featuredImage ? (
                          <img src={item.thumbnail || item.image || item.featuredImage} className="w-12 h-12 rounded object-cover" />
                        ) : (
                          <div className="w-12 h-12 rounded bg-[var(--bg-card)]/5 flex items-center justify-center"><ImageIcon className="text-gray-600" /></div>
                        )}
                        <div>
                          <div className="font-bold">{item.title || item.name}</div>
                          <div className="text-xs text-[var(--text-muted)]">{item.id}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => {
                            setEditingItem(item);
                            setIsEditing(true);
                          }}
                          className="p-2 text-[var(--text-muted)] hover:text-brand-500 transition-colors"
                        >
                          <Edit size={18} />
                        </button>
                        {activeTab !== 'settings' && (
                          <button 
                            onClick={() => handleDelete(item.id)}
                            className="p-2 text-[var(--text-muted)] hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  {data.length === 0 && (
                    <div className="text-center py-20 text-[var(--text-muted)]">
                      {activeTab === 'settings' ? (
                        <div className="flex flex-col items-center gap-6">
                           <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-2">
                             <Settings size={32} className="text-white/20" />
                           </div>
                           <div className="space-y-1">
                             <p className="text-white font-bold text-xl">System Settings</p>
                             <p className="text-sm max-w-xs mx-auto">Initialize your global profile settings to customize your portfolio's name, role, and photo.</p>
                           </div>
                           <button 
                             onClick={() => {
                               setEditingItem({});
                               setIsEditing(true);
                             }}
                             className="bg-brand-500 hover:bg-brand-600 text-[var(--text-main)] px-8 py-3 rounded-xl font-bold transition-all shadow-xl shadow-brand-500/20"
                           >
                             Initialize Portfolio Settings
                           </button>
                        </div>
                      ) : (
                        "No items found in this collection."
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditing(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="relative glass max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-3xl p-8"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-bold">{editingItem?.id ? 'Edit' : 'Create'} {activeTab.slice(0, -1)}</h3>
                <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-[var(--bg-card)]/10 [border-radius:var(--radius-full)]"><X size={20} /></button>
              </div>

              <form onSubmit={handleSave} className="space-y-6">
                 {/* Dynamic Form Fields based on Collection */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {activeTab === 'projects' && (
                      <>
                        <ProjectFields item={editingItem} />
                      </>
                    )}
                    {activeTab === 'blogs' && (
                      <BlogFields item={editingItem} />
                    )}
                    {activeTab === 'certifications' && (
                      <CertFields item={editingItem} />
                    )}
                    {activeTab === 'categories' && (
                      <CatFields item={editingItem} />
                    )}
                    {activeTab === 'services' && (
                      <ServiceFields item={editingItem} />
                    )}
                    {activeTab === 'settings' && (
                      <SettingsFields item={editingItem} />
                    )}
                 </div>

                 <div className="pt-8 border-t border-[var(--border-light)] flex justify-end gap-4">
                    <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-2 rounded-xl border-[length:var(--border-width)] border-[style:var(--border-style)] border-[var(--border-light)] hover:bg-[var(--bg-card)]/5 transition-colors">Cancel</button>
                    <button type="submit" className="bg-brand-500 hover:bg-brand-600 px-8 py-2 rounded-xl text-[var(--text-main)] font-bold flex items-center gap-2">
                       <Save size={18} /> Save Changes
                    </button>
                 </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Sub-components for fields
function ProjectFields({ item }: { item: any }) {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    async function loadCats() {
      const cats = await firestoreService.list<Category>('categories');
      setCategories(cats);
    }
    loadCats();
  }, []);

  return (
    <>
      <div className="space-y-2"><label className="text-xs font-bold text-[var(--text-muted)] uppercase">Title</label><input name="title" defaultValue={item?.title} className="w-full glass rounded-lg px-4 py-2 text-sm" /></div>
      <div className="space-y-2">
        <label className="text-xs font-bold text-[var(--text-muted)] uppercase">Category</label>
        <select name="category" defaultValue={item?.category} className="w-full glass rounded-lg px-4 py-2 text-sm appearance-none">
          <option value="">Select Category</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.name}>{cat.name}</option>
          ))}
        </select>
      </div>
      <div className="space-y-2 md:col-span-2"><label className="text-xs font-bold text-[var(--text-muted)] uppercase">Description</label><textarea name="description" defaultValue={item?.description} className="w-full glass rounded-lg px-4 py-2 text-sm" /></div>
      <div className="space-y-2 md:col-span-2"><label className="text-xs font-bold text-[var(--text-muted)] uppercase">Full Description (Markdown)</label><textarea name="fullDescription" defaultValue={item?.fullDescription} className="w-full glass rounded-lg px-4 py-2 text-sm h-32" /></div>
      <ImageUpload name="thumbnail" defaultValue={item?.thumbnail} label="Project Image" className="md:col-span-2" />
      <div className="space-y-2"><label className="text-xs font-bold text-[var(--text-muted)] uppercase">Technologies (comma separated)</label><input name="technologies" defaultValue={item?.technologies?.join(', ')} className="w-full glass rounded-lg px-4 py-2 text-sm" /></div>
      <div className="space-y-2"><label className="text-xs font-bold text-[var(--text-muted)] uppercase">Live URL</label><input name="liveUrl" defaultValue={item?.liveUrl} className="w-full glass rounded-lg px-4 py-2 text-sm" /></div>
      <div className="space-y-2"><label className="text-xs font-bold text-[var(--text-muted)] uppercase">GitHub URL</label><input name="githubUrl" defaultValue={item?.githubUrl} className="w-full glass rounded-lg px-4 py-2 text-sm" /></div>
      <div className="space-y-2 md:col-span-2"><label className="text-xs font-bold text-[var(--text-muted)] uppercase">Embed URL (Power BI, Tableau, etc.)</label><input name="embedUrl" defaultValue={item?.embedUrl} className="w-full glass rounded-lg px-4 py-2 text-sm" placeholder="https://app.powerbi.com/view?r=..." /></div>
      <div className="space-y-2"><label className="text-xs font-bold text-[var(--text-muted)] uppercase">Order</label><input type="number" name="order" defaultValue={item?.order || 0} className="w-full glass rounded-lg px-4 py-2 text-sm" /></div>
    </>
  );
}

function BlogFields({ item }: { item: any }) {
  return (
    <>
      <div className="space-y-2 md:col-span-2"><label className="text-xs font-bold text-[var(--text-muted)] uppercase">Title</label><input name="title" defaultValue={item?.title} className="w-full glass rounded-lg px-4 py-2 text-sm" /></div>
      <div className="space-y-2"><label className="text-xs font-bold text-[var(--text-muted)] uppercase">Slug</label><input name="slug" defaultValue={item?.slug} className="w-full glass rounded-lg px-4 py-2 text-sm" /></div>
      <div className="space-y-2"><label className="text-xs font-bold text-[var(--text-muted)] uppercase">Author</label><input name="author" defaultValue={item?.author || 'Nasir Hussain'} className="w-full glass rounded-lg px-4 py-2 text-sm" /></div>
      <div className="space-y-2 md:col-span-2"><label className="text-xs font-bold text-[var(--text-muted)] uppercase">Content (Markdown)</label><textarea name="content" defaultValue={item?.content} className="w-full glass rounded-lg px-4 py-2 text-sm h-64" /></div>
      <div className="space-y-2 md:col-span-2"><label className="text-xs font-bold text-[var(--text-muted)] uppercase">Meta Description</label><textarea name="metaDescription" defaultValue={item?.metaDescription} className="w-full glass rounded-lg px-4 py-2 text-sm" /></div>
      <div className="space-y-2"><label className="text-xs font-bold text-[var(--text-muted)] uppercase">Tags (comma separated)</label><input name="tags" defaultValue={item?.tags?.join(', ')} className="w-full glass rounded-lg px-4 py-2 text-sm" /></div>
      <ImageUpload name="featuredImage" defaultValue={item?.featuredImage} label="Blog Featured Image" className="md:col-span-1" />
      <div className="flex items-center gap-4 py-4 md:col-span-2">
         <label className="text-sm font-bold">Published</label>
         <input type="checkbox" name="published" defaultChecked={item?.published} className="w-6 h-6 rounded bg-brand-500" />
      </div>
    </>
  );
}

function CertFields({ item }: { item: any }) {
  return (
    <>
      <div className="space-y-2"><label className="text-xs font-bold text-[var(--text-muted)] uppercase">Title</label><input name="title" defaultValue={item?.title} className="w-full glass rounded-lg px-4 py-2 text-sm" /></div>
      <div className="space-y-2"><label className="text-xs font-bold text-[var(--text-muted)] uppercase">Organization</label><input name="organization" defaultValue={item?.organization} className="w-full glass rounded-lg px-4 py-2 text-sm" /></div>
      <div className="space-y-2"><label className="text-xs font-bold text-[var(--text-muted)] uppercase">Issue Date</label><input name="issueDate" defaultValue={item?.issueDate} className="w-full glass rounded-lg px-4 py-2 text-sm" placeholder="Oct 2023" /></div>
      <ImageUpload name="image" defaultValue={item?.image} label="Certificate Badge" className="md:col-span-2" />
      <div className="space-y-2 md:col-span-2"><label className="text-xs font-bold text-[var(--text-muted)] uppercase">Verification URL</label><input name="verificationUrl" defaultValue={item?.verificationUrl} className="w-full glass rounded-lg px-4 py-2 text-sm" /></div>
    </>
  );
}

function CatFields({ item }: { item: any }) {
  return (
    <>
      <div className="space-y-2 md:col-span-2">
        <label className="text-xs font-bold text-[var(--text-muted)] uppercase">Name</label>
        <input required name="name" defaultValue={item?.name} className="w-full glass rounded-lg px-4 py-2" />
      </div>
      <div className="space-y-2 md:col-span-2 p-4 bg-[var(--bg-main)]/50 rounded-lg border border-[var(--border-light)]">
        <label className="text-xs font-bold text-[var(--text-muted)] uppercase block mb-1">Project Count (Auto)</label>
        <div className="text-2xl font-bold text-[var(--brand-main)]">{item?.count || 0}</div>
        <p className="text-[10px] text-[var(--text-muted)] mt-2 italic">This number is automatically calculated based on projects assigned to this category.</p>
      </div>
    </>
  );
}

function ServiceFields({ item }: { item: any }) {
  return (
    <>
      <div className="space-y-2"><label className="text-xs font-bold text-[var(--text-muted)] uppercase">Title</label><input required name="title" defaultValue={item?.title} className="w-full glass rounded-lg px-4 py-2" /></div>
      <div className="space-y-2"><label className="text-xs font-bold text-[var(--text-muted)] uppercase">Icon Name (Lucide)</label><input name="iconName" defaultValue={item?.iconName || 'Database'} className="w-full glass rounded-lg px-4 py-2" /></div>
      <div className="space-y-2 md:col-span-2"><label className="text-xs font-bold text-[var(--text-muted)] uppercase">Description</label><textarea name="description" defaultValue={item?.description} className="w-full glass rounded-lg px-4 py-2" /></div>
      <div className="space-y-2 md:col-span-2"><label className="text-xs font-bold text-[var(--text-muted)] uppercase">Benefits (comma separated)</label><input name="benefits" defaultValue={item?.benefits?.join(', ')} className="w-full glass rounded-lg px-4 py-2" /></div>
    </>
  );
}

function SettingsFields({ item }: { item: any }) {
  return (
    <div className="md:col-span-2 space-y-12">
      <div className="p-12 border-2 border-dashed border-white/10 rounded-[3rem] bg-white/5">
         <ImageUpload 
           name="profilePhotoUrl" 
           defaultValue={item?.profilePhotoUrl} 
           label="Profile Photo" 
         />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 glass rounded-[2rem] border-white/5">
        <div className="space-y-4">
          <label className="text-xs font-black text-brand-500 uppercase tracking-[0.3em] block ml-1">Identity</label>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest pl-1">Full Name</label>
              <input name="name" defaultValue={item?.name || 'Nasir Hussain'} className="w-full glass rounded-xl px-4 py-3 text-sm focus:ring-2 ring-brand-500 outline-none transition-all placeholder:text-white/20" />
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest pl-1">Professional Title</label>
              <input name="role" defaultValue={item?.role || 'Data Scientist'} className="w-full glass rounded-xl px-4 py-3 text-sm focus:ring-2 ring-brand-500 outline-none transition-all placeholder:text-white/20" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-xs font-black text-brand-500 uppercase tracking-[0.3em] block ml-1">Contact & Socials</label>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest pl-1">Email</label>
              <input name="email" defaultValue={item?.email} className="w-full glass rounded-xl px-4 py-3 text-sm focus:ring-2 ring-brand-500 outline-none transition-all placeholder:text-white/20" />
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest pl-1">LinkedIn Profile URL</label>
              <input name="linkedin" defaultValue={item?.linkedin} className="w-full glass rounded-xl px-4 py-3 text-sm focus:ring-2 ring-brand-500 outline-none transition-all placeholder:text-white/20" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest pl-1">GitHub URL</label>
              <input name="github" defaultValue={item?.github} className="w-full glass rounded-xl px-4 py-3 text-sm focus:ring-2 ring-brand-500 outline-none transition-all placeholder:text-white/20" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest pl-1">WhatsApp Number</label>
              <input name="whatsapp" defaultValue={item?.whatsapp} className="w-full glass rounded-xl px-4 py-3 text-sm focus:ring-2 ring-brand-500 outline-none transition-all placeholder:text-white/20" placeholder="+92 ..." />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest pl-1">Instagram URL</label>
              <input name="instagram" defaultValue={item?.instagram} className="w-full glass rounded-xl px-4 py-3 text-sm focus:ring-2 ring-brand-500 outline-none transition-all placeholder:text-white/20" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest pl-1">TikTok URL</label>
              <input name="tiktok" defaultValue={item?.tiktok} className="w-full glass rounded-xl px-4 py-3 text-sm focus:ring-2 ring-brand-500 outline-none transition-all placeholder:text-white/20" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest pl-1">Facebook URL</label>
              <input name="facebook" defaultValue={item?.facebook} className="w-full glass rounded-xl px-4 py-3 text-sm focus:ring-2 ring-brand-500 outline-none transition-all placeholder:text-white/20" />
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-2">
          <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest pl-1">Short Biography</label>
          <textarea name="bio" defaultValue={item?.bio} className="w-full glass rounded-xl px-4 py-4 text-sm focus:ring-2 ring-brand-500 outline-none transition-all h-32" />
        </div>
      </div>
    </div>
  );
}
