package com.truongvx64cntt.nhatrangstay.specification;

import com.truongvx64cntt.nhatrangstay.dto.PostSearchRequest;
import com.truongvx64cntt.nhatrangstay.entity.Post;
import com.truongvx64cntt.nhatrangstay.enums.PostStatus;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class PostSpecification {

    public static Specification<Post> filterPosts(PostSearchRequest request) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // 1. CHỈ hiển thị các bài đăng đã được DUYỆT (APPROVE)
            predicates.add(cb.equal(root.get("status"), PostStatus.APPROVED));

            if (request != null) {

                // 2. TÌM THEO TỪ KHÓA
                if (request.getKeyword() != null && !request.getKeyword().trim().isEmpty()) {
                    String kw = request.getKeyword().toLowerCase().trim();
                    List<Predicate> keywordPredicates = new ArrayList<>();
                    List<String> searchTerms = new ArrayList<>();

                    searchTerms.add(kw);

                    if (kw.contains("nhà trọ") || kw.contains("nha tro")) {
                        searchTerms.add("phòng trọ");
                        searchTerms.add("phong tro");
                        searchTerms.add("phòng cho thuê");
                        searchTerms.add("nhà cho thuê");
                    } else if (kw.contains("phòng trọ") || kw.contains("phong tro")) {
                        searchTerms.add("nhà trọ");
                        searchTerms.add("nha tro");
                        searchTerms.add("nhà cho thuê");
                    } else if (kw.contains("chung cư") || kw.contains("chung cu")) {
                        searchTerms.add("căn hộ");
                        searchTerms.add("can ho");
                        searchTerms.add("apartment");
                    }

                    else if (kw.contains("căn hộ") || kw.contains("can ho")) {
                        searchTerms.add("chung cư");
                        searchTerms.add("apartment");
                    }

                    else if (kw.contains("nhà nguyên căn") || kw.contains("nha nguyen can")) {
                        searchTerms.add("nhà riêng");
                        searchTerms.add("nhà cho thuê nguyên căn");
                    }

                    else if (kw.contains("nhà riêng") || kw.contains("nha rieng")) {
                        searchTerms.add("nhà nguyên căn");
                        searchTerms.add("nhà cho thuê nguyên căn");
                    }

                    List<String> uniqueTerms = searchTerms.stream().distinct().collect(Collectors.toList());

                    for (String term : uniqueTerms) {
                        String pattern = "%" + term + "%";
                        Predicate titleMatch = cb.like(cb.lower(root.get("title")), pattern);
                        Predicate descMatch = cb.like(cb.lower(root.get("description")), pattern);

                        keywordPredicates.add(cb.or(titleMatch, descMatch));
                    }

                    predicates.add(cb.or(keywordPredicates.toArray(new Predicate[0])));
                }

                // 3. Price
                if (request.getMinPrice() != null) {
                    predicates.add(cb.greaterThanOrEqualTo(root.get("price"), request.getMinPrice()));
                }
                if (request.getMaxPrice() != null) {
                    predicates.add(cb.lessThanOrEqualTo(root.get("price"), request.getMaxPrice()));
                }

                // 4. Area
                if (request.getMinArea() != null) {
                    predicates.add(cb.greaterThanOrEqualTo(root.get("area"), request.getMinArea()));
                }
                if (request.getMaxArea() != null) {
                    predicates.add(cb.lessThanOrEqualTo(root.get("area"), request.getMaxArea()));
                }

                // 5. Lọc theo Khu vực
                if (request.getLocation() != null && !request.getLocation().trim().isEmpty()) {
                    predicates.add(
                            cb.like(
                                    cb.lower(root.get("address")), // ĐÚNG FIELD
                                    "%" + request.getLocation().toLowerCase().trim() + "%"));
                }

                // Commune
                if (request.getCommune() != null && !request.getCommune().trim().isEmpty()) {
                    predicates.add(cb.equal(root.get("commune"), request.getCommune()));
                }

                // Type
                if (request.getTypeId() != null) {
                    predicates.add(cb.equal(root.get("type").get("type_id"), request.getTypeId()));
                }
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}