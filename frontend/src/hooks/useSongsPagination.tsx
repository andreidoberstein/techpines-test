import { useEffect, useState } from "react";
import { PaginatedSongs } from '@/types';


const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080/api";

export function useSongsPagination(initialPage = 1, perPage = 10) {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [songsData, setSongsData] = useState<PaginatedSongs | null>(null);
  const [loadingSongs, setLoadingSongs] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchPage(page: number) {
    setLoadingSongs(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/songs?per_page=${perPage}&page=${page}`, {
        headers: { "Accept": "application/json" },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = (await res.json()) as PaginatedSongs;
      setSongsData(json);
      // Se a página solicitada passou do last_page (ex: filtro mudou), volta pra 1
      if (json.last_page > 0 && page > json.last_page) {
        setCurrentPage(1);
      }
    } catch (e) {
      setError(e?.message ?? "Erro ao carregar músicas");
    } finally {
      setLoadingSongs(false);
    }
  }

  useEffect(() => { fetchPage(currentPage); }, [currentPage, perPage]);

  const nextPage = () => {
    if (songsData && currentPage < songsData.last_page) {
      setCurrentPage((p) => p + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((p) => p - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goToPage = (page: number) => {
    if (page >= 1 && (!songsData || page <= songsData.last_page)) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return { songsData, loadingSongs, error, currentPage, nextPage, prevPage, goToPage };
}
