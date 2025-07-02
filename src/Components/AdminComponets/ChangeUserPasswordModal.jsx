import React, { useState } from "react";
import { Modal, Button, Input, message } from "antd";
import axios from "axios";
import { API_URL } from "../../../API";

const ChangePasswordModal = ({ isOpen, onClose, user }) => {
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  //   console.log("user to change password : ", user);
  const handlePasswordChange = async () => {
    if (newPassword.trim().length < 8) {
      message.error("Password must be at least 8 characters long.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.put(`${API_URL}/change-user-password`, {
        id: user._id,
        newPassword,
      });
      message.success(
        response.data.message || "Password updated successfully!"
      );
      setNewPassword("");
      onClose(); // Close the modal after success
    } catch (error) {
      console.error("Error updating password:", error);
      message.error(error.response?.data?.err || "Failed to update password.");
    } finally {
      setLoading(false);
      setNewPassword("");
    }
  };

  return (
    <Modal
      title={`Change Password for ${user?.name || "User"}`}
      visible={isOpen}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={handlePasswordChange}
        >
          Update Password
        </Button>,
      ]}
    >
      <Input.Password
        placeholder="Enter new password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
    </Modal>
  );
};

export default ChangePasswordModal;
