import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  loadComment,
  createComment,
  updateComment,
  deleteComment,
} from "../../../services/feedbackService";
import "./Comment.scss";
import { useSelector } from "react-redux";

const CommentsContainer = ({ userId }) => {
  // const userId = useSelector((state) => state.userReducer.account.userid);
  const { testId } = useParams(); // Lấy testId từ URL
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editingComment, setEditingComment] = useState(null);

  // Fetch comments khi component được mount hoặc testId thay đổi
  useEffect(() => {
    fetchComments();
  }, [testId]);
  const fetchComments = async () => {
    try {
      const data = await loadComment(testId); // Lấy danh sách bình luận theo testId
      setComments(data || []);
    } catch (error) {
      console.error("Error loading comments:", error);
    }
  };
  // Xử lý thêm bình luận
  const handleAddComment = async () => {
    if (!newComment.trim()) return; // Không cho phép bình luận rỗng

    try {
      const commentData = {
        UserID: userId,
        TestID: testId,
        CommentText: newComment,
      };

      // Gửi yêu cầu và thêm bình luận vào danh sách
      const addedComment = await createComment(commentData);

      if (addedComment) {
        setComments((prev) => [...prev, addedComment]);
        fetchComments();
      }

      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  // Xử lý chỉnh sửa bình luận
  const handleEditComment = (comment) => {
    setEditingComment(comment);
    setNewComment(comment.CommentText);
  };

  // Xử lý cập nhật bình luận
  const handleUpdateComment = async () => {
    if (!newComment.trim()) return; // Không cập nhật nếu nội dung rỗng
    try {
      // Kiểm tra xem `editingComment` có tồn tại và có `CommentID` không
      if (!editingComment || !editingComment.CommentID) {
        console.error("CommentID is missing");
        return;
      }

      const updatedComment = { ...editingComment, CommentText: newComment };
      const response = await updateComment(
        editingComment.CommentID,
        updatedComment
      );

      setComments((prev) =>
        prev.map((comment) =>
          comment.CommentID === editingComment.CommentID ? response : comment
        )
      );
      setEditingComment(null);
      setNewComment("");
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };

  // Xử lý xóa bình luận
  const handleDeleteComment = async (id) => {
    try {
      await deleteComment(id);
      setComments((prev) => prev.filter((comment) => comment.id !== id));
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  return (
    <div className="comments-container">
      <h1>Comments</h1>
      <ul className="comments-list">
        {comments.map((comment) => (
          <CommentItem
            key={comment.CommentID}
            comment={comment}
            onEdit={handleEditComment}
            onDelete={handleDeleteComment}
            userId={userId} // Truyền userId vào cho mỗi comment
          />
        ))}
      </ul>
      <div className="comment-form">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
        />
        <button
          onClick={editingComment ? handleUpdateComment : handleAddComment}
        >
          {editingComment ? "Update Comment" : "Add Comment"}
        </button>
      </div>
    </div>
  );
};

const CommentItem = ({ comment, onEdit, onDelete, userId }) => (
  <li>
    <div className="comment-main-level">
      <div className="comment-avatar">
        <img
          src="https://cdn-icons-png.flaticon.com/128/3237/3237472.png"
          alt="avatar"
        />
      </div>
      <div className="comment-box">
        <div className="comment-head">
          <h6
            className={`comment-name ${
              comment.UserID === userId ? "by-author" : ""
            }`}
          >
            {comment.UserID} {/* Hiển thị UserID hoặc tên người dùng */}
          </h6>
          <span>{new Date(comment.CommentDate).toLocaleString()}</span>

          {/* Chỉ hiển thị nút Edit và Delete nếu UserID của bình luận bằng userId */}
          {comment.UserID === userId && (
            <>
              <button onClick={() => onEdit(comment)}>Edit</button>
              <button onClick={() => onDelete(comment.CommentID)}>
                Delete
              </button>
            </>
          )}
        </div>
        <div className="comment-content">{comment.CommentText}</div>
      </div>
    </div>
    {/* Hiển thị phản hồi nếu có */}
    {comment.replies && comment.replies.length > 0 && (
      <ul className="reply-list">
        {comment.replies.map((reply) => (
          <CommentItem
            key={reply.CommentID}
            comment={reply}
            onEdit={onEdit}
            onDelete={onDelete}
            userId={userId} // Truyền userId vào cho các phản hồi
          />
        ))}
      </ul>
    )}
  </li>
);

export default CommentsContainer;
