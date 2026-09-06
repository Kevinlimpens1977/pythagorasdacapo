/**
 * BlockTypePickerModal
 * Typekiezer voor "+ Blok toevoegen": elk bloktype als kaart met één zin
 * over wanneer je hem gebruikt. De catalogus komt uit lesmateriaalStudio.
 */

import { BookOpen, CheckSquare, FileStack, FileText, Gamepad2, Image, Layers, X } from 'lucide-react';
import { getBlockTypeChoices } from '../../lib/lesmateriaalStudio';

const typeIcons = {
  theory: BookOpen,
  example: Layers,
  question: CheckSquare,
  quiz: CheckSquare,
  toets: FileText,
  media: Image,
  summary: FileText,
  game: Gamepad2,
  slidedeck: FileStack
};

export default function BlockTypePickerModal({ onPick, onClose, busyType = null }) {
  const choices = getBlockTypeChoices();

  return (
    <div
      className="fixed inset-0 z-[900] flex items-center justify-center bg-[var(--helix-navy)]/45 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="max-h-[85vh] w-full max-w-3xl overflow-y-auto rounded-[2rem] border border-[var(--helix-border)] bg-white p-6 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-label="Kies een bloktype"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="helix-eyebrow">Blok toevoegen</p>
            <h2 className="mt-1 font-display text-xl font-extrabold text-[var(--helix-navy)]">
              Wat voor blok wil je toevoegen?
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-2xl border border-[var(--helix-border)] bg-white p-2 text-[var(--helix-navy)] shadow-sm transition hover:bg-[var(--helix-soft-lavender)] hover:text-[var(--helix-purple)]"
            aria-label="Sluiten"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {choices.map((choice) => {
            const Icon = typeIcons[choice.type] || FileText;
            const isBusy = busyType === choice.type;

            return (
              <button
                key={choice.type}
                type="button"
                onClick={() => onPick(choice.type)}
                disabled={busyType !== null}
                className="group helix-action-card flex min-h-[7.5rem] flex-col gap-2 p-4 text-left disabled:cursor-wait disabled:opacity-60"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-[var(--helix-soft-lavender)] text-[var(--helix-purple)] transition group-hover:scale-105 group-hover:bg-white">
                    <Icon size={18} />
                  </span>
                  <span className="font-display text-base font-extrabold text-[var(--helix-navy)]">
                    {isBusy ? 'Maken...' : choice.label}
                  </span>
                </div>
                <span className="text-sm leading-5 text-[var(--helix-muted)]">{choice.description}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
