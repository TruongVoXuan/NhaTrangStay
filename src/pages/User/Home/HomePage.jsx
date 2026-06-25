import "./HomePage.scss";
import HomeFilterHeader from "components/shared/User/Home/HomeFilterHeader/HomeFilterHeader";
import RoomCard from "components/shared/User/Home/RoomCard/RoomCard";
import OptionSection from "components/shared/User/common/OptionSection/OptionSection";
import NewPostSection from "components/shared/User/Post/NewPostSection/NewPostSection";
import SelectionSection from "components/shared/User/common/SelectionSection/SelectionSection";
import ServiceSection from "components/shared/User/common/ServiceSection/ServiceSection";
import Pagination from "components/shared/User/Home/Pagination/Pagination";
import { usePostSearch } from "hooks/usePostSearch";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import HeroLayout from "components/layout/HeroLayout/HeroLayout";

function HomePage() {
  const [searchParams] = useSearchParams();
  const contentRef = useRef(null);
  const [sortMode, setSortMode] = useState("default");
  const {
    posts,
    loading,
    error,
    totalElements,
    totalPages,
    page,
    setPage,
    filters,
    updateFilters,
  } = usePostSearch();

  //  state chứa posts đã có rating + đã sort
  const [sortedPosts, setSortedPosts] = useState([]);

  // ==============================
  // Sync URL
  // ==============================
  useEffect(() => {
    const searchQuery = searchParams.get("search");

    if (searchQuery && searchQuery !== filters.location) {
      updateFilters({ location: searchQuery });
    }
  }, [searchParams]);

  // ==============================
  // FETCH RATING CHO TỪNG POST
  // ==============================
  useEffect(() => {
    const fetchRatings = async () => {
      const updated = await Promise.all(
        posts.map(async (p) => {
          try {
            const res = await fetch(
              `http://localhost:8080/api/reviews/post/${p.id}`
            );

            //  nếu bị 403 thì khỏi parse JSON
            if (!res.ok) {
              console.log(" STATUS:", res.status);
              return { ...p, rating: 0 };
            }

            const data = await res.json();

            if (!data || data.length === 0) {
              return { ...p, rating: 0 };
            }

            const avg =
              data.reduce((sum, r) => sum + (r.rating || 0), 0) /
              data.length;

            return { ...p, rating: avg };
          } catch (err) {
            console.error(err);
            return { ...p, rating: 0 };
          }
        })
      );

        if (sortMode === "rating,desc") {
    updated.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }

  setSortedPosts(updated);
    };

    if (posts.length > 0) {
      fetchRatings();
    } else {
      setSortedPosts([]);
    }
  }, [posts, sortMode]);

  // ==============================
  // LOCATION FILTER
  // ==============================
  const handleProvinceChange = (province) => {
    if (filters.location === province) {
      updateFilters({ location: "" });
    } else {
      updateFilters({ location: province });
    }
  };

  // ==============================
  // SORT
  // ==============================
  const handleSortChange = (sort) => {
  console.log(" Sort:", sort);

  setSortMode(sort);

  if (sort === "rating,desc") {
    const sorted = [...posts].sort(
      (a, b) => (b.rating || 0) - (a.rating || 0)
    );

    setSortedPosts(sorted);
  } else {
    setSortedPosts([...posts]);
  }
};

  // ==============================
  // PRICE FILTER
  // ==============================
  const handlePriceChange = (priceRange) => {
    const { min, max } = priceRange;

    if (filters.minPrice === min && filters.maxPrice === max) {
      updateFilters({ minPrice: null, maxPrice: null });
    } else {
      updateFilters({ minPrice: min, maxPrice: max });
    }
  };

  // ==============================
  // AREA FILTER
  // ==============================
  const handleAreaChange = (areaRange) => {
    const { min, max } = areaRange;

    if (filters.minArea === min && filters.maxArea === max) {
      updateFilters({ minArea: null, maxArea: null });
    } else {
      updateFilters({ minArea: min, maxArea: max });
    }
  };

  return (
    <>
      <HeroLayout scrollRef={contentRef} />

      <div className="home-page">
        <main className="main-content" ref={contentRef}>
          <section className="left-content">
            <HomeFilterHeader
              count={totalElements}
              onProvinceChange={handleProvinceChange}
              activeProvince={filters.location}
              onSortChange={handleSortChange}
            />

            <div className="view-room-list">
              {loading && (
                <div className="loading-state">
                  <p>Đang tải dữ liệu...</p>
                </div>
              )}

              {error && (
                <div className="error-state">
                  <p> {error}</p>
                </div>
              )}

              {!loading && !error && posts.length === 0 && (
                <div className="empty-state">
                  <p>Không tìm thấy bài đăng phù hợp</p>
                </div>
              )}

              {!loading && !error && posts.length > 0 && (
                (sortedPosts.length > 0 ? sortedPosts : posts).map((post) => (
                  <RoomCard key={post.id} data={post} />
                ))
              )}
            </div>

            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </section>

          <aside className="right-content">
            <OptionSection
              onPriceChange={handlePriceChange}
              activePriceRange={{
                min: filters.minPrice,
                max: filters.maxPrice,
              }}
              onAreaChange={handleAreaChange}
              activeAreaRange={{
                min: filters.minArea,
                max: filters.maxArea,
              }}
            />

            <NewPostSection />
            <SelectionSection />
          </aside>

          <footer className="bottom-wrapper">
            <ServiceSection />
          </footer>
        </main>
      </div>
    </>
  );
}

export default HomePage;