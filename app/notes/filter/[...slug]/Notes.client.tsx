"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@/hooks/useDebounce"; 
import { fetchNotes } from "@/lib/api";
import { NoteList } from "@/components/NoteList/NoteList";
import { SearchBox } from "@/components/SearchBox/SearchBox";
import { Pagination } from "@/components/Pagination/Pagination";
import { Modal } from "@/components/Modal/Modal";

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
        tag: currentTag,
        search: debouncedSearch,
        page: page,
      }),
  });

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setPage(1); 
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const openModal = (id: string) => {
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
      <h1>Notes: {currentTag || "All"}</h1>

      <SearchBox value={searchQuery} onChange={handleSearchChange} />

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          {notes.length > 0 ? (
            <NoteList notes={notes} onNoteClick={openModal} />
          ) : (
            <p>No notes found.</p>
          )}

          {totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}

      {isModalOpen && (
        <Modal onClose={closeModal}>
          <p>Контент модалки для нотатки: {selectedNoteId}</p>
          {/* Тут може бути NoteDetailsClient */}
        </Modal>
      )}
    </div>
  );
}