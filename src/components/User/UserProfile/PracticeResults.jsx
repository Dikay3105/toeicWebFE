import React, { useEffect, useState } from "react";
import "./PracticeResults.scss";
import { useSelector } from "react-redux";
import { getHistoryByUserId } from "../../../services/historyService";
import { useNavigate } from "react-router-dom";

const PracticeResults = () => {
  const account = useSelector((state) => state.userReducer.account);
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  const fetchHistoryByUserID = async () => {
    try {
      const response = await getHistoryByUserId(account.userid);
      if (response && response.EC === 0) {
        // Map dữ liệu từ API để phù hợp với định dạng hiển thị
        const mappedResults = response.DT.map((history) => ({
          date: new Date(history.EndTime).toLocaleDateString("vi-VN"), // Chỉ lấy ngày
          badges: [`Test ${history.TestID}`, "Luyện tập"], // Test ID và badge "Luyện tập"
          score: `${history.TotalScore}`, // Tổng điểm
          detailsLink: `/testResults/${history.Id}`, // Đường dẫn chi tiết (tuỳ chỉnh)
        }));
        setResults(mappedResults);
      } else {
        console.error(response?.EM || "Không thể lấy dữ liệu lịch sử.");
      }
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
    }
  };

  useEffect(() => {
    fetchHistoryByUserID();
  }, []);

  return (
    <div className="container">
      <div className="header">
        <a href="#">
          <i className="fas fa-chart-bar"></i> Tới trang thống kê kết quả luyện thi
        </a>
      </div>
      <table className="tableHistory">
        <thead>
          <tr>
            <th>Ngày làm</th>
            <th>Kết quả</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {results.map((result, index) => (
            <tr key={index}>
              <td>
                {result.date}{" "}
                {result.badges.map((badge, idx) => (
                  <span
                    key={idx}
                    className={`badge ${badge.toLowerCase().replace(" ", "-")}`}
                  >
                    {badge}
                  </span>
                ))}
              </td>
              <td>{result.score}</td>
              <td>
                <a onClick={() => navigate(result.detailsLink)} className="details-link">
                  Xem chi tiết
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PracticeResults;
