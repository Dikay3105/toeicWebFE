import { useEffect, useState } from "react";
import { getUsers, postLogin } from "../../../services/authService";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Login.scss";
import { useDispatch, useSelector } from "react-redux";
import { doLogIn, doLogOut } from "../../../redux/action/userAction";
import { toast } from "react-toastify";

const Login = () => {
  const role = useSelector((state) => state.userReducer.account.role);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const dataFromRegister = location.state;

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  useEffect(() => {
    if (role) {
      navigate(role === "User" ? "/" : "/admin"); // Chuyển hướng về trang chủ nếu đã có role
    }
  }, [role, navigate]); // role thay đổi thì effect này sẽ chạy

  useEffect(() => {
    if (dataFromRegister) {
      setUsername(dataFromRegister.newEmail || "");
      setPassword(dataFromRegister.newPassword || "");
    }
  }, [dataFromRegister]);

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async () => {
    dispatch(doLogOut()); // Đảm bảo người dùng trước đó được đăng xuất
    if (!username) {
      toast.error("Email không được để trống!");
      return;
    }
    if (!password) {
      toast.error("Password không được để trống!");
      return;
    }
    try {
      let response = await postLogin(username, password); // Gửi request login
      if (response && response.EC === 0) {
        // Lưu thông tin người dùng vào Redux
        dispatch(doLogIn(response));

        const role = response.DT.role; // Lấy role từ response (DT.role là giả định)

        // Điều hướng dựa trên vai trò
        if (role === "Admin" || role === "Staff") {
          navigate("/admin"); // Admin/Staff chuyển đến trang Admin
        } else {
          navigate("/"); // User chuyển đến trang Home
        }

        toast.success("Đăng nhập thành công!");
      } else if (response && response.EC !== 0) {
        // Xử lý khi đăng nhập thất bại
        toast.error(response.EM);
        console.log(response);
      }
    } catch (error) {
      // Xử lý lỗi trong quá trình đăng nhập
      console.error("Error during login:", error);
      toast.error(
        "Có lỗi xảy ra trong quá trình đăng nhập. Vui lòng thử lại sau."
      );
    }
  };


  // Handle keydown event for Enter key to submit form
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <>
      <div className="login-container mt-5 mb-5 d-grid gap-2">
        <div className="login-container-content px-4 pb-4 pt-4">
          <div className="title fs-2 fw-bold col-4 mx-auto text-center">
            Đăng Nhập
          </div>
          <div className="content-form col-3 mx-auto d-grid gap-3">
            {/* Email Input with form-floating */}
            <div className="form-floating mb-3">
              <input
                type="email"
                className="form-control"
                id="floatingInput"
                placeholder="name@example.com"
                onChange={(event) => setUsername(event.target.value)}
                onKeyDown={(event) => handleKeyDown(event)}
                value={username}
              />
              <label htmlFor="floatingInput">Username or Email</label>
            </div>

            {/* Password Input with form-floating */}
            <div className="d-flex align-items-center pass-container">
              <div className="form-floating d-flex" style={{ flex: "9" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  id="floatingPassword"
                  placeholder="Mật khẩu"
                  onChange={(event) => setPassword(event.target.value)}
                  onKeyDown={(event) => handleKeyDown(event)}
                  value={password}
                />
                <label htmlFor="floatingPassword">Mật khẩu</label>
              </div>
              <button
                type="button"
                className="btn-toggle-pass"
                onClick={togglePasswordVisibility}
                style={{ borderLeft: "none" }}
              >
                {showPassword ? <FaEye size={15} /> : <FaEyeSlash size={15} />}
              </button>
            </div>

            <button className="btn btn-dark w-100" onClick={handleLogin}>
              Đăng nhập
            </button>

            <div className="text-center mt-3">
              <Link to="/FindAccount">Quên mật khẩu</Link>
            </div>
            <div className="text-center mt-3">
              Bạn không có tài khoản? <Link to="/Register">Đăng kí</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
