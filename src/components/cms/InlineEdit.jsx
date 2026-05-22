/**
 * InlineEdit Component
 * Inline edit mode for text fields with save/cancel
 */

import { useState } from 'react';
import { Check, X } from 'lucide-react';

export default function InlineEdit({
  value,
  onSave,
  className = 'text-3xl font-bold text-gray-900',
  inputClassName = 'text-3xl font-bold',
  small = false
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (editValue.trim() === value.trim()) {
      setIsEditing(false);
      return;
    }

    try {
      setIsSaving(true);
      await onSave(editValue.trim());
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving:', error);
      alert('Error saving changes');
      setEditValue(value);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') handleCancel();
  };

  if (isEditing) {
    return (
      <div className={small ? 'flex items-center gap-2' : 'flex items-center gap-3 mb-6'}>
        <input
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
          disabled={isSaving}
          className={`
            rounded-2xl border border-[var(--helix-border)] px-3 py-2 text-[var(--helix-navy)] focus:outline-none focus:ring-4 focus:ring-fuchsia-100
            ${inputClassName}
            ${isSaving ? 'opacity-50' : ''}
          `}
        />
        <div className="flex gap-1 flex-shrink-0">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors disabled:opacity-50"
            title="Save"
          >
            <Check size={18} />
          </button>
          <button
            onClick={handleCancel}
            disabled={isSaving}
            className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
            title="Cancel"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={small ? 'flex items-center gap-2 group' : 'flex items-center gap-3 mb-6 group'}>
      <div className={className}>{value}</div>
      <button
        onClick={() => setIsEditing(true)}
        className="rounded-xl p-2 text-[var(--helix-muted)] opacity-0 transition-colors hover:bg-[var(--helix-surface-soft)] hover:text-[var(--helix-purple)] group-hover:opacity-100"
        title="Edit"
      >
        ✏️
      </button>
    </div>
  );
}
