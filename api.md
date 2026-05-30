# API Reference

Danh sách các API theo dạng: Path - Method - Description - Request body - Response 200 - Error

---

## Auth

- Path: /auth/signup - Method: POST
  - Description: Đăng ký tài khoản
  - Request body: { email, password, full_name, avatar_url? } (CreateUserDto)
  - Response 200: { user: { id, email, full_name, avatar_url } }
  - Error: 400 Bad Request (validation), 409 Conflict (email exists)

- Path: /auth/signin - Method: POST
  - Description: Đăng nhập
  - Request body: { email, password } (SignInDataDto)
  - Response 200: { accessToken }
    - Also sets cookie `refreshToken` (HttpOnly)
  - Error: 400 Bad Request, 401 Unauthorized (invalid credentials)

- Path: /auth/refresh - Method: POST
  - Description: Lấy access token mới từ refresh cookie
  - Request body: none (cookie: refreshToken)
  - Response 200: { accessToken }
  - Error: 401 Unauthorized (invalid/expired refresh token)

- Path: /auth/me - Method: GET
  - Description: Lấy thông tin user hiện tại
  - Request body: none
  - Response 200: { user: { id, email, full_name, avatar_url, role } }
  - Error: 401 Unauthorized

- Path: /auth/signout - Method: POST
  - Description: Đăng xuất (xóa refresh cookie)
  - Request body: none
  - Response 200: { success: true }
  - Error: 401 Unauthorized

---

## Users

- Path: /users/all - Method: GET
  - Description: Admin lấy danh sách user
  - Request body: none
  - Response 200: [ { id, email, full_name, role, avatar_url } ]
  - Error: 401, 403

- Path: /users/:user_id - Method: GET
  - Description: Lấy thông tin user theo id
  - Request body: none
  - Response 200: { id, email, full_name, avatar_url, role }
  - Error: 401, 404 Not Found

- Path: /users/:user_id - Method: PATCH
  - Description: Cập nhật thông tin user
  - Request body: { password?, full_name?, avatar_url? } (UpdateUserDto)
  - Response 200: updated user object
  - Error: 400, 401, 403

- Path: /users/:user_id - Method: DELETE
  - Description: Xóa user (admin)
  - Request body: none
  - Response 200: { success: true }
  - Error: 401, 403, 404

- Path: /users/change-password/:id - Method: PATCH
  - Description: Đổi mật khẩu (controller nhận raw body)
  - Request body: raw string or { newPass } (implementation varies)
  - Response 200: { success: true }
  - Error: 400, 401, 403

- Path: /users/change-role/:id - Method: PATCH
  - Description: Chuyển role (ví dụ lên instructor) (admin)
  - Request body: none
  - Response 200: updated user
  - Error: 401, 403, 404

- Path: /users/health - Method: HEAD
  - Description: Health check
  - Request body: none
  - Response 200: status ok (no body for HEAD; health endpoint returned JSON for GET/HEAD)
  - Error: n/a

---

## Courses

- Path: /courses - Method: GET
  - Description: Lấy danh sách courses đã publish (paging)
  - Query params: page, limit
  - Request body: none
  - Response 200: { courses: [ { id, title, price, thumbnail_url, created_at, instructor: { id, full_name, avatar_url } } ] }
  - Error: 401

- Path: /courses/my - Method: GET
  - Description: Instructor lấy course của mình
  - Request body: none
  - Response 200: { courses: [...] }
  - Error: 401, 403

- Path: /courses/:id - Method: GET
  - Description: Lấy chi tiết course (nội dung, sections, lessons). Nếu chưa publish kiểm tra role/owner.
  - Request body: none
  - Response 200: { course: { id, title, description, published, instructor, sections: [ ... ] } }
  - Error: 401, 403, 404

- Path: /courses - Method: POST
  - Description: Tạo course (instructor)
  - Request body: CreateCourseDto { title, description, thumbnail_url?, price }
  - Response 200: { course }
  - Error: 400, 401, 403

- Path: /courses/:id - Method: PATCH
  - Description: Cập nhật course (owner/instructor)
  - Request body: UpdateCourseDto { title?, description?, thumbnail_url?, price? }
  - Response 200: { course }
  - Error: 400, 401, 403, 404

- Path: /courses/:id - Method: DELETE
  - Description: Xóa course (owner/admin). Từ chối nếu có enrollments
  - Request body: none
  - Response 200: { course } (deleted)
  - Error: 400 (has enrollments), 401, 403, 404

- Path: /courses/:id/publish - Method: PATCH
  - Description: Toggle publish course (owner/admin)
  - Request body: none
  - Response 200: { course }
  - Error: 401, 403, 404

---

## Sections

- Path: /courses/:courseId/sections - Method: POST
  - Description: Tạo section cho course (owner/instructor)
  - Request body: CreateSectionDto { title }
  - Response 200: { section }
  - Error: 400, 401, 403, 404

- Path: /courses/:courseId/sections/:sectionId - Method: GET
  - Description: Lấy section cùng lessons (kiểm tra quyền nếu course chưa publish)
  - Request body: none
  - Response 200: { section: { id, title, lessons: [ ... ] } }
  - Error: 401, 403, 404

- Path: /courses/:courseId/sections/:sectionId - Method: PATCH
  - Description: Cập nhật section (owner/instructor)
  - Request body: UpdateSectionDto { title? }
  - Response 200: { section }
  - Error: 400, 401, 403, 404

- Path: /courses/:courseId/sections/:sectionId - Method: DELETE
  - Description: Xóa section (owner/instructor)
  - Request body: none
  - Response 200: { success: true }
  - Error: 401, 403, 404

---

## Lessons

- Path: /sections/:sectionId/lessons - Method: GET
  - Description: Lấy danh sách lesson trong section
  - Request body: none
  - Response 200: { lessons: [ { id, title, content, video_url, duration, is_preview, order_index } ] }
  - Error: 401, 404

- Path: /sections/:sectionId/lessons - Method: POST
  - Description: Tạo lesson (owner/instructor)
  - Request body: CreateLessonDto { title, content, video_url?, duration, is_preview }
  - Response 200: { lesson }
  - Error: 400, 401, 403, 404

- Path: /sections/:sectionId/lessons/:lessonId - Method: PATCH
  - Description: Cập nhật lesson (owner/instructor)
  - Request body: UpdateLessonDto { title?, content?, video_url?, duration?, is_preview? }
  - Response 200: { lesson }
  - Error: 400, 401, 403, 404

- Path: /sections/:sectionId/lessons/:lessonId - Method: DELETE
  - Description: Xóa lesson (owner/instructor)
  - Request body: none
  - Response 200: { success: true }
  - Error: 401, 403, 404

---

## Enrollments

- Path: /enrollments/:courseId - Method: POST
  - Description: Học viên enroll vào course
  - Request body: none
  - Response 200: { id, user_id, course_id, enrolled_at }
  - Error: 400, 401, 404, 409 (already enrolled)

- Path: /enrollments/my - Method: GET
  - Description: Danh sách courses đã enroll của học viên
  - Request body: none
  - Response 200: [ { enrollment objects with course info } ]
  - Error: 401

- Path: /enrollments/:id/status - Method: PATCH
  - Description: Học viên hủy enrollment / thay đổi trạng thái
  - Request body: none
  - Response 200: { success: true }
  - Error: 400, 401, 404

- Path: /enrollments/course/:courseId - Method: GET
  - Description: Instructor/admin xem danh sách người đã enroll course (owner)
  - Request body: none
  - Response 200: [ { user info, enrolled_at } ]
  - Error: 401, 403, 404

---

## Progress

- Path: /progress/lessons/:lessonId/complete - Method: POST
  - Description: Đánh dấu hoàn thành lesson (student)
  - Request body: none
  - Response 200: { lesson_id, is_completed: true, course_progress: { percentage, completed, total, lesson: [...] } }
  - Error: 400, 401, 403, 404

- Path: /progress/lessons/:lessonId/complete - Method: DELETE
  - Description: Bỏ hoàn thành lesson
  - Request body: none
  - Response 200: { lesson_id, is_completed: false }
  - Error: 400, 401, 404

- Path: /progress/my?course_id={id} - Method: GET
  - Description: Lấy tiến độ của học viên theo course
  - Request body: none
  - Response 200: { percentage, completed, total, lesson: [ { lessonId, title, is_completed } ] }
  - Error: 401, 403, 404

---

## Quizzes

- Path: /courses/:courseId/quizzes - Method: GET
  - Description: Lấy danh sách quizzes trong course
  - Request body: none
  - Response 200: { quizzes: [ { id, title, description, time_limit, created_at } ] }
  - Error: 401, 404

- Path: /courses/:courseId/quizzes/:quizId - Method: GET
  - Description: Lấy chi tiết quiz (questions + answers). `is_correct` chỉ hiển thị với instructor/admin
  - Request body: none
  - Response 200: { quiz: { id, course_id, title, description, time_limit, questions: [ { id, question_text, type, answers: [ { id, answer_text, is_correct? } ] } ] } }
  - Error: 401, 403, 404

- Path: /courses/:courseId/quizzes - Method: POST
  - Description: Tạo quiz (owner/instructor)
  - Request body: CreateQuizDto { title, description, time_limit }
  - Response 200: { quiz }
  - Error: 400, 401, 403, 404

- Path: /courses/:courseId/quizzes/:quizId - Method: PATCH
  - Description: Cập nhật quiz (owner/instructor)
  - Request body: UpdateQuizDto { title?, description?, time_limit? }
  - Response 200: { quiz }
  - Error: 400, 401, 403, 404

- Path: /courses/:courseId/quizzes/:quizId - Method: DELETE
  - Description: Xóa quiz (nếu chưa có submission)
  - Request body: none
  - Response 200: { success: true }
  - Error: 400 (has submissions), 401, 403, 404

---

## Questions

- Path: /quizzes/:quizId/questions - Method: GET
  - Description: Lấy questions của quiz, kèm answers (is_correct chỉ cho instructor/admin)
  - Request body: none
  - Response 200: { questions: [ { id, question_text, type, answers: [ { id, answer_text, is_correct? } ] } ] }
  - Error: 401, 404

- Path: /quizzes/:quizId/questions - Method: POST
  - Description: Tạo question (owner/instructor)
  - Request body: CreateQuestionsDto { questionText, type }
  - Response 200: { question }
  - Error: 400, 401, 403, 404

- Path: /quizzes/:quizId/questions/:questionId - Method: PATCH
  - Description: Cập nhật question
  - Request body: UpdateQuestionsDto { questionText?, type? }
  - Response 200: { question }
  - Error: 400, 401, 403, 404

- Path: /quizzes/:quizId/questions/:questionId - Method: DELETE
  - Description: Xóa question
  - Request body: none
  - Response 200: { success: true }
  - Error: 400 (has answers), 401, 403, 404

---

## Answers

- Path: /questions/:questionId/answers - Method: POST
  - Description: Tạo answer cho question (owner/instructor)
  - Request body: CreateAnswerDto { answer_text, is_correct }
  - Response 200: { answer }
  - Error: 400, 401, 403, 404

- Path: /questions/:questionId/answers/:answerId - Method: PATCH
  - Description: Cập nhật answer
  - Request body: UpdateAnswerDto { answer_text?, is_correct? }
  - Response 200: { answer }
  - Error: 400, 401, 403, 404

- Path: /questions/:questionId/answers/:answerId - Method: DELETE
  - Description: Xóa answer
  - Request body: none
  - Response 200: { success: true }
  - Error: 401, 403, 404

---

## Submissions

- Path: /submissions/:quizId - Method: POST
  - Description: Học viên nộp bài cho quiz
  - Request body: SubmissionAnswersDto { answers: [ { question_id, answers_id: string[] } ] }
  - Response 200: { submission_id, quiz_id, score, submitted_at, total_questions, detail: [ { question_id, question_text, selected_answers: [ { id, answer_text } ], correct_answers: [ { id, answer_text } ], is_correct } ] }
  - Error: 400 (no questions), 401, 403 (not enrolled), 404

- Path: /submissions/:quizId/my - Method: GET
  - Description: Học viên lấy bài nộp gần nhất (chi tiết)
  - Request body: none
  - Response 200: same shape as submission result (detail with selected & correct answers)
  - Error: 401, 403, 404

---

## Common Errors

- 400 Bad Request — validation lỗi hoặc thiếu dữ liệu.
- 401 Unauthorized — cần đăng nhập hoặc token không hợp lệ.
- 403 Forbidden — không có quyền (role/ownership).
- 404 Not Found — resource không tồn tại.
- 409 Conflict — dữ liệu mâu thuẫn (ví dụ duplicate enroll, quiz has submissions).

---

Nếu muốn, tôi sẽ:

- Bổ sung ví dụ response mẫu chi tiết cho từng endpoint.
- Xuất file dưới dạng CSV hoặc OpenAPI (swagger) nếu bạn cần.
