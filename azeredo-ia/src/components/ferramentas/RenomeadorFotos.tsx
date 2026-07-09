import { useState, useRef, useCallback, useEffect, useMemo } from 'react';

/**
 * Renomeador de fotos de produto (backlog A5).
 *
 * Cada fábrica manda fotos com nome em padrão próprio; o Mercos só casa a foto
 * com o produto quando o arquivo se chama exatamente o código do produto.
 * Fluxo: upload em lote → regra (preset da fábrica, IA ou manual) → prévia
 * antes/depois → download .zip renomeado. Tudo client-side; as fotos nunca
 * sobem para servidor — a IA recebe apenas os NOMES dos arquivos.
 */

type Rule =
  | { type: 'segment'; separator: string; index: number }
  | { type: 'regex'; pattern: string; group: number };

// Regras já validadas com a Tati (podem ser sobrescritas por presets salvos)
const BUILTIN_PRESETS: Record<string, Rule> = {
  'BR':   { type: 'segment', separator: '_', index: 1 }, // 5_MO-15_01 → MO-15
  'Ingá': { type: 'segment', separator: '_', index: 0 }, // 17619_baixa → 17619
};

const S = {
  wrap: { padding: '28px 32px', maxWidth: 960, margin: '0 auto' },
  section: { marginBottom: 28 },
  label: { fontSize: '11px', fontWeight: 600, color: '#4a6050', textTransform: 'uppercase' as const, letterSpacing: '0.06em', marginBottom: 8, display: 'block' },
  dropzone: (drag: boolean) => ({
    border: `2px dashed ${drag ? '#4de08c' : '#1c2820'}`,
    borderRadius: 10, padding: '36px 24px', textAlign: 'center' as const,
    cursor: 'pointer', background: drag ? 'rgba(37,211,102,0.04)' : '#0d120e',
    transition: 'all 0.15s',
  }),
  dropText: { fontSize: 14, color: '#4a6050', marginBottom: 6 },
  dropSub: { fontSize: 12, color: '#2d3d30' },
  fileName: { fontSize: 13, color: '#4de08c', fontWeight: 600, marginTop: 8 },
  tableWrap: { overflowX: 'auto' as const, borderRadius: 8, border: '1px solid #1c2820' },
  table: { width: '100%', borderCollapse: 'collapse' as const, fontSize: 12 },
  th: { padding: '8px 12px', textAlign: 'left' as const, background: '#0d120e', color: '#4a6050', fontWeight: 600, borderBottom: '1px solid #1c2820', whiteSpace: 'nowrap' as const },
  td: { padding: '7px 12px', color: '#8aaa90', borderBottom: '1px solid #111a12', maxWidth: 260, overflow: 'hidden' as const, textOverflow: 'ellipsis' as const, whiteSpace: 'nowrap' as const },
  select: {
    background: '#0d120e', border: '1px solid #1c2820', borderRadius: 6,
    color: '#e8f0e8', fontSize: 12, padding: '6px 10px', outline: 'none',
    fontFamily: 'inherit', cursor: 'pointer',
  },
  input: {
    background: '#0d120e', border: '1px solid #1c2820', borderRadius: 6,
    color: '#e8f0e8', fontSize: 12, padding: '6px 10px', outline: 'none',
    fontFamily: 'inherit',
  },
  btn: (disabled: boolean) => ({
    padding: '10px 24px', borderRadius: 8, border: 'none', fontFamily: 'inherit',
    fontSize: 13, fontWeight: 600, cursor: disabled ? 'not-allowed' : 'pointer',
    background: disabled ? '#1c2820' : '#25D366', color: disabled ? '#4a6050' : '#fff',
    transition: 'all 0.15s',
  }),
  btnGhost: (disabled: boolean) => ({
    padding: '7px 14px', borderRadius: 7, fontFamily: 'inherit',
    fontSize: 12, fontWeight: 600, cursor: disabled ? 'not-allowed' : 'pointer',
    background: 'none', border: '1px solid #1c2820',
    color: disabled ? '#2d3d30' : '#4de08c',
    transition: 'all 0.15s',
  }),
  notice: (kind: 'ok' | 'warn' | 'err') => ({
    fontSize: 12, borderRadius: 8, padding: '10px 14px', marginBottom: 14,
    border: `1px solid ${kind === 'ok' ? 'rgba(77,224,140,0.25)' : kind === 'warn' ? 'rgba(252,211,77,0.25)' : 'rgba(248,113,113,0.25)'}`,
    background: kind === 'ok' ? 'rgba(37,211,102,0.05)' : kind === 'warn' ? 'rgba(252,211,77,0.05)' : 'rgba(248,113,113,0.05)',
    color: kind === 'ok' ? '#4de08c' : kind === 'warn' ? '#fcd34d' : '#f87171',
  }),
  info: { fontSize: 12, color: '#4a6050', marginTop: 8 },
  status: (s: 'ok' | 'dup' | 'fail') => ({
    fontSize: 10, fontWeight: 700, padding: '1px 7px', borderRadius: 3,
    background: s === 'ok' ? 'rgba(77,224,140,0.12)' : s === 'dup' ? 'rgba(252,211,77,0.12)' : 'rgba(248,113,113,0.15)',
    color: s === 'ok' ? '#4de08c' : s === 'dup' ? '#fcd34d' : '#f87171',
  }),
  modeBtn: (active: boolean) => ({
    padding: '8px 16px', borderRadius: 7, fontFamily: 'inherit', fontSize: 12,
    fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
    background: active ? 'rgba(37,211,102,0.08)' : 'none',
    border: `1px solid ${active ? '#4de08c' : '#1c2820'}`,
    color: active ? '#4de08c' : '#4a6050',
  }),
};

function stripExt(name: string): { base: string; ext: string } {
  const m = name.match(/^(.*?)(\.[^.]+)?$/);
  return { base: m?.[1] ?? name, ext: (m?.[2] ?? '').toLowerCase() };
}

function applyRule(rule: Rule, filename: string): string | null {
  const { base } = stripExt(filename);
  if (rule.type === 'segment') {
    const parts = base.split(rule.separator);
    const seg = parts[rule.index];
    return seg && seg.trim() ? seg.trim() : null;
  }
  try {
    const m = base.match(new RegExp(rule.pattern));
    const g = m?.[rule.group];
    return g && g.trim() ? g.trim() : null;
  } catch {
    return null;
  }
}

function describeRule(rule: Rule): string {
  if (rule.type === 'segment') {
    return `separar por "${rule.separator}" e usar o ${rule.index + 1}º trecho`;
  }
  return `regex ${rule.pattern}`;
}

type ResultRow = { original: string; newName: string | null; status: 'ok' | 'dup' | 'fail' };

export default function RenomeadorFotos() {
  const [dragging, setDragging] = useState(false);
  const [files, setFiles]       = useState<File[]>([]);
  const [rule, setRule]         = useState<Rule | null>(null);
  const [ruleSource, setRuleSource] = useState<'preset' | 'ia' | 'manual' | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // Regra manual
  const [manSep, setManSep] = useState('_');
  const [manIdx, setManIdx] = useState(1);

  // IA
  const [aiState, setAiState] = useState<'idle' | 'running' | 'done' | 'error'>('idle');
  const [aiNotes, setAiNotes] = useState('');

  // Presets (az_settings) — builtin + salvos
  const [savedPresets, setSavedPresets] = useState<Record<string, Rule>>({});
  const [presetSel, setPresetSel]       = useState('');
  const [presetName, setPresetName]     = useState('');
  const [presetMsg, setPresetMsg]       = useState('');

  const [zipping, setZipping] = useState(false);

  useEffect(() => {
    fetch('/api/ferramentas/rename-presets')
      .then(r => (r.ok ? r.json() : { presets: {} }))
      .then(d => setSavedPresets(d.presets || {}))
      .catch(() => {});
  }, []);

  const presets: Record<string, Rule> = useMemo(
    () => ({ ...BUILTIN_PRESETS, ...savedPresets }),
    [savedPresets]
  );

  const addFiles = useCallback((list: FileList | File[]) => {
    const imgs = Array.from(list).filter(f => /\.(jpe?g|png|gif|webp|bmp|tiff?)$/i.test(f.name) || f.type.startsWith('image/'));
    setFiles(prev => {
      const seen = new Set(prev.map(f => f.name));
      return [...prev, ...imgs.filter(f => !seen.has(f.name))];
    });
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
  }, [addFiles]);

  const selectPreset = (name: string) => {
    setPresetSel(name);
    if (name && presets[name]) {
      setRule(presets[name]);
      setRuleSource('preset');
      const r = presets[name];
      if (r.type === 'segment') { setManSep(r.separator); setManIdx(r.index); }
    }
  };

  const applyManual = () => {
    if (!manSep) return;
    setRule({ type: 'segment', separator: manSep, index: Math.max(0, manIdx) });
    setRuleSource('manual');
    setPresetSel('');
  };

  const runAi = async () => {
    if (files.length === 0) return;
    setAiState('running');
    setAiNotes('');
    try {
      const res = await fetch('/api/ferramentas/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'rename-rule', filenames: files.slice(0, 40).map(f => f.name) }),
      });
      if (!res.ok) throw new Error();
      const out = await res.json();
      setRule(out.rule);
      setRuleSource('ia');
      setPresetSel('');
      if (out.rule.type === 'segment') { setManSep(out.rule.separator); setManIdx(out.rule.index); }
      setAiNotes(`Confiança ${out.confidence}. ${out.notes || ''}`.trim());
      setAiState('done');
    } catch {
      setAiState('error');
    }
  };

  // Prévia: aplica a regra + resolve colisões (2ª foto do mesmo código vira CODIGO_2.ext)
  const results: ResultRow[] = useMemo(() => {
    if (!rule) return [];
    const counts: Record<string, number> = {};
    return files.map(f => {
      const code = applyRule(rule, f.name);
      if (!code) return { original: f.name, newName: null, status: 'fail' as const };
      const { ext } = stripExt(f.name);
      const n = (counts[code] = (counts[code] || 0) + 1);
      return n === 1
        ? { original: f.name, newName: `${code}${ext}`, status: 'ok' as const }
        : { original: f.name, newName: `${code}_${n}${ext}`, status: 'dup' as const };
    });
  }, [files, rule]);

  const okCount   = results.filter(r => r.status === 'ok').length;
  const dupCount  = results.filter(r => r.status === 'dup').length;
  const failCount = results.filter(r => r.status === 'fail').length;

  const savePreset = async () => {
    if (!rule || !presetName.trim()) return;
    setPresetMsg('');
    try {
      const res = await fetch('/api/ferramentas/rename-presets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: presetName.trim(), rule }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error);
      setSavedPresets(d.presets || {});
      setPresetSel(presetName.trim());
      setPresetName('');
      setPresetMsg('Preset salvo.');
    } catch (e: any) {
      setPresetMsg(`Erro ao salvar: ${e?.message || 'falha'}`);
    }
  };

  const downloadZip = async () => {
    if (!rule || results.length === 0) return;
    setZipping(true);
    try {
      const { default: JSZip } = await import('jszip');
      const zip = new JSZip();
      results.forEach((r, i) => {
        if (r.newName) zip.file(r.newName, files[i]);
      });
      const blob = await zip.generateAsync({ type: 'blob' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `fotos_renomeadas_${presetSel || new Date().toISOString().slice(0, 10)}.zip`;
      a.click();
      URL.revokeObjectURL(a.href);
    } finally {
      setZipping(false);
    }
  };

  return (
    <div style={S.wrap}>
      <div style={{ marginBottom: 4, fontSize: 13, color: '#8aaa90' }}>
        Renomeie fotos de produto para o código Mercos — o Mercos reconhece a foto automaticamente quando o arquivo tem o nome do código.
      </div>
      <div style={{ fontSize: 11, color: '#2d3d30', marginBottom: 24 }}>
        Exemplos: BR <span style={{ color: '#8aaa90' }}>5_MO-15_01.jpg → MO-15.jpg</span> · Ingá <span style={{ color: '#8aaa90' }}>17619_baixa.jpg → 17619.jpg</span>. As fotos não saem do seu navegador.
      </div>

      {/* 1. Upload */}
      <div style={S.section}>
        <label style={S.label}>1. Fotos da fábrica</label>
        <div
          style={S.dropzone(dragging)}
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => fileRef.current?.click()}
        >
          <div style={S.dropText}>Arraste e solte as fotos aqui</div>
          <div style={S.dropSub}>ou clique para selecionar — .jpg, .png, .webp (várias de uma vez)</div>
          {files.length > 0 && <div style={S.fileName}>{files.length} foto{files.length === 1 ? '' : 's'} carregada{files.length === 1 ? '' : 's'}</div>}
        </div>
        <input
          ref={fileRef} type="file" accept="image/*,.jpg,.jpeg,.png,.gif,.webp" multiple
          style={{ display: 'none' }}
          onChange={e => { if (e.target.files?.length) addFiles(e.target.files); e.target.value = ''; }}
        />
        {files.length > 0 && (
          <div style={{ marginTop: 8 }}>
            <button style={S.btnGhost(false)} onClick={() => { setFiles([]); setAiState('idle'); }}>Limpar lista</button>
          </div>
        )}
      </div>

      {files.length > 0 && (
        <>
          {/* 2. Regra */}
          <div style={S.section}>
            <label style={S.label}>2. Regra de extração do código</label>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' as const, marginBottom: 14 }}>
              <button style={S.modeBtn(ruleSource === 'ia')} disabled={aiState === 'running'} onClick={runAi}>
                {aiState === 'running' ? 'IA analisando nomes…' : 'IA sugerir regra'}
              </button>
              <select style={S.select} value={presetSel} onChange={e => selectPreset(e.target.value)}>
                <option value="">Preset da fábrica…</option>
                {Object.keys(presets).sort().map(name => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 12, color: '#4a6050' }}>Manual: separador</span>
                <input style={{ ...S.input, width: 44, textAlign: 'center' as const }} value={manSep} maxLength={3} onChange={e => setManSep(e.target.value)} />
                <span style={{ fontSize: 12, color: '#4a6050' }}>trecho nº</span>
                <input style={{ ...S.input, width: 52 }} type="number" min={1} value={manIdx + 1} onChange={e => setManIdx(Math.max(0, (parseInt(e.target.value) || 1) - 1))} />
                <button style={S.btnGhost(!manSep)} disabled={!manSep} onClick={applyManual}>Aplicar</button>
              </div>
            </div>

            {aiState === 'error' && (
              <div style={S.notice('err')}>A IA não conseguiu deduzir a regra — use um preset ou a regra manual.</div>
            )}
            {rule && (
              <div style={S.notice(failCount === 0 ? 'ok' : 'warn')}>
                Regra ativa{ruleSource === 'ia' ? ' (sugerida pela IA)' : ruleSource === 'preset' ? ` (preset ${presetSel})` : ' (manual)'}: {describeRule(rule)}.
                {aiState === 'done' && aiNotes ? ` ${aiNotes}` : ''}
                {' '}Resultado: {okCount} ok{dupCount > 0 ? `, ${dupCount} código repetido (fica _2, _3…)` : ''}{failCount > 0 ? `, ${failCount} sem código — confira abaixo` : ''}.
              </div>
            )}

            {/* Salvar preset */}
            {rule && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input
                  style={{ ...S.input, width: 200 }} placeholder="Nome da fábrica (ex.: BR)"
                  value={presetName} onChange={e => setPresetName(e.target.value)}
                />
                <button style={S.btnGhost(!presetName.trim())} disabled={!presetName.trim()} onClick={savePreset}>
                  Salvar como preset
                </button>
                {presetMsg && <span style={{ fontSize: 12, color: presetMsg.startsWith('Erro') ? '#f87171' : '#4de08c' }}>{presetMsg}</span>}
              </div>
            )}
          </div>

          {/* 3. Prévia */}
          {rule && results.length > 0 && (
            <div style={S.section}>
              <label style={S.label}>3. Prévia antes → depois</label>
              <div style={S.tableWrap}>
                <table style={S.table}>
                  <thead>
                    <tr>
                      <th style={S.th}>Arquivo original</th>
                      <th style={S.th}>Novo nome</th>
                      <th style={S.th}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((r, i) => (
                      <tr key={i}>
                        <td style={S.td}>{r.original}</td>
                        <td style={{ ...S.td, color: r.newName ? '#e8f0e8' : '#f87171', fontWeight: r.newName ? 600 : 400 }}>
                          {r.newName || 'código não encontrado — não entra no zip'}
                        </td>
                        <td style={S.td}>
                          <span style={S.status(r.status)}>
                            {r.status === 'ok' ? 'OK' : r.status === 'dup' ? 'REPETIDO' : 'FALHOU'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {dupCount > 0 && (
                <div style={S.info}>
                  Códigos repetidos ganham sufixo _2, _3… — confirme no Mercos o padrão aceito para múltiplas fotos do mesmo produto.
                </div>
              )}
            </div>
          )}

          {/* 4. Download */}
          {rule && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <button
                style={S.btn(zipping || okCount + dupCount === 0)}
                disabled={zipping || okCount + dupCount === 0}
                onClick={downloadZip}
              >
                {zipping ? 'Compactando…' : `Baixar ${okCount + dupCount} foto${okCount + dupCount === 1 ? '' : 's'} renomeada${okCount + dupCount === 1 ? '' : 's'} (.zip)`}
              </button>
              {failCount > 0 && (
                <span style={{ fontSize: 12, color: '#fcd34d' }}>{failCount} arquivo{failCount === 1 ? '' : 's'} sem código ficará{failCount === 1 ? '' : 'ão'} de fora</span>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
