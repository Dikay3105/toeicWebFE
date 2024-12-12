import createAxiosInstance from "../util/axiosCustomize";

// Đường dẫn đầy đủ của API
const API_BASE_URL = "http://feedback.somee.com";

const axios = createAxiosInstance(API_BASE_URL);

// Hàm hiển thị comment theo testID
const loadComment = async (testID) => {
  try {
    console.log(testID);
    const response = await axios.get(`api/Comment/LoadComment/${testID}`);
    // console.log("Comment data:", response);
    if (response.EC === 0) {
      console.log("Comment data:", response);
      return response.DT; // Trả về dữ liệu trong phần 'dt'
    } else {
      console.error("Error:", response.data.em);
      throw new Error(response.em);
    }
  } catch (error) {
    console.error("Error fetching comment:", error);
    throw error;
  }
};

// Hàm tạo comment
// const createComment = async (commentData) => {
//   try {
//     const response = await axios.post("api/Comment", commentData, {
//       headers: { "Content-Type": "application/json" },
//     });
//     console.log("Comment added:", response.data);
//     if (response.EC === 0) {
//       console.log("Comment added:", response.data);
//       return response.DT; // Trả về dữ liệu trong phần 'dt'
//     } else {
//       console.error("Error:", response.data.em);
//       throw new Error(response.em);
//     }
//   } catch (error) {
//     console.error("Error adding comment:", error);
//     throw error;
//   }
// };

// feedbackService.jsx

const createComment = async (commentData) => {
  try {
    const response = await fetch('http://feedback.somee.com/api/Comment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        UserID: commentData.UserID,
        TestID: commentData.TestID,
        CommentText: commentData.CommentText,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create comment');
    }

    const data = await response.json();
    console.log('Comment added:', data);  // Kiểm tra dữ liệu trả về từ API
    return data;
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};


//Cập nhật comment
// const updateComment = async (commentID, commentData) => {
//   try {
//     const response = await axios.put(`api/Comment/${commentID}`, commentData, {
//       headers: { "Content-Type": "application/json" },
//     });
//     if (response.ec === 0) {
//       console.log("Comment updated:", response.data.DT);
//       return response.DT; // Trả về dữ liệu trong phần 'dt'
//     } else {
//       console.error("Error:", response.data.em);
//       throw new Error(response.em);
//     }
//   } catch (error) {
//     console.error("Error updating comment:", error);
//     throw error;
//   }
// };

const updateComment = async (commentId, updatedComment) => {
  const response = await fetch(`http://feedback.somee.com/api/Comment/${commentId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedComment),
  });

  if (!response.ok) {
    throw new Error('Failed to update comment');
  }

  return response;
};

// Xoá comment
const deleteComment = async (commentID) => {
  try {
    const response = await axios.delete(`api/Comment/${commentID}`);
    if (response.ec === 0) {
      console.log("Comment deleted:", response.data.DT);
      return response.DT; // Trả về dữ liệu trong phần 'dt'
    } else {
      console.error("Error:", response.data.em);
      throw new Error(response.em);
    }
  } catch (error) {
    console.error("Error deleting comment:", error);
    throw error;
  }
};

export { loadComment, createComment, updateComment, deleteComment };
