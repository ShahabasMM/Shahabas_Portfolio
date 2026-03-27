import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BarChart3,
  Braces,
  Eye,
  FolderKanban,
  Loader2,
  LogOut,
  Mail,
  Paperclip,
  Plus,
  Settings,
  Trash2,
} from 'lucide-react';
import { useContent } from '../../context/ContentContext';
import AdminCard from './ui/AdminCard';
import AdminModal from './ui/AdminModal';
import AdminSidebar from './ui/AdminSidebar';
import AdminTopbar from './ui/AdminTopbar';
import AdminTableShell from './ui/AdminTableShell';
import { PROJECT_STATUS_OPTIONS, getProjectStatusMeta } from '../../utils/projectStatus';

const MAX_FILE_SIZE_BYTES = 8 * 1024 * 1024;

const managementItems = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  { id: 'projects', label: 'Projects', icon: FolderKanban },
  { id: 'skills', label: 'Skills', icon: Braces },
  { id: 'contacts', label: 'Contacts', icon: Mail },
];

const settingsItems = [{ id: 'settings', label: 'Settings', icon: Settings }];

const titleByTab = {
  dashboard: 'Dashboard',
  projects: 'Project Management',
  skills: 'Skill Management',
  contacts: 'Contact Inbox',
  settings: 'Settings',
};

const TableLoadingRows = ({ cols }) => (
  <>
    {[...Array(4)].map((_, index) => (
      <tr key={`row-${index}`} className="border-b border-white/6">
        {[...Array(cols)].map((__, cell) => (
          <td key={`cell-${cell}`} className="px-4 py-3.5">
            <div className="h-4 bg-white/10 rounded animate-pulse" />
          </td>
        ))}
      </tr>
    ))}
  </>
);

const LoginView = ({ onAuth, loading }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      await onAuth({ email, password });
    } catch (authError) {
      setError(authError.message || 'Login failed.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white flex items-center justify-center px-4">
      <AdminCard className="w-full max-w-md p-8">
        <h1 className="text-3xl font-bold mb-2">Shahabas Admin</h1>
        <p className="text-gray-400 mb-6">Sign in with your Supabase admin account.</p>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <InputField label="Email" value={email} onChange={setEmail} placeholder="admin@example.com" type="email" />
          <InputField label="Password" value={password} onChange={setPassword} placeholder="********" type="password" />
          {error ? <p className="text-sm text-red-400">{error}</p> : null}
          <button
            disabled={loading}
            className="w-full h-11 rounded-xl bg-primary font-semibold hover:shadow-[0_0_24px_rgba(254,31,25,0.45)] transition-all disabled:opacity-60"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </AdminCard>
    </div>
  );
};

const StatCard = ({ title, value, accent = false }) => (
  <AdminCard className={`p-5 ${accent ? 'border-primary/30 shadow-[0_0_24px_rgba(254,31,25,0.18)]' : ''}`}>
    <p className="text-[11px] uppercase tracking-[0.2em] text-gray-500 mb-2">{title}</p>
    <p className="text-3xl font-bold">{value}</p>
  </AdminCard>
);

const InputField = ({ label, value, onChange, placeholder, type = 'text' }) => (
  <div className="space-y-2">
    {label ? <label className="text-xs uppercase tracking-[0.2em] text-gray-500">{label}</label> : null}
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full h-11 rounded-xl bg-[#131313] border border-white/12 px-3 focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(254,31,25,0.15)] transition-all"
    />
  </div>
);

const ActionButton = ({ variant = 'secondary', onClick, children, className = '', disabled = false }) => {
  const base = 'h-9 px-3 rounded-lg text-sm font-medium transition-all inline-flex items-center gap-2';
  const variantClass =
    variant === 'primary'
      ? 'bg-primary text-white hover:shadow-[0_0_18px_rgba(254,31,25,0.4)] hover:scale-[1.02]'
      : variant === 'danger'
      ? 'bg-red-500/18 text-red-300 border border-red-500/30 hover:bg-red-500/25'
      : 'bg-white/[0.04] border border-white/12 hover:border-primary/50';
  return (
    <button disabled={disabled} onClick={onClick} className={`${base} ${variantClass} ${className} disabled:opacity-50`}>
      {children}
    </button>
  );
};

const ProjectForm = ({ initial, onSubmit, submitting }) => {
  const [title, setTitle] = useState(initial?.title || '');
  const [description, setDescription] = useState(initial?.description || '');
  const [tags, setTags] = useState(initial?.tags?.join(', ') || '');
  const [github, setGithub] = useState(initial?.github || '');
  const [demo, setDemo] = useState(initial?.demo || '');
  const [status, setStatus] = useState(initial?.status || 'not_started');
  const [fileUrl, setFileUrl] = useState(initial?.fileUrl || '');
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');

  const handleFileInput = (event) => {
    const selected = event.target.files?.[0];
    if (!selected) return;
    if (selected.size > MAX_FILE_SIZE_BYTES) {
      setError('File size must be 8MB or smaller.');
      event.target.value = '';
      return;
    }
    setError('');
    setFile(selected);
  };

  const submit = (event) => {
    event.preventDefault();
    onSubmit({
      title: title.trim(),
      description: description.trim(),
      tags: tags
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
      github: github.trim() || '#',
      demo: demo.trim() || '#',
      status,
      fileUrl: fileUrl.trim(),
      file,
    });
  };

  return (
    <form className="space-y-4" onSubmit={submit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField label="Project Name" value={title} onChange={setTitle} placeholder="AI Vision System" />
        <InputField label="Tags" value={tags} onChange={setTags} placeholder="React, Node.js" />
      </div>
      <div className="space-y-2">
        <label className="text-xs uppercase tracking-[0.2em] text-gray-500">Description</label>
        <textarea
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the project..."
          className="w-full rounded-xl bg-[#131313] border border-white/12 px-3 py-2 focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(254,31,25,0.15)] transition-all"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField label="GitHub URL" value={github} onChange={setGithub} placeholder="https://github.com/..." />
        <InputField label="Live URL" value={demo} onChange={setDemo} placeholder="https://project.com" />
      </div>
      <div className="space-y-2">
        <label className="text-xs uppercase tracking-[0.2em] text-gray-500">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full h-11 rounded-xl bg-[#131313] border border-white/12 px-3 focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(254,31,25,0.15)] transition-all"
        >
          {PROJECT_STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value} className="bg-[#131313]">
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <InputField label="Attachment URL (optional)" value={fileUrl} onChange={setFileUrl} placeholder="https://example.com/file.pdf" />
      <div className="space-y-2">
        <label className="text-xs uppercase tracking-[0.2em] text-gray-500">Attach File Upload</label>
        <input
          type="file"
          onChange={handleFileInput}
          className="w-full h-11 rounded-xl bg-[#131313] border border-white/12 px-3 file:mr-3 file:px-3 file:py-1.5 file:rounded-lg file:border-0 file:bg-primary/20"
        />
      </div>
      {error ? <p className="text-sm text-red-400">{error}</p> : null}
      <div className="pt-2">
        <ActionButton variant="primary" className="h-11 px-5" disabled={submitting}>
          {submitting ? <Loader2 size={16} className="animate-spin" /> : null}
          Save Project
        </ActionButton>
      </div>
    </form>
  );
};

const SkillForm = ({ initial, onSubmit, submitting, categories }) => {
  const [name, setName] = useState(initial?.name || '');
  const [category, setCategory] = useState(initial?.category || '');
  const [customCategory, setCustomCategory] = useState('');

  const submit = (event) => {
    event.preventDefault();
    const resolvedCategory = category === '__custom__' ? customCategory.trim() : category.trim();
    onSubmit({ name: name.trim(), category: resolvedCategory });
  };

  return (
    <form className="space-y-4" onSubmit={submit}>
      <InputField label="Skill Name" value={name} onChange={setName} placeholder="React.js" />
      <div className="space-y-2">
        <label className="text-xs uppercase tracking-[0.2em] text-gray-500">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full h-11 rounded-xl bg-[#131313] border border-white/12 px-3 focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(254,31,25,0.15)] transition-all"
        >
          <option value="" className="bg-[#131313]">
            Select category
          </option>
          {categories.map((item) => (
            <option key={item} value={item} className="bg-[#131313]">
              {item}
            </option>
          ))}
          <option value="__custom__" className="bg-[#131313]">
            + Create New Category
          </option>
        </select>
      </div>
      {category === '__custom__' ? (
        <InputField label="New Category Name" value={customCategory} onChange={setCustomCategory} placeholder="Frontend Development" />
      ) : null}
      <ActionButton variant="primary" className="h-11 px-5" disabled={submitting}>
        {submitting ? <Loader2 size={16} className="animate-spin" /> : null}
        Save Skill
      </ActionButton>
    </form>
  );
};

const CategoryForm = ({ onSubmit, submitting }) => {
  const [category, setCategory] = useState('');
  const [firstSkill, setFirstSkill] = useState('');

  const submit = (event) => {
    event.preventDefault();
    onSubmit({ category: category.trim(), firstSkill: firstSkill.trim() });
  };

  return (
    <form className="space-y-4" onSubmit={submit}>
      <InputField label="Category Name" value={category} onChange={setCategory} placeholder="Frontend Development" />
      <InputField label="First Skill" value={firstSkill} onChange={setFirstSkill} placeholder="React.js" />
      <ActionButton variant="primary" className="h-11 px-5" disabled={submitting}>
        {submitting ? <Loader2 size={16} className="animate-spin" /> : null}
        Create Category
      </ActionButton>
    </form>
  );
};

const AdminPanel = () => {
  const {
    skills,
    projects,
    submissions,
    highlightedProjectIds,
    highlightedSkillIds,
    highlightedSubmissionIds,
    unreadSubmissions,
    loading,
    authLoading,
    adminSession,
    loginAdmin,
    logoutAdmin,
    addSkill,
    updateSkill,
    deleteSkill,
    addProject,
    updateProject,
    deleteProject,
    deleteSubmission,
    markSubmissionRead,
  } = useContent();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [projectModal, setProjectModal] = useState({ open: false, edit: null });
  const [skillModal, setSkillModal] = useState({ open: false, edit: null });
  const [categoryModal, setCategoryModal] = useState({ open: false });
  const [messageModal, setMessageModal] = useState({ open: false, data: null });
  const [savingProject, setSavingProject] = useState(false);
  const [savingSkill, setSavingSkill] = useState(false);
  const [savingCategory, setSavingCategory] = useState(false);
  const [loginPending, setLoginPending] = useState(false);

  const filteredProjects = projects.filter((project) =>
    [project.title, project.description, project.tags.join(' ')].join(' ').toLowerCase().includes(query.toLowerCase())
  );

  const filteredSkills = skills.filter((skill) =>
    [skill.name, skill.category].join(' ').toLowerCase().includes(query.toLowerCase())
  );
  const categoryOptions = [...new Set(skills.map((item) => item.category).filter(Boolean))].sort((a, b) => a.localeCompare(b));

  const filteredMessages = submissions.filter((item) =>
    [item.name, item.email, item.message].join(' ').toLowerCase().includes(query.toLowerCase())
  );

  const recentActivity = useMemo(
    () =>
      submissions
        .slice(0, 6)
        .map((item) => ({ id: item.id, text: `Message from ${item.name}`, time: new Date(item.created_at).toLocaleString() })),
    [submissions]
  );

  const sidebarOffset = collapsed ? 'md:ml-[88px]' : 'md:ml-[270px]';

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] text-white flex items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (!adminSession) {
    return (
      <LoginView
        loading={loginPending}
        onAuth={async (payload) => {
          setLoginPending(true);
          try {
            await loginAdmin(payload);
          } finally {
            setLoginPending(false);
          }
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white bg-[radial-gradient(circle_at_10%_10%,rgba(254,31,25,0.08),transparent_35%),radial-gradient(circle_at_95%_5%,rgba(254,31,25,0.05),transparent_28%)]">
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        managementItems={managementItems}
        settingsItems={settingsItems}
        unread={unreadSubmissions}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div className={`${sidebarOffset} transition-all`}>
        <AdminTopbar
          title={titleByTab[activeTab]}
          query={query}
          setQuery={setQuery}
          onOpenMobileSidebar={() => setMobileOpen(true)}
          onLogout={logoutAdmin}
        />

        <main className="px-4 md:px-6 xl:px-8 py-6">
          <div className="max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}>
                {activeTab === 'dashboard' ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <StatCard title="Total Projects" value={projects.length} />
                      <StatCard title="Total Skills" value={skills.length} />
                      <StatCard title="Messages" value={submissions.length} accent />
                    </div>
                    <AdminCard className="p-5 md:p-6">
                      <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
                      <div className="space-y-2">
                        {recentActivity.map((item) => (
                          <div key={item.id} className="rounded-xl px-4 py-3 border border-white/10 bg-white/[0.03] flex items-center justify-between">
                            <p>{item.text}</p>
                            <span className="text-xs text-gray-500">{item.time}</span>
                          </div>
                        ))}
                      </div>
                    </AdminCard>
                  </div>
                ) : null}

                {activeTab === 'projects' ? (
                  <AdminTableShell
                    title="Projects"
                    action={
                      <ActionButton variant="primary" onClick={() => setProjectModal({ open: true, edit: null })}>
                        <Plus size={15} /> Add Project
                      </ActionButton>
                    }
                  >
                    <table className="w-full text-sm">
                      <thead className="text-left text-gray-400 border-b border-white/10">
                        <tr>
                          <th className="px-4 py-3">Name</th>
                          <th className="px-4 py-3">Description</th>
                          <th className="px-4 py-3">Tech</th>
                          <th className="px-4 py-3">Status</th>
                          <th className="px-4 py-3">Attachment</th>
                          <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loading.projects ? <TableLoadingRows cols={6} /> : null}
                        {!loading.projects &&
                          filteredProjects.map((project) => (
                            <tr
                              key={project.id}
                              className={`border-b border-white/6 hover:bg-white/[0.03] transition-colors ${
                                highlightedProjectIds.includes(project.id) ? 'bg-primary/8 shadow-[inset_0_0_0_1px_rgba(254,31,25,0.35)]' : ''
                              }`}
                            >
                              <td className="px-4 py-3.5 font-semibold">{project.title}</td>
                              <td className="px-4 py-3.5 text-gray-300">{project.description.slice(0, 90)}</td>
                              <td className="px-4 py-3.5">
                                <div className="flex flex-wrap gap-1.5">
                                  {project.tags.map((tag) => (
                                    <span key={`${project.id}-${tag}`} className="px-2 py-1 rounded-full text-xs border border-white/12 bg-white/[0.03]">
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              </td>
                              <td className="px-4 py-3.5">
                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getProjectStatusMeta(project.status).adminClass}`}>
                                  {getProjectStatusMeta(project.status).label}
                                </span>
                              </td>
                              <td className="px-4 py-3.5">
                                {project.fileUrl ? (
                                  <span className="inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary">
                                    <Paperclip size={12} /> Attached
                                  </span>
                                ) : (
                                  <span className="text-xs text-gray-500">None</span>
                                )}
                              </td>
                              <td className="px-4 py-3.5">
                                <div className="flex justify-end gap-2">
                                  <ActionButton onClick={() => setProjectModal({ open: true, edit: project })}>Edit</ActionButton>
                                  <ActionButton variant="danger" onClick={() => deleteProject(project.id)}>
                                    <Trash2 size={14} /> Delete
                                  </ActionButton>
                                </div>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </AdminTableShell>
                ) : null}

                {activeTab === 'skills' ? (
                  <AdminTableShell
                    title="Skills"
                    action={
                      <div className="flex items-center gap-2">
                        <ActionButton onClick={() => setCategoryModal({ open: true })}>
                          <Plus size={15} /> Add Category
                        </ActionButton>
                        <ActionButton variant="primary" onClick={() => setSkillModal({ open: true, edit: null })}>
                          <Plus size={15} /> Add Skill
                        </ActionButton>
                      </div>
                    }
                  >
                    <table className="w-full text-sm">
                      <thead className="text-left text-gray-400 border-b border-white/10">
                        <tr>
                          <th className="px-4 py-3">Name</th>
                          <th className="px-4 py-3">Category</th>
                          <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loading.skills ? <TableLoadingRows cols={3} /> : null}
                        {!loading.skills &&
                          filteredSkills.map((skill) => (
                            <tr
                              key={skill.id}
                              className={`border-b border-white/6 hover:bg-white/[0.03] transition-colors ${
                                highlightedSkillIds.includes(skill.id) ? 'bg-primary/8 shadow-[inset_0_0_0_1px_rgba(254,31,25,0.35)]' : ''
                              }`}
                            >
                              <td className="px-4 py-3.5">{skill.name}</td>
                              <td className="px-4 py-3.5 text-gray-300">{skill.category}</td>
                              <td className="px-4 py-3.5">
                                <div className="flex justify-end gap-2">
                                  <ActionButton onClick={() => setSkillModal({ open: true, edit: skill })}>Edit</ActionButton>
                                  <ActionButton variant="danger" onClick={() => deleteSkill(skill.id)}>
                                    <Trash2 size={14} /> Delete
                                  </ActionButton>
                                </div>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </AdminTableShell>
                ) : null}

                {activeTab === 'contacts' ? (
                  <AdminTableShell title="Contact Messages">
                    <table className="w-full text-sm">
                      <thead className="text-left text-gray-400 border-b border-white/10">
                        <tr>
                          <th className="px-4 py-3">Name</th>
                          <th className="px-4 py-3">Email</th>
                          <th className="px-4 py-3">Message</th>
                          <th className="px-4 py-3">Date</th>
                          <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loading.contacts ? <TableLoadingRows cols={5} /> : null}
                        {!loading.contacts &&
                          filteredMessages.map((item) => (
                            <tr
                              key={item.id}
                              className={`border-b border-white/6 hover:bg-white/[0.03] transition-colors ${
                                highlightedSubmissionIds.includes(item.id) ? 'bg-primary/8 shadow-[inset_0_0_0_1px_rgba(254,31,25,0.35)]' : ''
                              }`}
                            >
                              <td className="px-4 py-3.5">
                                <div className="flex items-center gap-2">
                                  {!item.is_read ? <span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_rgba(254,31,25,0.75)]" /> : null}
                                  {item.name}
                                </div>
                              </td>
                              <td className="px-4 py-3.5 text-gray-300">{item.email}</td>
                              <td className="px-4 py-3.5 text-gray-300">{item.message.slice(0, 70)}...</td>
                              <td className="px-4 py-3.5 text-gray-500">{new Date(item.created_at).toLocaleDateString()}</td>
                              <td className="px-4 py-3.5">
                                <div className="flex justify-end gap-2">
                                  <ActionButton
                                    onClick={() => {
                                      setMessageModal({ open: true, data: item });
                                      if (!item.is_read) {
                                        markSubmissionRead(item.id, true);
                                      }
                                    }}
                                  >
                                    <Eye size={14} /> View
                                  </ActionButton>
                                  <ActionButton onClick={() => markSubmissionRead(item.id, !item.is_read)}>
                                    {item.is_read ? 'Unread' : 'Read'}
                                  </ActionButton>
                                  <ActionButton variant="danger" onClick={() => deleteSubmission(item.id)}>
                                    <Trash2 size={14} />
                                  </ActionButton>
                                </div>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </AdminTableShell>
                ) : null}

                {activeTab === 'settings' ? (
                  <AdminCard className="p-5 md:p-6 max-w-2xl">
                    <h2 className="text-2xl font-bold mb-2">Admin Settings</h2>
                    <p className="text-gray-400 mb-5">Signed in as {adminSession.user?.email}</p>

                    <ActionButton variant="primary" onClick={logoutAdmin} className="h-11 px-4">
                      <LogOut size={15} /> Logout
                    </ActionButton>
                  </AdminCard>
                ) : null}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>

      <AdminModal
        open={projectModal.open}
        title={projectModal.edit ? 'Edit Project' : 'Add Project'}
        onClose={() => setProjectModal({ open: false, edit: null })}
      >
        <ProjectForm
          initial={projectModal.edit}
          submitting={savingProject}
          onSubmit={async (payload) => {
            setSavingProject(true);
            try {
              if (projectModal.edit?.id) await updateProject(projectModal.edit.id, payload);
              else await addProject(payload);
              setProjectModal({ open: false, edit: null });
            } finally {
              setSavingProject(false);
            }
          }}
        />
      </AdminModal>

      <AdminModal
        open={skillModal.open}
        title={skillModal.edit ? 'Edit Skill' : 'Add Skill'}
        onClose={() => setSkillModal({ open: false, edit: null })}
      >
        <SkillForm
          initial={skillModal.edit}
          categories={categoryOptions}
          submitting={savingSkill}
          onSubmit={async (payload) => {
            setSavingSkill(true);
            try {
              if (skillModal.edit?.id) await updateSkill(skillModal.edit.id, payload);
              else await addSkill(payload);
              setSkillModal({ open: false, edit: null });
            } finally {
              setSavingSkill(false);
            }
          }}
        />
      </AdminModal>

      <AdminModal
        open={categoryModal.open}
        title="Create Category"
        onClose={() => setCategoryModal({ open: false })}
      >
        <CategoryForm
          submitting={savingCategory}
          onSubmit={async ({ category, firstSkill }) => {
            if (!category || !firstSkill) return;
            setSavingCategory(true);
            try {
              await addSkill({ name: firstSkill, category });
              setCategoryModal({ open: false });
            } finally {
              setSavingCategory(false);
            }
          }}
        />
      </AdminModal>

      <AdminModal
        open={messageModal.open}
        title="Message Details"
        onClose={() => setMessageModal({ open: false, data: null })}
      >
        {messageModal.data ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AdminCard className="p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-1">Name</p>
              <p>{messageModal.data.name}</p>
            </AdminCard>
            <AdminCard className="p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-1">Email</p>
              <p>{messageModal.data.email}</p>
            </AdminCard>
            <AdminCard className="p-4 md:col-span-2">
              <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-1">Message</p>
              <p className="whitespace-pre-wrap">{messageModal.data.message}</p>
            </AdminCard>
          </div>
        ) : null}
      </AdminModal>
    </div>
  );
};

export default AdminPanel;
