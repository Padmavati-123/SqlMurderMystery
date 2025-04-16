import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaLock, FaEnvelope, FaUserEdit, FaSave, FaArrowLeft } from "react-icons/fa";
import { motion } from "framer-motion";

const ProfilePage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [editMode, setEditMode] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        const fetchUserData = async () => {
            setIsLoading(true);
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/login");
                return;
            }
            try {
                const response = await fetch("https://sql-backend-hggtg3ccd8h8fpfv.southindia-01.azurewebsites.net/auth/user", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = await response.json();
                if (!response.ok) throw new Error(data.message);
                setUser(data);
                setFormData({
                    name: data.name,
                    email: data.email,
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: ""
                });
            } catch (error) {
                console.error("Error fetching user data:", error);
                localStorage.removeItem("token");
                navigate("/login");
            } finally {
                setIsLoading(false);
            }
        };
        fetchUserData();
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        // Validate form
        if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
            setError("New passwords do not match");
            return;
        }

        // Prepare data for update
        const updateData = {
            name: formData.name,
            email: formData.email
        };

        // Only include password fields if the user is updating the password
        if (formData.currentPassword && formData.newPassword) {
            updateData.currentPassword = formData.currentPassword;
            updateData.newPassword = formData.newPassword;
        }

        try {
            const token = localStorage.getItem("token");
            const response = await fetch("https://sql-backend-hggtg3ccd8h8fpfv.southindia-01.azurewebsites.net/auth/update-profile", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(updateData),
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || "Failed to update profile");
            }

            // Update local user state
            setUser({
                ...user,
                name: formData.name,
                email: formData.email
            });
            
            setSuccess("Profile updated successfully!");
            setEditMode(false);
            
            // Clear password fields
            setFormData({
                ...formData,
                currentPassword: "",
                newPassword: "",
                confirmPassword: ""
            });
        } catch (error) {
            console.error("Error updating profile:", error);
            setError(error.message || "Failed to update profile");
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white" style={{
            backgroundImage: "url('/crime_scene.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
        }}>
            {/* Back button */}
            <div className="container mx-auto px-4 py-8">
                <button 
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-300 hover:text-yellow-400 transition mb-6"
                >
                    <FaArrowLeft />
                    <span>Back</span>
                </button>

                <motion.div 
                    className="max-w-2xl mx-auto bg-gray-900 bg-opacity-90 rounded-lg shadow-lg overflow-hidden border border-red-700"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="p-6 md:p-8">
                        <h1 className="text-3xl font-bold text-center mb-8">
                            <span className="text-yellow-400">Detective</span> Profile
                        </h1>

                        {error && (
                            <div className="bg-red-900 bg-opacity-50 border border-red-700 text-white px-4 py-3 rounded mb-4">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="bg-green-900 bg-opacity-50 border border-green-700 text-white px-4 py-3 rounded mb-4">
                                {success}
                            </div>
                        )}

                        <div className="flex flex-col items-center mb-8">
                            <div className="w-24 h-24 bg-red-600 rounded-full flex items-center justify-center text-4xl mb-4">
                                {user && user.name.charAt(0).toUpperCase()}
                            </div>
                            {!editMode ? (
                                <button
                                    onClick={() => setEditMode(true)}
                                    className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition"
                                >
                                    <FaUserEdit />
                                    <span>Edit Profile</span>
                                </button>
                            ) : (
                                <div className="text-gray-300 text-sm">Edit your detective credentials</div>
                            )}
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-gray-300 text-sm font-semibold mb-2">
                                        Detective Name
                                    </label>
                                    <div className={`flex items-center border ${editMode ? 'border-red-500' : 'border-gray-700'} rounded-lg p-3 bg-gray-800 bg-opacity-50`}>
                                        <FaUserCircle className="text-gray-400 mr-3" />
                                        {editMode ? (
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                className="bg-transparent w-full text-white focus:outline-none"
                                                required
                                            />
                                        ) : (
                                            <span>{user?.name}</span>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-gray-300 text-sm font-semibold mb-2">
                                        Email
                                    </label>
                                    <div className={`flex items-center border ${editMode ? 'border-red-500' : 'border-gray-700'} rounded-lg p-3 bg-gray-800 bg-opacity-50`}>
                                        <FaEnvelope className="text-gray-400 mr-3" />
                                        {editMode ? (
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="bg-transparent w-full text-white focus:outline-none"
                                                required
                                            />
                                        ) : (
                                            <span>{user?.email}</span>
                                        )}
                                    </div>
                                </div>

                                {editMode && (
                                    <>
                                        <div className="border-t border-gray-700 my-6 pt-6">
                                            <h3 className="text-xl font-semibold mb-4 text-yellow-400">Change Password</h3>
                                            <p className="text-gray-400 text-sm mb-4">Leave blank if you don't want to change your password</p>
                                            
                                            <div className="mb-4">
                                                <label className="block text-gray-300 text-sm font-semibold mb-2">
                                                    Current Password
                                                </label>
                                                <div className="flex items-center border border-red-500 rounded-lg p-3 bg-gray-800 bg-opacity-50">
                                                    <FaLock className="text-gray-400 mr-3" />
                                                    <input
                                                        type="password"
                                                        name="currentPassword"
                                                        value={formData.currentPassword}
                                                        onChange={handleChange}
                                                        className="bg-transparent w-full text-white focus:outline-none"
                                                        placeholder="Enter current password to confirm changes"
                                                    />
                                                </div>
                                            </div>

                                            <div className="mb-4">
                                                <label className="block text-gray-300 text-sm font-semibold mb-2">
                                                    New Password
                                                </label>
                                                <div className="flex items-center border border-red-500 rounded-lg p-3 bg-gray-800 bg-opacity-50">
                                                    <FaLock className="text-gray-400 mr-3" />
                                                    <input
                                                        type="password"
                                                        name="newPassword"
                                                        value={formData.newPassword}
                                                        onChange={handleChange}
                                                        className="bg-transparent w-full text-white focus:outline-none"
                                                        placeholder="Enter new password"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-gray-300 text-sm font-semibold mb-2">
                                                    Confirm New Password
                                                </label>
                                                <div className="flex items-center border border-red-500 rounded-lg p-3 bg-gray-800 bg-opacity-50">
                                                    <FaLock className="text-gray-400 mr-3" />
                                                    <input
                                                        type="password"
                                                        name="confirmPassword"
                                                        value={formData.confirmPassword}
                                                        onChange={handleChange}
                                                        className="bg-transparent w-full text-white focus:outline-none"
                                                        placeholder="Confirm new password"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex gap-4 mt-8">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setEditMode(false);
                                                    setFormData({
                                                        name: user.name,
                                                        email: user.email,
                                                        currentPassword: "",
                                                        newPassword: "",
                                                        confirmPassword: ""
                                                    });
                                                    setError("");
                                                }}
                                                className="w-1/2 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                className="w-1/2 py-3 bg-gradient-to-r from-red-700 to-red-500 hover:from-red-600 hover:to-red-400 rounded-lg flex items-center justify-center gap-2 transition"
                                            >
                                                <FaSave />
                                                Save Changes
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </form>
                    </div>
                </motion.div>
            </div>

            {/* Footer */}
            <footer className="bg-black bg-opacity-60 backdrop-blur-md p-4 text-center mt-10 border-t border-red-700">
                <p className="text-gray-500">© 2025 SQL Murder Mystery | All Rights Reserved</p>
            </footer>
        </div>
    );
};

export default ProfilePage;