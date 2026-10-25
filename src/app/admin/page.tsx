'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import Link from 'next/link';
import { extractHashtags } from '@/lib/defaultPins';
import {
  IconChart,
  IconFilm,
  IconPlus,
  IconUpload,
  IconCheck,
  IconX,
  IconTrash,
  IconEdit,
  IconEye,
  IconClock,
  IconPin,
  IconRefresh,
  IconArrowUpRight,
  IconLogOut,
  IconSparkles,
  IconLayers,
  IconSearch,
} from '@/components/Iconoir';

interface Project {
  id: string;
  title: string;
  category: string;
  categoryLabel: string;
  tags: string[];
  aspect: 'vertical' | 'square' | 'wide';
  videoWebm: string;
  videoMp4: string;
  poster: string;
  client: string;
  description: string;
  duration: string;
  sourceUrl: string;
  specs: {
    fps: string;
    colorGrade: string;
    sound: string;
  };
  sortOrder: number;
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
}

interface ShowcaseItem {
  id: number;
  titleTop: string;
  titleBottom: string;
  leftTitle: string;
  leftText: string;
  rightTitle: string;
  rightText: string;
  videoWebm: string;
  videoMp4: string;
  posterSrc: string;
  videoSrc: string;
  width: number;
  height: number;
  sortOrder: number;
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
}

interface AnalyticsData {
  kpis: {
    totalOpens: number;
    totalReelClicks: number;
    overallReelCtr: number;
    totalWatchSeconds: number;
    averageWatchSeconds: number;
    uniqueSessions: number;
  };
  videos: Array<{
    projectId: string;
    title: string;
    client: string;
    poster: string;
    opens: number;
    reelClicks: number;
    reelCtr: number;
    avgWatchSeconds: number;
    totalWatchSeconds: number;
  }>;
  geo: {
    byCountry: Array<{ name: string; count: number; percentage: number }>;
    byRegion: Array<{ name: string; count: number; percentage: number }>;
    byCity: Array<{ name: string; count: number; percentage: number }>;
  };
  recentEvents: Array<{
    id: string;
    projectId: string;
    projectTitle: string;
    eventType: string;
    durationSeconds: number;
    country: string;
    region: string;
    city: string;
    createdAt: number;
  }>;
}

export default function AdminPage() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'analytics' | 'projects' | 'showcase' | 'upload'>('analytics');

  // Showcase Studio State
  const [showcaseItems, setShowcaseItems] = useState<ShowcaseItem[]>([]);
  const [isLoadingShowcase, setIsLoadingShowcase] = useState(false);
  const [selectedShowcaseIdx, setSelectedShowcaseIdx] = useState(0);
  const [isSavingShowcase, setIsSavingShowcase] = useState(false);
  const [showcaseSaveSuccess, setShowcaseSaveSuccess] = useState(false);
  const [isUploadingShowcaseVideo, setIsUploadingShowcaseVideo] = useState(false);
  const [isUploadingShowcasePoster, setIsUploadingShowcasePoster] = useState(false);
  const [showCustomUrlDrawer, setShowCustomUrlDrawer] = useState(false);
  const showcaseVideoInputRef = useRef<HTMLInputElement>(null);
  const showcasePosterInputRef = useRef<HTMLInputElement>(null);

  // Projects State
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);

  // Analytics State
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(false);

  // Upload Form State
  const [uploadMode, setUploadMode] = useState<'raw' | 'compressed'>('raw');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedResult, setUploadedResult] = useState<{
    videoMp4: string;
    videoWebm: string;
    poster: string;
    storage: string;
  } | null>(null);

  // Dynamic automatic aspect ratio & duration detected from video file
  const [detectedAspect, setDetectedAspect] = useState<'vertical' | 'square' | 'wide'>('vertical');
  const [detectedDimensions, setDetectedDimensions] = useState<{ width: number; height: number } | null>(null);

  // Form Fields
  const [formTitle, setFormTitle] = useState('');
  const [formClient, setFormClient] = useState('');
  const [formDuration, setFormDuration] = useState('0:15');
  const [formSourceUrl, setFormSourceUrl] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formFps, setFormFps] = useState('');
  const [formColorGrade, setFormColorGrade] = useState('');
  const [formSound, setFormSound] = useState('');
  const [isSubmittingProject, setIsSubmittingProject] = useState(false);
  const [formSuccessMessage, setFormSuccessMessage] = useState('');
  const [formErrorMessage, setFormErrorMessage] = useState('');

  // Live hashtag extraction from description
  const detectedFormTags = useMemo(() => {
    return extractHashtags(formDescription);
  }, [formDescription]);

  // Editing Project Modal
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  // Deleting Project State
  const [deletingProjectId, setDeletingProjectId] = useState<string | null>(null);

  // Verify Auth on mount & support ?tab= deep links
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      if (tabParam === 'showcase' || tabParam === 'projects' || tabParam === 'analytics' || tabParam === 'upload') {
        setActiveTab(tabParam as any);
      }
    }

    async function checkAuth() {
      try {
        const res = await fetch('/api/admin/auth');
        const data = await res.json();
        setIsAuthenticated(Boolean(data.authenticated));
      } catch {
        setIsAuthenticated(false);
      }
    }
    checkAuth();
  }, []);

  // Fetch Projects
  const fetchProjects = useCallback(async () => {
    setIsLoadingProjects(true);
    try {
      const res = await fetch('/api/admin/projects');
      const data = await res.json();
      if (data.success && Array.isArray(data.projects)) {
        setProjects(data.projects);
      }
    } catch (err) {
      console.error('Failed to load projects', err);
    } finally {
      setIsLoadingProjects(false);
    }
  }, []);

  // Fetch Analytics
  const fetchAnalytics = useCallback(async () => {
    setIsLoadingAnalytics(true);
    try {
      const res = await fetch('/api/analytics/summary');
      const data = await res.json();
      if (data.success) {
        setAnalytics(data);
      }
    } catch (err) {
      console.error('Failed to load analytics', err);
    } finally {
      setIsLoadingAnalytics(false);
    }
  }, []);

  // Fetch Showcase Items
  const fetchShowcaseItems = useCallback(async () => {
    setIsLoadingShowcase(true);
    try {
      const res = await fetch('/api/admin/showcase');
      const data = await res.json();
      if (data.success && Array.isArray(data.items)) {
        setShowcaseItems(data.items);
      }
    } catch (err) {
      console.error('Failed to load showcase items', err);
    } finally {
      setIsLoadingShowcase(false);
    }
  }, []);

  // Updates a field on the currently active showcase card locally
  const updateCurrentShowcaseField = (field: keyof ShowcaseItem, value: any) => {
    setShowcaseItems((prev) => {
      const next = [...prev];
      if (next[selectedShowcaseIdx]) {
        next[selectedShowcaseIdx] = { ...next[selectedShowcaseIdx], [field]: value };
      }
      return next;
    });
    setShowcaseSaveSuccess(false);
  };

  // Save Currently Selected Showcase Slide
  const handleSaveCurrentShowcase = async () => {
    const item = showcaseItems[selectedShowcaseIdx];
    if (!item) return;
    setIsSavingShowcase(true);
    setShowcaseSaveSuccess(false);
    try {
      const res = await fetch(`/api/admin/showcase/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      const data = await res.json();
      if (data.success && data.item) {
        setShowcaseItems((prev) =>
          prev.map((it) => (it.id === item.id ? data.item : it))
        );
        setShowcaseSaveSuccess(true);
        setTimeout(() => setShowcaseSaveSuccess(false), 3500);
      } else {
        alert(data.error || 'Failed to save showcase card');
      }
    } catch (err) {
      alert('Network error while saving showcase card');
    } finally {
      setIsSavingShowcase(false);
    }
  };

  // Upload Video directly with auto-dimension detection
  const handleShowcaseVideoSelect = async (file: File) => {
    const item = showcaseItems[selectedShowcaseIdx];
    if (!file || !item) return;

    // 1. Auto-detect dimensions from HTML5 video metadata
    try {
      const tempVideo = document.createElement('video');
      tempVideo.preload = 'metadata';
      const blobUrl = URL.createObjectURL(file);
      tempVideo.src = blobUrl;
      tempVideo.onloadedmetadata = () => {
        const w = tempVideo.videoWidth || 720;
        const h = tempVideo.videoHeight || 1280;
        setShowcaseItems((prev) => {
          const next = [...prev];
          if (next[selectedShowcaseIdx]) {
            next[selectedShowcaseIdx] = {
              ...next[selectedShowcaseIdx],
              width: w,
              height: h,
            };
          }
          return next;
        });
        URL.revokeObjectURL(blobUrl);
      };
    } catch (e) {
      console.warn('Auto dimension detection error:', e);
    }

    // 2. Upload to server
    setIsUploadingShowcaseVideo(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'video');
    formData.append('mode', 'raw');

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setShowcaseItems((prev) => {
          const next = [...prev];
          if (next[selectedShowcaseIdx]) {
            next[selectedShowcaseIdx] = {
              ...next[selectedShowcaseIdx],
              videoMp4: data.videoMp4,
              videoWebm: data.videoWebm || data.videoMp4,
              videoSrc: data.videoMp4,
              ...(data.poster ? { posterSrc: data.poster } : {}),
            };
          }
          return next;
        });
      } else {
        alert(data.error || 'Video upload failed');
      }
    } catch {
      alert('Upload failed due to network error');
    } finally {
      setIsUploadingShowcaseVideo(false);
      if (showcaseVideoInputRef.current) showcaseVideoInputRef.current.value = '';
    }
  };

  // Upload Custom Poster directly
  const handleShowcasePosterSelect = async (file: File) => {
    if (!file) return;
    setIsUploadingShowcasePoster(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'poster');
    formData.append('mode', 'raw');

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        updateCurrentShowcaseField('posterSrc', data.url || data.poster);
      } else {
        alert(data.error || 'Poster upload failed');
      }
    } catch {
      alert('Poster upload failed due to network error');
    } finally {
      setIsUploadingShowcasePoster(false);
      if (showcasePosterInputRef.current) showcasePosterInputRef.current.value = '';
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchProjects();
      fetchAnalytics();
      fetchShowcaseItems();
    }
  }, [isAuthenticated, fetchProjects, fetchAnalytics, fetchShowcaseItems]);

  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsAuthLoading(true);
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordInput }),
      });
      const data = await res.json();
      if (data.success) {
        setIsAuthenticated(true);
      } else {
        setAuthError(data.error || 'Incorrect passphrase');
      }
    } catch {
      setAuthError('Connection failed');
    } finally {
      setIsAuthLoading(false);
    }
  };

  // Logout handler
  const handleLogout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' });
    setIsAuthenticated(false);
  };

  // Video File Selection & Automatic Dimension/Duration Detection
  const handleFileSelect = (file: File) => {
    setUploadFile(file);
    setFormErrorMessage('');

    // Dynamic Automatic Aspect Ratio & Duration from Video Metadata
    if (typeof window !== 'undefined') {
      const videoEl = document.createElement('video');
      videoEl.preload = 'metadata';
      const objUrl = URL.createObjectURL(file);
      videoEl.src = objUrl;

      videoEl.onloadedmetadata = () => {
        URL.revokeObjectURL(objUrl);
        const w = videoEl.videoWidth;
        const h = videoEl.videoHeight;
        const dur = videoEl.duration;

        setDetectedDimensions({ width: w, height: h });

        // Automatic Aspect calculation:
        const ratio = w / h;
        let aspect: 'vertical' | 'square' | 'wide' = 'vertical';
        if (ratio >= 1.25) {
          aspect = 'wide';
        } else if (ratio <= 0.8) {
          aspect = 'vertical';
        } else {
          aspect = 'square';
        }
        setDetectedAspect(aspect);

        // Format duration automatically (e.g. 0:18)
        if (!isNaN(dur) && dur > 0) {
          const mins = Math.floor(dur / 60);
          const secs = Math.floor(dur % 60);
          setFormDuration(`${mins}:${secs < 10 ? '0' : ''}${secs}`);
        }
      };

      videoEl.onerror = () => {
        URL.revokeObjectURL(objUrl);
      };
    }

    // Auto-fill title from filename if title empty
    if (!formTitle) {
      const cleanName = file.name
        .replace(/\.[^/.]+$/, '')
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, (l) => l.toUpperCase());
      setFormTitle(cleanName);
    }

    // Trigger upload
    uploadSelectedFile(file);
  };

  // Upload Video File to Cloudinary / Local API
  const uploadSelectedFile = async (file: File) => {
    setIsUploading(true);
    setUploadProgress(15);
    setFormErrorMessage('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'video');
      formData.append('mode', uploadMode);

      setUploadProgress(45);
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      setUploadProgress(85);
      const data = await res.json();

      if (data.success) {
        setUploadedResult({
          videoMp4: data.videoMp4,
          videoWebm: data.videoWebm,
          poster: data.poster,
          storage: data.storage,
        });
        setUploadProgress(100);
      } else {
        setFormErrorMessage(data.error || 'Upload failed');
      }
    } catch (err: any) {
      setFormErrorMessage(err.message || 'Upload connection error');
    } finally {
      setIsUploading(false);
    }
  };

  // Create Project Submit Handler
  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadedResult?.videoMp4) {
      setFormErrorMessage('Please select and upload a video file first');
      return;
    }
    if (!formTitle.trim()) {
      setFormErrorMessage('Please enter a project title');
      return;
    }

    setIsSubmittingProject(true);
    setFormErrorMessage('');
    setFormSuccessMessage('');

    try {
      const tagsArray = extractHashtags(formDescription);
      const primaryTag = tagsArray[0] || 'visual';

      const res = await fetch('/api/admin/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formTitle,
          client: formClient.trim(),
          category: primaryTag,
          categoryLabel: `#${primaryTag}`,
          tags: tagsArray,
          aspect: detectedAspect,
          videoWebm: uploadedResult.videoWebm,
          videoMp4: uploadedResult.videoMp4,
          poster: uploadedResult.poster,
          duration: formDuration || '0:15',
          sourceUrl: formSourceUrl || 'https://instagram.com/zylitch',
          description: formDescription,
          specs: {
            fps: formFps.trim(),
            colorGrade: formColorGrade.trim(),
            sound: formSound.trim(),
          },
          sortOrder: projects.length + 1,
          isActive: true,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setFormSuccessMessage('Project published successfully to Turso DB & live site!');
        setUploadFile(null);
        setUploadedResult(null);
        setFormTitle('');
        setFormClient('');
        setFormSourceUrl('');
        setFormDescription('');
        setFormFps('');
        setFormColorGrade('');
        setFormSound('');
        fetchProjects();
        fetchAnalytics();
        setTimeout(() => {
          setActiveTab('projects');
          setFormSuccessMessage('');
        }, 1200);
      } else {
        setFormErrorMessage(data.error || 'Failed to publish project');
      }
    } catch (err: any) {
      setFormErrorMessage(err.message || 'Submission error');
    } finally {
      setIsSubmittingProject(false);
    }
  };

  // Delete Project Handler
  const handleDeleteProject = async (id: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this project?')) return;
    setDeletingProjectId(id);
    try {
      const res = await fetch(`/api/admin/projects/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setProjects((prev) => prev.filter((p) => p.id !== id));
        fetchAnalytics();
      }
    } catch (err) {
      console.error('Failed to delete project', err);
    } finally {
      setDeletingProjectId(null);
    }
  };

  // Toggle Active State
  const handleToggleActive = async (project: Project) => {
    try {
      const res = await fetch(`/api/admin/projects/${project.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !project.isActive }),
      });
      const data = await res.json();
      if (data.success) {
        setProjects((prev) =>
          prev.map((p) => (p.id === project.id ? { ...p, isActive: !p.isActive } : p))
        );
      }
    } catch (err) {
      console.error('Failed to toggle active status', err);
    }
  };

  // Save Edit Project
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;
    setIsSavingEdit(true);

    try {
      const tags = extractHashtags(editingProject.description || '');
      const primaryTag = tags[0] || editingProject.category || 'visual';
      const payload = {
        ...editingProject,
        tags,
        category: primaryTag,
        categoryLabel: tags[0] ? `#${tags[0]}` : 'Visual',
        client: editingProject.client ? editingProject.client.trim() : '',
      };

      const res = await fetch(`/api/admin/projects/${editingProject.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setProjects((prev) =>
          prev.map((p) => (p.id === editingProject.id ? data.project : p))
        );
        setEditingProject(null);
        fetchAnalytics();
      }
    } catch (err) {
      console.error('Failed to save project edits', err);
    } finally {
      setIsSavingEdit(false);
    }
  };

  // Loading state during auth check
  if (isAuthenticated === null) {
    return (
      <div style={styles.centerStage}>
        <div style={styles.loadingSpinner} />
      </div>
    );
  }

  // Render Login Screen if not authenticated
  if (!isAuthenticated) {
    return (
      <div style={styles.loginContainer}>
        <div style={styles.loginCard}>
          <div style={styles.loginHeader}>
            <span style={styles.badge}>CONSOLE ACCESS</span>
            <h1 style={styles.loginTitle}>Zylitch Studio</h1>
            <p style={styles.loginSub}>Enter your master passphrase to access studio metrics, Turso DB, and Cloudinary media controls.</p>
          </div>

          <form onSubmit={handleLogin} style={styles.loginForm}>
            <input
              type="password"
              placeholder="Master Passphrase"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              style={styles.loginInput}
              autoFocus
              required
            />
            {authError && <div style={styles.errorAlert}>{authError}</div>}
            <button type="submit" disabled={isAuthLoading} style={styles.primaryBtn}>
              {isAuthLoading ? 'Authenticating...' : 'Enter Console'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.adminRoot}>
      {/* Top Console Navigation Bar */}
      <header style={styles.adminHeader}>
        <div style={styles.headerBrand}>
          <Link href="/" style={styles.brandLogo}>
            ZYLITCH
          </Link>
          <span style={styles.brandTag}>STUDIO ADMIN</span>
        </div>

        <div style={styles.headerCenter}>
          <div style={styles.statusPills}>
            <div style={styles.statusPill}>
              <span style={styles.statusDotGreen} />
              <span>Turso DB: Online</span>
            </div>
            <div style={styles.statusPill}>
              <span style={styles.statusDotPink} />
              <span>Cloudinary: Dynamic</span>
            </div>
          </div>
        </div>

        <div style={styles.headerActions}>
          <Link href="/work" target="_blank" style={styles.secondaryLinkBtn}>
            <span>View Live Site</span>
            <IconArrowUpRight size={14} />
          </Link>
          <button onClick={handleLogout} style={styles.ghostBtn} title="Sign Out">
            <IconLogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Tabs Navigation */}
      <div style={styles.tabBarContainer}>
        <div style={styles.tabBar}>
          <button
            onClick={() => setActiveTab('analytics')}
            style={activeTab === 'analytics' ? styles.tabBtnActive : styles.tabBtn}
          >
            <IconChart size={16} />
            <span>Analytics & GeoIP</span>
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            style={activeTab === 'projects' ? styles.tabBtnActive : styles.tabBtn}
          >
            <IconFilm size={16} />
            <span>All Projects ({projects.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('showcase')}
            style={activeTab === 'showcase' ? styles.tabBtnActive : styles.tabBtn}
          >
            <IconSparkles size={16} />
            <span>Showcase Reel ({showcaseItems.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            style={activeTab === 'upload' ? styles.tabBtnActive : styles.tabBtn}
          >
            <IconPlus size={16} />
            <span>Upload & Create</span>
          </button>
        </div>
      </div>

      {/* Main Body Content */}
      <main style={styles.mainContent}>
        {/* =========================================================================
            TAB 1: ANALYTICS & GEOIP
            ========================================================================= */}
        {activeTab === 'analytics' && (
          <div style={styles.tabContent}>
            {/* KPI Metrics Cards */}
            <div style={styles.kpiGrid}>
              <div style={styles.kpiCard}>
                <span style={styles.kpiLabel}>TOTAL VIDEO OPENS</span>
                <div style={styles.kpiValue}>{analytics?.kpis.totalOpens || 0}</div>
                <span style={styles.kpiSub}>Overlay modal impressions</span>
              </div>

              <div style={styles.kpiCard}>
                <span style={styles.kpiLabel}>SHOW REEL CLICKS</span>
                <div style={styles.kpiValue}>{analytics?.kpis.totalReelClicks || 0}</div>
                <span style={styles.kpiSub}>Outbound clicks to original reel</span>
              </div>

              <div style={styles.kpiCard}>
                <span style={styles.kpiLabel}>REEL CTR</span>
                <div style={styles.kpiValue}>
                  {analytics?.kpis.overallReelCtr ? `${analytics.kpis.overallReelCtr}%` : '0%'}
                </div>
                <span style={styles.kpiSub}>Conversion from open to reel</span>
              </div>

              <div style={styles.kpiCard}>
                <span style={styles.kpiLabel}>AVG WATCH DURATION</span>
                <div style={styles.kpiValue}>
                  {analytics?.kpis.averageWatchSeconds ? `${analytics.kpis.averageWatchSeconds}s` : '0s'}
                </div>
                <span style={styles.kpiSub}>Average viewer dwell time</span>
              </div>
            </div>

            {/* Video Performance Table */}
            <section style={styles.sectionCard}>
              <div style={styles.sectionHeader}>
                <div>
                  <h2 style={styles.sectionTitle}>Video Performance Matrix</h2>
                  <p style={styles.sectionSub}>Breakdown of impressions, show reel clicks, and retention per project</p>
                </div>
                <button onClick={fetchAnalytics} style={styles.refreshBtn}>
                  <IconRefresh size={14} />
                  <span>Refresh</span>
                </button>
              </div>

              <div style={styles.tableWrapper}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Project</th>
                      <th style={styles.th}>Client</th>
                      <th style={styles.th}>Opens</th>
                      <th style={styles.th}>Reel Clicks</th>
                      <th style={styles.th}>Reel CTR</th>
                      <th style={styles.th}>Avg Watch Time</th>
                      <th style={styles.th}>Total Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics?.videos.length === 0 ? (
                      <tr>
                        <td colSpan={7} style={styles.emptyTd}>
                          No analytics recorded yet. Open videos on the /work page to start tracking.
                        </td>
                      </tr>
                    ) : (
                      analytics?.videos.map((vid) => (
                        <tr key={vid.projectId} style={styles.tr}>
                          <td style={styles.tdProject}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={vid.poster} alt="" style={styles.tableThumb} />
                            <span style={styles.tableTitle}>{vid.title}</span>
                          </td>
                          <td style={styles.td}>{vid.client}</td>
                          <td style={styles.tdLight}>{vid.opens}</td>
                          <td style={styles.td}>{vid.reelClicks}</td>
                          <td style={styles.tdPink}>{vid.reelCtr}%</td>
                          <td style={styles.td}>{vid.avgWatchSeconds}s</td>
                          <td style={styles.td}>{Math.round(vid.totalWatchSeconds / 60)} min</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Geographic Breakdown (Vercel GeoIP) */}
            <div style={styles.geoGrid}>
              {/* Countries */}
              <section style={styles.sectionCard}>
                <div style={styles.geoCardTitleRow}>
                  <IconPin size={16} color="#ff80b3" />
                  <h3 style={styles.sectionMiniTitle}>Countries</h3>
                </div>
                <p style={styles.sectionSub}>Derived via Vercel GeoIP header (<code>x-vercel-ip-country</code>)</p>
                <div style={styles.geoList}>
                  {analytics?.geo.byCountry.length === 0 ? (
                    <div style={styles.emptyNotice}>No country events recorded yet.</div>
                  ) : (
                    analytics?.geo.byCountry.map((item) => (
                      <div key={item.name} style={styles.geoItem}>
                        <div style={styles.geoItemHeader}>
                          <span style={styles.geoName}>{item.name}</span>
                          <span style={styles.geoCount}>{item.count} views ({item.percentage}%)</span>
                        </div>
                        <div style={styles.geoBarTrack}>
                          <div style={{ ...styles.geoBarFill, width: `${item.percentage}%` }} />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </section>

              {/* States / Provinces */}
              <section style={styles.sectionCard}>
                <div style={styles.geoCardTitleRow}>
                  <IconLayers size={16} color="#ff80b3" />
                  <h3 style={styles.sectionMiniTitle}>States & Provinces</h3>
                </div>
                <p style={styles.sectionSub}>Derived via Vercel Region header (<code>x-vercel-ip-country-region</code>)</p>
                <div style={styles.geoList}>
                  {analytics?.geo.byRegion.length === 0 ? (
                    <div style={styles.emptyNotice}>No region events recorded yet.</div>
                  ) : (
                    analytics?.geo.byRegion.map((item) => (
                      <div key={item.name} style={styles.geoItem}>
                        <div style={styles.geoItemHeader}>
                          <span style={styles.geoName}>{item.name}</span>
                          <span style={styles.geoCount}>{item.count} views ({item.percentage}%)</span>
                        </div>
                        <div style={styles.geoBarTrack}>
                          <div style={{ ...styles.geoBarFill, width: `${item.percentage}%` }} />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </section>

              {/* Cities */}
              <section style={styles.sectionCard}>
                <div style={styles.geoCardTitleRow}>
                  <IconPin size={16} color="#ff80b3" />
                  <h3 style={styles.sectionMiniTitle}>Cities</h3>
                </div>
                <p style={styles.sectionSub}>Derived via Vercel City header (<code>x-vercel-ip-city</code>)</p>
                <div style={styles.geoList}>
                  {analytics?.geo.byCity.length === 0 ? (
                    <div style={styles.emptyNotice}>No city events recorded yet.</div>
                  ) : (
                    analytics?.geo.byCity.map((item) => (
                      <div key={item.name} style={styles.geoItem}>
                        <div style={styles.geoItemHeader}>
                          <span style={styles.geoName}>{item.name}</span>
                          <span style={styles.geoCount}>{item.count} views ({item.percentage}%)</span>
                        </div>
                        <div style={styles.geoBarTrack}>
                          <div style={{ ...styles.geoBarFill, width: `${item.percentage}%` }} />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </section>
            </div>

            {/* Real-Time Live Activity Stream */}
            <section style={styles.sectionCard}>
              <div style={styles.geoCardTitleRow}>
                <IconClock size={16} color="#ff80b3" />
                <h3 style={styles.sectionMiniTitle}>Recent Activity Stream</h3>
              </div>
              <div style={styles.eventStreamList}>
                {analytics?.recentEvents.length === 0 ? (
                  <div style={styles.emptyNotice}>No recent events.</div>
                ) : (
                  analytics?.recentEvents.map((evt) => (
                    <div key={evt.id} style={styles.eventItem}>
                      <span style={styles.eventBadge}>
                        {evt.eventType === 'video_open'
                          ? 'OPEN'
                          : evt.eventType === 'show_reel_click'
                          ? 'REEL CLICK'
                          : `${Math.round(evt.durationSeconds)}s WATCH`}
                      </span>
                      <span style={styles.eventProject}>{evt.projectTitle}</span>
                      <span style={styles.eventLocation}>
                        {evt.city !== 'Unknown' ? `${evt.city}, ` : ''}
                        {evt.region !== 'Unknown' ? `${evt.region}, ` : ''}
                        {evt.country}
                      </span>
                      <span style={styles.eventTime}>
                        {new Date(evt.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>
        )}

        {/* =========================================================================
            TAB 2: ALL PROJECTS CRUD
            ========================================================================= */}
        {activeTab === 'projects' && (
          <div style={styles.tabContent}>
            <div style={styles.sectionHeader}>
              <div>
                <h2 style={styles.sectionTitle}>Video Projects</h2>
                <p style={styles.sectionSub}>All projects stored in Turso DB. Changes are instantly visible on /work.</p>
              </div>
              <button onClick={() => setActiveTab('upload')} style={styles.primaryBtn}>
                <IconPlus size={16} />
                <span>Add Project</span>
              </button>
            </div>

            <div style={styles.projectsGrid}>
              {projects.map((proj) => (
                <div key={proj.id} style={styles.projectCard}>
                  <div style={styles.projectMediaWrap}>
                    <video
                      src={proj.videoMp4}
                      poster={proj.poster}
                      muted
                      loop
                      playsInline
                      onMouseEnter={(e) => (e.currentTarget as HTMLVideoElement).play().catch(() => {})}
                      onMouseLeave={(e) => (e.currentTarget as HTMLVideoElement).pause()}
                      style={styles.projectVideo}
                    />
                    <div style={styles.projectOverlayMeta}>
                      <span style={styles.aspectBadge}>{proj.aspect}</span>
                      <span style={styles.durationBadge}>{proj.duration}</span>
                    </div>
                  </div>

                  <div style={styles.projectBody}>
                    <div style={styles.projectCategory}>{proj.categoryLabel}</div>
                    <h3 style={styles.projectTitle}>{proj.title}</h3>
                    <div style={styles.projectClient}>{proj.client}</div>
                    <p style={styles.projectDesc}>{proj.description}</p>

                    <div style={styles.projectTags}>
                      {proj.tags.map((t) => (
                        <span key={t} style={styles.tagPill}>
                          #{t}
                        </span>
                      ))}
                    </div>

                    <div style={styles.projectActions}>
                      <button
                        onClick={() => handleToggleActive(proj)}
                        style={proj.isActive ? styles.statusBtnActive : styles.statusBtnInactive}
                      >
                        {proj.isActive ? 'Active' : 'Draft'}
                      </button>

                      <button
                        onClick={() => setEditingProject(proj)}
                        style={styles.editBtn}
                        title="Edit Project"
                      >
                        <IconEdit size={14} />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => handleDeleteProject(proj.id)}
                        disabled={deletingProjectId === proj.id}
                        style={styles.deleteBtn}
                        title="Delete Project"
                      >
                        <IconTrash size={14} />
                        <span>{deletingProjectId === proj.id ? 'Deleting...' : 'Delete'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB: SHOWCASE REEL (HOME PAGE HORIZONTAL CARDS) - SHOWCASE STUDIO
            ========================================================================= */}
        {activeTab === 'showcase' && (
          <div style={styles.tabContent}>
            {/* Header */}
            <div style={styles.sectionHeader}>
              <div>
                <h2 style={styles.sectionTitle}>Showcase Studio</h2>
                <p style={styles.sectionSub}>
                  Direct live editor for the 5 interactive reel slides on the home page horizontal scroll. Select a slide to upload video and edit text in real time.
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {showcaseSaveSuccess && (
                  <span style={styles.saveSuccessPill}>
                    <IconCheck size={14} color="#4ade80" />
                    <span>Saved to Live Site!</span>
                  </span>
                )}
                <button
                  type="button"
                  onClick={handleSaveCurrentShowcase}
                  disabled={isSavingShowcase}
                  style={showcaseSaveSuccess ? { ...styles.primaryBtn, ...styles.primaryBtnSaved } : styles.primaryBtn}
                >
                  {isSavingShowcase ? (
                    <>
                      <div style={{ ...styles.spinner, width: 14, height: 14 }} />
                      <span>Saving...</span>
                    </>
                  ) : showcaseSaveSuccess ? (
                    <>
                      <IconCheck size={14} />
                      <span>Saved!</span>
                    </>
                  ) : (
                    <>
                      <IconCheck size={14} />
                      <span>Save Slide</span>
                    </>
                  )}
                </button>
                <button type="button" onClick={fetchShowcaseItems} style={styles.secondaryBtn} title="Reload from database">
                  <IconRefresh size={14} />
                  <span>Refresh</span>
                </button>
              </div>
            </div>

            {isLoadingShowcase ? (
              <div style={styles.loadingContainer}>
                <div style={styles.spinner} />
                <p style={styles.loadingText}>Loading showcase studio...</p>
              </div>
            ) : showcaseItems.length === 0 ? (
              <div style={styles.emptyState}>
                <IconSparkles size={36} color="var(--pink-primary)" />
                <h3 style={styles.emptyTitle}>No Showcase Slides Found</h3>
                <p style={styles.emptySub}>Slides will be automatically initialized from default portfolio presets.</p>
                <button onClick={fetchShowcaseItems} style={styles.primaryBtn}>
                  <IconRefresh size={14} />
                  <span>Reload Presets</span>
                </button>
              </div>
            ) : (() => {
              const currentSlide = showcaseItems[selectedShowcaseIdx] || showcaseItems[0];
              if (!currentSlide) return null;

              const aspectLabel =
                currentSlide.width > currentSlide.height
                  ? '16:9 Wide'
                  : currentSlide.width === currentSlide.height
                  ? '1:1 Square'
                  : '9:16 Vertical';

              return (
                <div style={styles.studioContainer}>
                  {/* Slide Selector Strip */}
                  <div style={styles.slideSelectorBar}>
                    {showcaseItems.map((item, idx) => {
                      const isSelected = idx === selectedShowcaseIdx;
                      const itemAspect =
                        item.width > item.height ? '16:9' : item.width === item.height ? '1:1' : '9:16';
                      return (
                        <div
                          key={item.id}
                          onClick={() => {
                            setSelectedShowcaseIdx(idx);
                            setShowcaseSaveSuccess(false);
                          }}
                          style={{
                            ...styles.slidePill,
                            ...(isSelected ? styles.slidePillActive : {}),
                          }}
                        >
                          <span
                            style={{
                              ...styles.slidePillIndex,
                              ...(isSelected ? styles.slidePillIndexActive : {}),
                            }}
                          >
                            0{idx + 1}
                          </span>
                          <span style={styles.slidePillTitle}>
                            {item.titleTop} {item.titleBottom}
                          </span>
                          <span
                            style={{
                              ...styles.slidePillAspect,
                              ...(isSelected ? styles.slidePillAspectActive : {}),
                            }}
                          >
                            {itemAspect}
                          </span>
                          <span
                            style={{
                              ...styles.slidePillDot,
                              backgroundColor: item.isActive ? '#4ade80' : 'rgba(255, 255, 255, 0.25)',
                            }}
                            title={item.isActive ? 'Active on Home' : 'Draft / Inactive'}
                          />
                        </div>
                      );
                    })}
                  </div>

                  {/* Two-Column Studio Layout */}
                  <div style={styles.studioGrid}>
                    {/* LEFT COLUMN: Media Preview & Direct Upload */}
                    <div style={styles.studioLeftCol}>
                      <div style={styles.studioMediaBox}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.88rem', fontWeight: 400, color: '#ffffff' }}>
                            Card #{selectedShowcaseIdx + 1} Media
                          </span>
                          <span style={{ fontSize: '0.74rem', color: 'rgba(255, 255, 255, 0.45)', fontWeight: 300 }}>
                            {currentSlide.width} &times; {currentSlide.height} ({aspectLabel})
                          </span>
                        </div>

                        {/* Live Player Preview */}
                        <div style={styles.studioMediaPreview}>
                          <div style={styles.studioMediaBadge}>
                            Slide 0{selectedShowcaseIdx + 1}
                          </div>
                          <div style={styles.studioFormatBadge}>
                            {aspectLabel}
                          </div>

                          {currentSlide.videoMp4 || currentSlide.videoSrc ? (
                            <video
                              key={currentSlide.videoMp4 || currentSlide.videoSrc}
                              src={currentSlide.videoMp4 || currentSlide.videoSrc}
                              poster={currentSlide.posterSrc}
                              controls
                              muted
                              loop
                              playsInline
                              style={styles.studioVideo}
                            />
                          ) : (
                            <img
                              src={currentSlide.posterSrc || '/assets/burger-promo-poster.webp'}
                              alt={`${currentSlide.titleTop} ${currentSlide.titleBottom}`}
                              style={{ width: '100%', maxHeight: 420, objectFit: 'contain' }}
                            />
                          )}
                        </div>

                        {/* Hidden Inputs */}
                        <input
                          ref={showcaseVideoInputRef}
                          type="file"
                          accept="video/*"
                          style={{ display: 'none' }}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleShowcaseVideoSelect(file);
                          }}
                        />
                        <input
                          ref={showcasePosterInputRef}
                          type="file"
                          accept="image/*"
                          style={{ display: 'none' }}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleShowcasePosterSelect(file);
                          }}
                        />

                        {/* Direct Video Upload Dropzone */}
                        <div
                          onClick={() => {
                            if (!isUploadingShowcaseVideo) {
                              showcaseVideoInputRef.current?.click();
                            }
                          }}
                          style={{
                            ...styles.studioUploadBox,
                            opacity: isUploadingShowcaseVideo ? 0.6 : 1,
                            pointerEvents: isUploadingShowcaseVideo ? 'none' : 'auto',
                          }}
                        >
                          <IconUpload size={22} color="#ff4f9c" />
                          <p style={styles.studioUploadText}>
                            {isUploadingShowcaseVideo ? 'Uploading Video & Auto-Detecting Dimensions...' : 'Upload & Replace Video'}
                          </p>
                          <p style={styles.studioUploadSubtext}>
                            Drop MP4 / WebM file &mdash; dimensions are auto-extracted instantly
                          </p>
                        </div>

                        {/* Quick Aspect Presets */}
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button
                            type="button"
                            onClick={() => {
                              updateCurrentShowcaseField('width', 720);
                              updateCurrentShowcaseField('height', 1280);
                            }}
                            style={{
                              ...styles.secondaryBtn,
                              flex: 1,
                              padding: '7px 8px',
                              fontSize: '0.72rem',
                              justifyContent: 'center',
                              backgroundColor: currentSlide.width === 720 && currentSlide.height === 1280 ? 'rgba(255, 79, 156, 0.16)' : 'rgba(255, 255, 255, 0.03)',
                              border: currentSlide.width === 720 && currentSlide.height === 1280 ? '1px solid #ff4f9c' : '1px solid rgba(255, 255, 255, 0.08)',
                              color: currentSlide.width === 720 && currentSlide.height === 1280 ? '#ff4f9c' : 'rgba(255, 255, 255, 0.7)',
                            }}
                          >
                            9:16 Vertical
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              updateCurrentShowcaseField('width', 1080);
                              updateCurrentShowcaseField('height', 1080);
                            }}
                            style={{
                              ...styles.secondaryBtn,
                              flex: 1,
                              padding: '7px 8px',
                              fontSize: '0.72rem',
                              justifyContent: 'center',
                              backgroundColor: currentSlide.width === 1080 && currentSlide.height === 1080 ? 'rgba(255, 79, 156, 0.16)' : 'rgba(255, 255, 255, 0.03)',
                              border: currentSlide.width === 1080 && currentSlide.height === 1080 ? '1px solid #ff4f9c' : '1px solid rgba(255, 255, 255, 0.08)',
                              color: currentSlide.width === 1080 && currentSlide.height === 1080 ? '#ff4f9c' : 'rgba(255, 255, 255, 0.7)',
                            }}
                          >
                            1:1 Square
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              updateCurrentShowcaseField('width', 1280);
                              updateCurrentShowcaseField('height', 720);
                            }}
                            style={{
                              ...styles.secondaryBtn,
                              flex: 1,
                              padding: '7px 8px',
                              fontSize: '0.72rem',
                              justifyContent: 'center',
                              backgroundColor: currentSlide.width === 1280 && currentSlide.height === 720 ? 'rgba(255, 79, 156, 0.16)' : 'rgba(255, 255, 255, 0.03)',
                              border: currentSlide.width === 1280 && currentSlide.height === 720 ? '1px solid #ff4f9c' : '1px solid rgba(255, 255, 255, 0.08)',
                              color: currentSlide.width === 1280 && currentSlide.height === 720 ? '#ff4f9c' : 'rgba(255, 255, 255, 0.7)',
                            }}
                          >
                            16:9 Wide
                          </button>
                        </div>

                        {/* Secondary Options */}
                        <div style={{ display: 'flex', gap: 10 }}>
                          <button
                            type="button"
                            onClick={() => showcasePosterInputRef.current?.click()}
                            disabled={isUploadingShowcasePoster}
                            style={{ ...styles.secondaryBtn, flex: 1, padding: '9px 12px', fontSize: '0.78rem', justifyContent: 'center' }}
                          >
                            <IconUpload size={13} />
                            <span>{isUploadingShowcasePoster ? 'Uploading Poster...' : 'Upload Poster Image'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setShowCustomUrlDrawer((prev) => !prev)}
                            style={{ ...styles.ghostBtn, fontSize: '0.78rem', padding: '9px 12px' }}
                          >
                            <span>{showCustomUrlDrawer ? 'Hide URLs' : 'Direct URLs'}</span>
                          </button>
                        </div>

                        {/* Direct URLs & Manual Dimensions Drawer */}
                        {showCustomUrlDrawer && (
                          <div style={styles.studioDrawerBox}>
                            <div style={styles.formGroup}>
                              <label style={styles.label}>Video URL (MP4 / WebM)</label>
                              <input
                                type="text"
                                value={currentSlide.videoMp4}
                                onChange={(e) => {
                                  updateCurrentShowcaseField('videoMp4', e.target.value);
                                  updateCurrentShowcaseField('videoWebm', e.target.value);
                                  updateCurrentShowcaseField('videoSrc', e.target.value);
                                }}
                                style={styles.input}
                                placeholder="https://... or /assets/..."
                              />
                            </div>
                            <div style={styles.formGroup}>
                              <label style={styles.label}>Poster Image URL</label>
                              <input
                                type="text"
                                value={currentSlide.posterSrc}
                                onChange={(e) => updateCurrentShowcaseField('posterSrc', e.target.value)}
                                style={styles.input}
                                placeholder="/assets/poster.webp"
                              />
                            </div>
                            <div style={styles.formRow}>
                              <div style={{ ...styles.formGroup, flex: 1 }}>
                                <label style={styles.label}>Width (px)</label>
                                <input
                                  type="number"
                                  value={currentSlide.width}
                                  onChange={(e) => updateCurrentShowcaseField('width', Number(e.target.value))}
                                  style={styles.input}
                                />
                              </div>
                              <div style={{ ...styles.formGroup, flex: 1 }}>
                                <label style={styles.label}>Height (px)</label>
                                <input
                                  type="number"
                                  value={currentSlide.height}
                                  onChange={(e) => updateCurrentShowcaseField('height', Number(e.target.value))}
                                  style={styles.input}
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* RIGHT COLUMN: Copywriting & Configuration */}
                    <div style={styles.studioRightCol}>
                      <div style={styles.studioFormBox}>
                        {/* Live Header Text Preview */}
                        <div>
                          <span style={{ fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                            Card Preview Title & Subtitles
                          </span>
                          <div style={{ ...styles.studioLiveTitlePreview, marginTop: 8 }}>
                            <div>
                              <div style={{ fontSize: '1.2rem', fontWeight: 300, color: '#ffffff', letterSpacing: '-0.02em', textTransform: 'uppercase' }}>
                                {currentSlide.titleTop || 'TITLE'} <span style={{ color: '#ff4f9c', fontWeight: 400 }}>{currentSlide.titleBottom || 'SUBTITLE'}</span>
                              </div>
                              <div style={{ fontSize: '0.76rem', color: 'rgba(255, 255, 255, 0.5)', marginTop: 4, fontWeight: 300, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                                {currentSlide.leftTitle || 'LEFT TAG'} &bull; {currentSlide.rightTitle || 'RIGHT TAG'}
                              </div>
                            </div>
                            <span
                              style={{
                                fontSize: '0.72rem',
                                padding: '4px 10px',
                                borderRadius: 999,
                                background: currentSlide.isActive ? 'rgba(74, 222, 128, 0.12)' : 'rgba(255, 255, 255, 0.06)',
                                color: currentSlide.isActive ? '#4ade80' : 'rgba(255, 255, 255, 0.4)',
                                border: currentSlide.isActive ? '1px solid rgba(74, 222, 128, 0.25)' : '1px solid rgba(255, 255, 255, 0.1)',
                              }}
                            >
                              {currentSlide.isActive ? 'Live on Site' : 'Draft (Hidden)'}
                            </span>
                          </div>
                        </div>

                        {/* Title Inputs */}
                        <div style={styles.formRow}>
                          <div style={{ ...styles.formGroup, flex: 1 }}>
                            <label style={styles.label}>Top Title (White)</label>
                            <input
                              type="text"
                              value={currentSlide.titleTop}
                              onChange={(e) => updateCurrentShowcaseField('titleTop', e.target.value)}
                              style={styles.input}
                              placeholder="BRAND"
                            />
                          </div>
                          <div style={{ ...styles.formGroup, flex: 1 }}>
                            <label style={styles.label}>Bottom Title (Pink Accent)</label>
                            <input
                              type="text"
                              value={currentSlide.titleBottom}
                              onChange={(e) => updateCurrentShowcaseField('titleBottom', e.target.value)}
                              style={styles.input}
                              placeholder="PROMOS"
                            />
                          </div>
                        </div>

                        {/* Subtitles Inputs */}
                        <div style={styles.formRow}>
                          <div style={{ ...styles.formGroup, flex: 1 }}>
                            <label style={styles.label}>Left Category Tag</label>
                            <input
                              type="text"
                              value={currentSlide.leftTitle}
                              onChange={(e) => updateCurrentShowcaseField('leftTitle', e.target.value)}
                              style={styles.input}
                              placeholder="COMMERCIAL"
                            />
                          </div>
                          <div style={{ ...styles.formGroup, flex: 1 }}>
                            <label style={styles.label}>Right Format Tag</label>
                            <input
                              type="text"
                              value={currentSlide.rightTitle}
                              onChange={(e) => updateCurrentShowcaseField('rightTitle', e.target.value)}
                              style={styles.input}
                              placeholder="REELS"
                            />
                          </div>
                        </div>

                        {/* Narrative Paragraph */}
                        <div style={styles.formGroup}>
                          <label style={styles.label}>Card Narrative / Description</label>
                          <textarea
                            rows={3}
                            value={currentSlide.leftText}
                            onChange={(e) => updateCurrentShowcaseField('leftText', e.target.value)}
                            style={{ ...styles.textarea, minHeight: 80 }}
                            placeholder="Write the narrative description displayed when the card is expanded..."
                          />
                        </div>

                        {/* Secondary Detail Text */}
                        <div style={styles.formGroup}>
                          <label style={styles.label}>Secondary Story Text (Optional)</label>
                          <textarea
                            rows={2}
                            value={currentSlide.rightText}
                            onChange={(e) => updateCurrentShowcaseField('rightText', e.target.value)}
                            style={{ ...styles.textarea, minHeight: 60 }}
                            placeholder="Additional context or technical specs for this card..."
                          />
                        </div>

                        {/* Settings & Active Toggle */}
                        <div style={styles.formRow}>
                          <div style={{ ...styles.formGroup, flex: 1 }}>
                            <label style={styles.label}>Card Visibility</label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', marginTop: 8, userSelect: 'none' }}>
                              <input
                                type="checkbox"
                                checked={currentSlide.isActive}
                                onChange={(e) => updateCurrentShowcaseField('isActive', e.target.checked)}
                                style={{ width: 16, height: 16, accentColor: '#ff4f9c', cursor: 'pointer' }}
                              />
                              <span style={{ fontSize: '0.86rem', color: '#ffffff', fontWeight: 300 }}>
                                Active in Horizontal Scroll Showcase
                              </span>
                            </label>
                          </div>
                          <div style={{ ...styles.formGroup, width: 110 }}>
                            <label style={styles.label}>Sort Order</label>
                            <input
                              type="number"
                              value={currentSlide.sortOrder}
                              onChange={(e) => updateCurrentShowcaseField('sortOrder', Number(e.target.value))}
                              style={styles.input}
                            />
                          </div>
                        </div>

                        {/* Action Bar */}
                        <div style={styles.studioActionBar}>
                          <div style={{ display: 'flex', gap: 8 }}>
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedShowcaseIdx((prev) => Math.max(0, prev - 1));
                                setShowcaseSaveSuccess(false);
                              }}
                              disabled={selectedShowcaseIdx === 0}
                              style={{ ...styles.ghostBtn, opacity: selectedShowcaseIdx === 0 ? 0.35 : 1 }}
                            >
                              &larr; Previous Slide
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedShowcaseIdx((prev) => Math.min(showcaseItems.length - 1, prev + 1));
                                setShowcaseSaveSuccess(false);
                              }}
                              disabled={selectedShowcaseIdx === showcaseItems.length - 1}
                              style={{ ...styles.ghostBtn, opacity: selectedShowcaseIdx === showcaseItems.length - 1 ? 0.35 : 1 }}
                            >
                              Next Slide &rarr;
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={handleSaveCurrentShowcase}
                            disabled={isSavingShowcase}
                            style={showcaseSaveSuccess ? { ...styles.primaryBtn, ...styles.primaryBtnSaved } : styles.primaryBtn}
                          >
                            {isSavingShowcase ? (
                              <>
                                <div style={{ ...styles.spinner, width: 14, height: 14 }} />
                                <span>Saving Changes...</span>
                              </>
                            ) : showcaseSaveSuccess ? (
                              <>
                                <IconCheck size={14} />
                                <span>Slide Saved Successfully!</span>
                              </>
                            ) : (
                              <>
                                <IconCheck size={14} />
                                <span>Save Slide Changes</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* =========================================================================
            TAB 3: UPLOAD & CREATE
            ========================================================================= */}
        {activeTab === 'upload' && (
          <div style={styles.tabContent}>
            <div style={styles.sectionHeader}>
              <div>
                <h2 style={styles.sectionTitle}>Upload & Publish Video</h2>
                <p style={styles.sectionSub}>Aspect ratio and duration are automatically detected from the video. Categories can be selected or dynamically created.</p>
              </div>
            </div>

            <div style={styles.uploadLayout}>
              {/* Left Column: Media File Upload Zone */}
              <div style={styles.uploadMediaBox}>
                <h3 style={styles.formSectionTitle}>1. Video File & Quality</h3>

                {/* Quality Mode Toggle */}
                <div style={styles.qualityToggleGroup}>
                  <label style={uploadMode === 'raw' ? styles.qualityOptionSelected : styles.qualityOption}>
                    <input
                      type="radio"
                      name="qualityMode"
                      value="raw"
                      checked={uploadMode === 'raw'}
                      onChange={() => setUploadMode('raw')}
                      style={{ marginRight: 10, accentColor: '#ff4f9c' }}
                    />
                    <div>
                      <div style={styles.qualityTitle}>Raw (Highest Quality & Master Audio)</div>
                      <div style={styles.qualityDesc}>Uncompromised audio channels, maximum video bitrate, auto-converted VP9 WebM</div>
                    </div>
                  </label>

                  <label style={uploadMode === 'compressed' ? styles.qualityOptionSelected : styles.qualityOption}>
                    <input
                      type="radio"
                      name="qualityMode"
                      value="compressed"
                      checked={uploadMode === 'compressed'}
                      onChange={() => setUploadMode('compressed')}
                      style={{ marginRight: 10, accentColor: '#ff4f9c' }}
                    />
                    <div>
                      <div style={styles.qualityTitle}>Compressed (Adaptive Web Streaming)</div>
                      <div style={styles.qualityDesc}>Optimized file size for fast loading on all cellular and mobile connections</div>
                    </div>
                  </label>
                </div>

                {/* File Dropzone */}
                <div
                  style={styles.dropzone}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (e.dataTransfer.files?.[0]) {
                      handleFileSelect(e.dataTransfer.files[0]);
                    }
                  }}
                >
                  <input
                    type="file"
                    accept="video/*"
                    id="videoFileInput"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        handleFileSelect(e.target.files[0]);
                      }
                    }}
                  />
                  <label htmlFor="videoFileInput" style={styles.dropzoneLabel}>
                    <IconUpload size={28} color="#ff80b3" />
                    <div style={styles.dropzoneText}>
                      {uploadFile ? uploadFile.name : 'Select or drag & drop video'}
                    </div>
                    <div style={styles.dropzoneSub}>MP4, MOV, WebM (auto-detects dimensions and duration)</div>
                  </label>
                </div>

                {/* Automatic Detection Info */}
                {detectedDimensions && (
                  <div style={styles.detectionPill}>
                    <IconSparkles size={14} color="#00e676" />
                    <span>
                      Detected: {detectedDimensions.width}x{detectedDimensions.height} &bull; Aspect: {detectedAspect} &bull; Duration: {formDuration}
                    </span>
                  </div>
                )}

                {/* Upload Status / Progress */}
                {isUploading && (
                  <div style={styles.progressContainer}>
                    <div style={styles.progressText}>
                      Processing video and generating WebM... ({uploadProgress}%)
                    </div>
                    <div style={styles.progressTrack}>
                      <div style={{ ...styles.progressFill, width: `${uploadProgress}%` }} />
                    </div>
                  </div>
                )}

                {/* Uploaded Result Preview */}
                {uploadedResult && (
                  <div style={styles.uploadedMetaCard}>
                    <div style={styles.uploadedSuccessBadge}>
                      <IconCheck size={14} color="#00e676" />
                      <span>Video converted and ready</span>
                    </div>
                    <video
                      src={uploadedResult.videoMp4}
                      poster={uploadedResult.poster}
                      controls
                      style={styles.uploadedPreviewVideo}
                    />
                    <div style={styles.urlDisplayRow}>
                      <span style={styles.urlLabel}>MP4:</span>
                      <span style={styles.urlValue}>{uploadedResult.videoMp4}</span>
                    </div>
                    <div style={styles.urlDisplayRow}>
                      <span style={styles.urlLabel}>WebM:</span>
                      <span style={styles.urlValue}>{uploadedResult.videoWebm}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Project Details Form */}
              <form onSubmit={handleCreateProject} style={styles.projectFormBox}>
                <h3 style={styles.formSectionTitle}>2. Project Details</h3>

                {formSuccessMessage && <div style={styles.successAlert}>{formSuccessMessage}</div>}
                {formErrorMessage && <div style={styles.errorAlert}>{formErrorMessage}</div>}

                <div style={styles.formGroup}>
                  <label style={styles.label}>Title</label>
                  <input
                    type="text"
                    placeholder="Project Title"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    style={styles.input}
                    required
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Client Name (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Trattoria Roma (Optional)"
                    value={formClient}
                    onChange={(e) => setFormClient(e.target.value)}
                    style={styles.input}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Instagram Post URL</label>
                  <input
                    type="url"
                    placeholder="https://instagram.com/p/... or /reel/..."
                    value={formSourceUrl}
                    onChange={(e) => setFormSourceUrl(e.target.value)}
                    style={styles.input}
                    required
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Description &amp; Hashtags</label>
                  <textarea
                    rows={3}
                    placeholder="Visual narrative and pacing summary... Type #hashtags directly here (e.g. #food #cinematic #commercial)"
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    style={styles.textarea}
                  />

                  {/* Live detected hashtags preview */}
                  <div style={styles.detectedHashtagsBox}>
                    <span style={styles.detectedHashtagsLabel}>Detected Tags:</span>
                    {detectedFormTags.length > 0 ? (
                      <div style={styles.detectedTagsRow}>
                        {detectedFormTags.map((tag) => (
                          <span key={tag} style={styles.detectedTagPill}>
                            #{tag}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span style={styles.detectedTagsHint}>Type #hashtags directly in the description to tag this project</span>
                    )}
                  </div>
                </div>

                <div style={styles.formRow}>
                  <div style={{ ...styles.formGroup, flex: 1 }}>
                    <label style={styles.label}>FPS Pacing Spec (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. 60fps High-Retention (Optional)"
                      value={formFps}
                      onChange={(e) => setFormFps(e.target.value)}
                      style={styles.input}
                    />
                  </div>
                  <div style={{ ...styles.formGroup, flex: 1 }}>
                    <label style={styles.label}>Color Grade Spec (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. Cinematic Contrast Grade (Optional)"
                      value={formColorGrade}
                      onChange={(e) => setFormColorGrade(e.target.value)}
                      style={styles.input}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingProject || !uploadedResult}
                  style={!uploadedResult ? styles.primaryBtnDisabled : styles.primaryBtn}
                >
                  {isSubmittingProject ? 'Publishing to Turso DB...' : 'Publish Project'}
                </button>
              </form>
            </div>
          </div>
        )}
      </main>

      {/* Edit Project Modal */}
      {editingProject && (
        <div style={styles.modalBackdrop} onClick={() => setEditingProject(null)}>
          <div style={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Edit: {editingProject.title}</h3>
              <button onClick={() => setEditingProject(null)} style={styles.modalCloseBtn}>
                <IconX size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} style={styles.editForm}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Title</label>
                <input
                  type="text"
                  value={editingProject.title}
                  onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Client Name (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Trattoria Roma (Optional)"
                  value={editingProject.client}
                  onChange={(e) => setEditingProject({ ...editingProject, client: e.target.value })}
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Instagram Post URL</label>
                <input
                  type="url"
                  placeholder="https://instagram.com/p/... or /reel/..."
                  value={editingProject.sourceUrl}
                  onChange={(e) => setEditingProject({ ...editingProject, sourceUrl: e.target.value })}
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Description &amp; Hashtags</label>
                <textarea
                  rows={3}
                  placeholder="Type #hashtags directly in the description..."
                  value={editingProject.description}
                  onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                  style={styles.textarea}
                />

                {(() => {
                  const editTags = extractHashtags(editingProject.description || '');
                  return (
                    <div style={styles.detectedHashtagsBox}>
                      <span style={styles.detectedHashtagsLabel}>Detected Tags:</span>
                      {editTags.length > 0 ? (
                        <div style={styles.detectedTagsRow}>
                          {editTags.map((tag) => (
                            <span key={tag} style={styles.detectedTagPill}>
                              #{tag}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span style={styles.detectedTagsHint}>Include #hashtags anywhere in the description</span>
                      )}
                    </div>
                  );
                })()}
              </div>

              <div style={styles.formRow}>
                <div style={{ ...styles.formGroup, flex: 1 }}>
                  <label style={styles.label}>FPS Pacing Spec (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. 60fps High-Retention (Optional)"
                    value={editingProject.specs?.fps || ''}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        specs: { ...(editingProject.specs || { fps: '', colorGrade: '', sound: '' }), fps: e.target.value },
                      })
                    }
                    style={styles.input}
                  />
                </div>
                <div style={{ ...styles.formGroup, flex: 1 }}>
                  <label style={styles.label}>Color Grade Spec (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Cinematic Contrast Grade (Optional)"
                    value={editingProject.specs?.colorGrade || ''}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        specs: { ...(editingProject.specs || { fps: '', colorGrade: '', sound: '' }), colorGrade: e.target.value },
                      })
                    }
                    style={styles.input}
                  />
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Sort Order</label>
                <input
                  type="number"
                  value={editingProject.sortOrder}
                  onChange={(e) => setEditingProject({ ...editingProject, sortOrder: Number(e.target.value) })}
                  style={styles.input}
                />
              </div>

              <div style={styles.modalActions}>
                <button type="button" onClick={() => setEditingProject(null)} style={styles.ghostBtn}>
                  Cancel
                </button>
                <button type="submit" disabled={isSavingEdit} style={styles.primaryBtn}>
                  {isSavingEdit ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

// Visual Styles - Exclusively Thin Satoshi Typography, No Emojis, Zero Borders
const styles: Record<string, React.CSSProperties> = {
  adminRoot: {
    minHeight: '100vh',
    backgroundColor: '#0a0409',
    color: '#ffffff',
    fontFamily: "'Satoshi', sans-serif",
    fontWeight: 300,
    display: 'flex',
    flexDirection: 'column',
  },
  adminHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 36px',
    backgroundColor: 'rgba(20, 9, 18, 0.85)',
    backdropFilter: 'blur(20px)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  headerBrand: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  brandLogo: {
    fontSize: '1.25rem',
    fontWeight: 300,
    color: '#ff4f9c',
    letterSpacing: '0.04em',
    textDecoration: 'none',
  },
  brandTag: {
    fontSize: '0.72rem',
    fontWeight: 300,
    letterSpacing: '0.14em',
    color: 'rgba(255, 255, 255, 0.5)',
    textTransform: 'uppercase',
  },
  headerCenter: {
    display: 'flex',
    alignItems: 'center',
  },
  statusPills: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  statusPill: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '5px 12px',
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    fontSize: '0.76rem',
    fontWeight: 300,
    letterSpacing: '0.02em',
    color: 'rgba(255, 255, 255, 0.75)',
  },
  statusDotGreen: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    backgroundColor: '#00e676',
    boxShadow: '0 0 8px rgba(0, 230, 118, 0.8)',
  },
  statusDotPink: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    backgroundColor: '#ff4f9c',
    boxShadow: '0 0 8px rgba(255, 79, 156, 0.8)',
  },
  headerActions: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
  },
  secondaryLinkBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '7px 16px',
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    color: '#ffffff',
    fontSize: '0.82rem',
    fontWeight: 300,
    letterSpacing: '0.02em',
    textDecoration: 'none',
    transition: 'all 0.2s',
  },
  ghostBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    background: 'none',
    border: 'none',
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: '0.82rem',
    fontWeight: 300,
    letterSpacing: '0.02em',
    cursor: 'pointer',
    padding: '7px 12px',
  },
  tabBarContainer: {
    display: 'flex',
    justifyContent: 'center',
    padding: '18px 24px 0',
    backgroundColor: '#0a0409',
  },
  tabBar: {
    display: 'inline-flex',
    padding: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    backdropFilter: 'blur(16px)',
    gap: 4,
  },
  tabBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    padding: '9px 20px',
    borderRadius: 999,
    border: 'none',
    backgroundColor: 'transparent',
    color: 'rgba(255, 255, 255, 0.65)',
    fontSize: '0.84rem',
    fontWeight: 300,
    letterSpacing: '0.03em',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  tabBtnActive: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    padding: '9px 20px',
    borderRadius: 999,
    border: 'none',
    backgroundColor: '#ff4f9c',
    color: '#ffffff',
    fontSize: '0.84rem',
    fontWeight: 400,
    letterSpacing: '0.03em',
    cursor: 'pointer',
    boxShadow: '0 4px 18px rgba(255, 79, 156, 0.35)',
  },
  mainContent: {
    flex: 1,
    padding: '24px 36px 64px',
    maxWidth: 1400,
    width: '100%',
    margin: '0 auto',
  },
  tabContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: 28,
  },
  kpiGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: 16,
  },
  kpiCard: {
    padding: '22px 24px',
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    boxShadow: '0 12px 32px rgba(0, 0, 0, 0.35)',
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  kpiLabel: {
    fontSize: '0.72rem',
    fontWeight: 300,
    letterSpacing: '0.12em',
    color: 'rgba(255, 255, 255, 0.5)',
  },
  kpiValue: {
    fontSize: '2.4rem',
    fontWeight: 300,
    color: '#ff4f9c',
    letterSpacing: '-0.02em',
    lineHeight: 1.1,
  },
  kpiSub: {
    fontSize: '0.78rem',
    fontWeight: 300,
    color: 'rgba(255, 255, 255, 0.45)',
  },
  sectionCard: {
    padding: '26px 28px',
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    boxShadow: '0 16px 40px rgba(0, 0, 0, 0.4)',
    display: 'flex',
    flexDirection: 'column',
    gap: 18,
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 12,
  },
  sectionTitle: {
    fontSize: '1.4rem',
    fontWeight: 300,
    letterSpacing: '-0.01em',
    margin: 0,
    color: '#ffffff',
  },
  sectionMiniTitle: {
    fontSize: '1.1rem',
    fontWeight: 300,
    letterSpacing: '0.02em',
    margin: 0,
    color: '#ffffff',
  },
  sectionSub: {
    fontSize: '0.84rem',
    fontWeight: 300,
    color: 'rgba(255, 255, 255, 0.55)',
    margin: '4px 0 0',
  },
  refreshBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '7px 14px',
    borderRadius: 999,
    border: 'none',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    color: '#ffffff',
    fontSize: '0.8rem',
    fontWeight: 300,
    cursor: 'pointer',
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
  },
  th: {
    padding: '12px 14px',
    fontSize: '0.74rem',
    fontWeight: 300,
    color: 'rgba(255, 255, 255, 0.5)',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
  },
  tr: {
    borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
  },
  td: {
    padding: '14px',
    fontSize: '0.86rem',
    fontWeight: 300,
    color: 'rgba(255, 255, 255, 0.75)',
  },
  tdLight: {
    padding: '14px',
    fontSize: '0.9rem',
    fontWeight: 400,
    color: '#ffffff',
  },
  tdPink: {
    padding: '14px',
    fontSize: '0.9rem',
    fontWeight: 400,
    color: '#ff4f9c',
  },
  tdProject: {
    padding: '14px',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  tableThumb: {
    width: 44,
    height: 44,
    borderRadius: 8,
    objectFit: 'cover',
  },
  tableTitle: {
    fontSize: '0.88rem',
    fontWeight: 300,
    color: '#ffffff',
  },
  emptyTd: {
    padding: '36px',
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: '0.88rem',
    fontWeight: 300,
  },
  geoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: 20,
  },
  geoCardTitleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  geoList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    marginTop: 6,
  },
  geoItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  geoItemHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.82rem',
    fontWeight: 300,
  },
  geoName: {
    color: '#ffffff',
  },
  geoCount: {
    color: 'rgba(255, 255, 255, 0.55)',
  },
  geoBarTrack: {
    width: '100%',
    height: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    overflow: 'hidden',
  },
  geoBarFill: {
    height: '100%',
    borderRadius: 999,
    background: 'linear-gradient(90deg, #c2185b 0%, #ff4f9c 100%)',
  },
  emptyNotice: {
    padding: '24px',
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.35)',
    fontSize: '0.82rem',
    fontWeight: 300,
  },
  eventStreamList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    maxHeight: 380,
    overflowY: 'auto',
  },
  eventItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    padding: '10px 14px',
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    fontSize: '0.84rem',
    fontWeight: 300,
  },
  eventBadge: {
    padding: '3px 10px',
    borderRadius: 999,
    backgroundColor: 'rgba(255, 79, 156, 0.15)',
    color: '#ff80b3',
    fontWeight: 400,
    fontSize: '0.72rem',
    letterSpacing: '0.06em',
    flexShrink: 0,
  },
  eventProject: {
    color: '#ffffff',
    flex: 1,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  eventLocation: {
    color: 'rgba(255, 255, 255, 0.65)',
    fontSize: '0.78rem',
  },
  eventTime: {
    color: 'rgba(255, 255, 255, 0.35)',
    fontSize: '0.75rem',
  },
  projectsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: 22,
  },
  projectCard: {
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 16px 36px rgba(0, 0, 0, 0.4)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
  },
  projectCardMedia: {
    position: 'relative',
    width: '100%',
    height: 220,
    backgroundColor: '#0a0409',
    overflow: 'hidden',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
  },
  projectCardPoster: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
    transition: 'transform 0.4s ease',
  },
  projectCardBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    padding: '4px 10px',
    borderRadius: 999,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    fontSize: '0.7rem',
    fontWeight: 400,
    color: '#ff4f9c',
    letterSpacing: '0.04em',
    border: '1px solid rgba(255, 79, 156, 0.25)',
    zIndex: 2,
  },
  projectCardBody: {
    padding: '16px 18px 18px',
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    flex: 1,
  },
  projectCardDesc: {
    fontSize: '0.8rem',
    lineHeight: 1.45,
    fontWeight: 300,
    color: 'rgba(255, 255, 255, 0.5)',
    margin: 0,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  projectCardFooter: {
    marginTop: 'auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTop: '1px solid rgba(255, 255, 255, 0.06)',
  },
  projectMediaWrap: {
    position: 'relative',
    width: '100%',
    height: 220,
    backgroundColor: '#000000',
    overflow: 'hidden',
  },
  projectVideo: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  projectOverlayMeta: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    display: 'flex',
    justifyContent: 'space-between',
    pointerEvents: 'none',
  },
  aspectBadge: {
    padding: '3px 8px',
    borderRadius: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    backdropFilter: 'blur(10px)',
    fontSize: '0.68rem',
    fontWeight: 300,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: '#ffffff',
  },
  durationBadge: {
    padding: '3px 8px',
    borderRadius: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    backdropFilter: 'blur(10px)',
    fontSize: '0.68rem',
    fontWeight: 300,
    color: '#ffffff',
  },
  projectBody: {
    padding: 18,
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    flex: 1,
  },
  projectCategory: {
    fontSize: '0.72rem',
    fontWeight: 400,
    color: '#ff80b3',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
  },
  projectTitle: {
    fontSize: '1.02rem',
    fontWeight: 300,
    margin: 0,
    color: '#ffffff',
    lineHeight: 1.25,
  },
  projectClient: {
    fontSize: '0.78rem',
    fontWeight: 300,
    color: 'rgba(255, 255, 255, 0.65)',
  },
  projectDesc: {
    fontSize: '0.8rem',
    lineHeight: 1.45,
    fontWeight: 300,
    color: 'rgba(255, 255, 255, 0.5)',
    margin: '4px 0 8px',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  projectTags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 4,
    marginBottom: 12,
  },
  tagPill: {
    padding: '2px 8px',
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    fontSize: '0.7rem',
    fontWeight: 300,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  projectActions: {
    marginTop: 'auto',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  statusBtnActive: {
    padding: '6px 12px',
    borderRadius: 999,
    border: 'none',
    backgroundColor: 'rgba(0, 230, 118, 0.15)',
    color: '#00e676',
    fontSize: '0.74rem',
    fontWeight: 400,
    cursor: 'pointer',
  },
  statusBtnInactive: {
    padding: '6px 12px',
    borderRadius: 999,
    border: 'none',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: '0.74rem',
    fontWeight: 400,
    cursor: 'pointer',
  },
  editBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 5,
    padding: '6px 12px',
    borderRadius: 999,
    border: 'none',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    color: '#ffffff',
    fontSize: '0.74rem',
    fontWeight: 300,
    cursor: 'pointer',
  },
  deleteBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 5,
    padding: '6px 12px',
    borderRadius: 999,
    border: 'none',
    backgroundColor: 'rgba(244, 67, 54, 0.15)',
    color: '#f44336',
    fontSize: '0.74rem',
    fontWeight: 300,
    cursor: 'pointer',
    marginLeft: 'auto',
  },
  uploadLayout: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
    gap: 28,
  },
  uploadMediaBox: {
    display: 'flex',
    flexDirection: 'column',
    gap: 18,
    padding: 26,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  projectFormBox: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    padding: 26,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  formSectionTitle: {
    fontSize: '1.15rem',
    fontWeight: 300,
    letterSpacing: '0.02em',
    color: '#ffffff',
    margin: 0,
  },
  qualityToggleGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  qualityOption: {
    display: 'flex',
    alignItems: 'flex-start',
    padding: '12px 14px',
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
  qualityOptionSelected: {
    display: 'flex',
    alignItems: 'flex-start',
    padding: '12px 14px',
    borderRadius: 14,
    backgroundColor: 'rgba(255, 79, 156, 0.08)',
    cursor: 'pointer',
  },
  qualityTitle: {
    fontSize: '0.86rem',
    fontWeight: 400,
    color: '#ffffff',
  },
  qualityDesc: {
    fontSize: '0.75rem',
    fontWeight: 300,
    color: 'rgba(255, 255, 255, 0.55)',
    marginTop: 2,
    lineHeight: 1.4,
  },
  dropzone: {
    padding: '36px 20px',
    borderRadius: 20,
    backgroundColor: 'rgba(255, 79, 156, 0.04)',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'background 0.2s ease',
  },
  dropzoneLabel: {
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 10,
  },
  dropzoneText: {
    fontSize: '0.92rem',
    fontWeight: 300,
    color: '#ffffff',
  },
  dropzoneSub: {
    fontSize: '0.74rem',
    fontWeight: 300,
    color: 'rgba(255, 255, 255, 0.45)',
  },
  detectionPill: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    padding: '8px 14px',
    borderRadius: 999,
    backgroundColor: 'rgba(0, 230, 118, 0.08)',
    fontSize: '0.76rem',
    fontWeight: 300,
    color: '#00e676',
  },
  progressContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  progressText: {
    fontSize: '0.78rem',
    fontWeight: 300,
    color: '#ff80b3',
  },
  progressTrack: {
    width: '100%',
    height: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: '#ff4f9c',
    transition: 'width 0.3s ease',
  },
  uploadedMetaCard: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  uploadedSuccessBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    fontSize: '0.76rem',
    fontWeight: 400,
    color: '#00e676',
  },
  uploadedPreviewVideo: {
    width: '100%',
    maxHeight: 180,
    borderRadius: 10,
    objectFit: 'contain',
    backgroundColor: '#000000',
  },
  urlDisplayRow: {
    display: 'flex',
    gap: 6,
    fontSize: '0.72rem',
    fontWeight: 300,
  },
  urlLabel: {
    color: 'rgba(255, 255, 255, 0.5)',
  },
  urlValue: {
    color: '#ffffff',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    position: 'relative',
  },
  formRow: {
    display: 'flex',
    gap: 12,
  },
  label: {
    fontSize: '0.76rem',
    fontWeight: 300,
    color: 'rgba(255, 255, 255, 0.7)',
    letterSpacing: '0.04em',
  },
  input: {
    padding: '11px 14px',
    borderRadius: 12,
    border: 'none',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    color: '#ffffff',
    fontSize: '0.86rem',
    fontFamily: "'Satoshi', sans-serif",
    fontWeight: 300,
    outline: 'none',
    width: '100%',
  },
  detectedHashtagsBox: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    padding: '10px 14px',
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    border: '1px dashed rgba(255, 79, 156, 0.25)',
    marginTop: 4,
  },
  detectedHashtagsLabel: {
    fontSize: '0.72rem',
    fontWeight: 300,
    color: 'rgba(255, 255, 255, 0.5)',
    letterSpacing: '0.04em',
  },
  detectedTagsRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 6,
  },
  detectedTagPill: {
    padding: '3px 10px',
    borderRadius: 999,
    backgroundColor: 'rgba(255, 79, 156, 0.15)',
    color: '#ff80b3',
    fontSize: '0.75rem',
    fontWeight: 400,
    letterSpacing: '0.02em',
  },
  detectedTagsHint: {
    fontSize: '0.74rem',
    fontWeight: 300,
    color: 'rgba(255, 255, 255, 0.35)',
    fontStyle: 'italic',
  },
  textarea: {
    padding: '11px 14px',
    borderRadius: 12,
    border: 'none',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    color: '#ffffff',
    fontSize: '0.86rem',
    fontFamily: "'Satoshi', sans-serif",
    fontWeight: 300,
    outline: 'none',
    resize: 'vertical',
  },
  primaryBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: '12px 24px',
    borderRadius: 999,
    border: '1px solid transparent',
    background: 'linear-gradient(135deg, #c2185b 0%, #ff4f9c 100%)',
    color: '#ffffff',
    fontSize: '0.88rem',
    fontWeight: 400,
    letterSpacing: '0.04em',
    cursor: 'pointer',
    boxShadow: '0 6px 20px rgba(194, 24, 91, 0.4)',
    transition: 'transform 0.18s ease',
  },
  primaryBtnDisabled: {
    padding: '12px 24px',
    borderRadius: 999,
    border: 'none',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    color: 'rgba(255, 255, 255, 0.3)',
    fontSize: '0.88rem',
    fontWeight: 300,
    cursor: 'not-allowed',
  },
  secondaryBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    padding: '8px 16px',
    borderRadius: 999,
    border: '1px solid rgba(255, 255, 255, 0.12)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    color: '#ffffff',
    fontSize: '0.82rem',
    fontWeight: 300,
    letterSpacing: '0.02em',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  actionBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '7px 14px',
    borderRadius: 999,
    border: '1px solid rgba(255, 79, 156, 0.35)',
    backgroundColor: 'rgba(255, 79, 156, 0.08)',
    color: '#ff80b3',
    fontSize: '0.78rem',
    fontWeight: 300,
    fontFamily: "'Satoshi', sans-serif",
    letterSpacing: '0.02em',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  successAlert: {
    padding: '10px 14px',
    borderRadius: 12,
    backgroundColor: 'rgba(0, 230, 118, 0.15)',
    color: '#00e676',
    fontSize: '0.82rem',
    fontWeight: 300,
  },
  errorAlert: {
    padding: '10px 14px',
    borderRadius: 12,
    backgroundColor: 'rgba(244, 67, 54, 0.15)',
    color: '#f44336',
    fontSize: '0.82rem',
    fontWeight: 300,
  },
  modalBackdrop: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    backdropFilter: 'blur(20px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 580,
    maxHeight: '90vh',
    overflowY: 'auto',
    borderRadius: 24,
    backgroundColor: '#160a14',
    padding: 28,
    display: 'flex',
    flexDirection: 'column',
    gap: 18,
    boxShadow: '0 24px 60px rgba(0, 0, 0, 0.8)',
  },
  modalHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalTitle: {
    fontSize: '1.2rem',
    fontWeight: 300,
    letterSpacing: '0.02em',
    margin: 0,
    color: '#ffffff',
  },
  modalCloseBtn: {
    background: 'none',
    border: 'none',
    color: 'rgba(255, 255, 255, 0.6)',
    cursor: 'pointer',
    padding: 4,
  },
  editForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 10,
  },
  loginContainer: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0a0409',
    padding: 24,
    fontFamily: "'Satoshi', sans-serif",
    fontWeight: 300,
  },
  loginCard: {
    width: '100%',
    maxWidth: 420,
    padding: 36,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    backdropFilter: 'blur(30px)',
    boxShadow: '0 24px 60px rgba(0, 0, 0, 0.8)',
    display: 'flex',
    flexDirection: 'column',
    gap: 22,
    textAlign: 'center',
  },
  loginHeader: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
  },
  badge: {
    padding: '4px 12px',
    borderRadius: 999,
    backgroundColor: 'rgba(255, 79, 156, 0.15)',
    color: '#ff80b3',
    fontSize: '0.72rem',
    fontWeight: 300,
    letterSpacing: '0.14em',
  },
  loginTitle: {
    fontSize: '2rem',
    fontWeight: 300,
    letterSpacing: '-0.02em',
    color: '#ffffff',
    margin: 0,
  },
  loginSub: {
    fontSize: '0.84rem',
    lineHeight: 1.45,
    fontWeight: 300,
    color: 'rgba(255, 255, 255, 0.55)',
    margin: 0,
  },
  loginForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  loginInput: {
    padding: '14px 18px',
    borderRadius: 14,
    border: 'none',
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    color: '#ffffff',
    fontSize: '0.95rem',
    textAlign: 'center',
    fontFamily: "'Satoshi', sans-serif",
    fontWeight: 300,
    letterSpacing: '0.04em',
    outline: 'none',
  },
  loginHint: {
    fontSize: '0.74rem',
    fontWeight: 300,
    color: 'rgba(255, 255, 255, 0.4)',
  },
  centerStage: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0a0409',
  },
  loadingSpinner: {
    width: 38,
    height: 38,
    borderRadius: '50%',
    border: '2px solid rgba(255, 79, 156, 0.2)',
    borderTopColor: '#ff4f9c',
    animation: 'spin 0.8s linear infinite',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 20px',
    gap: 16,
  },
  spinner: {
    width: 32,
    height: 32,
    borderRadius: '50%',
    border: '2px solid rgba(255, 79, 156, 0.2)',
    borderTopColor: '#ff4f9c',
    animation: 'spin 0.8s linear infinite',
  },
  loadingText: {
    fontSize: '0.86rem',
    fontWeight: 300,
    color: 'rgba(255, 255, 255, 0.6)',
    letterSpacing: '0.02em',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 24px',
    textAlign: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: 20,
    border: '1px dashed rgba(255, 255, 255, 0.1)',
    gap: 12,
  },
  emptyTitle: {
    fontSize: '1.15rem',
    fontWeight: 300,
    color: '#ffffff',
    letterSpacing: '0.02em',
    margin: 0,
  },
  emptySub: {
    fontSize: '0.84rem',
    fontWeight: 300,
    color: 'rgba(255, 255, 255, 0.5)',
    maxWidth: 420,
    lineHeight: 1.5,
    margin: 0,
  },
  // Showcase Studio Styles
  saveSuccessPill: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    fontSize: '0.8rem',
    fontWeight: 300,
    color: '#4ade80',
    backgroundColor: 'rgba(74, 222, 128, 0.1)',
    padding: '6px 14px',
    borderRadius: 999,
    border: '1px solid rgba(74, 222, 128, 0.25)',
  },
  primaryBtnSaved: {
    background: 'rgba(74, 222, 128, 0.15)',
    border: '1px solid #4ade80',
    color: '#4ade80',
  },
  slideSelectorBar: {
    display: 'flex',
    gap: 10,
    overflowX: 'auto',
    paddingBottom: 8,
    marginBottom: 8,
  },
  slidePill: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '10px 16px',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 12,
    border: '1px solid rgba(255, 255, 255, 0.08)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap',
    userSelect: 'none',
  },
  slidePillActive: {
    backgroundColor: 'rgba(255, 79, 156, 0.1)',
    border: '1px solid rgba(255, 79, 156, 0.45)',
    boxShadow: '0 4px 20px rgba(255, 79, 156, 0.15)',
  },
  slidePillIndex: {
    fontSize: '0.8rem',
    fontWeight: 400,
    color: 'rgba(255, 255, 255, 0.4)',
    letterSpacing: '0.04em',
  },
  slidePillIndexActive: {
    color: '#ff4f9c',
  },
  slidePillTitle: {
    fontSize: '0.86rem',
    fontWeight: 400,
    color: '#ffffff',
    letterSpacing: '0.02em',
  },
  slidePillAspect: {
    fontSize: '0.68rem',
    fontWeight: 300,
    padding: '2px 7px',
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    color: 'rgba(255, 255, 255, 0.5)',
  },
  slidePillAspectActive: {
    backgroundColor: 'rgba(255, 79, 156, 0.18)',
    color: '#ff4f9c',
  },
  slidePillDot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    backgroundColor: '#4ade80',
    flexShrink: 0,
  },
  studioContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  studioGrid: {
    display: 'grid',
    gridTemplateColumns: 'minmax(320px, 440px) 1fr',
    gap: 24,
    alignItems: 'start',
  },
  studioLeftCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  studioRightCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  studioMediaBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: 16,
    border: '1px solid rgba(255, 255, 255, 0.06)',
    padding: 18,
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
  },
  studioMediaPreview: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#000000',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 260,
  },
  studioVideo: {
    width: '100%',
    maxHeight: 440,
    objectFit: 'contain',
    display: 'block',
    borderRadius: 12,
    backgroundColor: '#000000',
  },
  studioMediaBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    padding: '4px 10px',
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    fontSize: '0.72rem',
    fontWeight: 300,
    color: '#ff4f9c',
    letterSpacing: '0.04em',
    border: '1px solid rgba(255, 79, 156, 0.25)',
    zIndex: 2,
  },
  studioFormatBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: '4px 8px',
    borderRadius: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    fontSize: '0.7rem',
    fontWeight: 300,
    color: 'rgba(255, 255, 255, 0.8)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    zIndex: 2,
  },
  studioUploadBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '22px 16px',
    backgroundColor: 'rgba(255, 79, 156, 0.04)',
    borderRadius: 12,
    border: '1px dashed rgba(255, 79, 156, 0.35)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textAlign: 'center',
    gap: 6,
  },
  studioUploadText: {
    fontSize: '0.86rem',
    fontWeight: 400,
    color: '#ffffff',
    margin: 0,
  },
  studioUploadSubtext: {
    fontSize: '0.72rem',
    fontWeight: 300,
    color: 'rgba(255, 255, 255, 0.45)',
    margin: 0,
  },
  studioFormBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: 16,
    border: '1px solid rgba(255, 255, 255, 0.06)',
    padding: 22,
    display: 'flex',
    flexDirection: 'column',
    gap: 18,
  },
  studioLiveTitlePreview: {
    padding: '16px 20px',
    borderRadius: 12,
    backgroundColor: 'rgba(20, 9, 18, 0.85)',
    border: '1px solid rgba(255, 79, 156, 0.2)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  studioDrawerBox: {
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    borderRadius: 12,
    border: '1px solid rgba(255, 255, 255, 0.06)',
    padding: 16,
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  studioActionBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 14,
    borderTop: '1px solid rgba(255, 255, 255, 0.06)',
    gap: 12,
  },
};
