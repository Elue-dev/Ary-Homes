import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import BeatLoader from "react-spinners/BeatLoader";

export default function Reset() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();
  const navigate = useNavigate();

  const resetUserPassword = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Please enter your email");
      window.setTimeout(() => setError(""), 5000);
      return;
    }

    try {
      setError("");
      setMessage("");
      setLoading(true);
      await resetPassword(email);
      setEmail("");
      setLoading(false);
      setMessage(
        "Check your inbox for further instructions (Ensure to check spam folder, click on 'Report as not spam and continue from inbox')."
      );
      window.setTimeout(() => {
        setMessage("REDIRECTING...");
      }, 5000);
      window.setTimeout(() => {
        navigate("/login");
      }, 7000);
    } catch (err) {
      if (err.message === "Firebase: Error (auth/user-not-found).") {
        setError("This email is not registered");
        window.setTimeout(() => {
          setError("");
        }, 5000);
      }
      if (err.message === "Firebase: Error (auth/invalid-email).") {
        setError("Invalid email");
        window.setTimeout(() => {
          setError("");
        }, 5000);
      }
      if (err.message === "Firebase: Error (auth/too-many-requests).") {
        setError("Reset password limit exceeded");
        window.setTimeout(() => {
          setError("");
        }, 5000);
      }
      setLoading(false);
    }
  };

  return (
    <section className="auth__modal">
      <div className="auth__contents">
        <h2>Reset your password</h2>

        <div className="reset__info">
          <p>
            If the email goes to your spam folder, click on{" "}
            <b>'Report as not spam'</b>, this will move the mail from spam to
            your inbox. then go to your inbox and continue from there.
          </p>
        </div>
        <br />
        {error && <p className="alert error">{error}</p>}
        {message && <p className="alert message">{message}</p>}
        <form onSubmit={resetUserPassword} className="reset__password__input">
          <label>
            <span>Email address:</span>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </label>
          {loading && (
            <button type="submit" className="reset__password__btn">
              <BeatLoader loading={loading} size={10} color={"#fff"} />
            </button>
          )}
          {!loading && (
            <button type="submit" className="reset__password__btn">
              Proceed
            </button>
          )}
        </form>
      </div>
    </section>
  );
}
