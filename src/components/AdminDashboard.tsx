import React, { useState, useEffect } from 'react';
import { useUserStore, type Fase, type Licao } from '../store/useUserStore';
import { ChevronLeft, Plus, Edit3, Trash2, ShieldCheck, Layers, BookOpen, Check, X, AlertCircle } from 'lucide-react';

interface AdminDashboardProps {
  onBack: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBack }) => {
  const { currentUser, fases, loadFases, createPhase, updatePhase, deletePhase, createLesson, updateLesson, deleteLesson } = useUserStore();

  const [activeTab, setActiveTab] = useState<'phases' | 'lessons'>('lessons');
  const [selectedPhaseId, setSelectedPhaseId] = useState<string>('');

  // Estados de formulário de Módulo
  const [editingPhase, setEditingPhase] = useState<Fase | null>(null);
  const [phaseTitle, setPhaseTitle] = useState('');
  const [phaseDesc, setPhaseDesc] = useState('');
  const [showPhaseModal, setShowPhaseModal] = useState(false);

  // Estados de formulário de Lição
  const [editingLesson, setEditingLesson] = useState<Licao | null>(null);
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonSubtitle, setLessonSubtitle] = useState('');
  const [lessonLinhas, setLessonLinhas] = useState('');
  const [lessonTeclasFoco, setLessonTeclasFoco] = useState('');
  const [lessonIsScrolling, setLessonIsScrolling] = useState(false);
  const [showLessonModal, setShowLessonModal] = useState(false);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadFases();
  }, []);

  useEffect(() => {
    if (fases.length > 0 && !selectedPhaseId) {
      setSelectedPhaseId(fases[0].id || '');
    }
  }, [fases]);

  // Verificar autorização Admin
  const isAdmin = currentUser && (currentUser.email === 'klismanrds@gmail.com' || currentUser.isAdmin);

  if (!isAdmin) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'radial-gradient(circle at top, #1e1b4b 0%, #0f172a 100%)',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20
      }}>
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(239,68,68,0.3)',
          borderRadius: 24,
          padding: 40,
          maxWidth: 450,
          textAlign: 'center',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
        }}>
          <AlertCircle size={56} color="#ef4444" style={{ marginBottom: 16 }} />
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8, color: '#f87171' }}>Acesso Restrito</h2>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', marginBottom: 24 }}>
            Esta página é exclusiva para administradores ({currentUser?.email || 'Sem sessão'}).
          </p>
          <button onClick={onBack} style={{
            background: 'linear-gradient(135deg, #a78bfa, #7c3aed)',
            color: '#fff', border: 'none', padding: '12px 24px', borderRadius: 12,
            fontWeight: 700, cursor: 'pointer', fontSize: 14
          }}>
            Voltar ao Aplicativo
          </button>
        </div>
      </div>
    );
  }

  // --- Handlers de Módulos ---
  const handleOpenPhaseModal = (phase?: Fase) => {
    if (phase) {
      setEditingPhase(phase);
      setPhaseTitle(phase.titulo);
      setPhaseDesc(phase.descricao);
    } else {
      setEditingPhase(null);
      setPhaseTitle('');
      setPhaseDesc('');
    }
    setShowPhaseModal(true);
  };

  const handleSavePhase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phaseTitle.trim()) return alert('O título do módulo é obrigatório.');
    setLoading(true);
    if (editingPhase && editingPhase.id) {
      await updatePhase(editingPhase.id, phaseTitle, phaseDesc);
    } else {
      await createPhase(phaseTitle, phaseDesc);
    }
    setLoading(false);
    setShowPhaseModal(false);
  };

  const handleDeletePhase = async (phase: Fase) => {
    if (!phase.id) return;
    if (window.confirm(`Tem certeza que deseja excluir o módulo "${phase.titulo}" e todas as suas lições?`)) {
      setLoading(true);
      await deletePhase(phase.id);
      setLoading(false);
    }
  };

  // --- Handlers de Lições ---
  const handleOpenLessonModal = (lesson?: Licao) => {
    if (lesson) {
      setEditingLesson(lesson);
      setLessonTitle(lesson.titulo);
      setLessonSubtitle(lesson.subtitulo || '');
      setLessonLinhas((lesson.linhas || []).join('\n'));
      setLessonTeclasFoco((lesson.teclasFoco || []).join(', '));
      setLessonIsScrolling(!!lesson.isScrolling);
    } else {
      setEditingLesson(null);
      setLessonTitle('');
      setLessonSubtitle('');
      setLessonLinhas('');
      setLessonTeclasFoco('');
      setLessonIsScrolling(false);
    }
    setShowLessonModal(true);
  };

  const handleSaveLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lessonTitle.trim()) return alert('O título da lição é obrigatório.');
    if (!selectedPhaseId) return alert('Selecione um módulo válido.');

    const linhasArray = lessonLinhas.split('\n').filter(l => l.trim() !== '');
    if (linhasArray.length === 0) return alert('Digite ao menos uma linha de texto para o exercício.');

    const teclasArray = lessonTeclasFoco
      .split(',')
      .map(k => k.trim())
      .filter(k => k.length > 0);

    setLoading(true);
    if (editingLesson && editingLesson.dbId) {
      await updateLesson(editingLesson.dbId, {
        titulo: lessonTitle,
        subtitulo: lessonSubtitle,
        linhas: linhasArray,
        teclasFoco: teclasArray,
        isScrolling: lessonIsScrolling,
      });
    } else {
      await createLesson(selectedPhaseId, {
        titulo: lessonTitle,
        subtitulo: lessonSubtitle,
        linhas: linhasArray,
        teclasFoco: teclasArray,
        isScrolling: lessonIsScrolling,
      });
    }
    setLoading(false);
    setShowLessonModal(false);
  };

  const handleDeleteLesson = async (lesson: Licao) => {
    if (!lesson.dbId) return;
    if (window.confirm(`Excluir a lição "${lesson.titulo}"?`)) {
      setLoading(true);
      await deleteLesson(lesson.dbId);
      setLoading(false);
    }
  };

  const currentPhase = fases.find(f => f.id === selectedPhaseId) || fases[0];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(circle at top, #1e1b4b 0%, #0f172a 100%)',
      color: '#fff',
      padding: '30px 20px',
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button onClick={onBack} style={{
              background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)',
              color: '#fff', padding: 10, borderRadius: 12, cursor: 'pointer', display: 'flex', alignItems: 'center'
            }}>
              <ChevronLeft size={20} />
            </button>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <ShieldCheck size={24} color="#a78bfa" />
                <h1 style={{ fontSize: 24, fontWeight: 900, background: 'linear-gradient(90deg,#fff,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Painel de Administração
                </h1>
              </div>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>
                Gerencie módulos, lições e conteúdos em tempo real para todos os alunos.
              </p>
            </div>
          </div>

          {/* Abas */}
          <div style={{ display: 'flex', gap: 8, background: 'rgba(0,0,0,0.3)', padding: 6, borderRadius: 14, border: '1px solid rgba(255,255,255,0.08)' }}>
            <button
              onClick={() => setActiveTab('lessons')}
              style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 10, border: 'none',
                background: activeTab === 'lessons' ? '#a78bfa' : 'transparent',
                color: activeTab === 'lessons' ? '#0f172a' : 'rgba(255,255,255,0.7)',
                fontWeight: 700, fontSize: 13, cursor: 'pointer', transition: 'all 0.2s'
              }}
            >
              <BookOpen size={16} /> Lições ({currentPhase?.licoes.length || 0})
            </button>
            <button
              onClick={() => setActiveTab('phases')}
              style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 10, border: 'none',
                background: activeTab === 'phases' ? '#a78bfa' : 'transparent',
                color: activeTab === 'phases' ? '#0f172a' : 'rgba(255,255,255,0.7)',
                fontWeight: 700, fontSize: 13, cursor: 'pointer', transition: 'all 0.2s'
              }}
            >
              <Layers size={16} /> Módulos ({fases.length})
            </button>
          </div>
        </div>

        {/* CONTEÚDO DA ABA 1: GERENCIAR MÓDULOS */}
        {activeTab === 'phases' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700 }}>Módulos Cadastrados</h2>
              <button
                onClick={() => handleOpenPhaseModal()}
                style={{
                  background: 'linear-gradient(135deg, #a78bfa, #7c3aed)',
                  color: '#fff', border: 'none', padding: '10px 18px', borderRadius: 12,
                  fontWeight: 700, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8
                }}
              >
                <Plus size={18} /> Novo Módulo
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
              {fases.map((f, idx) => (
                <div key={f.id || idx} style={{
                  background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 20,
                  display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
                }}>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 800, color: '#a78bfa', textTransform: 'uppercase', marginBottom: 4 }}>
                      Módulo {idx + 1}
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 6 }}>{f.titulo}</div>
                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 16, lineHeight: 1.4 }}>{f.descricao}</div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
                      {f.licoes.length} {f.licoes.length === 1 ? 'lição' : 'lições'}
                    </span>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        onClick={() => handleOpenPhaseModal(f)}
                        style={{ background: 'rgba(255,255,255,0.08)', border: 'none', color: '#a78bfa', padding: 8, borderRadius: 8, cursor: 'pointer' }}
                        title="Editar Módulo"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeletePhase(f)}
                        style={{ background: 'rgba(239,68,68,0.1)', border: 'none', color: '#ef4444', padding: 8, borderRadius: 8, cursor: 'pointer' }}
                        title="Excluir Módulo"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CONTEÚDO DA ABA 2: GERENCIAR LIÇÕES */}
        {activeTab === 'lessons' && (
          <div>
            {/* Seletor de Módulo e Botão Adicionar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, marginBottom: 20, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.7)' }}>Módulo:</span>
                <select
                  value={selectedPhaseId}
                  onChange={e => setSelectedPhaseId(e.target.value)}
                  style={{
                    background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(167,139,250,0.3)',
                    color: '#fff', padding: '10px 16px', borderRadius: 12, fontSize: 14, fontWeight: 700, outline: 'none'
                  }}
                >
                  {fases.map((f, idx) => (
                    <option key={f.id || idx} value={f.id || ''} style={{ background: '#0f172a', color: '#fff' }}>
                      {idx + 1}. {f.titulo}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => handleOpenLessonModal()}
                style={{
                  background: 'linear-gradient(135deg, #a78bfa, #7c3aed)',
                  color: '#fff', border: 'none', padding: '10px 18px', borderRadius: 12,
                  fontWeight: 700, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8
                }}
              >
                <Plus size={18} /> Adicionar Lição a este Módulo
              </button>
            </div>

            {/* Lista de Lições */}
            {!currentPhase || currentPhase.licoes.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 60, background: 'rgba(255,255,255,0.02)', borderRadius: 20, border: '1px dashed rgba(255,255,255,0.1)' }}>
                <BookOpen size={48} color="rgba(255,255,255,0.2)" style={{ marginBottom: 12 }} />
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>Nenhuma lição cadastrada neste módulo.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {currentPhase.licoes.map((l, idx) => (
                  <div key={l.dbId || l.id || idx} style={{
                    background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '16px 20px',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                  }}>
                    <div style={{ flex: 1, paddingRight: 20 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                        <span style={{ fontSize: 12, fontWeight: 900, color: '#0f172a', background: '#a78bfa', padding: '2px 8px', borderRadius: 6 }}>
                          Lição {idx + 1}
                        </span>
                        <span style={{ fontSize: 15, fontWeight: 800 }}>{l.titulo}</span>
                        {l.isScrolling && (
                          <span style={{ fontSize: 10, fontWeight: 800, color: '#34d399', background: 'rgba(52,211,153,0.15)', padding: '2px 8px', borderRadius: 6, border: '1px solid rgba(52,211,153,0.3)' }}>
                            Modo Fluxo (Scrolling)
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 8 }}>{l.subtitulo}</div>
                      
                      {/* Exemplo de texto da lição */}
                      <div style={{
                        fontSize: 12, fontFamily: 'monospace', background: 'rgba(0,0,0,0.3)',
                        padding: '6px 10px', borderRadius: 8, color: '#e2e8f0', border: '1px solid rgba(255,255,255,0.05)',
                        maxWidth: '90%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                      }}>
                        {l.linhas[0] || 'Sem linhas'}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        onClick={() => handleOpenLessonModal(l)}
                        style={{ background: 'rgba(255,255,255,0.08)', border: 'none', color: '#a78bfa', padding: 10, borderRadius: 10, cursor: 'pointer' }}
                        title="Editar Lição"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteLesson(l)}
                        style={{ background: 'rgba(239,68,68,0.1)', border: 'none', color: '#ef4444', padding: 10, borderRadius: 10, cursor: 'pointer' }}
                        title="Excluir Lição"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* MODAL MÓDULO */}
      {showPhaseModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20
        }}>
          <div style={{ background: '#1e1b4b', border: '1px solid rgba(167,139,250,0.3)', borderRadius: 24, padding: 30, width: '100%', maxWidth: 450 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontSize: 18, fontWeight: 800 }}>{editingPhase ? 'Editar Módulo' : 'Novo Módulo'}</h3>
              <button onClick={() => setShowPhaseModal(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}><X size={20} /></button>
            </div>

            <form onSubmit={handleSavePhase} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: 'rgba(255,255,255,0.7)', marginBottom: 6, fontWeight: 700 }}>Título do Módulo</label>
                <input
                  type="text" required placeholder="Ex: Módulo 11 — Digitação Técnica"
                  value={phaseTitle} onChange={e => setPhaseTitle(e.target.value)}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: 10, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', outline: 'none' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: 'rgba(255,255,255,0.7)', marginBottom: 6, fontWeight: 700 }}>Descrição</label>
                <textarea
                  rows={3} placeholder="Descrição breve dos objetivos deste módulo..."
                  value={phaseDesc} onChange={e => setPhaseDesc(e.target.value)}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: 10, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', outline: 'none', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 10 }}>
                <button type="button" onClick={() => setShowPhaseModal(false)} style={{ flex: 1, padding: 12, borderRadius: 10, background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>
                  Cancelar
                </button>
                <button type="submit" disabled={loading} style={{ flex: 1, padding: 12, borderRadius: 10, background: 'linear-gradient(135deg, #a78bfa, #7c3aed)', border: 'none', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>
                  {loading ? 'Salvando...' : 'Salvar Módulo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL LIÇÃO */}
      {showLessonModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20
        }}>
          <div style={{ background: '#1e1b4b', border: '1px solid rgba(167,139,250,0.3)', borderRadius: 24, padding: 30, width: '100%', maxWidth: 550, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontSize: 18, fontWeight: 800 }}>{editingLesson ? 'Editar Lição' : 'Adicionar Lição'}</h3>
              <button onClick={() => setShowLessonModal(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}><X size={20} /></button>
            </div>

            <form onSubmit={handleSaveLesson} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: 'rgba(255,255,255,0.7)', marginBottom: 6, fontWeight: 700 }}>Título da Lição</label>
                <input
                  type="text" required placeholder="Ex: Lição 1"
                  value={lessonTitle} onChange={e => setLessonTitle(e.target.value)}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: 10, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, color: 'rgba(255,255,255,0.7)', marginBottom: 6, fontWeight: 700 }}>Subtítulo / Objetivo</label>
                <input
                  type="text" placeholder="Ex: Treinando Teclas A S D F"
                  value={lessonSubtitle} onChange={e => setLessonSubtitle(e.target.value)}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: 10, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, color: 'rgba(255,255,255,0.7)', marginBottom: 6, fontWeight: 700 }}>
                  Linhas de Texto (Uma por linha)
                </label>
                <textarea
                  rows={5} required placeholder={`linha 1 de texto\nlinha 2 de texto\nlinha 3 de texto`}
                  value={lessonLinhas} onChange={e => setLessonLinhas(e.target.value)}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: 10, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', outline: 'none', fontFamily: 'monospace', fontSize: 13, resize: 'vertical' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, color: 'rgba(255,255,255,0.7)', marginBottom: 6, fontWeight: 700 }}>
                  Teclas em Destaque no Teclado (Separadas por vírgula)
                </label>
                <input
                  type="text" placeholder="Ex: a, s, d, f"
                  value={lessonTeclasFoco} onChange={e => setLessonTeclasFoco(e.target.value)}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: 10, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: 'rgba(0,0,0,0.2)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)' }}>
                <input
                  type="checkbox" id="isScrolling"
                  checked={lessonIsScrolling} onChange={e => setLessonIsScrolling(e.target.checked)}
                  style={{ width: 18, height: 18, accentColor: '#a78bfa', cursor: 'pointer' }}
                />
                <label htmlFor="isScrolling" style={{ fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                  Modo Fluxo Deslizante (Scrolling / Guitar Hero)
                </label>
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 10 }}>
                <button type="button" onClick={() => setShowLessonModal(false)} style={{ flex: 1, padding: 12, borderRadius: 10, background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>
                  Cancelar
                </button>
                <button type="submit" disabled={loading} style={{ flex: 1, padding: 12, borderRadius: 10, background: 'linear-gradient(135deg, #a78bfa, #7c3aed)', border: 'none', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>
                  {loading ? 'Salvando...' : 'Salvar Lição'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
