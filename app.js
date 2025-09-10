import React, { useEffect, useState } from "react";

const TEACHER_PASS = "iml123";
const LS = {
  profile: "iml_profile",
  modules: "iml_modules",
  materi: "iml_materi",
  pre: "iml_pre",
  post: "iml_post",
  motivations: "iml_motivations",
  theme: "iml_theme",
};

const uid = () => Math.random().toString(36).slice(2, 9);

const defaultProfile = {
  id: uid(),
  name: "Nama Guru",
  contact: "email@domain.com",
  bio: "Guru Mata Pelajaran Instalasi Motor Listrik. Mengajar instalasi motor 3 fasa, forward-reverse, star-delta, dan keselamatan kerja.",
};

const defaultModules = [
  { id: uid(), title: "Pengenalan Motor Listrik", content: "Dasar-dasar motor listrik, jenis, prinsip kerja." },
  { id: uid(), title: "Instalasi Rangkaian Motor", content: "Wiring, kontaktor, starter, proteksi, dan interlock." },
  { id: uid(), title: "Perawatan & Keselamatan", content: "Langkah perawatan, SOP keselamatan, pemeriksaan sebelum praktek." },
];

const defaultMateri = {
  id: uid(),
  title: "Rangkaian Forward-Reverse",
  videoUrl: "https://www.youtube.com/embed/qTnqn6-VqnI",
  text:
    "Rangkaian forward-reverse adalah sistem kontrol yang digunakan untuk membalik arah putaran motor induksi tiga fasa.\n\nPrinsip: membalik dua dari tiga fasa melalui dua kontaktor (forward & reverse). Interlock mencegah kedua kontaktor aktif bersamaan.",
};

const defaultPre = [
  { id: uid(), q: "Tujuan utama rangkaian forward-reverse pada instalasi motor listrik adalah...", choices: ["Mengatur kecepatan", "Mengubah arah putaran", "Menghemat energi", "Mengatur torsi"], ans: 1 },
  { id: uid(), q: "Komponen utama untuk membalik arah putaran motor tiga fasa adalah...", choices: ["MCB", "Kontaktor", "Relay", "Saklar"], ans: 1 },
  { id: uid(), q: "Fungsi thermal overload relay pada rangkaian forward-reverse adalah...", choices: ["Mengontrol waktu", "Mengamankan dari arus lebih", "Mengatur arah", "Menambah tegangan"], ans: 1 },
  { id: uid(), q: "Jika kedua tombol forward dan reverse ditekan bersamaan, maka akan...", choices: ["Motor tetap forward", "Motor tetap reverse", "Motor stop (interlock aktif)", "Motor bolak-balik"], ans: 2 },
  { id: uid(), q: "Komponen berikut yang BUKAN bagian dari kontrol forward-reverse motor listrik adalah...", choices: ["Push button", "Kontaktor", "Lampu indikator", "Diode"], ans: 3 },
  { id: uid(), q: "Untuk membalik arah putaran motor 3 fasa, yang dilakukan adalah...", choices: ["Membalik salah satu kabel fasa", "Membalik kabel netral", "Menambah beban", "Mengganti relai"], ans: 0 },
  { id: uid(), q: "Jenis interlock yang efisien untuk mencegah hubungan kontak forward dan reverse secara bersamaan adalah...", choices: ["Interlock elektrik dan mekanik", "Interlock suhu", "Interlock waktu", "Interlock arus"], ans: 0 },
  { id: uid(), q: "Pada diagram kontrol, push button warna merah biasanya digunakan untuk...", choices: ["Start", "Stop/Emergency", "Forward", "Reverse"], ans: 1 },
  { id: uid(), q: "Interlock elektrik biasanya diimplementasikan menggunakan...", choices: ["Kontak bantu NC/NO pada kontaktor", "MCB", "Thermal relay", "Fuse"], ans: 0 },
  { id: uid(), q: "Komponen yang melindungi dari hubungan singkat di panel daya adalah...", choices: ["Kontaktor", "Thermal overload", "MCB/MCCB", "Lampu indikator"], ans: 2 },
  { id: uid(), q: "Apa fungsi lampu indikator pada panel kontrol?", choices: ["Mengganti fuse", "Menunjukkan status (ON/OFF)", "Menambah tegangan", "Menjadi tombol start"], ans: 1 },
  { id: uid(), q: "Sebelum melakukan uji fungsional, langkah yang harus dilakukan adalah...", choices: ["Langsung hidupkan motor", "Cek sambungan dan komponen", "Lepas kabel fasa", "Ganti kontaktor"], ans: 1 },
  { id: uid(), q: "Interlock mekanik pada kontaktor berfungsi untuk...", choices: ["Mengamankan dari arus lebih", "Mencegah aktivasi dua kontaktor bersamaan secara mekanis", "Mengontrol waktu start", "Mengatur torsi"], ans: 1 },
  { id: uid(), q: "Jika thermal overload trip, maka tindakan yang benar adalah...", choices: ["Ganti motor", "Periksa beban dan reset setelah dingin", "Tekan forward terus", "Cabut semua fuse"], ans: 1 },
  { id: uid(), q: "Mengapa harus berhenti motor sebelum mengganti arah (forward -> reverse)?", choices: ["Agar lampu indikator nyala", "Untuk menghindari lonjakan arus dan kerusakan", "Supaya lebih cepat", "Tidak perlu berhenti"], ans: 1 },
];

const defaultPost = defaultPre.map(q => ({ ...q, id: uid() }));

const defaultMotivations = [
  "Belajar bukan untuk dihafal — tetapi untuk dipahami dan dipraktikkan.",
  "Kesalahan adalah guru terbaik. Gagal hari ini, siap lebih baik besok.",
  "Kerja praktek konsisten mengalahkan teori tanpa aksi.",
];

const defaultTheme = {
  accent: "#1976d2",
  gradientFrom: "#667eea",
  gradientTo: "#764ba2",
};

function loadOrDefault(key, def) {
  const raw = localStorage.getItem(key);
  if (!raw) {
    localStorage.setItem(key, JSON.stringify(def));
    return def;
  }
  try {
    return JSON.parse(raw);
  } catch (e) {
    localStorage.setItem(key, JSON.stringify(def));
    return def;
  }
}

function save(key, val) {
  localStorage.setItem(key, JSON.stringify(val));
}

function ConfirmationDialog({ isOpen, onConfirm, onCancel, title, message }) {
  if (!isOpen) return null;
  
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 50
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '1.5rem',
        borderRadius: '0.5rem',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        maxWidth: '28rem',
        width: '100%',
        marginLeft: '1rem',
        marginRight: '1rem'
      }}>
        <h3 style={{fontWeight: 600, fontSize: '1.125rem', marginBottom: '0.5rem'}}>{title}</h3>
        <p style={{color: '#4b5563', marginBottom: '1rem'}}>{message}</p>
        <div style={{display: 'flex', justifyContent: 'flex-end', gap: '0.75rem'}}>
          <button onClick={onCancel} style={{padding: '0.5rem 1rem', border: '1px solid #d1d5db', borderRadius: '0.375rem'}}>Batal</button>
          <button onClick={onConfirm} style={{padding: '0.5rem 1rem', backgroundColor: '#dc2626', color: 'white', borderRadius: '0.375rem'}}>Hapus</button>
        </div>
      </div>
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1rem 0'}}>
      <div style={{
        animation: 'spin 1s linear infinite',
        borderRadius: '9999px',
        height: '2rem',
        width: '2rem',
        borderBottom: '2px solid #2563eb'
      }}></div>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default function IMLModulAjarApp() {
  const [route, setRoute] = useState("profil");
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);

  const [profile, setProfile] = useState(() => loadOrDefault(LS.profile, defaultProfile));
  const [modules, setModules] = useState(() => loadOrDefault(LS.modules, defaultModules));
  const [materi, setMateri] = useState(() => loadOrDefault(LS.materi, defaultMateri));
  const [preQuestions, setPreQuestions] = useState(() => loadOrDefault(LS.pre, defaultPre));
  const [postQuestions, setPostQuestions] = useState(() => loadOrDefault(LS.post, defaultPost));
  const [motivations, setMotivations] = useState(() => loadOrDefault(LS.motivations, defaultMotivations));
  const [theme, setTheme] = useState(() => loadOrDefault(LS.theme, defaultTheme));

  useEffect(() => save(LS.profile, profile), [profile]);
  useEffect(() => save(LS.modules, modules), [modules]);
  useEffect(() => save(LS.materi, materi), [materi]);
  useEffect(() => save(LS.pre, preQuestions), [preQuestions]);
  useEffect(() => save(LS.post, postQuestions), [postQuestions]);
  useEffect(() => save(LS.motivations, motivations), [motivations]);
  useEffect(() => save(LS.theme, theme), [theme]);

  const setRouteWithLoading = (newRoute) => {
    setLoading(true);
    setTimeout(() => {
      setRoute(newRoute);
      setLoading(false);
    }, 300);
  };

  return (
    <div style={{ 
      background: `linear-gradient(135deg, ${theme.gradientFrom}, ${theme.gradientTo})`,
      minHeight: '100vh',
      padding: '1rem'
    }}>
      <div style={{
        maxWidth: '72rem',
        marginLeft: 'auto',
        marginRight: 'auto',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(8px)',
        borderRadius: '1rem',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        overflow: 'hidden'
      }}>
        <Header profile={profile} setRoute={setRouteWithLoading} route={route} theme={theme} isAdmin={isAdmin} setIsAdmin={setIsAdmin} />
        {loading && <LoadingSpinner />}
        <main style={{padding: '1rem'}}>
          {!loading && (
            <>
              {route === "profil" && <ProfilePage profile={profile} modules={modules} isAdmin={isAdmin} setProfile={setProfile} theme={theme} />}
              {route === "materi" && <MateriPage materi={materi} isAdmin={isAdmin} setMateri={setMateri} theme={theme} />}
              {route === "pre" && <TestPage title="Pre-Test" questions={preQuestions} setQuestions={setPreQuestions} isAdmin={isAdmin} theme={theme} />}
              {route === "post" && <TestPage title="Post-Test" questions={postQuestions} setQuestions={setPostQuestions} isAdmin={isAdmin} theme={theme} />}
              {route === "motivasi" && <MotivationPage motivations={motivations} theme={theme} />}

              {isAdmin && (
                <div style={{marginTop: '2rem'}}>
                  <AdminPanel
                    profile={profile}
                    setProfile={setProfile}
                    modules={modules}
                    setModules={setModules}
                    materi={materi}
                    setMateri={setMateri}
                    preQuestions={preQuestions}
                    setPreQuestions={setPreQuestions}
                    postQuestions={postQuestions}
                    setPostQuestions={setPostQuestions}
                    motivations={motivations}
                    setMotivations={setMotivations}
                    theme={theme}
                    setTheme={setTheme}
                  />
                </div>
              )}
            </>
          )}
        </main>
        <footer style={{padding: '1rem', textAlign: 'center', backgroundColor: 'rgba(255, 255, 255, 0.8)', borderTop: '1px solid #e5e7eb'}}>
          © 2025 Modul Ajar IML
        </footer>
      </div>
    </div>
  );
}

function Header({ profile, setRoute, route, theme, isAdmin, setIsAdmin }) {
  return (
    <header style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '1rem',
      borderBottom: '1px solid #e5e7eb',
      backgroundColor: 'rgba(255, 255, 255, 0.8)'
    }}>
      <div style={{marginBottom: '1rem', textAlign: 'center'}}>
        <h1 style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: '#1e293b',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          justifyContent: 'center'
        }}>
          <span style={{ color: theme.accent }}>⚡</span> Modul Ajar - Instalasi Motor Listrik
        </h1>
        <p style={{fontSize: '0.75rem', color: '#64748b'}}>{profile.bio}</p>
      </div>
      <nav style={{display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center', justifyContent: 'center'}}>
        <NavBtn id="profil" label="Profil & Modul" active={route === "profil"} onClick={() => setRoute("profil")} accent={theme.accent} />
        <NavBtn id="materi" label="Materi" active={route === "materi"} onClick={() => setRoute("materi")} accent={theme.accent} />
        <NavBtn id="pre" label="Pre-Test" active={route === "pre"} onClick={() => setRoute("pre")} accent={theme.accent} />
        <NavBtn id="post" label="Post-Test" active={route === "post"} onClick={() => setRoute("post")} accent={theme.accent} />
        <NavBtn id="motivasi" label="Motivasi" active={route === "motivasi"} onClick={() => setRoute("motivasi")} accent={theme.accent} />
        {isAdmin ? (
          <button onClick={() => setIsAdmin(false)} style={{
            marginLeft: '1rem',
            padding: '0.5rem 0.75rem',
            borderRadius: '0.5rem',
            color: 'white',
            backgroundColor: theme.accent
          }}>Keluar Admin</button>
        ) : (
          <AdminLogin onLogin={() => setIsAdmin(true)} accent={theme.accent} />
        )}
      </nav>
    </header>
  );
}

function NavBtn({ id, label, active, onClick, accent }) {
  return (
    <button onClick={onClick} style={{
      padding: '0.5rem 0.75rem',
      borderRadius: '0.375rem',
      fontWeight: '500',
      fontSize: '0.875rem',
      backgroundColor: active ? accent : 'transparent',
      color: active ? 'white' : '#334155',
      boxShadow: active ? '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)' : 'none',
      border: active ? 'none' : '1px solid #cbd5e1'
    }}>{label}</button>
  );
}

function AdminLogin({ onLogin, accent }) {
  const [open, setOpen] = useState(false);
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");
  const tryLogin = () => {
    if (pw === TEACHER_PASS) {
      onLogin();
      setPw("");
      setOpen(false);
      setError("");
    } else {
      setError("Password salah");
      setTimeout(() => setError(""), 3000);
    }
  };
  return (
    <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
      {open ? (
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem'}}>
          <div style={{position: 'relative'}}>
            <input
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              placeholder="Admin pass"
              type="password"
              style={{padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.25rem'}}
            />
            {error && <div style={{position: 'absolute', top: '100%', left: 0, color: '#ef4444', fontSize: '0.75rem', marginTop: '0.25rem'}}>{error}</div>}
          </div>
          <button onClick={tryLogin} style={{padding: '0.5rem 0.75rem', borderRadius: '0.25rem', color: 'white', backgroundColor: accent}}>Login</button>
          <button onClick={() => setOpen(false)} style={{padding: '0.5rem 0.75rem', borderRadius: '0.25rem', border: '1px solid #d1d5db'}}>Batal</button>
        </div>
      ) : (
        <button onClick={() => setOpen(true)} style={{padding: '0.5rem 0.75rem', border: '1px solid ' + (open ? '#3b82f6' : '#d1d5db'), borderRadius: '0.25rem'}}>Admin</button>
      )}
    </div>
  );
}

function ProfilePage({ profile, setProfile, modules, isAdmin, theme }) {
  const [editing, setEditing] = useState(false);
  const [local, setLocal] = useState(profile);
  const [errors, setErrors] = useState({});
  
  useEffect(() => setLocal(profile), [profile]);
  
  const validate = () => {
    const newErrors = {};
    if (!local.name.trim()) newErrors.name = "Nama tidak boleh kosong";
    if (!local.contact.trim()) newErrors.contact = "Kontak tidak boleh kosong";
    if (!local.bio.trim()) newErrors.bio = "Bio tidak boleh kosong";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const save = () => {
    if (validate()) {
      setProfile(local); 
      setEditing(false); 
      alert('Profil disimpan');
    }
  };

  return (
    <div style={{display: 'grid', gridTemplateColumns: '1fr', gap: '1rem'}}>
      <div style={{backgroundColor: 'white', padding: '1rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'}}>
        <h2 style={{fontWeight: 600, fontSize: '1.125rem'}}>Profil Guru</h2>
        {!editing ? (
          <div style={{marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
            <div><b>Nama:</b> {profile.name}</div>
            <div><b>Kontak:</b> {profile.contact}</div>
            <div style={{fontSize: '0.875rem', color: '#64748b'}}>{profile.bio}</div>
            {isAdmin && <button onClick={() => setEditing(true)} style={{
              marginTop: '0.75rem',
              padding: '0.5rem 0.75rem',
              borderRadius: '0.25rem',
              color: 'white',
              backgroundColor: theme.accent
            }}>Edit Profil</button>}
          </div>
        ) : (
          <div style={{marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
            <div>
              <input 
                style={{
                  width: '100%',
                  border: `1px solid ${errors.name ? '#ef4444' : '#d1d5db'}`,
                  padding: '0.5rem 0.75rem',
                  borderRadius: '0.25rem'
                }}
                value={local.name} 
                onChange={e => setLocal({ ...local, name: e.target.value })} 
                maxLength={50}
              />
              {errors.name && <div style={{color: '#ef4444', fontSize: '0.75rem', marginTop: '0.25rem'}}>{errors.name}</div>}
            </div>
            <div>
              <input 
                style={{
                  width: '100%',
                  border: `1px solid ${errors.contact ? '#ef4444' : '#d1d5db'}`,
                  padding: '0.5rem 0.75rem',
                  borderRadius: '0.25rem'
                }}
                value={local.contact} 
                onChange={e => setLocal({ ...local, contact: e.target.value })} 
                maxLength={50}
              />
              {errors.contact && <div style={{color: '#ef4444', fontSize: '0.75rem', marginTop: '0.25rem'}}>{errors.contact}</div>}
            </div>
            <div>
              <textarea 
                style={{
                  width: '100%',
                  border: `1px solid ${errors.bio ? '#ef4444' : '#d1d5db'}`,
                  padding: '0.5rem 0.75rem',
                  borderRadius: '0.25rem'
                }}
                value={local.bio} 
                onChange={e => setLocal({ ...local, bio: e.target.value })} 
                maxLength={200}
              />
              {errors.bio && <div style={{color: '#ef4444', fontSize: '0.75rem', marginTop: '0.25rem'}}>{errors.bio}</div>}
            </div>
            <div style={{display: 'flex', gap: '0.5rem'}}>
              <button onClick={save} style={{
                padding: '0.5rem 0.75rem',
                borderRadius: '0.25rem',
                color: 'white',
                backgroundColor: theme.accent
              }}>Simpan</button>
              <button onClick={() => { setEditing(false); setErrors({}); }} style={{
                padding: '0.5rem 0.75rem',
                borderRadius: '0.25rem',
                border: '1px solid #d1d5db'
              }}>Batal</button>
            </div>
          </div>
        )}
      </div>

      <div style={{backgroundColor: 'white', padding: '1rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'}}>
        <h2 style={{fontWeight: 600, fontSize: '1.125rem'}}>Modul Ajar Runtut</h2>
        <ol style={{listStyleType: 'decimal', marginLeft: '1.5rem', marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
          {modules.map((m, i) => (
            <li key={m.id} style={{
              borderLeft: `4px solid ${theme.accent}`,
              paddingLeft: '0.75rem',
              paddingTop: '0.5rem',
              paddingBottom: '0.5rem',
              borderRadius: '0.25rem'
            }}>
              <div style={{fontWeight: 500}}>{m.title}</div>
              <div style={{fontSize: '0.875rem', color: '#64748b'}}>{m.content}</div>
            </li>
          ))}
        </ol>
        {!isAdmin && <p style={{marginTop: '0.75rem', fontSize: '0.875rem', color: '#64748b'}}>(Login sebagai Admin untuk mengedit modul)</p>}
      </div>
    </div>
  );
}

function MateriPage({ materi, isAdmin, setMateri, theme }) {
  const [editing, setEditing] = useState(false);
  const [local, setLocal] = useState(materi);
  useEffect(() => setLocal(materi), [materi]);
  const save = () => { setMateri(local); setEditing(false); alert('Materi disimpan'); };

  return (
    <div style={{backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'}}>
      <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
        <div style={{flex: 1}}>
          <h2 style={{fontWeight: 600, fontSize: '1.125rem'}}>{materi.title}</h2>
          <div style={{marginTop: '1rem'}}>
            {materi.videoUrl && materi.videoUrl.includes('youtube.com') ? (
              <div style={{aspectRatio: '16/9', width: '100%', borderRadius: '0.375rem', overflow: 'hidden', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'}}>
                <iframe src={materi.videoUrl} title="video" style={{width: '100%', height: '100%', border: 'none'}} allowFullScreen />
              </div>
            ) : (
              <video controls src={materi.videoUrl} style={{width: '100%', borderRadius: '0.375rem'}} />
            )}
            <p style={{marginTop: '1rem', whiteSpace: 'pre-line', color: '#374151'}}>{materi.text}</p>
          </div>
        </div>
        <div style={{width: '100%', maxWidth: '24rem'}}>
          <div style={{padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '0.375rem'}}>
            <h3 style={{fontWeight: 600}}>Ringkasan</h3>
            <p style={{fontSize: '0.875rem', color: '#64748b', marginTop: '0.5rem'}}>Halaman materi menampilkan video pembelajaran, teks penjelasan, serta referensi. Kamu dapat mengunggah URL video atau link YouTube (embed URL) di Admin Panel.</p>
            {isAdmin && (
              <div style={{marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                <button onClick={() => setEditing(true)} style={{
                  padding: '0.5rem 0.75rem',
                  borderRadius: '0.25rem',
                  color: 'white',
                  backgroundColor: theme.accent
                }}>Edit Materi</button>
              </div>
            )}
          </div>
          {editing && (
            <div style={{marginTop: '1rem', padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '0.375rem'}}>
              <input style={{width: '100%', border: '1px solid #d1d5db', padding: '0.5rem 0.75rem', borderRadius: '0.25rem'}} value={local.title} onChange={e => setLocal({ ...local, title: e.target.value })} />
              <input style={{width: '100%', border: '1px solid #d1d5db', padding: '0.5rem 0.75rem', borderRadius: '0.25rem', marginTop: '0.5rem'}} value={local.videoUrl} onChange={e => setLocal({ ...local, videoUrl: e.target.value })} placeholder="https://www.youtube.com/embed/... or video.mp4" />
              <textarea style={{width: '100%', border: '1px solid #d1d5db', padding: '0.5rem 0.75rem', borderRadius: '0.25rem', marginTop: '0.5rem', minHeight: '9rem'}} value={local.text} onChange={e => setLocal({ ...local, text: e.target.value })} />
              <div style={{display: 'flex', gap: '0.5rem', marginTop: '0.5rem'}}>
                <button onClick={save} style={{
                  padding: '0.5rem 0.75rem',
                  borderRadius: '0.25rem',
                  color: 'white',
                  backgroundColor: theme.accent
                }}>Simpan</button>
                <button onClick={() => setEditing(false)} style={{
                  padding: '0.5rem 0.75rem',
                  borderRadius: '0.25rem',
                  border: '1px solid #d1d5db'
                }}>Batal</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TestPage({ title, questions, setQuestions, isAdmin, theme }) {
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  useEffect(() => { setAnswers({}); setResult(null); }, [questions]);

  const pick = (qid, idx) => setAnswers(a => ({ ...a, [qid]: idx }));

  const submit = () => {
    let correct = 0;
    questions.forEach(q => { if (answers[q.id] === q.ans) correct++; });
    const percent = questions.length ? Math.round((correct / questions.length) * 100) : 0;
    setResult({ correct, total: questions.length, percent });
  };

  return (
    <div style={{backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'}}>
      <h2 style={{fontWeight: 600, fontSize: '1.125rem'}}>{title}</h2>
      <p style={{fontSize: '0.875rem', color: '#64748b', marginTop: '0.5rem'}}>Soal bisa dikelola oleh admin. Setelah menjawab, klik <b>Kumpulkan</b> untuk melihat hasil.</p>

      <div style={{marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem'}}>
        {questions.map((q, i) => (
          <div key={q.id} style={{padding: '1rem', borderRadius: '0.5rem', border: '1px solid #e0f2fe', backgroundColor: '#f8fafc'}}>
            <div style={{fontWeight: 500}}>{i+1}. {q.q}</div>
            <div style={{marginTop: '0.75rem', display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '0.5rem'}}>
              {q.choices.map((c, idx) => (
                <label key={idx} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.5rem',
                  borderRadius: '0.25rem',
                  cursor: 'pointer',
                  backgroundColor: answers[q.id] === idx ? '#dbeafe' : 'transparent'
                }}>
                  <input type="radio" name={q.id} checked={answers[q.id] === idx} onChange={() => pick(q.id, idx)} />
                  <span>{c}</span>
                </label>
              ))}
            </div>
            {result && (
              <div style={{marginTop: '0.5rem', fontSize: '0.875rem'}}>
                {answers[q.id] === q.ans ? <span style={{color: '#16a34a'}}>Benar</span> : <span style={{color: '#dc2626'}}>Salah — Jawaban benar: {q.choices[q.ans]}</span>}
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{marginTop: '1rem', display: 'flex', gap: '0.5rem'}}>
        <button onClick={submit} style={{
          padding: '0.5rem 1rem',
          borderRadius: '0.25rem',
          color: 'white',
          backgroundColor: theme.accent
        }}>Kumpulkan</button>
        <button onClick={() => { setAnswers({}); setResult(null); }} style={{
          padding: '0.5rem 1rem',
          borderRadius: '0.25rem',
          border: '1px solid #d1d5db'
        }}>Reset</button>
      </div>

      {result && (
        <div style={{
          marginTop: '1rem',
          borderRadius: '0.25rem',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          padding: '1rem',
          borderLeft: `5px solid ${theme.accent}`
        }}>
          <div style={{fontWeight: 500}}>Hasil: {result.correct} / {result.total} — {result.percent}%</div>
        </div>
      )}

      {isAdmin && <div style={{marginTop: '1rem', fontSize: '0.875rem', color: '#64748b'}}>(Sebagai admin kamu dapat mengelola soal melalui Admin Panel di bawah)</div>}
    </div>
  );
}

function MotivationPage({ motivations, theme }) {
  const [idx, setIdx] = useState(0);
  useEffect(() => { 
    const t = setInterval(() => setIdx(i => (i+1) % Math.max(1, motivations.length)), 6000); 
    return () => clearInterval(t); 
  }, [motivations]);
  
  return (
    <div style={{backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)', textAlign: 'center'}}>
      <h2 style={{fontWeight: 600, fontSize: '1.125rem'}}>Penguat Mental & Motivasi</h2>
      <p style={{fontStyle: 'italic', marginTop: '1rem'}}>"{motivations[idx] || ''}"</p>

      <div style={{marginTop: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '1rem'}}>
        <div style={{padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '0.375rem'}}>
          <h4 style={{fontWeight: 600}}>Tips Praktik</h4>
          <ul style={{marginTop: '0.5rem', fontSize: '0.875rem', listStyleType: 'disc', textAlign: 'left', paddingLeft: '1.25rem', color: '#64748b'}}>
            <li>Catat langkah praktikum secara runtut.</li>
            <li>Uji setiap perubahan rangkaian secara aman.</li>
            <li>Bertanya ke guru ketika ragu—jangan sungkan.</li>
          </ul>
        </div>
        <div style={{padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '0.375rem'}}>
          <h4 style={{fontWeight: 600}}>Mindset</h4>
          <p style={{marginTop: '0.5rem', fontSize: '0.875rem', color: '#64748b'}}>Fokus pada proses. Keahlian teknik dibangun lewat latihan berulang dan dokumentasi.</p>
        </div>
        <div style={{padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '0.375rem'}}>
          <h4 style={{fontWeight: 600}}>Checklist Sebelum Praktek</h4>
          <ol style={{marginTop: '0.5rem', fontSize: '0.875rem', listStyleType: 'decimal', textAlign: 'left', paddingLeft: '1.25rem', color: '#64748b'}}>
            <li>Periksa alat & APD.</li>
            <li>Baca instruksi langkah demi langkah.</li>
            <li>Konsultasi jika ada bagian berbahaya.</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

function AdminPanel({ profile, setProfile, modules, setModules, materi, setMateri, preQuestions, setPreQuestions, postQuestions, setPostQuestions, motivations, setMotivations, theme, setTheme }) {
  // Modules CRUD
  const addModule = () => setModules(m => [...m, { id: uid(), title: 'Modul baru', content: 'Isi modul...' }]);
  const updateModule = (id, data) => setModules(m => m.map(x => x.id === id ? { ...x, ...data } : x));
  const removeModule = (id) => setModules(m => m.filter(x => x.id !== id));

  // Questions CRUD
  const addQuestion = (which) => {
    const q = { id: uid(), q: 'Soal baru', choices: ['Pil A', 'Pil B', 'Pil C', 'Pil D'], ans: 0 };
    if (which === 'pre') setPreQuestions(s => [...s, q]); else setPostQuestions(s => [...s, q]);
  };
  const updateQuestion = (which, id, data) => {
    if (which === 'pre') setPreQuestions(s => s.map(x => x.id === id ? { ...x, ...data } : x)); else setPostQuestions(s => s.map(x => x.id === id ? { ...x, ...data } : x));
  };
  const removeQuestion = (which, id) => {
    if (which === 'pre') setPreQuestions(s => s.filter(x => x.id !== id)); else setPostQuestions(s => s.filter(x => x.id !== id));
  };

  // motivations
  const addMotivation = () => setMotivations(m => [...m, 'Kutipan motivasi baru']);
  const updateMotivation = (idx, text) => setMotivations(m => m.map((x, i) => i === idx ? text : x));
  const removeMotivation = (idx) => setMotivations(m => m.filter((_, i) => i !== idx));

  // theme
  const updateTheme = (k, v) => setTheme(t => ({ ...t, [k]: v }));

  // import/export
  const exportAll = () => {
    const all = { profile, modules, materi, preQuestions, postQuestions, motivations, theme };
    const blob = new Blob([JSON.stringify(all, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'iml_backup.json'; a.click(); URL.revokeObjectURL(url);
  };
  const importAll = (e) => {
    const f = e.target.files?.[0]; if (!f) return;
    const r = new FileReader();
    r.onload = ev => {
      try {
        const obj = JSON.parse(ev.target.result);
        if (obj.profile) setProfile(obj.profile);
        if (obj.modules) setModules(obj.modules);
        if (obj.materi) setMateri(obj.materi);
        if (obj.preQuestions) setPreQuestions(obj.preQuestions);
        if (obj.postQuestions) setPostQuestions(obj.postQuestions);
        if (obj.motivations) setMotivations(obj.motivations);
        if (obj.theme) setTheme(obj.theme);
        alert('Import berhasil');
      } catch (err) { alert('File tidak valid'); }
    };
    r.readAsText(f);
  };

  return (
    <div style={{backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'}}>
      <h3 style={{fontWeight: 600}}>Admin Panel — Kelola Konten</h3>

      <section style={{marginTop: '1rem'}}>
        <h4 style={{fontWeight: 500}}>Profil Guru</h4>
        <div style={{marginTop: '0.5rem', display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '0.5rem'}}>
          <input style={{border: '1px solid #d1d5db', padding: '0.5rem 0.75rem', borderRadius: '0.25rem'}} value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} />
          <input style={{border: '1px solid #d1d5db', padding: '0.5rem 0.75rem', borderRadius: '0.25rem'}} value={profile.contact} onChange={e => setProfile({ ...profile, contact: e.target.value })} />
          <input style={{border: '1px solid #d1d5db', padding: '0.5rem 0.75rem', borderRadius: '0.25rem'}} value={profile.bio} onChange={e => setProfile({ ...profile, bio: e.target.value })} />
        </div>
      </section>

      <section style={{marginTop: '1rem'}}>
        <h4 style={{fontWeight: 500}}>Modul (CRUD)</h4>
        <div style={{marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
          {modules.map(m => (
            <div key={m.id} style={{padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.375rem', display: 'grid', gridTemplateColumns: 'repeat(12, minmax(0, 1fr))', gap: '0.5rem', alignItems: 'center'}}>
              <input style={{gridColumn: 'span 4 / span 4', border: '1px solid #d1d5db', padding: '0.5rem', borderRadius: '0.25rem'}} value={m.title} onChange={e => updateModule(m.id, { title: e.target.value })} />
              <input style={{gridColumn: 'span 7 / span 7', border: '1px solid #d1d5db', padding: '0.5rem', borderRadius: '0.25rem'}} value={m.content} onChange={e => updateModule(m.id, { content: e.target.value })} />
              <button style={{gridColumn: 'span 1 / span 1', padding: '0.5rem', borderRadius: '0.25rem', backgroundColor: '#dc2626', color: 'white'}} onClick={() => removeModule(m.id)}>Hapus</button>
            </div>
          ))}
          <div>
            <button onClick={addModule} style={{
              padding: '0.5rem 0.75rem',
              borderRadius: '0.25rem',
              color: 'white',
              backgroundColor: theme.accent,
              marginTop: '0.5rem'
            }}>Tambah Modul</button>
          </div>
        </div>
      </section>

      <section style={{marginTop: '1rem'}}>
        <h4 style={{fontWeight: 500}}>Materi</h4>
        <div style={{marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
          <input style={{border: '1px solid #d1d5db', padding: '0.5rem 0.75rem', borderRadius: '0.25rem'}} value={materi.title} onChange={e => setMateri({ ...materi, title: e.target.value })} />
          <input style={{border: '1px solid #d1d5db', padding: '0.5rem 0.75rem', borderRadius: '0.25rem'}} value={materi.videoUrl} onChange={e => setMateri({ ...materi, videoUrl: e.target.value })} placeholder="YouTube embed link or video file URL" />
          <textarea style={{border: '1px solid #d1d5db', padding: '0.5rem 0.75rem', borderRadius: '0.25rem', minHeight: '9rem'}} value={materi.text} onChange={e => setMateri({ ...materi, text: e.target.value })} />
        </div>
      </section>

      <section style={{marginTop: '1rem'}}>
        <h4 style={{fontWeight: 500}}>Pre-Test (Soal)</h4>
        <div style={{marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
          {preQuestions.map(q => (
            <QuestionEditor key={q.id} item={q} onChange={(d) => updateQuestion('pre', q.id, d)} onRemove={() => removeQuestion('pre', q.id)} />
          ))}
          <div style={{marginTop: '0.5rem'}}>
            <button onClick={() => addQuestion('pre')} style={{
              padding: '0.5rem 0.75rem',
              borderRadius: '0.25rem',
              color: 'white',
              backgroundColor: theme.accent
            }}>Tambah Soal Pre</button>
          </div>
        </div>
      </section>

      <section style={{marginTop: '1rem'}}>
        <h4 style={{fontWeight: 500}}>Post-Test (Soal)</h4>
        <div style={{marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
          {postQuestions.map(q => (
            <QuestionEditor key={q.id} item={q} onChange={(d) => updateQuestion('post', q.id, d)} onRemove={() => removeQuestion('post', q.id)} />
          ))}
          <div style={{marginTop: '0.5rem'}}>
            <button onClick={() => addQuestion('post')} style={{
              padding: '0.5rem 0.75rem',
              borderRadius: '0.25rem',
              color: 'white',
              backgroundColor: theme.accent
            }}>Tambah Soal Post</button>
          </div>
        </div>
      </section>

      <section style={{marginTop: '1rem'}}>
        <h4 style={{fontWeight: 500}}>Motivasi</h4>
        <div style={{marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
          {motivations.map((m, i) => (
            <div key={i} style={{display: 'flex', gap: '0.5rem'}}>
              <input style={{flex: 1, border: '1px solid #d1d5db', padding: '0.5rem 0.75rem', borderRadius: '0.25rem'}} value={m} onChange={e => updateMotivation(i, e.target.value)} />
              <button style={{padding: '0.5rem 0.75rem', borderRadius: '0.25rem', backgroundColor: '#dc2626', color: 'white'}} onClick={() => removeMotivation(i)}>Hapus</button>
            </div>
          ))}
          <button onClick={addMotivation} style={{
            padding: '0.5rem 0.75rem',
            borderRadius: '0.25rem',
            color: 'white',
            backgroundColor: theme.accent,
            marginTop: '0.5rem'
          }}>Tambah Motivasi</button>
        </div>
      </section>

      <section style={{marginTop: '1rem'}}>
        <h4 style={{fontWeight: 500}}>Theme & Warna</h4>
        <div style={{marginTop: '0.5rem', display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '0.5rem'}}>
          <label style={{display: 'flex', flexDirection: 'column'}}>
            <span style={{fontSize: '0.875rem'}}>Warna Accent</span>
            <input type="color" value={theme.accent} onChange={e => updateTheme('accent', e.target.value)} style={{marginTop: '0.25rem'}} />
          </label>
          <label style={{display: 'flex', flexDirection: 'column'}}>
            <span style={{fontSize: '0.875rem'}}>Gradient From</span>
            <input type="color" value={theme.gradientFrom} onChange={e => updateTheme('gradientFrom', e.target.value)} style={{marginTop: '0.25rem'}} />
          </label>
          <label style={{display: 'flex', flexDirection: 'column'}}>
            <span style={{fontSize: '0.875rem'}}>Gradient To</span>
            <input type="color" value={theme.gradientTo} onChange={e => updateTheme('gradientTo', e.target.value)} style={{marginTop: '0.25rem'}} />
          </label>
        </div>
      </section>

      <section style={{marginTop: '1rem', display: 'flex', gap: '0.5rem', alignItems: 'center'}}>
        <div>
          <button onClick={exportAll} style={{
            padding: '0.5rem 0.75rem',
            borderRadius: '0.25rem',
            color: 'white',
            backgroundColor: theme.accent
          }}>Export (backup)</button>
        </div>
        <div>
          <input type="file" accept="application/json" onChange={importAll} />
        </div>
        <div>
          <button onClick={() => { if (confirm('Reset semua data ke default?')) { localStorage.clear(); window.location.reload(); } }} style={{
            padding: '0.5rem 0.75rem',
            borderRadius: '0.25rem',
            border: '1px solid #d1d5db'
          }}>Reset semua</button>
        </div>
      </section>
    </div>
  );
}

function QuestionEditor({ item, onChange, onRemove }) {
  const updateField = (k, v) => onChange({ ...item, [k]: v });
  const updateChoice = (idx, val) => onChange({ ...item, choices: item.choices.map((c, i) => i === idx ? val : c) });
  const addChoice = () => onChange({ ...item, choices: [...item.choices, 'Pilihan'] });
  const removeChoice = (idx) => onChange({ ...item, choices: item.choices.filter((_, i) => i !== idx) });

  return (
    <div style={{padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.375rem'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
        <div style={{fontWeight: 500}}>{item.q}</div>
        <button onClick={onRemove} style={{padding: '0.5rem', borderRadius: '0.25rem', backgroundColor: '#dc2626', color: 'white'}}>Hapus</button>
      </div>
      <input style={{width: '100%', border: '1px solid #d1d5db', padding: '0.5rem', borderRadius: '0.25rem', marginTop: '0.5rem'}} value={item.q} onChange={e => updateField('q', e.target.value)} />
      <div style={{marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
        {item.choices.map((c, i) => (
          <div key={i} style={{display: 'flex', gap: '0.5rem', alignItems: 'center'}}>
            <input style={{flex: 1, border: '1px solid #d1d5db', padding: '0.5rem', borderRadius: '0.25rem'}} value={c} onChange={e => updateChoice(i, e.target.value)} />
            <label style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
              <input type="radio" name={`ans-${item.id}`} checked={item.ans === i} onChange={() => updateField('ans', i)} /> Benar
            </label>
            <button onClick={() => removeChoice(i)} style={{padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid #d1d5db'}}>-</button>
          </div>
        ))}
        <div style={{display: 'flex', gap: '0.5rem'}}>
          <button onClick={addChoice} style={{padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid #d1d5db'}}>Tambah Pilihan</button>
        </div>
      </div>
    </div>
  );
}