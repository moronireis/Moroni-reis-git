import { useState, type FormEvent } from 'react';

interface Props {
  defaultEmail?: string;
}

export default function CreateAccountForm({ defaultEmail }: Props) {
  const [email, setEmail] = useState(defaultEmail || '');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'form' | 'success'>('form');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Step 1: Create account via API (verifies purchase + creates user)
      const res = await fetch('/api/auth/create-from-purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), name: name.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.code === 'ACCOUNT_EXISTS') {
          setError('Já existe uma conta com este email. Redirecionando para login...');
          setTimeout(() => { window.location.href = '/login'; }, 2000);
          return;
        }
        setError(data.error || 'Erro ao criar conta.');
        return;
      }

      // Step 2: Sign in via server-side endpoint (sets httpOnly cookies)
      const loginRes = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      });

      if (!loginRes.ok) {
        // Account created but login failed — send to login page
        setStep('success');
        setTimeout(() => { window.location.href = '/login'; }, 3000);
        return;
      }

      // Step 3: Redirect to dashboard
      setStep('success');
      setTimeout(() => { window.location.href = '/dashboard'; }, 1500);

    } catch (err) {
      setError('Erro de conexão. Verifique sua internet e tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  if (step === 'success') {
    return (
      <div className="rounded-xl p-8 text-center" style={{ background: 'var(--surface-1)', border: '1px solid var(--border-subtle)' }}>
        <div className="mb-4">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="mx-auto">
            <circle cx="24" cy="24" r="24" fill="rgba(34, 197, 94, 0.12)" />
            <path d="M16 24l6 6 10-12" stroke="#22C55E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h3 className="text-lg font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
          Conta criada com sucesso!
        </h3>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Redirecionando para o painel...
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl p-8" style={{ background: 'var(--surface-1)', border: '1px solid var(--border-subtle)' }}>
      <h2 className="text-xl font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
        Crie sua conta
      </h2>
      <p className="text-sm mb-6" style={{ color: 'var(--text-tertiary)' }}>
        Use o mesmo email da sua compra para ativar o acesso.
      </p>

      {error && (
        <div
          className="mb-4 p-3 rounded-lg text-sm"
          style={{
            background: error.includes('Redirecionando') ? 'var(--color-warning-bg)' : 'var(--color-error-bg)',
            color: error.includes('Redirecionando') ? 'var(--color-warning)' : 'var(--color-error)',
            border: error.includes('Redirecionando')
              ? '1px solid rgba(245, 158, 11, 0.25)'
              : '1px solid rgba(239, 68, 68, 0.25)',
          }}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Email da compra
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all input-field"
            style={{
              background: 'var(--surface-2)',
              border: '1px solid var(--border-default)',
              color: 'var(--text-primary)',
            }}
            placeholder="seu@email.com"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Nome completo
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all input-field"
            style={{
              background: 'var(--surface-2)',
              border: '1px solid var(--border-default)',
              color: 'var(--text-primary)',
            }}
            placeholder="Seu nome"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Crie uma senha
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all input-field"
            style={{
              background: 'var(--surface-2)',
              border: '1px solid var(--border-default)',
              color: 'var(--text-primary)',
            }}
            placeholder="Mínimo 8 caracteres"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-lg text-sm font-medium transition-all mt-2 submit-btn"
          style={{
            background: loading ? 'var(--accent-blue-muted)' : 'var(--accent-blue)',
            color: '#fff',
            opacity: loading ? 0.7 : 1,
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Criando conta...' : 'Criar conta e acessar'}
        </button>
      </form>

      <p className="text-center mt-6 text-sm" style={{ color: 'var(--text-tertiary)' }}>
        Já tem conta?{' '}
        <a href="/login" style={{ color: 'var(--accent-blue)' }}>
          Entrar
        </a>
      </p>
    </div>
  );
}
