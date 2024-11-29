import { useState, useEffect } from "react";
import { getUserInfo } from "../services/AuthService.js";

const AccountInfo = () => {

    // state variable holding user information
    const [user, setUser] = useState(null);

    useEffect(() => {

        // uses async because it needs to wait for data to be fetched by rest api
        const fetchUserInfo = async () => {
            try {

                // calls to fetch user data using rest api, must also decode JWT token
                const userInfo = await getUserInfo();
                console.log("Fetched userInfo:", userInfo); // Add this line


                // update user state variable with the fetched data
                setUser(userInfo);
            } catch (error) {
                console.error("Error fetching user info:", error);
            }
        };

        // make call to fetch user data
        fetchUserInfo();
    }, []);


    // if there is no user then return no user logged in
    if (!user) {
        return <div>No user is logged in.</div>;
    }

    return (
        <div>
            <h2>Account Information</h2>

            {/*display name or username if it exists*/}
            <p>
                <strong>Name:</strong> {user.name || user.username}
            </p>

            {/*display email*/}
            <p>
                <strong>Email:</strong> {user.email}
            </p>

            {/*display email*/}
            <p>
                <strong>Username:</strong> {user.username}
            </p>

        </div>
    );
};

export default AccountInfo;
