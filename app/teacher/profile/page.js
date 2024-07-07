"use client"

import React, { useState } from 'react';

const ProfilePage = () => {
    const [profile, setProfile] = useState({
        name: "John Doe",
        email: "john.doe@example.com",
        subject: "Mathematics",
        bio: "Passionate about making mathematics accessible and engaging for all students.",
        yearsOfExperience: 10,
    });

    const [isEditing, setIsEditing] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfile(prevProfile => ({
            ...prevProfile,
            [name]: value
        }));
    };

    const handleSave = () => {
        // Here you would typically send the updated profile to your backend
        console.log("Saving profile:", profile);
        setIsEditing(false);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">Teacher Profile</h1>
                    {!isEditing && (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                        >
                            Edit Profile
                        </button>
                    )}
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        {isEditing ? (
                            <input
                                type="text"
                                name="name"
                                value={profile.name}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                            />
                        ) : (
                            <p className="mt-1 text-lg">{profile.name}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        {isEditing ? (
                            <input
                                type="email"
                                name="email"
                                value={profile.email}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                            />
                        ) : (
                            <p className="mt-1 text-lg">{profile.email}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Subject</label>
                        {isEditing ? (
                            <input
                                type="text"
                                name="subject"
                                value={profile.subject}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                            />
                        ) : (
                            <p className="mt-1 text-lg">{profile.subject}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Years of Experience</label>
                        {isEditing ? (
                            <input
                                type="number"
                                name="yearsOfExperience"
                                value={profile.yearsOfExperience}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                            />
                        ) : (
                            <p className="mt-1 text-lg">{profile.yearsOfExperience} years</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Bio</label>
                        {isEditing ? (
                            <textarea
                                name="bio"
                                value={profile.bio}
                                onChange={handleInputChange}
                                rows="4"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                            ></textarea>
                        ) : (
                            <p className="mt-1 text-lg">{profile.bio}</p>
                        )}
                    </div>

                    {isEditing && (
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={() => setIsEditing(false)}
                                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                            >
                                Save Changes
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;