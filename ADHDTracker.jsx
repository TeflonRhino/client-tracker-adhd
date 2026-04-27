import React, { useState, useEffect, useMemo } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  onAuthStateChanged, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  signInWithCustomToken,
  signInAnonymously
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  onSnapshot 
} from 'firebase/firestore';
import { 
  CheckCircle2, 
  Circle, 
  TrendingUp, 
  ChevronRight, 
  ChevronLeft, 
  User, 
  Zap,
  Layout,
  Clock,
  Target,
  Brain, 
  Rocket,
  PlayCircle,
  ClipboardList,
  Sparkles,
  MessageSquare,
  Lock,
  Mail,
  ArrowRight,
  LogOut,
  Loader2
} from 'lucide-react';

// --- Firebase Initialization ---
const firebaseConfig = JSON.parse(__firebase_config);
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'adhd-client-tracker';

// --- Program Data ---
const PHASES = [
  {
    id: 'welcome',
    title: 'Welcome & Onboarding',
    icon: <Sparkles className="w-5 h-5" />,
    actions: [
      { id: 'w_a1', text: 'Attend QA Call' },
      { id: 'w_a2', text: 'Attend POD Call' },
      { id: 'w_a3', text: 'Start Burnout Phase' }
    ],
    videos: [
      { id: 'v_w1', text: 'Program Overview' },
      { id: 'v_w2', text: 'How to Succeed in this Program' },
      { id: 'v_w3', text: 'What we Need From You' }
    ]
  },
  {
    id: 'p0',
    title: 'Phase 0: Burnout Stabilisation',
    icon: <Zap className="w-5 h-5" />,
    actions: [
      { id: 'p0_a1', text: 'Identify main burnout driver' },
      { id: 'p0_a2', text: 'Remove 1 energy drain' },
      { id: 'p0_a3', text: 'Add 1 recovery action' }
    ],
    videos: [
      { id: 'v0_1', text: 'Part 1: Do You Have Burnout?' },
      { id: 'v0_2', text: 'Part 2: What Causes Burnout?' },
      { id: 'v0_3', text: 'Part 3.1: What To Do About Burnout' },
      { id: 'v0_4', text: 'Part 3.2: What To Do About Burnout (Con’t)' }
    ]
  },
  {
    id: 'p1',
    title: 'Phase 1: Identity & Goal',
    icon: <Target className="w-5 h-5" />,
    actions: [
      { id: 'p1_a1', text: 'Set 12-week goal (1 sentence)' },
      { id: 'p1_a2', text: 'Choose identity' },
      { id: 'p1_a3', text: 'Define 1 behaviour standard' }
    ],
    videos: [
      { id: 'v1_1', text: '1.1 Getting Started On Your Goals' },
      { id: 'v1_2', text: '1.2 Understanding What Holds Us Back' },
      { id: 'v1_3', text: '1.3 Neurology & brain wiring' },
      { id: 'v1_4', text: '1.4 Learned behaviors' },
      { id: 'v1_5', text: '1.5 Taking advice designed for neurotypical people' },
      { id: 'v1_6', text: '1.6 Neurodivergent burnout' },
      { id: 'v1_assessment', text: '[Complete Your Assessment]', type: 'action' },
      { id: 'v1_7', text: '1.7 How We See Ourselves' },
      { id: 'v1_8', text: '1.8 Model 1: Different traits' },
      { id: 'v1_9', text: '1.9 Model 2: Makers & Managers' },
      { id: 'v1_10', text: '1.10 Model 3: Hunters & Farmers' },
      { id: 'v1_assignment', text: 'Assignment: Submit Your Goals', type: 'assignment' }
    ]
  },
  {
    id: 'p2',
    title: 'Phase 2: Clarity & Focus',
    icon: <Layout className="w-5 h-5" />,
    actions: [
      { id: 'p2_a1', text: 'Define 3 business buckets' },
      { id: 'p2_a2', text: 'Make 1 real decision' },
      { id: 'p2_a3', text: 'Attempt 1 avoided action' }
    ],
    videos: [
      { id: 'v2_1', text: '2.1 Overcoming ADHD Indecision' },
      { id: 'v2_2', text: '2.2 A rule for making decisions & breaking out of indecision' },
      { id: 'v2_3', text: '2.3 Increasing certainty for decisions when we lack information' },
      { id: 'v2_4', text: '2.4 Reducing the stakes of failure' },
      { id: 'v2_5', text: '2.5 How We Find Clarity When We Have ADHD' },
      { id: 'v2_6', text: '2.6 Using focusing questions to prioritize & sort our thoughts' },
      { id: 'v2_7', text: '2.7 Maintaining flow, using maker schedules, & reducing task-switching' },
      { id: 'v2_8', text: '2.8 Assignment 1: Practice Controlling & Expanding Your Focus', type: 'assignment' },
      { id: 'v2_9', text: '2.9 Assignment 2: Map out the 3 buckets of your business', type: 'assignment' },
      { id: 'v2_10', text: '2.10 Optional: Address indecision in one area', type: 'assignment' }
    ]
  },
  {
    id: 'p3',
    title: 'Phase 3: Task Initiation',
    icon: <Brain className="w-5 h-5" />,
    actions: [
      { id: 'p3_a1', text: 'Complete 1 avoided task' },
      { id: 'p3_a2', text: 'Use timer (1-3 min)' },
      { id: 'p3_a3', text: 'Use system for 3 days' }
    ],
    videos: [
      { id: 'v3_1', text: '3.1 Overcoming Task Paralysis' },
      { id: 'v3_2', text: '3.2 Universal Task Initiation strategy (6S)' },
      { id: 'v3_3', text: '3.3 Addressing avoidance & overwhelm' },
      { id: 'v3_4', text: '3.4 Sequencing & not knowing where to start' },
      { id: 'v3_5', text: '3.6 Addressing "demand avoidance"' },
      { id: 'v3_6', text: '3.7 What to Expect Before Moving On' }
    ]
  },
  {
    id: 'p41',
    title: 'Phase 4.1: Time Awareness',
    icon: <Clock className="w-5 h-5" />,
    actions: [
      { id: 'p41_a1', text: 'Track time (3-5 days)' },
      { id: 'p41_a2', text: 'Identify 1-2 time leaks' },
      { id: 'p41_a3', text: 'Adjust schedule once' }
    ],
    videos: [
      { id: 'v41_1', text: '4.1.1 Overcoming Time Blindness' },
      { id: 'v41_2', text: '4.1.2 Estimating time: Before, during, & after' },
      { id: 'v41_3', text: '4.1.3 Estimating time: Task inventory' },
      { id: 'v41_4', text: '4.1.4 Developing time scarcity: Externalizing time' },
      { id: 'v41_5', text: '4.1.5 Developing time scarcity: Avoiding wasting time' },
      { id: 'v41_6', text: '4.1.6 Developing time scarcity: Avoiding blending' }
    ]
  },
  {
    id: 'p42',
    title: 'Phase 4.2: Task Management',
    icon: <ClipboardList className="w-5 h-5" />,
    actions: [
      { id: 'p42_a1', text: 'Use one system consistently' },
      { id: 'p42_a2', text: 'Use capture list daily' },
      { id: 'p42_a3', text: 'Avoid acting on impulse ideas' }
    ],
    videos: [
      { id: 'v42_1', text: '4.2.1 Implementing a Task Management System' },
      { id: 'v42_2', text: '4.2.2 How to stick with a task management system' },
      { id: 'v42_3', text: '4.2.3 Principles for managing tasks' },
      { id: 'v42_4', text: '4.2.4 Sample system: One-Page Planner' }
    ]
  },
  {
    id: 'p43',
    title: 'Phase 4.3: Weekly Planning',
    icon: <Layout className="w-5 h-5" />,
    actions: [
      { id: 'p43_a1', text: 'Plan full week' },
      { id: 'p43_a2', text: 'Complete 1 deep work block' },
      { id: 'p43_a3', text: 'Complete weekly review' }
    ],
    videos: [
      { id: 'v43_1', text: '4.3.1 Project management approach: Project two-step' },
      { id: 'v43_2', text: '4.3.2 Creating a project plan: The six moves' },
      { id: 'v43_3', text: '4.3.3 Using the "SNL Method" for projects' },
      { id: 'v43_4', text: '4.3.4 How to keep going with a project & not quit' },
      { id: 'v43_5', text: '4.3.5 Planning week for productivity' }
    ]
  },
  {
    id: 'p5',
    title: 'Phase 5: Systems & Leverage',
    icon: <Rocket className="w-5 h-5" />,
    actions: [
      { id: 'p5_a1', text: 'Define outcome clearly' },
      { id: 'p5_a2', text: 'Delegate or eliminate 1 task' },
      { id: 'p5_a3', text: 'Identify 1 "buy back time" opportunity' }
    ],
    videos: [
      { id: 'v5_1', text: '5.1 Working With a Team' },
      { id: 'v5_2', text: '5.2 Delegating work to others' },
      { id: 'v5_3', text: '5.3 Tracking & managing delegated tasks' },
      { id: 'v5_4', text: '5.4 Stopping "reverse delegating" & interruptions' },
      { id: 'v5_5', text: '5.5 Making hiring decisions' },
      { id: 'v5_6', text: '5.6 Identifying what to delegate' }
    ]
  }
];

const SCORE_LABELS = { 0: 'Not Done', 1: 'Attempted', 2: 'Partial', 3: 'Completed' };

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [userData, setUserData] = useState({ scores: {}, watched: {}, notes: {}, currentPhase: 0 });
  const [activeTab, setActiveTab] = useState('doing');
  const [saving, setSaving] = useState(false);

  // --- 1. Authentication ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // --- 2. Data Synchronization ---
  useEffect(() => {
    if (!user) return;
    const docRef = doc(db, 'artifacts', appId, 'users', user.uid, 'settings', 'progress');
    
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        setUserData(snapshot.data());
      } else {
        const initial = { scores: {}, watched: {}, notes: {}, currentPhase: 0 };
        setDoc(docRef, initial);
        setUserData(initial);
      }
    }, (error) => {
      console.error("Firestore Error", error);
    });

    return () => unsubscribe();
  }, [user]);

  // --- 3. Auth Handlers ---
  const handleAuth = async (e) => {
    e.preventDefault();
    setAuthError('');
    setLoading(true);
    try {
      if (authMode === 'login') {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      setAuthError(err.message.replace('Firebase:', '').trim());
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => signOut(auth);

  // --- 4. Main App Actions ---
  const updateCloud = async (newData) => {
    if (!user) return;
    setSaving(true);
    const docRef = doc(db, 'artifacts', appId, 'users', user.uid, 'settings', 'progress');
    try {
      await setDoc(docRef, { ...newData, updatedAt: new Date().toISOString() }, { merge: true });
    } catch (err) {
      console.error("Save Error", err);
    } finally {
      setSaving(false);
    }
  };

  const setPhase = (index) => {
    if (index < 0 || index >= PHASES.length) return;
    const updated = { ...userData, currentPhase: index };
    setUserData(updated);
    updateCloud(updated);
  };

  const toggleVideo = (id) => {
    const newWatched = { ...userData.watched, [id]: !userData.watched[id] };
    const updated = { ...userData, watched: newWatched };
    setUserData(updated);
    updateCloud(updated);
  };

  const setActionScore = (id, score) => {
    const newScores = { ...userData.scores, [id]: score };
    const updated = { ...userData, scores: newScores };
    setUserData(updated);
    updateCloud(updated);
  };

  // --- 5. Logic & Stats ---
  const currentPhase = PHASES[userData.currentPhase || 0];
  
  const momentumScore = useMemo(() => {
    if (currentPhase.id === 'welcome') return 0;
    const scores = currentPhase.actions.map(a => userData.scores[a.id] || 0);
    return (scores.reduce((a, b) => a + b, 0) / 3).toFixed(1);
  }, [userData, currentPhase]);

  const videoProgress = useMemo(() => {
    const total = currentPhase.videos.length;
    if (total === 0) return 0;
    const watched = currentPhase.videos.filter(v => userData.watched[v.id]).length;
    return Math.round((watched / total) * 100);
  }, [userData, currentPhase]);

  // --- Loading Screen ---
  if (loading && !user) return (
    <div className="flex h-screen items-center justify-center bg-slate-50">
      <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
    </div>
  );

  // --- Login Screen ---
  if (!user) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 border border-slate-100">
        <div className="text-center mb-8">
          <div className="bg-indigo-600 inline-flex p-3 rounded-2xl text-white shadow-lg shadow-indigo-100 mb-4">
            <TrendingUp size={28} />
          </div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">ADHD Journey Tracker</h1>
          <p className="text-slate-400 text-sm mt-1">Consistency over intensity. Repetition over perfection.</p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type="email" 
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type="password" 
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {authError && (
            <div className="bg-red-50 text-red-600 text-xs font-bold p-3 rounded-xl border border-red-100 flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-red-400 rounded-full" />
              {authError}
            </div>
          )}

          <button 
            type="submit" 
            className="w-full bg-indigo-600 text-white font-black py-4 rounded-2xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            {authMode === 'login' ? 'Welcome Back' : 'Start Journey'}
            <ArrowRight size={18} />
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-50 text-center">
          <button 
            onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
            className="text-xs font-bold text-slate-400 hover:text-indigo-600 transition-colors"
          >
            {authMode === 'login' ? "Don't have an account? Sign up" : "Already registered? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );

  // --- Main App UI ---
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b px-4 py-3">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 text-white p-1.5 rounded-lg shadow-sm">
              <TrendingUp size={18} />
            </div>
            <h1 className="font-bold text-lg tracking-tight">ADHD Tools</h1>
          </div>
          <div className="flex items-center gap-3">
            {saving && <span className="text-[10px] font-bold text-slate-300 uppercase animate-pulse">Syncing...</span>}
            <button 
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-4 pt-6 space-y-6">
        {/* Phase Navigation Card */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
          <div className="flex justify-between items-start mb-4">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Phase</p>
              <h2 className="text-xl font-bold flex items-center gap-2">
                <span className="text-indigo-600">{currentPhase.icon}</span>
                {currentPhase.title}
              </h2>
            </div>
            <div className="bg-indigo-50 text-indigo-700 text-xs font-bold px-2.5 py-1 rounded-full">
              {userData.currentPhase + 1} / {PHASES.length}
            </div>
          </div>

          <div className="flex items-center gap-4 mt-6">
            <button 
              onClick={() => setPhase(userData.currentPhase - 1)}
              disabled={userData.currentPhase === 0}
              className="p-2 border rounded-xl disabled:opacity-20 hover:bg-slate-50 transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner">
              <div 
                className="h-full bg-indigo-500 transition-all duration-700 ease-out"
                style={{ width: `${((userData.currentPhase + 1) / PHASES.length) * 100}%` }}
              />
            </div>
            <button 
              onClick={() => setPhase(userData.currentPhase + 1)}
              disabled={userData.currentPhase === PHASES.length - 1}
              className="p-2 border rounded-xl disabled:opacity-20 hover:bg-slate-50 transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-8 border-t pt-6">
            <div className="text-center space-y-1">
              <p className="text-2xl font-black text-slate-800">{momentumScore}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Action Momentum</p>
            </div>
            <div className="text-center space-y-1 border-l">
              <p className="text-2xl font-black text-slate-800">{videoProgress}%</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Learning Complete</p>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-200/50 p-1 rounded-2xl">
          <button 
            onClick={() => setActiveTab('doing')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'doing' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}
          >
            <ClipboardList size={16} /> Doing (Actions)
          </button>
          <button 
            onClick={() => setActiveTab('learning')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'learning' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}
          >
            <PlayCircle size={16} /> Learning (Videos)
          </button>
        </div>

        {/* Content Area */}
        <div className="space-y-4">
          {activeTab === 'doing' ? (
            <div className="space-y-4">
              {currentPhase.actions.map((action, idx) => {
                const score = userData.scores[action.id] || 0;
                return (
                  <div key={action.id} className={`bg-white p-5 rounded-2xl border transition-all ${score === 3 ? 'border-green-200 bg-green-50/20' : 'border-slate-200'}`}>
                    <div className="flex gap-4 mb-4">
                      <div className={`mt-1 w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold border-2 ${score === 3 ? 'bg-green-500 border-green-500 text-white' : 'border-slate-200 text-slate-300'}`}>
                        {score === 3 ? <CheckCircle2 size={14} /> : idx + 1}
                      </div>
                      <p className={`font-bold leading-tight ${score === 3 ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                        {action.text}
                      </p>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {[0,1,2,3].map(s => (
                        <button 
                          key={s} 
                          onClick={() => setActionScore(action.id, s)}
                          className={`py-2 rounded-xl text-[10px] font-bold uppercase transition-all ${score === s ? (s === 3 ? 'bg-green-600 text-white shadow-md' : 'bg-slate-800 text-white shadow-md') : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                        >
                          {SCORE_LABELS[s]}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-2">
              {currentPhase.videos.map((vid) => {
                const isWatched = userData.watched[vid.id];
                return (
                  <button
                    key={vid.id}
                    onClick={() => toggleVideo(vid.id)}
                    className={`w-full group flex items-center gap-4 p-4 rounded-2xl border text-left transition-all ${isWatched ? 'bg-indigo-50/50 border-indigo-100' : 'bg-white border-slate-200 hover:border-indigo-300'}`}
                  >
                    <div className={`${isWatched ? 'text-indigo-500' : 'text-slate-300 group-hover:text-indigo-300'}`}>
                      {isWatched ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-bold ${isWatched ? 'text-indigo-900 line-through opacity-60' : 'text-slate-700'}`}>
                        {vid.text}
                      </p>
                      {vid.type && (
                        <span className={`text-[9px] uppercase font-black px-1.5 py-0.5 rounded mt-1 inline-block ${vid.type === 'assignment' ? 'bg-orange-100 text-orange-600' : 'bg-indigo-100 text-indigo-600'}`}>
                          {vid.type}
                        </span>
                      )}
                    </div>
                    <div className="text-slate-300"><PlayCircle size={18} /></div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Reflection Section */}
        <div className="bg-indigo-600 rounded-3xl p-6 text-white shadow-xl shadow-indigo-200/50">
          <div className="flex items-center gap-2 mb-2">
             <MessageSquare size={16} className="text-indigo-200" />
             <h4 className="text-[10px] font-bold uppercase tracking-widest text-indigo-200">Phase Reflection</h4>
          </div>
          <p className="text-lg font-bold mb-4 leading-tight">What is the <span className="underline decoration-yellow-400 underline-offset-4">ONE</span> action for next week?</p>
          <textarea 
            className="w-full bg-indigo-700 border border-indigo-500 rounded-2xl p-4 text-white placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-white/30 min-h-[100px] text-sm"
            placeholder="Focus on momentum over perfection..."
            value={userData.notes[currentPhase.id] || ''}
            onChange={(e) => {
              const val = e.target.value;
              const updated = { ...userData, notes: { ...userData.notes, [currentPhase.id]: val } };
              setUserData(updated);
              updateCloud(updated);
            }}
          />
        </div>

        <footer className="text-center py-8 space-y-2 opacity-40">
           <p className="text-[10px] font-bold uppercase tracking-widest">Messy Execution {'>'} Perfection</p>
           <p className="text-[9px]">Logged in as: {user.email}</p>
        </footer>
      </main>

      {/* Mobile Sticky Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t p-4 sm:hidden z-40">
        <div className="max-w-md mx-auto flex items-center justify-between gap-4">
          <button 
            onClick={() => setPhase(userData.currentPhase - 1)}
            disabled={userData.currentPhase === 0}
            className="flex-1 bg-slate-100 text-slate-600 text-xs font-bold px-4 py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-20 active:scale-95 transition-all"
          >
            <ChevronLeft size={16} /> Back
          </button>
          
          <div className="flex flex-col items-center">
            <span className="text-[8px] font-bold text-slate-400 uppercase mb-1">Phase</span>
            <div className="flex gap-1">
              {PHASES.map((_, i) => (
                <div key={i} className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${i === userData.currentPhase ? 'bg-indigo-600 scale-125' : i < userData.currentPhase ? 'bg-indigo-300' : 'bg-slate-200'}`} />
              ))}
            </div>
          </div>

          <button 
            onClick={() => setPhase(userData.currentPhase + 1)}
            disabled={userData.currentPhase === PHASES.length - 1}
            className="flex-1 bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-20 active:scale-95 transition-all"
          >
            Next <ChevronRight size={16} />
          </button>
        </div>
      </nav>
    </div>
  );
}
