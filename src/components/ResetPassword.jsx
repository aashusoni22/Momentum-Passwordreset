import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Client, Account } from "appwrite";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const userId = searchParams.get("userId");
  const secret = searchParams.get("secret");

  useEffect(() => {
    if (!userId || !secret) {
      setError("Invalid reset link. Please request a new password reset.");
    }
  }, [userId, secret]);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");

    if (!newPassword || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setIsSubmitting(true);

    try {
      const client = new Client()
        .setEndpoint("https://cloud.appwrite.io/v1")
        .setProject("67a919570017f0b49451");

      const account = new Account(client);

      await account.updateRecovery(
        userId,
        secret,
        newPassword,
        confirmPassword
      );

      setSuccess(true);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-cyan-600 via-blue-600 to-purple-800 px-4 py-6 sm:px-6">
      <div className="relative w-full max-w-md">
        {/* Decorative circles - hidden on very small screens */}
        <div className="hidden sm:block absolute top-20 -right-10 w-32 h-32 rounded-full bg-white/5" />
        <div className="hidden sm:block absolute -bottom-4 -left-10 w-24 h-24 rounded-full bg-white/5" />

        <div className="relative w-full mx-auto p-6 sm:p-8 bg-white/10 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            Reset Password
          </h2>
          <p className="text-base sm:text-lg text-gray-300 mb-6 sm:mb-8">
            Enter your new password below
          </p>

          {success ? (
            <div className="text-center">
              <div className="bg-green-500/20 text-green-200 p-4 rounded-lg mb-6 text-sm sm:text-base">
                Password reset successful! You can now return to the app and
                sign in with your new password.
              </div>
            </div>
          ) : (
            <form
              onSubmit={handleResetPassword}
              className="space-y-4 sm:space-y-6"
            >
              {error && (
                <div className="bg-red-500/20 text-red-200 p-3 sm:p-4 rounded-lg text-sm sm:text-base">
                  {error}
                </div>
              )}

              <div className="space-y-3 sm:space-y-4">
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 text-white rounded-xl p-3 sm:p-4 text-base sm:text-lg outline-none focus:border-white/40 transition-colors"
                    placeholder="New Password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white text-sm sm:text-base"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>

                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 text-white rounded-xl p-3 sm:p-4 text-base sm:text-lg outline-none focus:border-white/40 transition-colors"
                    placeholder="Confirm Password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white text-sm sm:text-base"
                  >
                    {showConfirmPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-white text-purple-900 rounded-xl py-3 sm:py-4 px-4 text-base sm:text-lg font-semibold hover:bg-white/90 transition-colors
                  ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {isSubmitting ? "Resetting Password..." : "Reset Password"}
              </button>
            </form>
          )}

          {/* Back to App Link */}
          <div className="mt-6 text-center">
            <a
              href="momentum://"
              className="text-white/60 hover:text-white text-sm sm:text-base transition-colors"
            >
              Return to App
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
