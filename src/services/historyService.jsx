import createAxiosInstance from "../util/axiosCustomize";

// Định nghĩa URL cơ sở
const API_BASE_URL = "http://examservice.somee.com/";
const axios = createAxiosInstance(API_BASE_URL);

// Lấy danh sách tất cả lịch sử
const getAllHistories = async () => {
  try {
    const response = await axios.get("api/History");
    return response;
  } catch (error) {
    console.error("Error fetching histories:", error);
    throw error;
  }
};



// Lấy lịch sử theo ID
const getHistoryById = async (id) => {
  try {
    const response = await axios.get(`api/History/${id}`);
    return response;
  } catch (error) {
    console.error(`Error fetching history with id=${id}:`, error);
    throw error;
  }
};

// Lấy lịch sử theo ID
const getHistoryByUserId = async (id) => {
  try {
    const response = await axios.get(`api/History/user/${id}`);
    return response;
  } catch (error) {
    console.error(`Error fetching history with id=${id}:`, error);
    throw error;
  }
};

// Tạo mới một lịch sử
const createHistory = async (data) => {
  try {
    const response = await axios.post("api/History", data);
    return response;
  } catch (error) {
    console.error("Error creating history:", error);
    throw error;
  }
};

// Cập nhật lịch sử theo ID
const updateHistory = async (id, history) => {
  try {
    const response = await axios.put(`api/History/${id}`, history);
    return response.data;
  } catch (error) {
    console.error(`Error updating history with id=${id}:`, error);
    throw error;
  }
};

// Xóa lịch sử theo ID
const deleteHistory = async (id) => {
  try {
    await axios.delete(`api/History/${id}`);
  } catch (error) {
    console.error(`Error deleting history with id=${id}:`, error);
    throw error;
  }
};

// Lấy tất cả các phần của lịch sử theo ID lịch sử
const getAllPartsByHistoryId = async (id) => {
  try {
    const response = await axios.get(`api/History/part/${id}`);
    return response;
  } catch (error) {
    console.error(`Error fetching parts of history with id=${id}:`, error);
    throw error;
  }
};

// Lấy thông tin kết hợp của lịch sử dựa trên userId và historyId
const getCombinedHistories = async (userId, hisId) => {
  try {
    const response = await axios.get(
      `api/History/PartOfHistory/${userId}/${hisId}`
    );
    return response;
  } catch (error) {
    console.error(
      `Error fetching combined histories with userId=${userId} and hisId=${hisId}:`,
      error
    );
    throw error;
  }
};

// Hàm khác để lấy dữ liệu phần của lịch sử (có thể bỏ nếu dư thừa)
const getPartOfHis = async (userID, historyID) => {
  try {
    const response = await axios.get(
      `api/History/PartOfHistory/${userID}/${historyID}`
    );
    return response;
  } catch (error) {
    console.error(
      `Error fetching part of history with userID=${userID} and historyID=${historyID}:`,
      error
    );
    throw error;
  }
};

// Export các hàm
export {
  getAllHistories,
  getHistoryById,
  createHistory,
  updateHistory,
  deleteHistory,
  getAllPartsByHistoryId,
  getCombinedHistories,
  getPartOfHis,
  getHistoryByUserId
};

/* import createAxiosInstance from "../util/axiosCustomize";

// import axios from "../util/axiosCustomize";
// const BASE_URL = "https://localhost:5001/api/History";
// import createAxiosInstance from "../util/axiosCustomize";
// const axios1 = createAxiosInstance(5001);

const BASE_URL = "https://localhost:5001/api/History";
const getPartOfHis = (userID, historyID) => {
  return axios.get(`${BASE_URL}/PartOfHistory/${userID}/${historyID}`);
};

const axios = createAxiosInstance(5001);
// Get all questions
const getAllHistories = async () => {
  try {
    const response = await axios.get(BASE_URL);
    return response;
  } catch (error) {
    console.error("Error fetching histories:", error);
    throw error;
  }
};

const getHistoryById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/${id}`);
    return response;
  } catch (error) {
    console.error(`Error fetching history with id=${id}:`, error);
    throw error;
  }
};

const createHistory = async (data) => {
  try {
    const response = await axios.post(`api/History`, data);
    return response;
  } catch (error) {
    console.error("Error creating history:", error);
    throw error;
  }
};

const updateHistory = async (id, history) => {
  try {
    const response = await axios.put(`${BASE_URL}/${id}`, history);
    return response.data;
  } catch (error) {
    console.error(`Error updating history with id=${id}:`, error);
    throw error;
  }
};

const deleteHistory = async (id) => {
  try {
    await axios.delete(`${BASE_URL}/${id}`);
  } catch (error) {
    console.error(`Error deleting history with id=${id}:`, error);
    throw error;
  }
};

// Function to get all parts of a history by History ID
const getAllPartsByHistoryId = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/part/${id}`);
    return response;
  } catch (error) {
    console.error(`Error fetching parts of history with id=${id}:`, error);
    throw error;
  }
};
const getCombinedHistories = async (userId, hisId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/PartOfHistory/${userId}/${hisId}`
    );
    return response;
  } catch (error) {
    console.error(
      `Error fetching combined histories with userId=${userId} and hisId=${hisId}:`,
      error
    );
    throw error;
  }
};

// Export functions including the new function
export {
  getAllHistories,
  getHistoryById,
  createHistory,
  updateHistory,
  deleteHistory,
  getAllPartsByHistoryId,
  getCombinedHistories,
  getPartOfHis,
};
 */
