import { SessionTimeline } from '@/types/IFSModel';

const SESSIONS_KEY = 'ifs_sessions';
const SESSION_PREFIX = 'ifs_session_';

export const saveSession = (timeline: SessionTimeline): void => {
  try {
    // Save the session data
    localStorage.setItem(`${SESSION_PREFIX}${timeline.sessionId}`, JSON.stringify(timeline));
    
    // Update the sessions list
    const sessions = getSessions();
    if (!sessions.includes(timeline.sessionId)) {
      sessions.push(timeline.sessionId);
      localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
    }
  } catch (error) {
    console.error('Error saving session:', error);
  }
};

export const loadSession = (sessionId: string): SessionTimeline | null => {
  try {
    const data = localStorage.getItem(`${SESSION_PREFIX}${sessionId}`);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error loading session:', error);
    return null;
  }
};

export const getSessions = (): string[] => {
  try {
    const sessions = localStorage.getItem(SESSIONS_KEY);
    return sessions ? JSON.parse(sessions) : [];
  } catch (error) {
    console.error('Error getting sessions:', error);
    return [];
  }
};

export const deleteSession = (sessionId: string): void => {
  try {
    // Remove the session data
    localStorage.removeItem(`${SESSION_PREFIX}${sessionId}`);
    
    // Update the sessions list
    const sessions = getSessions().filter(id => id !== sessionId);
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
  } catch (error) {
    console.error('Error deleting session:', error);
  }
};

export const exportSession = (sessionId: string): string => {
  const session = loadSession(sessionId);
  if (!session) {
    throw new Error('Session not found');
  }
  return JSON.stringify(session);
};

export const importSession = (data: string): void => {
  try {
    const session: SessionTimeline = JSON.parse(data);
    if (!session.sessionId || !Array.isArray(session.snapshots)) {
      throw new Error('Invalid session data');
    }
    
    // Ensure unique session ID
    session.sessionId = `session_${Date.now()}`;
    saveSession(session);
  } catch (error) {
    console.error('Error importing session:', error);
    throw new Error('Failed to import session');
  }
}; 