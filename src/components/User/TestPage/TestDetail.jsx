import "./TestDetail.scss";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // Import useParams
import { getTestById } from "../../../services/testsService"; // Import hàm lấy test
import { useNavigate } from "react-router-dom"; // Negative import cho useNavigate
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import CommentsContainer from "../Feedback/Comment";
/* import CommentsContainer from "../Feedback/Comment"; */
const TestDetail = () => {
  const { testId } = useParams(); // Lấy testId từ URL params
  const [selectedTab, setSelectedTab] = useState("practice"); // State to track the selected tab
  const [selectedParts, setSelectedParts] = useState({
    part1: false,
    part2: false,
    part3: false,
    part5: false,
    part6: false,
    part7: false,
  });
  const [testInfo, setTestInfo] = useState(null); // State để lưu thông tin bài kiểm tra
  const [loading, setLoading] = useState(true); // State để quản lý trạng thái tải
  const userId = useSelector(
    (state) => state?.userReducer?.account?.userid || null
  );

  const handleTabClick = (tab) => {
    setSelectedTab(tab); // Update the selected tab
  };

  const handleCheckboxChange = (event) => {
    const { id, checked } = event.target;
    setSelectedParts((prevState) => ({
      ...prevState,
      [id]: checked,
    }));
  };
  const navigate = useNavigate();

  const handleStartPractice = (type) => {
    if (userId != null) {
      if (type === "full") {
        console.log("Starting full test practice");
        // Chuyển hướng đến trang kiểm tra toàn bộ
        navigate(`/test/${testId}/full`); // Đường dẫn cho bài kiểm tra toàn bộ
      } else if (type === "part") {
        console.log("Parts selected for practice:", selectedParts);

        // Kiểm tra nếu không có phần nào được chọn
        if (!Object.values(selectedParts).some((part) => part === true)) {
          toast.error("Vui lòng chọn ít nhất một phần để thực hành!");
          return; // Dừng lại, không chuyển hướng
        }

        // Chuyển hướng đến trang kiểm tra từng phần nếu có phần được chọn
        navigate(`/test/${testId}/part`, { state: { parts: selectedParts } });
      }

      console.log("Test ID:", testId);
    } else {
      toast.error("Vui lòng đăng nhập để làm bài kiểm tra");
      navigate("/login");
    }
  };

  useEffect(() => {
    const fetchTestInfo = async () => {
      try {
        const data = await getTestById(testId); // testId được lấy từ params
        if (data.EC === 0) {
          setTestInfo(data.DT); // Nếu EC = 0, set dữ liệu vào testInfo
          console.log("Thông tin bài kiểm tra:", data.DT);
        } else {
          console.error("Lỗi:", data.EM); // Nếu EC khác 0, log lỗi
        }
      } catch (error) {
        console.error("Error fetching test info:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestInfo();
  }, [testId]);

  if (loading) {
    return <div>Loading...</div>; // Hiển thị loading khi đang lấy dữ liệu
  }

  return (
    <div className="toeic-test-container container">
      {/* Header */}
      <div>
        <div className="test-header">
          <span className="badge bg-light text-secondary">#TOEIC</span>
          <h2>{testInfo?.Name}</h2>
          <div className="test-info">
            <p>
              <strong>Thời gian làm bài:</strong> {testInfo?.Duration} phút |{" "}
              <strong>Độ khó:</strong> {testInfo?.Difficulty} |
              <strong> Mô tả:</strong>{" "}
              {testInfo?.Description || "Không có mô tả"}
            </p>
            <p>
              <i className="bi bi-person-fill"></i>{" "}
              {testInfo?.participants || 321081} người đã luyện tập đề thi này
            </p>
            <p className="text-danger">
              Chú ý: để được quy đổi sang scaled score, vui lòng chọn chế độ làm
              FULL TEST.
            </p>
          </div>
        </div>

        {/* Tab chọn */}
        <ul className="nav nav-tabs mt-3">
          <li className="nav-item">
            <a
              className={`nav-link ${
                selectedTab === "practice" ? "active" : ""
              }`}
              href="#"
              onClick={() => handleTabClick("practice")}
            >
              Luyện tập
            </a>
          </li>
          <li className="nav-item">
            <a
              className={`nav-link ${
                selectedTab === "fullTest" ? "active" : ""
              }`}
              href="#"
              onClick={() => handleTabClick("fullTest")}
            >
              Làm full test
            </a>
          </li>
        </ul>

        {/* Nội dung cho từng tab */}
        {selectedTab === "practice" && (
          <div className="alert alert-info mt-3">
            <h5>Bạn đã chọn chế độ luyện tập!</h5>
            <p>
              Trong chế độ luyện tập, bạn có thể chọn từng phần thi riêng lẻ để
              luyện tập.
            </p>
            {/* Phần chọn phần thi */}
            <div className="test-sections">
              <h5>Chọn phần thi bạn muốn làm</h5>

              {/* Part 1 */}
              <div className="form-check mt-3 d-flex align-items-center">
                <input
                  className="form-check-input me-2"
                  type="checkbox"
                  id="part1"
                  checked={selectedParts.part1}
                  onChange={handleCheckboxChange}
                />
                <label className="form-check-label me-3" htmlFor="part1">
                  Part 1 (6 câu hỏi)
                </label>
              </div>
              <div className="tag-list mt-2 d-flex flex-wrap">
                <span className="badge .bg-light me-1">
                  #Part 1 Tranh tả người
                </span>
                <span className="badge .bg-light me-1">
                  #Part 1 Tranh tả người và vật
                </span>
              </div>

              {/* Part 2 */}
              <div className="form-check mt-3 d-flex align-items-center">
                <input
                  className="form-check-input me-2"
                  type="checkbox"
                  id="part2"
                  checked={selectedParts.part2}
                  onChange={handleCheckboxChange}
                />
                <label className="form-check-label me-3" htmlFor="part2">
                  Part 2 (25 câu hỏi)
                </label>
              </div>
              <div className="tag-list mt-2 d-flex flex-wrap">
                <span className="badge .bg-light me-1">
                  #Part 2 Câu hỏi WHAT
                </span>
                <span className="badge .bg-light me-1">
                  #Part 2 Câu hỏi WHO
                </span>
                <span className="badge .bg-light me-1">
                  #Part 2 Câu hỏi WHERE
                </span>
                <span className="badge .bg-light me-1">
                  #Part 2 Câu hỏi WHEN
                </span>
                <span className="badge .bg-light me-1">
                  #Part 2 Câu hỏi HOW
                </span>
                <span className="badge .bg-light me-1">
                  #Part 2 Câu hỏi WHY
                </span>
                <span className="badge .bg-light me-1">
                  #Part 2 Câu hỏi YES/NO
                </span>
                <span className="badge .bg-light me-1">
                  #Part 2 Câu hỏi đuôi
                </span>
                <span className="badge .bg-light me-1">
                  #Part 2 Câu hỏi lựa chọn
                </span>
                <span className="badge .bg-light me-1">
                  #Part 2 Câu yêu cầu, đề nghị
                </span>
                <span className="badge .bg-light me-1">
                  #Part 2 Câu trần thuật
                </span>
              </div>

              {/* Part 3 */}
              <div className="form-check mt-3 d-flex align-items-center">
                <input
                  className="form-check-input me-2"
                  type="checkbox"
                  id="part3"
                  checked={selectedParts.part3}
                  onChange={handleCheckboxChange}
                />
                <label className="form-check-label me-3" htmlFor="part3">
                  Part 3 (39 câu hỏi)
                </label>
              </div>
              <div className="tag-list mt-2 d-flex flex-wrap">
                <span className="badge .bg-light me-1">
                  #Part 3 Câu hỏi về chủ đề, mục đích
                </span>
                <span className="badge .bg-light me-1">
                  #Part 3 Câu hỏi về danh tính người nói
                </span>
                <span className="badge .bg-light me-1">
                  #Part 3 Câu hỏi về chi tiết cuộc hội thoại
                </span>
                <span className="badge .bg-light me-1">
                  #Part 3 Câu hỏi về hành động tương lai
                </span>
                <span className="badge .bg-light me-1">
                  #Part 3 Câu hỏi kết hợp bảng biểu
                </span>
                <span className="badge .bg-light me-1">
                  #Part 3 Câu hỏi về hàm ý câu nói
                </span>
                <span className="badge .bg-light me-1">
                  #Part 3 Chủ đề: Company - General Office Work
                </span>
                <span className="badge .bg-light me-1">
                  #Part 3 Chủ đề: Company - Business, Marketing
                </span>
                <span className="badge .bg-light me-1">
                  #Part 3 Chủ đề: Company - Event, Project
                </span>
                <span className="badge .bg-light me-1">
                  #Part 3 Chủ đề: Company - Facility
                </span>
                <span className="badge .bg-light me-1">
                  #Part 3 Chủ đề: Shopping, Service
                </span>
                <span className="badge .bg-light me-1">
                  #Part 3 Chủ đề: Order, delivery
                </span>
                <span className="badge .bg-light me-1">
                  #Part 3 Chủ đề: Transportation
                </span>
                <span className="badge .bg-light me-1">
                  #Part 3 Câu hỏi về địa điểm hội thoại
                </span>
                <span className="badge .bg-light me-1">
                  #Part 3 Câu hỏi về yêu cầu, gợi ý
                </span>
              </div>

              {/* Part 4 */}
              <div className="form-check mt-3 d-flex align-items-center">
                <input
                  className="form-check-input me-2"
                  type="checkbox"
                  id="part4"
                  checked={selectedParts.part4}
                  onChange={handleCheckboxChange}
                />
                <label className="form-check-label me-3" htmlFor="part4">
                  Part 4 (30 câu hỏi)
                </label>
              </div>
              <div className="tag-list mt-2 d-flex flex-wrap">
                <span className="badge .bg-light me-1">
                  #Part 4 Câu hỏi về chủ đề, mục đích
                </span>
                <span className="badge .bg-light me-1">
                  #Part 4 Câu hỏi về danh tính, địa điểm
                </span>
                <span className="badge .bg-light me-1">
                  #Part 4 Câu hỏi về chi tiết
                </span>
                <span className="badge .bg-light me-1">
                  #Part 4 Câu hỏi về hành động tương lai
                </span>
                <span className="badge .bg-light me-1">
                  #Part 4 Câu hỏi kết hợp bảng biểu
                </span>
                <span className="badge .bg-light me-1">
                  #Part 4 Câu hỏi về hàm ý câu nói
                </span>
                <span className="badge .bg-light me-1">
                  #Part 4 Dạng bài: Telephone message - Tin nhắn thoại
                </span>
                <span className="badge .bg-light me-1">
                  #Part 4 Dạng bài: Announcement - Thông báo
                </span>
                <span className="badge .bg-light me-1">
                  #Part 4 Dạng bài: News report, Broadcast - Bản tin
                </span>
                <span className="badge .bg-light me-1">
                  #Part 4 Dạng bài: Talk - Bài phát biểu, diễn văn
                </span>
                <span className="badge .bg-light me-1">
                  #Part 4 Dạng bài: Excerpt from a meeting - Trích dẫn từ buổi
                  họp
                </span>
              </div>

              {/* Part 5 */}
              <div className="form-check mt-3 d-flex align-items-center">
                <input
                  className="form-check-input me-2"
                  type="checkbox"
                  id="part5"
                  checked={selectedParts.part5}
                  onChange={handleCheckboxChange}
                />
                <label className="form-check-label me-3" htmlFor="part5">
                  Part 5 (30 câu hỏi)
                </label>
              </div>
              <div className="tag-list mt-2 d-flex flex-wrap">
                <span className="badge .bg-light me-1">
                  #Part 5 Câu hỏi từ loại
                </span>
                <span className="badge .bg-light me-1">
                  #Part 5 Câu hỏi ngữ pháp
                </span>
                <span className="badge .bg-light me-1">
                  #Part 5 Câu hỏi từ vựng
                </span>
                <span className="badge .bg-light me-1">#Grammar Danh từ</span>
                <span className="badge .bg-light me-1">#Grammar Đại từ</span>
                <span className="badge .bg-light me-1">#Grammar Tính từ</span>
                <span className="badge .bg-light me-1">#Grammar Thì</span>
                <span className="badge .bg-light me-1">#Grammar Trạng từ</span>
                <span className="badge .bg-light me-1">
                  #Grammar Động từ nguyên mẫu có &quot;to&quot;;
                </span>
                <span className="badge .bg-light me-1">#Grammar Giới từ</span>
                <span className="badge .bg-light me-1">#Grammar Liên từ</span>
                <span className="badge .bg-light me-1">
                  #Grammar Cấu trúc so sánh
                </span>
              </div>

              {/* Part 6 */}
              <div className="form-check mt-3 d-flex align-items-center">
                <input
                  className="form-check-input me-2"
                  type="checkbox"
                  id="part6"
                  checked={selectedParts.part6} // Cập nhật để sử dụng state của selectedParts
                  onChange={handleCheckboxChange} // Giả sử bạn có hàm xử lý sự kiện này
                />
                <label className="form-check-label me-3" htmlFor="part6">
                  Part 6 (16 câu hỏi)
                </label>
              </div>
              <div className="tag-list mt-2 d-flex flex-wrap">
                <span className="badge .bg-light me-1">
                  #Part 6 Câu hỏi từ loại
                </span>
                <span className="badge .bg-light me-1">
                  #Part 6 Câu hỏi ngữ pháp
                </span>
                <span className="badge .bg-light me-1">
                  #Part 6 Câu hỏi từ vựng
                </span>
                <span className="badge .bg-light me-1">
                  #Part 6 Câu hỏi điền câu vào đoạn văn
                </span>
                <span className="badge .bg-light me-1">
                  #Hình thức: Thư điện tử/ thư tay (Email/ Letter)
                </span>
                <span className="badge .bg-light me-1">
                  #Hình thức: Quảng cáo (Advertisement)
                </span>
                <span className="badge .bg-light me-1">
                  #Hình thức: Thông báo/ văn bản hướng dẫn (Notice/
                  Announcement)
                </span>
                <span className="badge .bg-light me-1">
                  #Hình thức: Thông báo nội bộ (Memo)
                </span>
                <span className="badge .bg-light me-1">#Grammar Danh từ</span>
                <span className="badge .bg-light me-1">#Grammar Đại từ</span>
                <span className="badge .bg-light me-1">#Grammar Tính từ</span>
                <span className="badge .bg-light me-1">#Grammar Thì</span>
                <span className="badge .bg-light me-1">#Grammar Thể</span>
                <span className="badge .bg-light me-1">
                  #Grammar Động từ nguyên mẫu có to
                </span>
                <span className="badge .bg-light me-1">
                  #Grammar Động từ nguyên mẫu
                </span>
                <span className="badge .bg-light me-1">
                  #Grammar Phân từ và Cấu trúc phân từ
                </span>
                <span className="badge .bg-light me-1">#Grammar Liên từ</span>
              </div>

              {/* Part 7 */}
              <div className="form-check mt-3 d-flex align-items-center">
                <input
                  className="form-check-input me-2"
                  type="checkbox"
                  id="part7"
                  checked={selectedParts.part7} // Cập nhật để sử dụng state của selectedParts
                  onChange={handleCheckboxChange} // Giả sử bạn có hàm xử lý sự kiện này
                />
                <label className="form-check-label me-3" htmlFor="part7">
                  Part 7 (54 câu hỏi)
                </label>
              </div>
              <div className="tag-list mt-2 d-flex flex-wrap">
                <span className="badge .bg-light me-1">
                  #Part 7 Câu hỏi tìm thông tin
                </span>
                <span className="badge .bg-light me-1">
                  #Part 7 Câu hỏi tìm chi tiết sai
                </span>
                <span className="badge .bg-light me-1">
                  #Part 7 Câu hỏi về chủ đề, mục đích
                </span>
                <span className="badge .bg-light me-1">
                  #Part 7 Câu hỏi suy luận
                </span>
                <span className="badge .bg-light me-1">
                  #Part 7 Câu hỏi điền câu
                </span>
                <span className="badge .bg-light me-1">
                  #Cấu trúc: Một đoạn
                </span>
                <span className="badge .bg-light me-1">
                  #Cấu trúc: Nhiều đoạn
                </span>
                <span className="badge .bg-light me-1">
                  #Dạng bài: Thư điện tử/ Thư tay (Email/ Letter)
                </span>
                <span className="badge .bg-light me-1">
                  #Dạng bài: Đơn từ, biểu mẫu (Form)
                </span>
                <span className="badge .bg-light me-1">
                  #Dạng bài: Bài báo/ Bài đánh giá (Article/ Review)
                </span>
                <span className="badge .bg-light me-1">
                  #Dạng bài: Quảng cáo (Advertisement)
                </span>
                <span className="badge .bg-light me-1">
                  #Dạng bài: Thông báo (Announcement/ Notice)
                </span>
                <span className="badge .bg-light me-1">
                  #Dạng bài: Chuỗi tin nhắn (Text message chain)
                </span>
                <span className="badge .bg-light me-1">
                  #Câu hỏi tìm từ đồng nghĩa
                </span>
                <span className="badge .bg-light me-1">
                  #Câu hỏi về hàm ý câu nói
                </span>
              </div>

              <button
                className="btn btn-primary mt-4"
                onClick={() => handleStartPractice("part")}
              >
                Bắt đầu luyện tập
              </button>
            </div>
          </div>
        )}

        {selectedTab === "fullTest" && (
          <div className="alert alert-info mt-3">
            <h5>Sẵn sàng để bắt đầu làm full test?</h5>
            <p>
              Để đạt được kết quả tốt nhất, bạn cần dành ra 120 phút cho bài
              test này.
            </p>
            <button
              className="btn btn-primary"
              onClick={() => handleStartPractice("full")}
            >
              Bắt đầu luyện tập
            </button>
          </div>
        )}
        <div className="mt-5">
          <CommentsContainer userId={userId} testId={testId} />
        </div>
      </div>
    </div>
  );
};

export default TestDetail;
