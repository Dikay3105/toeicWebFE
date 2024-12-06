export const ROUTERS = {
  USER: {
    HOMEPAGE: "/",
    LIBRARY_TEST: "/library-test",
    TEST_PAGE: "/test/:testId",
    MAIN_TEST: "/test/:testId/:type",
    ONLINECOURSE: "/onlinecourse",
    COURSEPURCHASE: "/onlinecourse/purchase/:courseId",
    LOGIN: "/login",
    REGISTER: "/register",
    CONFIRMCODE: "/confirmCode",
    USERCOURSE: "/usercourse",
    FINDACCOUNT: "/findAccount",
    RESETPASSWORD: "/resetPassword",
    CHANGEPASSWORD: "/changePassword",
    TESTRESULT: "/testResults/:historyID",
    LESSON: "/lesson/:courseId",
    MYCOURSE: "/my-course",
    PAYMENTSUCCESS: "/payment-success",
  },
  ADMIN: {
    DASHBOARD: "dashboard", // Chỉ cần để "dashboard" mà không có /
    TEST: "test",
    USER: "user",
    PART: "part",
    QUESTION: "question",
    COURSE: "manage-course",
    COURSE_DETAIL: "courseDetail",
    COURSE_EXISTING: "manage-courseExisting",
    LESSON: "manage-lesson",
    LESSON_DETAIL: "manage-lessonDetail",
  },
};
