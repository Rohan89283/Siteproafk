const ADMIN_USERNAME = 'RohanAFK';
const ADMIN_PASSWORD = 'Rohan456';

export const login = (username, password) => {
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    const authData = {
      username: ADMIN_USERNAME,
      role: 'admin',
      loginTime: Date.now()
    };
    localStorage.setItem('auth', JSON.stringify(authData));
    return { success: true, user: authData };
  }
  return { success: false, error: 'Invalid credentials' };
};

export const logout = () => {
  localStorage.removeItem('auth');
};

export const isAuthenticated = () => {
  const auth = localStorage.getItem('auth');
  if (!auth) return null;
  try {
    return JSON.parse(auth);
  } catch {
    return null;
  }
};

export const getShortlists = () => {
  const data = localStorage.getItem('shortlists');
  return data ? JSON.parse(data) : [];
};

export const addShortlist = (shortlist) => {
  const shortlists = getShortlists();
  const newShortlist = {
    id: Date.now().toString(),
    name: shortlist.name,
    description: shortlist.description || '',
    created_at: new Date().toISOString()
  };
  shortlists.push(newShortlist);
  localStorage.setItem('shortlists', JSON.stringify(shortlists));
  return newShortlist;
};

export const deleteShortlist = (id) => {
  const shortlists = getShortlists();
  const filtered = shortlists.filter(s => s.id !== id);
  localStorage.setItem('shortlists', JSON.stringify(filtered));

  const shortlinks = getShortlinks();
  const filteredLinks = shortlinks.filter(s => s.shortlist_id !== id);
  localStorage.setItem('shortlinks', JSON.stringify(filteredLinks));

  return true;
};

export const getShortlinks = (shortlistId = null) => {
  const data = localStorage.getItem('shortlinks');
  const shortlinks = data ? JSON.parse(data) : [];

  if (shortlistId) {
    return shortlinks.filter(s => s.shortlist_id === shortlistId);
  }
  return shortlinks;
};

export const addShortlink = (shortlink) => {
  const shortlinks = getShortlinks();
  const newShortlink = {
    id: Date.now().toString(),
    shortlist_id: shortlink.shortlist_id,
    shortlist_name: shortlink.shortlist_name,
    original_url: shortlink.original_url,
    short_code: shortlink.short_code,
    title: shortlink.title || '',
    is_active: true,
    clicks: 0,
    created_at: new Date().toISOString()
  };
  shortlinks.push(newShortlink);
  localStorage.setItem('shortlinks', JSON.stringify(shortlinks));
  return newShortlink;
};

export const updateShortlink = (id, updates) => {
  const shortlinks = getShortlinks();
  const index = shortlinks.findIndex(s => s.id === id);
  if (index !== -1) {
    shortlinks[index] = { ...shortlinks[index], ...updates };
    localStorage.setItem('shortlinks', JSON.stringify(shortlinks));
    return shortlinks[index];
  }
  return null;
};

export const deleteShortlink = (id) => {
  const shortlinks = getShortlinks();
  const filtered = shortlinks.filter(s => s.id !== id);
  localStorage.setItem('shortlinks', JSON.stringify(filtered));
  return true;
};

export const getShortlinkByCode = (code) => {
  const shortlinks = getShortlinks();
  return shortlinks.find(s => s.short_code === code);
};

export const incrementClicks = (code) => {
  const shortlinks = getShortlinks();
  const index = shortlinks.findIndex(s => s.short_code === code);
  if (index !== -1) {
    shortlinks[index].clicks = (shortlinks[index].clicks || 0) + 1;
    localStorage.setItem('shortlinks', JSON.stringify(shortlinks));
  }
};

export const getStats = () => {
  const shortlinks = getShortlinks();
  const shortlists = getShortlists();

  const totalClicks = shortlinks.reduce((sum, s) => sum + (s.clicks || 0), 0);
  const activeLinks = shortlinks.filter(s => s.is_active).length;

  return {
    totalUsers: 1,
    totalShortlists: shortlists.length,
    totalShortlinks: shortlinks.length,
    totalClicks: totalClicks,
    activeShortlinks: activeLinks
  };
};

export const getAllData = () => {
  return {
    shortlinks: getShortlinks(),
    shortlists: getShortlists(),
    exportedAt: new Date().toISOString()
  };
};
