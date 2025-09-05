import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export const usePagination = (initialPage: number = 1) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(() => {
    const pageParam = searchParams.get('page');
    return pageParam ? parseInt(pageParam, 10) : initialPage;
  });

  useEffect(() => {
    const pageParam = searchParams.get('page');
    if (pageParam) {
      setCurrentPage(parseInt(pageParam, 10));
    }
  }, [searchParams]);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      newParams.set('page', page.toString());
      return newParams;
    });
  };

  const nextPage = () => goToPage(currentPage + 1);
  const prevPage = () => goToPage(Math.max(1, currentPage - 1));

  return {
    currentPage,
    goToPage,
    nextPage,
    prevPage,
  };
};