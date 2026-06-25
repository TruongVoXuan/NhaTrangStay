# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project layout

This git repo's actual Maven project lives in the `nhatrangstay/` subdirectory (root of the repo only has `README.md` and this file). Run all build/test commands from inside `nhatrangstay/`.

This is the backend for NhaTrangStay (a Khánh Hòa room/apartment rental listing platform, graduation thesis project). The companion frontend lives in a sibling, separately-cloned repo at `../fe-nhatrangstay` (React) which calls this API and expects it on `localhost:8080`; several backend flows (OAuth2 redirect, email links) hardcode `http://localhost:3000` as the frontend origin.

## Commands

All commands run from `nhatrangstay/` (use `mvnw.cmd` on Windows, `./mvnw` on bash/WSL):

```
mvnw.cmd clean install        # full build
mvnw.cmd spring-boot:run      # run the app (port 8080)
mvnw.cmd test                 # run tests
mvnw.cmd test -Dtest=NhatrangstayApplicationTests#contextLoads   # single test
```

There is currently only one test (`NhatrangstayApplicationTests`, a context-load smoke test) — no real unit/integration test suite exists yet.

Requires a local MySQL instance (`jdbc:mysql://localhost:3306/nhatrangstay`, see `src/main/resources/application.properties` for credentials) and outbound network access at startup for Supabase (file storage), Gmail SMTP, Google OAuth2, Vonage SMS, and OpenRouter AI — `SupabaseStorageService` throws at `@PostConstruct` if its config keys are blank, so the app will fail to start without valid Supabase settings.

`application.properties` is **not** gitignored and currently holds live third-party credentials (DB, Gmail SMTP, Google OAuth2, Supabase, Vonage, OpenRouter) directly in plaintext — treat this file as sensitive, don't echo its contents elsewhere.

`src/main/resources/data.sql` contains sample seed data (room types, users, posts, images) for manual/demo use; it is not wired to auto-run (no `spring.sql.init.mode=always`), so it must be executed manually against the MySQL DB if needed. Separately, `DatabaseSeeder` (a `CommandLineRunner` bean) runs on every boot and creates a default admin account (`admin@nhatrangstay.com` / `123456`) if one doesn't already exist.

## Architecture

Standard layered Spring Boot structure under `com.truongvx64cntt.nhatrangstay`: `controller` → `service` → `repository` (Spring Data JPA) → `entity`, with `dto` for request/response payloads, `enums` for status/role types, `security`/`config` for cross-cutting setup, and `specification` for dynamic JPA queries.

### Auth & security
- Stateless JWT auth (`spring-boot-starter-security` configured for `SessionCreationPolicy.STATELESS`). `JwtAuthenticationFilter` reads `Authorization: Bearer <token>`, resolves the user by the email embedded in the token, and sets a `UsernamePasswordAuthenticationToken` with a single `ROLE_<role>` authority — there's no Spring `UserDetailsService`, the filter does the lookup itself.
- `JwtService` signs/verifies with a **hardcoded** HMAC secret (not read from `application.properties`) and 24h expiry.
- Endpoint authorization is split across two places: broad path rules in `SecurityConfig.filterChain` (`authorizeHttpRequests`), and `@PreAuthorize("hasRole('ADMIN')")` on individual admin endpoints (mainly in `AdminUserController`). Check both when reasoning about who can call an endpoint.
- Google OAuth2 login is wired two ways: the active path is the inline `successHandler` lambda inside `SecurityConfig.filterChain()`, which calls `CustomOAuth2UserService.processOAuth2User` and redirects to the frontend with a token. The standalone `OAuth2LoginSuccessHandler` component also exists and implements the same idea independently, but is not registered as the OAuth2 success handler anywhere — it's effectively dead/legacy code (also notably generates tokens with a `null` user id).

### Posts (core domain)
- `Post` is the central listing entity (title/price/area/address/lat-long/images/type/owner) with a `PostStatus` lifecycle: `PENDING` → `APPROVED`/`REJECTED`, plus admin-only `LOCKED`, and `DELETED`. Search (`PostController#searchPosts` → `PostSpecification`) only ever returns `APPROVED` posts.
- New/edited posts go through **AI auto-moderation**: `PostService.createPost`/`updatePost` save the post, then fire `AutoApproveService.autoReview(post, isUpdate)` on a raw `new Thread(...)` (not a managed `@Async`/executor). That method calls OpenRouter's API (Gemini 2.5 Flash Image model) with the post text + downloaded images, parses an `APPROVED`/`REJECTED|<reason>` response, updates `PostStatus` accordingly, and emails the owner via `EmailService`.
- Post images are uploaded to Supabase Storage via `SupabaseStorageService` (plain `RestTemplate` calls to the Supabase REST API, not a Supabase SDK); `Image.url` stores the public Supabase URL.
- `PostSpecification.filterPosts` builds a dynamic JPA `Specification` and does manual Vietnamese keyword-synonym expansion (e.g. "nhà trọ" ↔ "phòng trọ" ↔ "nhà cho thuê") for search-by-keyword.

### Booking / viewing flow
- The active "schedule a viewing" feature is `PreOrder` (status enum: `PENDING/APPROVED/REJECTED/CANCELLED`) + `PreOrderService`, exposed via `RentalProcedureController` at `/api/rental-procedures/**`.
- `RentalRegistration` (entity/service/repository) is a separate, similar-sounding concept but is **not referenced by any controller** — treat it as unused/legacy unless you're specifically asked to wire it up.
- Similarly, `Comment` is an entity with no repository/service/controller — `Review` (which already carries both `rating` and `content`) is what's actually used for post reviews/comments.

### Notifications
- Email (`service/email`, `EmailSender`/`EmailService`) is fully wired: signup verification, password-reset OTP, email-change OTP, and admin/owner notifications (lock/unlock, post lock, AI rejection reasons) all send real mail via Gmail SMTP.
- SMS (`service/sms`, `SmsSender`/`SmsService`, Vonage SDK) is implemented but **not actually invoked** — `UserService.generatePhoneOtp` generates and stores a phone OTP but the call to send it via `smsService` is commented out, so phone OTP currently can't reach the user.

### Conventions to be aware of
- Code style is inconsistent across entities/services — some use Lombok (`@Data`, `@Builder`, `@RequiredArgsConstructor`, e.g. `User`, `PreOrder`, `PostService`), others hand-write getters/setters with no Lombok (e.g. `Post`, `RentalRegistration`, `Comment`). Don't assume one style; check the specific file before editing.
- Dependency injection is mostly constructor injection via `@RequiredArgsConstructor`, but a few controllers use field injection (`@Autowired` fields, e.g. `FavoriteController`, `AdminUserController`'s pattern varies). Match the existing style in the file you're editing.
- Error handling is centralized in `GlobalExceptionHandler` (`@RestControllerAdvice`): `ResponseStatusException` maps to its own status/reason as JSON; any other `RuntimeException` is flattened to HTTP 400 with `ex.getMessage()`. Services therefore mostly throw `ResponseStatusException(HttpStatus.X, "message")` for expected failures.
- There's heavy use of `System.out.println`/`e.printStackTrace()` for debugging throughout controllers/services instead of a logger — consistent with the rest of the codebase if you're adding similar temporary diagnostics, but prefer not to expand this pattern unnecessarily.
- Several `*-sequence.md` / `*-activity.md` files at the `nhatrangstay/` root (e.g. `login-sequence.md`, `post-create-sequence.md`, `rental-procedure-sequence.md`, `ai-moderation-activity.md`) are UML-style diagrams documenting specific flows for the thesis writeup — useful as design references, not part of the build.
