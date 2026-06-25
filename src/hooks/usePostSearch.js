import { useState, useEffect, useCallback } from "react";
import { postAPI } from "lib/apiService";
import { useSearchParams} from "react-router-dom";

export const usePostSearch = () => {
  const [filters, setFilters] = useState({
    keyword: "",
    minPrice: null,
    maxPrice: null,
    minArea: null,
    maxArea: null,
    province: "",
    commune: "",
    typeId: null,
  });

  const [searchParams, setSearchParams] = useSearchParams();

  const [page, setPage] = useState(() => {
    const pageParam = searchParams.get("page");
    if (pageParam) {
      const parsedPage = parseInt(pageParam, 10) - 1;
      return parsedPage >= 0 ? parsedPage : 0;
    }
    return 0;
  });

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (page === 0) {
      params.delete("page");
    } else {
      params.set("page", (page + 1).toString());
    }
    if (params.toString() !== searchParams.toString()) {
      setSearchParams(params, { replace: true });
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const [size] = useState(10);
  const [sort, setSort] = useState("id,desc");

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const searchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const numericFields = ["minPrice", "maxPrice", "minArea", "maxArea", "typeId"];
      const cleanFilters = Object.entries(filters).reduce((acc, [key, value]) => {
        if (value === null || value === undefined || value === "") return acc;
        if (numericFields.includes(key)) {
          const numVal = Number(value);
          if (!Number.isNaN(numVal)) acc[key] = numVal;
          return acc;
        }
        acc[key] = value;
        return acc;
      }, {});

      const response = await postAPI.search(cleanFilters, page, size, sort);
      const data = response.data || {};

      setPosts(
  (data.content || []).map(p => ({
    ...p,
    type: p.typeId //  FIX CHÍNH XÁC
  }))
);
      setTotalPages(data.totalPages || data.totalPage || 0);
      setTotalElements(
        data.totalItems || data.totalElements || (data.content ? data.content.length : 0)
      );
      
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Có lỗi xảy ra khi tìm kiếm";
      setError(errorMsg);
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  }, [filters, page, size, sort]);

  useEffect(() => {
    searchPosts();
  }, [searchPosts]);

  const updateFilters = useCallback((newFilters) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
    }));
    setPage(0);
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      keyword: "",
      minPrice: null,
      maxPrice: null,
      minArea: null,
      maxArea: null,
      location: "",
      commune: "",
      typeId: null,
    });
    setPage(0);
  }, []);

  return {
    posts,
    loading,
    error,
    totalPages,
    totalElements,
    filters,
    page,
    sort,
    updateFilters,
    resetFilters,
    setSort,
    setPage,
    searchPosts,
  };
};