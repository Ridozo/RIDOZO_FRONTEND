"use client";
import React, { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./cmlogin.module.css";
import { authService } from "../../../services/auth.service";

export default function LoginPage() {
  const router = useRouter();

  const [method, setMethod] = useState<"password" | "otp">("password");
  const [otpSent, setOtpSent] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [otpValue, setOtpValue] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async () => {
    if (!identifier.trim()) {
      alert("Please enter Phone or Email");
      return;
    }

    try {
      setLoading(true);

      
      await authService.sendMobileOtp({ mobileNo: identifier });

      setOtpSent(true);
      alert("OTP sent successfully");
    } catch (error) {
      console.error(error);
      alert("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

const handleLogin = async (e: FormEvent) => {
  e.preventDefault();

  if (!identifier.trim()) {
    alert("Identifier required");
    return;
  }

  try {
    setLoading(true);

    let res;

    if (method === "password") {
      res = await authService.loginWithPassword({
        mobileNo: identifier,
        password,
      });
    } else {
      res = await authService.loginWithOtp({
        mobileNo: identifier,
        otp: otpValue,
      });
    }

    console.log("Login Response:", res);

    const token = res?.data?.token || res?.token;

    if (token) {
      // ✅ Set cookie instead of localStorage
      document.cookie = `token=${token}; path=/; max-age=86400`;

      router.push("/user-dashboard");
    } else {
      alert("Invalid credentials");
    }
  } catch (error) {
    console.error("Login failed:", error);
    alert("Login failed");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className={styles.signup_full_page}>
      <div className={styles.signup_form_card}>
        <div className={styles.point_container}>
          <span className={styles.welcome_point_text}>
            Welcome back to Bhopal
          </span>
        </div>

        <div className={styles.brand_logo_center}>
          RIDO<span>ZO</span>
        </div>

        <div className={styles.method_toggle_container}>
          <button
            type="button"
            className={`${styles.tab_btn} ${
              method === "password" ? styles.tab_active : ""
            }`}
            onClick={() => {
              setMethod("password");
              setOtpSent(false);
            }}
          >
            Password
          </button>

          <button
            type="button"
            className={`${styles.tab_btn} ${
              method === "otp" ? styles.tab_active : ""
            }`}
            onClick={() => {
              setMethod("otp");
              setOtpSent(false);
            }}
          >
            OTP Login
          </button>
        </div>

        <form className={styles.fade_in} onSubmit={handleLogin}>
          {!otpSent && (
            <div className={styles.input_group_block}>
              <label className={styles.label_text}>
                Email or Phone Number
              </label>
              <input
                className={styles.standard_input}
                placeholder="name@example.com or +91..."
                value={identifier}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setIdentifier(e.target.value)
                }
                required
              />
            </div>
          )}

          {method === "password" && (
            <>
              <div className={styles.input_group_block}>
                <label className={styles.label_text}>Password</label>
                <input
                  type="password"
                  className={styles.standard_input}
                  placeholder="********"
                  value={password}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setPassword(e.target.value)
                  }
                  required
                />
              </div>

              <button
                type="submit"
                className={styles.btn_finish_reg}
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login Now"}
              </button>
            </>
          )}

          {method === "otp" && (
            <>
              {!otpSent ? (
                <button
                  type="button"
                  className={styles.btn_finish_reg}
                  onClick={handleSendOtp}
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send OTP"}
                </button>
              ) : (
                <>
                  <p className={styles.otp_info_text}>
                    OTP sent to <b>{identifier}</b>
                  </p>

                  <div className={styles.input_group_block}>
                    <label className={styles.label_text}>Enter OTP</label>
                    <input
                      className={styles.standard_input}
                      placeholder="000000"
                      maxLength={6}
                      value={otpValue}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setOtpValue(e.target.value)
                      }
                      style={{
                        textAlign: "center",
                        letterSpacing: "8px",
                        fontWeight: "800",
                      }}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className={styles.btn_finish_reg}
                    disabled={loading}
                  >
                    {loading ? "Verifying..." : "Verify & Login"}
                  </button>

                  <button
                    type="button"
                    onClick={() => setOtpSent(false)}
                    className={styles.resend_btn}
                  >
                    Change details
                  </button>
                </>
              )}
            </>
          )}
        </form>

        <p className={styles.footer_text}>
          Don't have an account?{" "}
          <Link href="/auth/user-signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}
