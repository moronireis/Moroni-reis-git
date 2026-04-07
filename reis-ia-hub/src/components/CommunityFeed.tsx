import React, { useState } from 'react';

interface Space {
  id: string;
  name: string;
  description: string;
  slug: string;
  icon: string;
  sort_order: number;
  admin_only: boolean;
}

interface Author {
  id: string;
  full_name: string;
  role: string;
}

interface Post {
  id: string;
  space_id: string;
  author_id: string;
  author: Author;
  title: string | null;
  content: string;
  pinned: boolean;
  likes_count: number;
  comments_count: number;
  created_at: string;
}

interface Comment {
  id: string;
  post_id: string;
  author_id: string;
  author: Author;
  content: string;
  parent_id: string | null;
  created_at: string;
}

interface CommunityFeedProps {
  spaces: Space[];
  initialPosts: Post[];
  initialSpace: string;
  currentUserId: string;
  isAdmin: boolean;
  userRole?: string;
}

function getInitials(name: string): string {
  if (!name) return 'U';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function relativeTime(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 60) return 'agora';
  if (diff < 3600) return `${Math.floor(diff / 60)}min`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d`;
  if (diff < 2592000) return `${Math.floor(diff / 604800)}sem`;
  return `${Math.floor(diff / 2592000)}mes`;
}

// SVG Icons — no emojis
function HeartIcon({ filled }: { filled?: boolean }) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function MessageIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z" />
    </svg>
  );
}

const SPACE_LABELS: Record<string, string> = {
  geral: '#',
  journeys: '#',
  builders: '#',
  mentorados: '#',
  start: '#',
  anuncios: '#',
};

function SpaceIcon({ slug }: { slug: string }): React.ReactElement {
  return (
    <span style={{ fontSize: '13px', fontWeight: 700, opacity: 0.5 }}>
      {SPACE_LABELS[slug] || '#'}
    </span>
  );
}

function LockIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4h6v2" />
    </svg>
  );
}

function ReplyIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 17 4 12 9 7" />
      <path d="M20 18v-2a4 4 0 0 0-4-4H4" />
    </svg>
  );
}

// Space groups definition for sidebar labels
// Admin-only spaces (admin_only === true) go under "OFICIAL"
// Everything else goes under "COMUNIDADE"

function PostCard({
  post,
  currentUserId,
  isAdmin,
  onDelete,
  isStarterMode,
}: {
  post: Post;
  currentUserId: string;
  isAdmin: boolean;
  onDelete: (id: string) => void;
  isStarterMode?: boolean;
}) {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes_count ?? 0);
  const [expanded, setExpanded] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [commentsCount, setCommentsCount] = useState(post.comments_count ?? 0);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);
  const [contentExpanded, setContentExpanded] = useState(false);

  const canDelete = isAdmin || post.author_id === currentUserId;
  const isAuthorAdmin = post.author?.role === 'admin';
  const initials = getInitials(post.author?.full_name || 'U');

  // Truncate long content
  const MAX_CONTENT_LINES = 4;
  const contentLines = post.content.split('\n').length;
  const needsTruncation = post.content.length > 280 || contentLines > MAX_CONTENT_LINES;
  const displayContent = !contentExpanded && needsTruncation
    ? post.content.slice(0, 280).trimEnd() + '...'
    : post.content;

  const handleLike = async () => {
    const prevLiked = liked;
    const prevCount = likesCount;
    setLiked(!liked);
    setLikesCount(prev => liked ? Math.max(0, prev - 1) : prev + 1);
    try {
      const res = await fetch(`/api/posts/${post.id}/like`, { method: 'POST' });
      if (!res.ok) {
        setLiked(prevLiked);
        setLikesCount(prevCount);
      }
    } catch {
      setLiked(prevLiked);
      setLikesCount(prevCount);
    }
  };

  const handleExpandComments = async () => {
    if (!expanded && comments.length === 0) {
      setLoadingComments(true);
      try {
        const res = await fetch(`/api/posts/${post.id}/comments`);
        if (res.ok) {
          const data = await res.json();
          setComments(data);
        }
      } catch { /* noop */ }
      finally { setLoadingComments(false); }
    }
    setExpanded(!expanded);
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;
    setSubmittingComment(true);
    try {
      const res = await fetch(`/api/posts/${post.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newComment.trim() }),
      });
      if (res.ok) {
        const created = await res.json();
        setComments(prev => [...prev, created]);
        setCommentsCount(prev => prev + 1);
        setNewComment('');
      }
    } catch { /* noop */ }
    finally { setSubmittingComment(false); }
  };

  const handleSubmitReply = async (parentId: string) => {
    if (!replyContent.trim()) return;
    setSubmittingReply(true);
    try {
      const res = await fetch(`/api/posts/${post.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: replyContent.trim(), parent_id: parentId }),
      });
      if (res.ok) {
        const created = await res.json();
        setComments(prev => [...prev, created]);
        setCommentsCount(prev => prev + 1);
        setReplyContent('');
        setReplyingTo(null);
      }
    } catch { /* noop */ }
    finally { setSubmittingReply(false); }
  };

  const topLevelComments = comments.filter(c => !c.parent_id);
  const getReplies = (parentId: string) => comments.filter(c => c.parent_id === parentId);

  return (
    <div style={{
      borderRadius: '10px',
      background: '#111111',
      border: '1px solid rgba(255,255,255,0.06)',
      overflow: 'hidden',
    }}>
      {/* Pinned indicator */}
      {post.pinned && (
        <div style={{
          padding: '6px 16px',
          background: 'rgba(74,144,255,0.04)',
          borderBottom: '1px solid rgba(74,144,255,0.08)',
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          fontSize: '11px',
          color: 'rgba(74,144,255,0.7)',
          fontWeight: 500,
        }}>
          <PinIcon />
          <span>Fixado</span>
        </div>
      )}

      {/* Post header */}
      <div style={{ padding: '16px 16px 0' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Avatar */}
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '9999px',
              background: isAuthorAdmin ? 'rgba(74,144,255,0.15)' : 'rgba(255,255,255,0.07)',
              color: isAuthorAdmin ? '#4A90FF' : 'rgba(255,255,255,0.6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: 600,
              flexShrink: 0,
            }}>
              {initials}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '13px', fontWeight: 500, color: '#fff' }}>
                  {post.author?.full_name || 'Usuario'}
                </span>
                {isAuthorAdmin && (
                  <span style={{
                    fontSize: '10px',
                    fontWeight: 500,
                    padding: '1px 6px',
                    borderRadius: '9999px',
                    background: 'rgba(74,144,255,0.12)',
                    color: '#4A90FF',
                    letterSpacing: '0.04em',
                  }}>
                    Admin
                  </span>
                )}
              </div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>
                {relativeTime(post.created_at)}
              </div>
            </div>
          </div>

          {/* Delete button */}
          {canDelete && (
            <button
              onClick={() => onDelete(post.id)}
              style={{
                background: 'none',
                border: 'none',
                color: 'rgba(239,68,68,0.25)',
                cursor: 'pointer',
                padding: '4px',
                borderRadius: '4px',
                transition: 'color 150ms',
              }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#EF4444'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(239,68,68,0.25)'}
            >
              <TrashIcon />
            </button>
          )}
        </div>

        {/* Post title */}
        {post.title && (
          <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#fff', marginBottom: '6px', lineHeight: 1.3 }}>
            {post.title}
          </h3>
        )}

        {/* Post content — with clickable links and line breaks */}
        <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.62)', lineHeight: 1.65, marginBottom: needsTruncation ? '6px' : '14px', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
          {displayContent.split(/(https?:\/\/[^\s]+)/g).map((part, i) =>
            /^https?:\/\//.test(part)
              ? <a key={i} href={part} target="_blank" rel="noopener noreferrer" style={{ color: '#4A90FF', textDecoration: 'underline', wordBreak: 'break-all' }}>{part}</a>
              : <span key={i}>{part}</span>
          )}
        </div>
        {needsTruncation && (
          <button
            onClick={() => setContentExpanded(!contentExpanded)}
            style={{
              background: 'none',
              border: 'none',
              color: '#4A90FF',
              cursor: 'pointer',
              fontSize: '13px',
              padding: '0 0 12px',
              fontWeight: 400,
            }}
          >
            {contentExpanded ? 'ver menos' : 'ver mais'}
          </button>
        )}
      </div>

      {/* Post footer: reactions + comment toggle */}
      <div style={{
        padding: '10px 16px',
        borderTop: '1px solid rgba(255,255,255,0.04)',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
      }}>
        {isStarterMode ? (
          /* Starter: show counts only, no interaction */
          <>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.2)', fontSize: '13px' }}>
              <HeartIcon filled={false} />
              <span>{likesCount}</span>
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.2)', fontSize: '13px' }}>
              <MessageIcon />
              <span>{commentsCount}</span>
            </span>
          </>
        ) : (
          <>
            {/* Heart / like */}
            <button
              onClick={handleLike}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'none',
                border: 'none',
                color: liked ? '#4A90FF' : 'rgba(255,255,255,0.3)',
                cursor: 'pointer',
                fontSize: '13px',
                padding: '4px 0',
                transition: 'color 150ms',
              }}
              onMouseEnter={e => { if (!liked) (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.55)'; }}
              onMouseLeave={e => { if (!liked) (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.3)'; }}
            >
              <HeartIcon filled={liked} />
              <span>{likesCount}</span>
            </button>

            {/* Comments toggle */}
            <button
              onClick={handleExpandComments}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'none',
                border: 'none',
                color: expanded ? '#4A90FF' : 'rgba(255,255,255,0.3)',
                cursor: 'pointer',
                fontSize: '13px',
                padding: '4px 0',
                transition: 'color 150ms',
              }}
              onMouseEnter={e => { if (!expanded) (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.55)'; }}
              onMouseLeave={e => { if (!expanded) (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.3)'; }}
            >
              <MessageIcon />
              <span>{commentsCount}</span>
            </button>

            <button
              onClick={handleExpandComments}
              style={{
                marginLeft: 'auto',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                background: 'none',
                border: 'none',
                color: 'rgba(255,255,255,0.35)',
                cursor: 'pointer',
                fontSize: '13px',
                padding: '4px 0',
                transition: 'color 150ms',
              }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.6)'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.35)'}
            >
              <ReplyIcon />
              <span>Responder</span>
            </button>
          </>
        )}
      </div>

      {/* Expanded comments section — hidden for starters */}
      {expanded && !isStarterMode && (
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.04)',
          background: '#0D0D0D',
          padding: '16px',
        }}>
          {/* Comment loading state */}
          {loadingComments ? (
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.25)', textAlign: 'center', padding: '12px 0' }}>
              Carregando comentários...
            </div>
          ) : (
            <div style={{ marginBottom: '14px' }}>
              {topLevelComments.length === 0 ? (
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.2)', textAlign: 'center', padding: '8px 0' }}>
                  Nenhum comentário ainda.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {topLevelComments.map(comment => {
                    const commentReplies = getReplies(comment.id);
                    const commentInitials = getInitials(comment.author?.full_name || 'U');
                    const isCommentAdmin = comment.author?.role === 'admin';

                    return (
                      <div key={comment.id}>
                        {/* Top-level comment */}
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <div style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '9999px',
                            background: isCommentAdmin ? 'rgba(74,144,255,0.12)' : 'rgba(255,255,255,0.06)',
                            color: isCommentAdmin ? '#4A90FF' : 'rgba(255,255,255,0.5)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '10px',
                            fontWeight: 600,
                            flexShrink: 0,
                          }}>
                            {commentInitials}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
                              <span style={{ fontSize: '12px', fontWeight: 500, color: 'rgba(255,255,255,0.8)' }}>
                                {comment.author?.full_name || 'Usuario'}
                              </span>
                              {isCommentAdmin && (
                                <span style={{
                                  fontSize: '9px',
                                  fontWeight: 500,
                                  padding: '1px 5px',
                                  borderRadius: '9999px',
                                  background: 'rgba(74,144,255,0.1)',
                                  color: '#4A90FF',
                                }}>
                                  Admin
                                </span>
                              )}
                              <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.2)' }}>
                                {relativeTime(comment.created_at)}
                              </span>
                            </div>
                            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.55, margin: '0 0 6px', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                              {comment.content.split(/(https?:\/\/[^\s]+)/g).map((part: string, ci: number) =>
                                /^https?:\/\//.test(part)
                                  ? <a key={ci} href={part} target="_blank" rel="noopener noreferrer" style={{ color: '#4A90FF', textDecoration: 'underline' }}>{part}</a>
                                  : <span key={ci}>{part}</span>
                              )}
                            </div>
                            <button
                              onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                background: 'none',
                                border: 'none',
                                color: 'rgba(255,255,255,0.25)',
                                cursor: 'pointer',
                                fontSize: '11px',
                                padding: 0,
                                transition: 'color 150ms',
                              }}
                              onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.5)'}
                              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.25)'}
                            >
                              <ReplyIcon />
                              Responder
                            </button>

                            {/* Reply input */}
                            {replyingTo === comment.id && (
                              <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
                                <input
                                  placeholder="Escreva uma resposta..."
                                  value={replyContent}
                                  onChange={e => setReplyContent(e.target.value)}
                                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSubmitReply(comment.id)}
                                  autoFocus
                                  style={{
                                    flex: 1,
                                    padding: '7px 10px',
                                    borderRadius: '7px',
                                    background: '#111111',
                                    border: '1px solid rgba(255,255,255,0.08)',
                                    color: '#fff',
                                    fontSize: '12px',
                                    outline: 'none',
                                  }}
                                />
                                <button
                                  onClick={() => handleSubmitReply(comment.id)}
                                  disabled={submittingReply || !replyContent.trim()}
                                  style={{
                                    padding: '7px 12px',
                                    borderRadius: '7px',
                                    background: '#4A90FF',
                                    color: '#fff',
                                    fontSize: '12px',
                                    border: 'none',
                                    cursor: submittingReply || !replyContent.trim() ? 'not-allowed' : 'pointer',
                                    opacity: submittingReply || !replyContent.trim() ? 0.5 : 1,
                                  }}
                                >
                                  Enviar
                                </button>
                              </div>
                            )}

                            {/* Nested replies */}
                            {commentReplies.length > 0 && (
                              <div style={{ marginTop: '10px', paddingLeft: '14px', borderLeft: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {commentReplies.map(reply => (
                                  <div key={reply.id} style={{ display: 'flex', gap: '8px' }}>
                                    <div style={{
                                      width: '24px',
                                      height: '24px',
                                      borderRadius: '9999px',
                                      background: reply.author?.role === 'admin' ? 'rgba(74,144,255,0.1)' : 'rgba(255,255,255,0.05)',
                                      color: reply.author?.role === 'admin' ? '#4A90FF' : 'rgba(255,255,255,0.4)',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      fontSize: '9px',
                                      fontWeight: 600,
                                      flexShrink: 0,
                                    }}>
                                      {getInitials(reply.author?.full_name || 'U')}
                                    </div>
                                    <div>
                                      <div style={{ display: 'flex', gap: '5px', alignItems: 'center', marginBottom: '2px' }}>
                                        <span style={{ fontSize: '11px', fontWeight: 500, color: 'rgba(255,255,255,0.7)' }}>
                                          {reply.author?.full_name || 'Usuario'}
                                        </span>
                                        <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.2)' }}>
                                          {relativeTime(reply.created_at)}
                                        </span>
                                      </div>
                                      <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.5, margin: 0 }}>
                                        {reply.content}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* New comment input */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              placeholder="Escreva um comentário..."
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSubmitComment()}
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: '8px',
                background: '#161616',
                border: '1px solid rgba(255,255,255,0.07)',
                color: '#fff',
                fontSize: '13px',
                outline: 'none',
              }}
              onFocus={e => (e.target as HTMLElement).style.borderColor = 'rgba(74,144,255,0.25)'}
              onBlur={e => (e.target as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)'}
            />
            <button
              onClick={handleSubmitComment}
              disabled={submittingComment || !newComment.trim()}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                background: '#4A90FF',
                color: '#fff',
                fontSize: '13px',
                border: 'none',
                cursor: submittingComment || !newComment.trim() ? 'not-allowed' : 'pointer',
                opacity: submittingComment || !newComment.trim() ? 0.5 : 1,
                fontWeight: 500,
              }}
            >
              Enviar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CommunityFeed({
  spaces,
  initialPosts,
  initialSpace,
  currentUserId,
  isAdmin,
  userRole = 'starter',
}: CommunityFeedProps) {
  const [activeSpaceId, setActiveSpaceId] = useState(
    spaces.find(s => s.slug === initialSpace)?.id || spaces[0]?.id || ''
  );
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [showNewPost, setShowNewPost] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [submittingPost, setSubmittingPost] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activeSpace = spaces.find(s => s.id === activeSpaceId);

  // Separate spaces into community and oficial groups
  const communitySpaces = spaces.filter(s => !s.admin_only);
  const oficialSpaces = spaces.filter(s => s.admin_only);

  const handleSpaceChange = async (spaceId: string) => {
    setActiveSpaceId(spaceId);
    setLoadingPosts(true);
    setPosts([]);
    try {
      const res = await fetch(`/api/posts?space_id=${spaceId}`);
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } catch { /* noop */ }
    finally { setLoadingPosts(false); }
  };

  const handleCreatePost = async () => {
    if (!newPostContent.trim() || !activeSpaceId) return;
    if (activeSpace?.admin_only && !isAdmin) return;

    setSubmittingPost(true);
    setError(null);
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          space_id: activeSpaceId,
          title: newPostTitle.trim() || null,
          content: newPostContent.trim(),
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        setError(err.error || 'Erro ao publicar');
        return;
      }

      const created = await res.json();
      setPosts(prev => [created, ...prev]);
      setNewPostTitle('');
      setNewPostContent('');
      setShowNewPost(false);
    } catch {
      setError('Erro de conexao');
    } finally {
      setSubmittingPost(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm('Excluir esta publicação?')) return;
    try {
      const res = await fetch(`/api/posts/${postId}`, { method: 'DELETE' });
      if (res.ok) {
        setPosts(prev => prev.filter(p => p.id !== postId));
      }
    } catch {
      setError('Erro ao excluir publicação');
    }
  };

  const isStarterMode = userRole === 'starter';
  const isJourneyMode = userRole === 'journey';

  // Space access rules by role
  function canAccessSpace(slug: string): boolean {
    if (isAdmin) return true;
    if (isJourneyMode) return ['geral', 'journeys'].includes(slug);
    if (userRole === 'builder') return ['geral', 'journeys', 'builders'].includes(slug);
    if (userRole === 'mentoria') return ['geral', 'journeys', 'builders', 'mentorados'].includes(slug);
    return slug === 'geral';
  }

  // Can the user post in the current space?
  const isAnuncios = activeSpace?.slug === 'anuncios';
  const hasSpaceAccess = canAccessSpace(activeSpace?.slug || '');
  const canPost = isAdmin
    ? true
    : isStarterMode
      ? false
      : hasSpaceAccess && !isAnuncios && !activeSpace?.admin_only;

  // Pinned posts first
  const sortedPosts = [...posts].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return 0;
  });

  // Starter: only show first 3 posts
  const STARTER_POST_LIMIT = 3;
  const visiblePosts = isStarterMode ? sortedPosts.slice(0, STARTER_POST_LIMIT) : sortedPosts;
  const hasMoreForStarter = isStarterMode && sortedPosts.length > STARTER_POST_LIMIT;

  function SpaceButton({ space }: { space: Space }) {
    const isActive = space.id === activeSpaceId;
    const accessible = canAccessSpace(space.slug);
    const locked = !accessible && !isAdmin;

    return (
      <button
        onClick={() => !locked && handleSpaceChange(space.id)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 12px',
          background: isActive ? 'rgba(74,144,255,0.07)' : 'transparent',
          border: 'none',
          borderRadius: '6px',
          color: locked ? 'rgba(255,255,255,0.20)' : isActive ? '#4A90FF' : 'rgba(255,255,255,0.5)',
          cursor: locked ? 'default' : 'pointer',
          fontSize: '13px',
          textAlign: 'left',
          transition: 'background 150ms, color 150ms',
          fontWeight: isActive ? 500 : 400,
          opacity: locked ? 0.5 : 1,
        }}
        onMouseEnter={e => { if (!isActive && !locked) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)'; }}
        onMouseLeave={e => { if (!isActive && !locked) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
      >
        <span style={{ color: locked ? 'rgba(255,255,255,0.15)' : isActive ? '#4A90FF' : 'rgba(255,255,255,0.3)', flexShrink: 0 }}>
          <SpaceIcon slug={space.slug} />
        </span>
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {space.name || space.slug}
        </span>
        {locked && (
          <span style={{ marginLeft: 'auto', color: 'rgba(255,255,255,0.15)', flexShrink: 0 }}>
            <LockIcon />
          </span>
        )}
      </button>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '24px', alignItems: 'start' }}>
      {/* Spaces sidebar */}
      <div style={{
        borderRadius: '12px',
        background: '#0A0A0A',
        border: '1px solid rgba(255,255,255,0.05)',
        overflow: 'hidden',
        position: 'sticky',
        top: '80px',
      }}>
        {/* Community spaces */}
        {communitySpaces.length > 0 && (
          <div style={{ padding: '12px 8px 8px' }}>
            <div style={{
              fontSize: '10px',
              fontWeight: 700,
              color: 'rgba(255,255,255,0.25)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              padding: '0 8px',
              marginBottom: '6px',
            }}>
              Comunidade
            </div>
            {communitySpaces.map(space => (
              <SpaceButton key={space.id} space={space} />
            ))}
          </div>
        )}

        {/* Oficial spaces */}
        {oficialSpaces.length > 0 && (
          <div style={{ padding: '8px 8px 12px', borderTop: communitySpaces.length > 0 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
            <div style={{
              fontSize: '10px',
              fontWeight: 700,
              color: 'rgba(255,255,255,0.25)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              padding: '4px 8px 6px',
            }}>
              Oficial
            </div>
            {oficialSpaces.map(space => (
              <SpaceButton key={space.id} space={space} />
            ))}
          </div>
        )}

        {/* No spaces fallback */}
        {communitySpaces.length === 0 && oficialSpaces.length === 0 && (
          <div style={{ padding: '16px', fontSize: '13px', color: 'rgba(255,255,255,0.25)', textAlign: 'center' }}>
            Sem espacos
          </div>
        )}

        {/* Online indicator */}
        <div style={{
          padding: '10px 16px',
          borderTop: '1px solid rgba(255,255,255,0.04)',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}>
          <div style={{
            width: '7px',
            height: '7px',
            borderRadius: '9999px',
            background: '#22C55E',
            boxShadow: '0 0 6px rgba(34,197,94,0.5)',
          }} />
          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>
            Online agora
          </span>
        </div>
      </div>

      {/* Feed column */}
      <div>
        {/* Space header */}
        {activeSpace && (
          <div style={{
            borderRadius: '10px',
            background: '#111111',
            border: '1px solid rgba(255,255,255,0.06)',
            padding: '16px 20px',
            marginBottom: '16px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{ color: 'rgba(255,255,255,0.35)' }}>
                <HashIcon />
              </span>
              <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#fff', margin: 0 }}>
                {activeSpace.name || activeSpace.slug}
              </h2>
            </div>
            {activeSpace.description && (
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', margin: 0, paddingLeft: '21px' }}>
                {activeSpace.description}
              </p>
            )}
          </div>
        )}

        {error && (
          <div style={{
            marginBottom: '14px',
            padding: '12px 16px',
            borderRadius: '8px',
            background: 'rgba(239,68,68,0.08)',
            border: '1px solid rgba(239,68,68,0.2)',
            color: '#EF4444',
            fontSize: '13px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <span>{error}</span>
            <button onClick={() => setError(null)} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: '16px', lineHeight: 1 }}>
              ×
            </button>
          </div>
        )}

        {/* New post input — compact collapsed state */}
        {canPost && (
          <div style={{ marginBottom: '16px' }}>
            {!showNewPost ? (
              <button
                onClick={() => setShowNewPost(true)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  background: '#111111',
                  border: '1px solid rgba(255,255,255,0.06)',
                  color: 'rgba(255,255,255,0.22)',
                  fontSize: '14px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'border-color 150ms',
                }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.11)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.06)'}
              >
                Escreva algo para #{activeSpace?.slug || 'geral'}...
              </button>
            ) : (
              <div style={{
                padding: '16px',
                borderRadius: '10px',
                background: '#111111',
                border: '1px solid rgba(255,255,255,0.08)',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}>
                <input
                  placeholder="Titulo (opcional)"
                  value={newPostTitle}
                  onChange={e => setNewPostTitle(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    background: '#161616',
                    border: '1px solid rgba(255,255,255,0.07)',
                    color: '#fff',
                    fontSize: '14px',
                    fontWeight: 500,
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
                <textarea
                  placeholder={`Escreva para #${activeSpace?.slug || 'geral'}...`}
                  value={newPostContent}
                  onChange={e => setNewPostContent(e.target.value)}
                  autoFocus
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    background: '#161616',
                    border: '1px solid rgba(255,255,255,0.07)',
                    color: '#fff',
                    fontSize: '14px',
                    outline: 'none',
                    resize: 'vertical',
                    minHeight: '100px',
                    boxSizing: 'border-box',
                    lineHeight: 1.6,
                    fontFamily: 'inherit',
                  }}
                />
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => { setShowNewPost(false); setNewPostTitle(''); setNewPostContent(''); }}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      background: 'transparent',
                      color: 'rgba(255,255,255,0.4)',
                      fontSize: '13px',
                      border: '1px solid rgba(255,255,255,0.07)',
                      cursor: 'pointer',
                    }}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleCreatePost}
                    disabled={submittingPost || !newPostContent.trim()}
                    style={{
                      padding: '8px 20px',
                      borderRadius: '8px',
                      background: '#4A90FF',
                      color: '#fff',
                      fontSize: '13px',
                      fontWeight: 500,
                      border: 'none',
                      cursor: submittingPost || !newPostContent.trim() ? 'not-allowed' : 'pointer',
                      opacity: submittingPost || !newPostContent.trim() ? 0.5 : 1,
                    }}
                  >
                    {submittingPost ? 'Publicando...' : 'Publicar'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Feed */}
        {loadingPosts ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'rgba(255,255,255,0.2)', fontSize: '14px' }}>
            Carregando publicacoes...
          </div>
        ) : sortedPosts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.28)', marginBottom: '8px' }}>
              Nenhuma publicação em #{activeSpace?.slug || 'geral'} ainda.
            </p>
            {canPost && (
              <button
                onClick={() => setShowNewPost(true)}
                style={{ fontSize: '13px', color: '#4A90FF', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                Seja o primeiro a publicar
              </button>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {visiblePosts.map(post => (
              <PostCard
                key={post.id}
                post={post}
                currentUserId={currentUserId}
                isAdmin={isAdmin}
                onDelete={handleDeletePost}
                isStarterMode={isStarterMode}
              />
            ))}

            {/* Starter upgrade CTA */}
            {hasMoreForStarter && (
              <div style={{
                borderRadius: '10px',
                background: 'rgba(74,144,255,0.04)',
                border: '1px solid rgba(74,144,255,0.15)',
                padding: '32px 24px',
                textAlign: 'center',
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: 'rgba(74,144,255,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4A90FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#fff', marginBottom: '8px' }}>
                  Faca parte da comunidade
                </h3>
                <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.45)', maxWidth: '380px', margin: '0 auto 20px', lineHeight: 1.6 }}>
                  Acesse todas as discussões, poste suas dúvidas e conecte com outros membros.
                </p>
                <a
                  href="/agendar"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '11px 24px',
                    borderRadius: '8px',
                    background: '#4A90FF',
                    color: '#fff',
                    fontSize: '14px',
                    fontWeight: 500,
                    textDecoration: 'none',
                  }}
                >
                  Fazer upgrade para Builder
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
