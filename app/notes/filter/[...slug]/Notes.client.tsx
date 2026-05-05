"use client";

import { NoteList } from "@/components/NoteList/NoteList";
import { Note } from "@/types/note"; 

interface NotesClientProps {
  notes: Note[];
  currentTag: string;
}

export default function NotesClient({ notes, currentTag }: NotesClientProps) {
  return (
    <div>
      <h1>Notes: {currentTag || "All"}</h1>
      {notes.length > 0 ? (
        <NoteList notes={notes} />
      ) : (
        <p>No notes found for this tag.</p>
      )}
    </div>
  );
}