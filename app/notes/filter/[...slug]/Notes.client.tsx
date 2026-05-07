"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@/hooks/useDebounce";
import { fetchNotes } from "@/lib/api";
import { NoteList } from "@/components/NoteList/NoteList";
import { SearchBox } from "@/components/SearchBox/SearchBox";
import { Pagination } from "@/components/Pagination/Pagination";
import { Modal } from "@/components/Modal/Modal";
import NoteForm from "@/components/NoteForm/NoteForm"; 

interface NotesClientProps {
  currentTag: string;
}

export default function NotesClient({ currentTag }: NotesClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);

  const debouncedSearch = useDebounce(searchQuery, 500);

  const { data, isLoading } = useQuery({
    queryKey: ["notes", currentTag, debouncedSearch, page],
    queryFn: () =>
      fetchNotes({
        tag: currentTag === "all" ? "" : currentTag,
        search: debouncedSearch,
        page: page,
      }),
  });

  const handleOpenCreateModal = () => {
    setSelectedNoteId(null); 
    setIsModalOpen(true);
  };

  const openEditModal = (id: string) => {
    setSelectedNoteId(id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedNoteId(null);
  };

  const notes = data?.notes || [];
  const totalPages = data?.totalPages || 1;

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Notes: {currentTag || "All"}</h1>
        
        <button 
          onClick={handleOpenCreateModal}
          style={{ padding: '10px 20px', cursor: 'pointer' }}
        >
          Add Note
        </button>
      </div>

      <SearchBox value={searchQuery} onChange={(v) => { setSearchQuery(v); setPage(1); }} />

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <NoteList notes={notes} onNoteClick={openEditModal} />
          
          {totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          )}
        </>
      )}

      {isModalOpen && (
        <Modal onClose={closeModal}>
          <NoteForm 
            onClose={closeModal} 
            noteId={selectedNoteId} 
          />
        </Modal>
      )}
    </div>
  );
}