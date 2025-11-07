import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { apiClient } from "../../utils/api";

export default function Profile() {
  const { user, token, updateProfile } = useContext(AuthContext);
  const [profile, setProfile] = useState({
    name: user?.name || "",
    email: user?.email || "",
    avatar: user?.avatar || "",
    bio: user?.bio || "",
  });
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || "");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await apiClient.get("/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data);
        setAvatarPreview(res.data.avatar || "");
      } catch (err) {
        console.error(err);
        setMessage("Failed to load profile");
      }
    };
    if (token) fetchProfile();
  }, [token]);

  // ✅ Avatar upload
  const onAvatar = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setAvatarPreview(previewUrl);

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const res = await apiClient.post("/api/users/change-avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      const avatarUrl = res.data.avatar;
      updateProfile({ avatar: avatarUrl });
      setMessage("✅ Avatar updated successfully!");
    } catch (err) {
      console.error("❌ Error uploading avatar:", err);
      setMessage("Error updating avatar");
    }
  };

  // ✅ Save profile
  const saveProfile = async () => {
    setLoading(true);
    try {
      const res = await apiClient.put(
        "/api/users/me",
        { name: profile.name, bio: profile.bio },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      updateProfile(res.data.user);
      setMessage("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      setMessage("Error updating profile");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Change password
  const changePassword = async () => {
    if (!password || !newPassword) {
      setMessage("Fill both fields");
      return;
    }
    try {
      await apiClient.put(
        "/api/users/change-password",
        { currentPassword: password, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("Password changed successfully!");
      setPassword("");
      setNewPassword("");
    } catch (err) {
      console.error(err);
      setMessage("Error changing password");
    }
  };
  return (
  <div className="flex min-h-screen bg-primary">
    {/* LEFT SIDE - Profile Form */}
    <div className="flex-1 flex justify-center items-center p-4">
      <div className="w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Profile</h2>
        {message && <div className="mb-2 text-sm text-secondary">{message}</div>}

        <div className="bg-primary p-4 rounded shadow">
          {/* Name */}
          <label className="block mb-2">
            Name
            <input
              value={profile.name}
              onChange={(e) =>
                setProfile((prev) => ({ ...prev, name: e.target.value }))
              }
              className="w-full p-2 border rounded"
            />
          </label>

          {/* Email */}
          <label className="block mb-2">
            Email
            <input
              value={profile.email}
              disabled
              className="w-full p-2 border rounded bg-gray-100"
            />
          </label>

          {/* Bio */}
          <label className="block mb-2">
            Bio
            <textarea
              value={profile.bio}
              onChange={(e) =>
                setProfile((prev) => ({ ...prev, bio: e.target.value }))
              }
              className="w-full p-2 border rounded resize-none h-24"
              placeholder="Tell something about yourself..."
            />
          </label>

          {/* Avatar */}
          <div className="mb-2">Avatar</div>
          <div className="flex items-center gap-4 mb-4">
            <img
              src={
                avatarPreview
                  ? avatarPreview.startsWith("blob:")
                    ? avatarPreview
                    : `http://localhost:5000${avatarPreview}`
                  : profile.avatar
                  ? `http://localhost:5000${profile.avatar}`
                  : "/default-avatar.png"
              }
              alt="Avatar"
              onError={(e) => (e.target.src = "/default-avatar.png")}
              className="w-24 h-24 rounded-full object-cover"
            />

            <input type="file" accept="image/*" onChange={onAvatar} />
          </div>

          {/* Save Profile */}
          <div className="mb-4">
            <button
              className="px-3 py-1 bg-secondary text-primary rounded disabled:opacity-60"
              onClick={saveProfile}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save profile"}
            </button>
          </div>

          {/* Password Section */}
          <div className="border-t pt-4">
            <h3 className="font-semibold mb-2">Change Password</h3>
            <input
              type="password"
              placeholder="Current password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded mb-2"
            />
            <input
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-2 border rounded mb-2"
            />
            <div className="flex gap-2">
              <button
                onClick={changePassword}
                className="px-3 py-1 bg-secondary text-primary rounded"
              >
                Change
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* RIGHT SIDE - Image */}
    <div className="hidden md:flex flex-1 items-center justify-center">
      <img
        src="/images/ProfilePageImageNew.svg"
        alt="Profile illustration"
        className="max-w-[70%] rounded-xl object-contain"
      />
    </div>
  </div>
);
}