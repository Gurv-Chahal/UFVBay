import { useState, useEffect } from "react";
import { getUserInfo, updateUserInfo } from "../services/AuthService.js";
import "../public/account.css";

const AccountInfo = () => {
    // State variables
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [updatedUser, setUpdatedUser] = useState({});
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const userInfo = await getUserInfo();
                console.log("Fetched userInfo:", userInfo);
                setUser(userInfo);
                setUpdatedUser(userInfo);
            } catch (error) {
                console.error("Error fetching user info:", error);
                setError("Failed to fetch user information.");
            }
        };
        fetchUserInfo();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedUser((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleCancelClick = () => {
        setIsEditing(false);
        setUpdatedUser(user);
    };

    const handleSaveClick = async () => {
        try {
            const updatedInfo = await updateUserInfo(updatedUser);
            setUser(updatedInfo);
            setIsEditing(false);
            alert("Profile updated successfully!");
        } catch (error) {
            console.error("Error updating user info:", error);
            setError("Failed to update user information.");
        }
    };


    if (!user) {
        return <div>No user is logged in.</div>;
    }

    return (
        <div className="account-container">
            <header className="account-header">
                <h1>Account Information</h1>
            </header>

            {error && <div className="error-message">{error}</div>}

            {!isEditing ? (
                <div>
                    {/* account detials*/}
                    <div className="account-details">
                        <p>
                            <strong>Name:</strong> {user.name || user.username}
                        </p>
                        <p>
                            <strong>Email:</strong> {user.email}
                        </p>
                        <p>
                            <strong>Username:</strong> {user.username}
                        </p>
                    </div>

                    {/* nav buttons */}
                    <div className="account-actions">
                        <button className="btn btn-primary" onClick={handleEditClick}>
                            Edit Profile
                        </button>
                    </div>
                </div>
            ) : (
                <div>
                    {/*edit Form */}
                    <div className="account-details">
                        <div className="form-group">
                            <label htmlFor="name">
                                <strong>Name:</strong>
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={updatedUser.name || ""}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">
                                <strong>Email:</strong>
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={updatedUser.email || ""}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="username">
                                <strong>Username:</strong>
                            </label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={updatedUser.username || ""}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    {/* Butons */}
                    <div className="account-actions">
                        <button className="btn btn-primary" onClick={handleSaveClick}>
                            Save
                        </button>
                        <button className="btn btn-secondary" onClick={handleCancelClick}>
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AccountInfo;
