import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Import useHistory
import { useSelector } from "react-redux";

import { GiCheckMark, GiBullseye } from "react-icons/gi";
import { MdOutlineTimer } from "react-icons/md";
import {
  FaTimesCircle,
  FaMinusCircle,
  FaCheckCircle,
  FaTimes,
  FaCheck,
} from "react-icons/fa";

import "./TestResult.scss";
import { getHistoryById, getPartOfHis } from "../../../services/historyService";
import { getTestByID } from "../../../services/testService";
import { getQuestionByPartID } from "../../../services/partService";
import { getUserAnswerByHisID } from "../../../services/userAnswerService";

const TestResult = () => {
  const { historyID } = useParams(); // Lấy historyID từ URL
  // const userID = "4"; //thêm userID khi cấu hình xong login
  const userID = useSelector((state) => state.userReducer.account.userid);
  const [historyData, setHistoryData] = useState([]);
  const [partData, setPartData] = useState([]);
  const [testData, setTestData] = useState([]);
  const [fullData, setFullData] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);
  const [skip, setSkip] = useState(null);
  const [listeningCorrect, setListeningCorrect] = useState(0);
  const [readingCorrect, setReadingCorrect] = useState(0);
  const [totalListeningQuestions, setTotalListeningQuestions] = useState(0);
  const [activePart, setActivePart] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showQuestion, setShowQuestion] = useState(false); // State để điều khiển hiển thị câu hỏi
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const overlayRef = useRef();
  const navigate = useNavigate(); // Hook để điều hướng
  const partRefs = useRef({}); // Tạo ref cho mỗi part section

  // Khai báo state cho các giá trị cần tính toán
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Lấy historyData
        const historyResponse = await getHistoryById(historyID);
        if (historyResponse.EC !== 0) {
          setError(historyResponse.EM);
          return;
        }
        setHistoryData(historyResponse.DT);

        //lấy thông tin part của 1 user trong history
        const partResponse = await getPartOfHis(userID, historyID);
        if (partResponse.EC !== 0) {
          setError(partResponse.EM);
          return;
        }
        setPartData(partResponse.DT);

        // Lấy testData sau khi có historyData
        const testResponse = await getTestByID(historyResponse.DT.TestID);
        if (testResponse.EC !== 0) {
          setError(testResponse.EM);
          return;
        }
        setTestData(testResponse.DT);

        // Lấy userAnswers
        const userAnswersResponse = await getUserAnswerByHisID(historyID);
        if (userAnswersResponse.EC !== 0) {
          setError(userAnswersResponse.EM);
          return;
        }
        setUserAnswers(userAnswersResponse.DT);
      } catch (error) {
        setError("Lỗi khi lấy dữ liệu");
        console.log("Lỗi khi lấy dữ liệu", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [historyID]);

  useEffect(() => {
    const fetchQuestionsWithAnswers = async () => {
      if (partData.length > 0 && userAnswers.length > 0) {
        setLoading(true);
        setError(null);

        try {
          // Fetch initial part data (assume it's already set in partData)
          const partsWithQuestionsPromises = partData.map(async (part) => {
            const response = await getQuestionByPartID(part.PardId);
            if (response.EC === 0) {
              const { questions } = response.DT.part;
              // Add `userAnswer` field to each question based on `userAnswers`
              const questionsWithAnswers = questions.map((q) => {
                const userAnswer = userAnswers.find(
                  (ua) => ua.QuestionID == q.question.Id
                );

                return {
                  ...q,
                  userAnswer: userAnswer || null, // If no answer, set as null
                };
              });

              return {
                ...part,
                questions: questionsWithAnswers,
              };
            } else {
              setError(response.EM);
              return null;
            }
          });

          // Execute all part question fetch promises
          const partsWithQuestions = await Promise.all(
            partsWithQuestionsPromises
          );
          setFullData(partsWithQuestions);
        } catch (error) {
          console.error("Error while fetching questions:", error);
          setError("Error fetching questions data");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchQuestionsWithAnswers();
  }, [partData, userAnswers]);

  useEffect(() => {
    let skipCount = 0;
    let questions = 0;
    let correct = 0;
    let listeningCorrect = 0;
    let readingCorrect = 0;
    if (partData) {
      partData.forEach((part, index) => {
        console.log("partData", partData)
        // questions += +part.Total_Question;
        correct += part.Total_Correct;
        if (index < 5) {
          listeningCorrect += part.Total_Correct; // Tính điểm Listening
        } else {
          readingCorrect += part.Total_Correct; // Tính điểm Reading
        }
      });
    }
    setReadingCorrect(readingCorrect);
    setListeningCorrect(listeningCorrect);
    setCorrectAnswers(correct);

    fullData.forEach((part) => {
      if(!part) return;

      // Tổng số câu hỏi
      questions += part.questions.length;

      // Đếm số câu bị bỏ qua
      part.questions.forEach((item) => {
        if (item.userAnswer == null) {
          skipCount += 1;
        }
      });
    });

    setTotalQuestions(questions);
    setSkip(skipCount);
    setIncorrectAnswers(questions - correct - skipCount);

    // Tổng số câu hỏi phần Listening
    setTotalListeningQuestions(
      fullData?.slice(0, 5).reduce((total, part) => {
        return total + (part?.questions?.length || 0); // Kiểm tra part.questions
      }, 0)
    );

    let accuracyValue = ((correct / questions) * 100).toFixed(1);
    setAccuracy(accuracyValue);

  }, [partData, historyData, fullData]);

  const convertSelectedToLetter = (selectedId) => {
    const letters = ["A", "B", "C", "D"]; // Tương ứng với 1, 2, 3, 4
    return letters[(selectedId - 1) % 4]; // Giả sử SelectedID là từ 1 đến 4
  };

  // Xử lý khi người dùng chọn câu trả lời
  const handleAnswerSelect = (answer) => {
    setData({ ...data, userAnswer: answer });
  };

  const handleShowDetails = (question) => {
    setSelectedQuestion(question);
    setShowQuestion(true);
  };

  const handleCloseOverlay = () => {
    setShowQuestion(false);
    setSelectedQuestion(null);
  };

  // Hàm xử lý cuộn đến phần cụ thể
  const handleScrollToPart = (partName) => {
    // Kiểm tra nếu ref của phần tử đó tồn tại
    setActivePart(partName)
    if (partRefs.current[partName]) {
      partRefs.current[partName].scrollIntoView({
        behavior: "smooth", // Cuộn mượt mà
        block: "start", // Cuộn đến phần đầu của phần tử
      });
    }
  };
  const handleBackClick = () => {
    // Điều hướng về trang đề thi (giả sử đường dẫn là '/exam')
    navigate("/library-test");
  };

  return (
    <div className="result-display">
      <div className="result-display__header">
        <h2>Kết quả luyện tập: {testData.Name}</h2>
        <div className="part-buttons">
          {partData &&
            partData.map((part) => (
              <button
                key={part.PartName}
                // className="partButton"
                className={`partButton ${activePart === part.PartName ? 'active' : ''}`}
                onClick={() => handleScrollToPart(part.PartName)}
              >
                {part.PartName}
              </button>
            ))}
        </div>
      </div>
      <button className="result-display__back" onClick={handleBackClick}>
        Quay về trang đề thi
      </button>

      <div className="result-display__content">
        <div className="result-display__summary">
          <div className="result-display__summary__element">
            <span>
              <GiCheckMark color="green" /> Kết quả làm bài{" "}
            </span>
            <strong>
              {correctAnswers}/{totalQuestions}
            </strong>
          </div>
          <div className="result-display__summary__element">
            <span>
              <GiBullseye /> Độ chính xác
            </span>
            <strong>{accuracy}%</strong>
          </div>
        </div>

        <div className="result-display__container-stats">
          <div className="result-display__stats">
            <div className="result-display__stat correct">
              <FaCheckCircle className="icon" />
              <span>Trả lời đúng</span>
              <strong>{correctAnswers}</strong>
              <span>câu hỏi</span>
            </div>
            <div className="result-display__stat incorrect">
              <FaTimesCircle className="icon" />
              <span>Trả lời sai</span>
              <strong>{incorrectAnswers}</strong>
              <span>câu hỏi</span>
            </div>
            <div className="result-display__stat skipped">
              <FaMinusCircle className="icon" />
              <span>Bỏ qua</span>
              <strong>{skip}</strong>
              <span>câu hỏi</span>
            </div>
          </div>

          {partData.length === 7 ? (
            <div className="result-display__score-section">
              <div className="result-display__score listening">
                <strong>Listening</strong>
                <strong>{listeningCorrect * 5}/{totalListeningQuestions * 5}</strong>
                <span>Trả lời đúng: {listeningCorrect}/{totalListeningQuestions}</span>
              </div>
              <div className="result-display__score reading">
                <span>Reading</span>
                <strong>{readingCorrect * 5}/{(totalQuestions - totalListeningQuestions) * 5}</strong>
                <span>Trả lời đúng:  {readingCorrect}/{totalQuestions - totalListeningQuestions}</span>
              </div>
              <div className="result-display__score total">
                <span>Tổng điểm</span>
                <strong>{listeningCorrect * 5 + readingCorrect * 5 + 5}/{totalQuestions * 5 + 5}</strong>
                <span>Trả lời đúng: {correctAnswers}/{totalQuestions}</span>
              </div>
            </div>
          ) : null}
        </div>

      </div>

      <div className="answer-list">
        <h3>Đáp án</h3>
        {fullData.map((part, index) => {
          // console.log(fullData)
          if (!part) return null;
          return (
            <div
              key={index}
              id={part.PartName} // Thêm id cho từng phần tử
              className="part-section"
              ref={(el) => (partRefs.current[part.PartName] = el)} // Gán ref cho từng phần part
            >
              <div className="part-title">{part.PartName}</div>
              <div className="answer-grid">
                {part.questions.map((item, indexQues) => {
                  // console.log(item)
                  return (
                    <div key={indexQues} className="answer-item">
                      <div className="question-number">{indexQues + 1}</div>
                      <div className="answer-wrapper">
                        {item.userAnswer == null ? (
                          <span>Chưa chọn</span> // Hiển thị nếu không có userAnswer
                        ) : (
                          <div className="answer-choice">
                            <span>
                              {/* {convertSelectedToLetter(
                                item.userAnswer.SelectedAnswerID
                              )} */}
                              {convertSelectedToLetter(
                                item.answers.findIndex(
                                  (answer) => answer.Id == item.userAnswer.SelectedAnswerID
                                ) + 1 // +1 để chuyển sang dạng "A, B, C,..."
                              )}
                            </span>
                            <div
                              className={`selected-answer ${item.userAnswer.IsCorrect === true
                                ? "correct"
                                : "incorrect"
                                }`}
                            ></div>
                            {item.userAnswer.IsCorrect === true ? (
                              <span className="correct-icon">
                                {" "}
                                <FaCheck />{" "}
                              </span>
                            ) : (
                              <span className="incorrect-icon">
                                <FaTimes />
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      <span
                        className="details-toggle"
                        onClick={() => handleShowDetails(item)}
                      >
                        [Chi tiết]
                      </span>
                      {showQuestion && selectedQuestion && (
                        <div className="overlay" ref={overlayRef}>
                          <div className="overlay-content">
                            <button
                              className="close-button"
                              onClick={handleCloseOverlay}
                            >
                              <FaTimes />
                            </button>
                            <h3>{selectedQuestion.question.Text}</h3>
                            <ul>
                              {selectedQuestion.answers.map((answer, index) => {
                                return (
                                  <li
                                    key={answer.Id}
                                    className={`answer-list-item ${answer.IsCorrect == true
                                      ? "correct-answer-bg"
                                      : selectedQuestion.userAnswer != null &&
                                        selectedQuestion.userAnswer
                                          .SelectedAnswerID === answer.Id &&
                                        selectedQuestion.userAnswer
                                          .IsCorrect == false
                                        ? "incorrect-answer-bg"
                                        : ""
                                      }`}
                                  >
                                    <span style={{ fontWeight: "bold" }}>
                                      {convertSelectedToLetter(index + 1)}
                                    </span>
                                    . {answer.Text}
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TestResult;
