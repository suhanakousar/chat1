import React, { useState, useEffect } from "react";
import axios from "axios";
import io from "socket.io-client";
import { AvatarPerson } from "./ReusableComponents";
import {
  IconButton,
  Avatar,
  Badge,
  Button,
  Modal,
  Divider,
  Input,
} from "../ui/ThemeAwareComponents";
import {
  FaEdit,
  FaCopy,
  FaCheck,
  FaTimes,
  FaTimesCircle,
  FaUserShield,
  FaChevronDown,
  FaChevronUp,
  FaCalendar,
  FaUsers,
  FaLink,
  FaSync,
} from "react-icons/fa";
import { showToastError, showToastSuccess } from "../common/ShowToast";
import { API_BASE_URL } from "../../config/api";

const CollapsibleSection = ({ title, icon, children, defaultOpen = true, count }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-brand-grey-200 dark:border-brand-grey-light last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-brand-grey-50 dark:hover:bg-brand-grey-light/50 transition-colors"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3">
          <span className="text-brand-grey-600 dark:text-brand-grey-400">{icon}</span>
          <h3 className="font-['Montserrat'] font-semibold text-brand-grey-dark dark:text-brand-white">
            {title}
          </h3>
          {count !== undefined && (
            <Badge variant="default" className="ml-2">
              {count}
            </Badge>
          )}
        </div>
        {isOpen ? (
          <FaChevronUp className="text-brand-grey-500 dark:text-brand-grey-400" />
        ) : (
          <FaChevronDown className="text-brand-grey-500 dark:text-brand-grey-400" />
        )}
      </button>
      {isOpen && <div className="px-6 py-4">{children}</div>}
    </div>
  );
};

const MemberItem = ({ member, currentUserId, isAdmin, onUserInfoClick }) => {
  const isCurrentUser = member.id === currentUserId;
  
  return (
    <div className="flex items-center justify-between py-3 group">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <Avatar
          src={member.profile_picture}
          alt={member.given_name}
          fallback={member.given_name?.charAt(0)}
          size="md"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-['Inter'] font-medium text-brand-grey-dark dark:text-brand-white truncate">
              {member.given_name}
              {isCurrentUser && (
                <span className="text-brand-grey-500 dark:text-brand-grey-400 ml-1">
                  (You)
                </span>
              )}
            </p>
            {isAdmin && <Badge variant="admin">Admin</Badge>}
          </div>
          {member.email && (
            <p className="font-['Inter'] text-sm text-brand-grey-600 dark:text-brand-grey-400 truncate">
              {member.email}
            </p>
          )}
        </div>
      </div>
      {!isCurrentUser && onUserInfoClick && (
        <IconButton
          icon={<FaUserShield />}
          onClick={() => onUserInfoClick(member)}
          className="opacity-0 group-hover:opacity-100 transition-opacity"
          ariaLabel={`Manage ${member.given_name}`}
        />
      )}
    </div>
  );
};

const JoinRequestItem = ({ request, onAccept, onReject }) => {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-3">
        <Avatar
          src={request.profile_picture}
          alt={request.given_name}
          fallback={request.given_name?.charAt(0)}
          size="md"
        />
        <div>
          <p className="font-['Inter'] font-medium text-brand-grey-dark dark:text-brand-white">
            {request.given_name}
          </p>
          {request.email && (
            <p className="font-['Inter'] text-sm text-brand-grey-600 dark:text-brand-grey-400">
              {request.email}
            </p>
          )}
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => onAccept(request.id)}
          className="p-2 rounded-full bg-success/10 text-success hover:bg-success/20 transition-colors"
          aria-label={`Accept ${request.given_name}'s request`}
        >
          <FaCheck />
        </button>
        <button
          onClick={() => onReject(request.id)}
          className="p-2 rounded-full bg-error/10 text-error hover:bg-error/20 transition-colors"
          aria-label={`Reject ${request.given_name}'s request`}
        >
          <FaTimes />
        </button>
      </div>
    </div>
  );
};

const ChatInfo = ({ chatId, currentUserId, onClose, setCurrentChatId }) => {
  const userId = currentUserId || localStorage.getItem("user_id");
  const [groupData, setGroupData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [joinRequests, setJoinRequests] = useState([]);
  const [isEditingName, setIsEditingName] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [isUserInfoModalOpen, setIsUserInfoModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isCurrentUserAdmin, setIsCurrentUserAdmin] = useState(false);
  const [socket, setSocket] = useState(null);

  const fetchGroupData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/chatroom/${chatId}`);
        const chatRoom = response.data.chatRoom;

        const members = [];
        const pendingMembers = [];

        for (const member of chatRoom.members) {
          if (member.status === "approved") {
            members.push(member);
          } else if (member.status === "pending") {
            pendingMembers.push(member);
          }
        }

        // Format members and join requests to handle missing user data
        const formattedMembers = members.filter(member => member.user).map(member => ({
          id: member.user.id,
          given_name: member.user.given_name || 'Unknown User',
          profile_picture: member.user.profile_picture,
          email: member.user.email,
          status: member.status,
          timestamp: member.timestamp
        }));

        const formattedJoinRequests = pendingMembers.filter(member => member.user).map(member => ({
          id: member.user.id,
          given_name: member.user.given_name || 'Unknown User',
          profile_picture: member.user.profile_picture,
          email: member.user.email,
          status: member.status,
          timestamp: member.timestamp
        }));

        const mockData = {
          id: chatRoom.id,
          name: chatRoom.name,
          createdAt: chatRoom.created_at,
          description: chatRoom.description,
          adminId: chatRoom.admin_id,
          inviteLink: `${window.location.origin}/Chat/${chatRoom.id}`,
          members: formattedMembers,
          joinRequests: formattedJoinRequests,
        };

        setGroupData(mockData);
        setNewGroupName(mockData.name);
        setJoinRequests(mockData.joinRequests);
        setIsCurrentUserAdmin(mockData.adminId === Number(userId));
        setLoading(false);
      } catch (err) {
        console.error("Failed to load group data:", err);
        setError("Failed to load group data");
        setLoading(false);
      }
    };

  useEffect(() => {
    if (chatId) {
      fetchGroupData();
    }
  }, [chatId, userId]);

  useEffect(() => {
    const socketInstance = io(`${API_BASE_URL}`, {
      transports: ["websocket"],
      auth: { userId: userId },
    });

    socketInstance.on("connect", () => {
      console.log("ChatInfo socket connected");
      // Join the chat room to receive notifications
      socketInstance.emit("joinRoom", chatId);
    });

    socketInstance.on("new-join-request", (data) => {
      if (data.chatId === chatId && isCurrentUserAdmin) {
        // Refresh join requests
        fetchGroupData();
      }
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [chatId, userId, isCurrentUserAdmin]);

  const handleRefresh = () => {
    if (chatId) {
      fetchGroupData();
    }
  };

  const handleCopyInviteLink = () => {
    navigator.clipboard.writeText(groupData.inviteLink);
    showToastSuccess("Invite link copied to clipboard!");
  };

  const handleJoinRequest = async (requestUserId, approve) => {
    try {
      await axios.put(`${API_BASE_URL}/chatroom/${chatId}/memberRequest`, {
        userId: requestUserId,
        adminId: userId,
        action: approve ? 'approve' : 'reject',
      });

      // Refresh the group data to ensure UI is up to date
      await fetchGroupData();

      if (approve) {
        showToastSuccess("Member approved successfully");
      } else {
        showToastSuccess("Request rejected");
      }

      // Notify the user via socket
      if (socket) {
        socket.emit("join-request-handled", { userId: requestUserId, chatId, action: approve ? 'approved' : 'rejected' });
      } else {
        console.log("Socket not available in ChatInfo");
      }
    } catch (err) {
      console.error("Failed to handle join request", err);
      showToastError("Failed to process request");
    }
  };

  const handleLeaveGroup = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/chatroom/${chatId}/members/${userId}`);
      showToastSuccess("Left the group successfully");
      setIsLeaveModalOpen(false);
      if (setCurrentChatId) setCurrentChatId(null);
      if (onClose) onClose();
    } catch (err) {
      console.error("Failed to leave group", err);
      showToastError("Failed to leave group");
    }
  };

  const handleUserAction = async (targetUserId, action) => {
    try {
      setIsUserInfoModalOpen(false);

      if (action === "makeAdmin") {
        await axios.put(`${API_BASE_URL}/chatroom/${chatId}/changeAdmin`, {
          newAdminId: targetUserId,
        });
        setGroupData((prev) => ({
          ...prev,
          adminId: targetUserId,
        }));
        setIsCurrentUserAdmin(false);
        showToastSuccess("Admin status transferred successfully");
      } else if (action === "removeMember") {
        await axios.delete(`${API_BASE_URL}/chatroom/${chatId}/members/${targetUserId}`);
        setGroupData((prev) => ({
          ...prev,
          members: prev.members.filter((member) => member.id !== targetUserId),
        }));
        showToastSuccess("Member removed successfully");
      }
    } catch (err) {
      console.error(`Failed to ${action}`, err);
      showToastError(`Failed to ${action}`);
    }
  };

  const handleSaveName = async () => {
    try {
      if (!newGroupName.trim()) {
        showToastError("Group name cannot be empty");
        return;
      }

      if (newGroupName.trim() === groupData.name) {
        setIsEditingName(false);
        return;
      }

      await axios.put(`${API_BASE_URL}/chatroom/${chatId}`, {
        name: newGroupName,
      });

      setGroupData((prev) => ({
        ...prev,
        name: newGroupName.trim(),
      }));

      setIsEditingName(false);
      showToastSuccess("Group name updated successfully");
    } catch (err) {
      console.error("Failed to update group name", err);
      showToastError("Failed to update group name");
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "Unknown";
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <aside className="w-80 lg:w-96 border-l border-brand-grey-200 dark:border-brand-grey-light bg-brand-white-soft dark:bg-brand-grey-medium flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-brand-grey-200 dark:border-brand-grey-600 border-t-brand-yellow mx-auto mb-4"></div>
          <p className="font-['Inter'] text-brand-grey-600 dark:text-brand-grey-400">
            Loading chat info...
          </p>
        </div>
      </aside>
    );
  }

  if (error) {
    return (
      <aside className="w-80 lg:w-96 border-l border-brand-grey-200 dark:border-brand-grey-light bg-brand-white-soft dark:bg-brand-grey-medium flex items-center justify-center">
        <div className="text-center p-6">
          <p className="font-['Inter'] text-error mb-4">{error}</p>
          <Button variant="secondary" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-80 lg:w-96 border-l border-brand-grey-200 dark:border-brand-grey-light bg-brand-white-soft dark:bg-brand-grey-medium flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-brand-grey-200 dark:border-brand-grey-light flex-shrink-0">
        {isEditingName ? (
          <div className="flex items-center gap-2">
            <Input
              type="text"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              className="flex-1"
              maxLength={50}
              autoFocus
              aria-label="Edit group name"
            />
            <IconButton
              icon={<FaCheck className="text-success" />}
              onClick={handleSaveName}
              ariaLabel="Save group name"
            />
            <IconButton
              icon={<FaTimes className="text-error" />}
              onClick={() => {
                setNewGroupName(groupData.name);
                setIsEditingName(false);
              }}
              ariaLabel="Cancel editing"
            />
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <h2 className="font-['Montserrat'] text-xl font-bold text-brand-grey-dark dark:text-brand-white">
              {groupData?.name}
            </h2>
            {isCurrentUserAdmin && (
              <>
                <IconButton
                  icon={<FaSync />}
                  onClick={handleRefresh}
                  ariaLabel="Refresh group data"
                />
                <IconButton
                  icon={<FaEdit />}
                  onClick={() => setIsEditingName(true)}
                  ariaLabel="Edit group name"
                />
              </>
            )}
          </div>
        )}
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto scrollbar-custom">
        {/* Group Details */}
        <CollapsibleSection title="Details" icon={<FaCalendar />} defaultOpen={true}>
          <div className="space-y-3">
            <div>
              <p className="font-['Inter'] text-xs text-brand-grey-600 dark:text-brand-grey-400 mb-1">
                Created
              </p>
              <p className="font-['Inter'] text-sm text-brand-grey-dark dark:text-brand-white">
                {formatDate(groupData?.createdAt)}
              </p>
            </div>
            {groupData?.description && (
              <div>
                <p className="font-['Inter'] text-xs text-brand-grey-600 dark:text-brand-grey-400 mb-1">
                  Description
                </p>
                <p className="font-['Inter'] text-sm text-brand-grey-dark dark:text-brand-white">
                  {groupData.description}
                </p>
              </div>
            )}
          </div>
        </CollapsibleSection>

        {/* Members */}
        <CollapsibleSection
          title="Members"
          icon={<FaUsers />}
          count={groupData?.members?.length}
          defaultOpen={true}
        >
          <div className="space-y-1">
            {groupData?.members.map((member) => (
              <MemberItem
                key={member.id}
                member={member}
                currentUserId={Number(userId)}
                isAdmin={member.id === groupData.adminId}
                onUserInfoClick={
                  isCurrentUserAdmin && member.id !== Number(userId)
                    ? (user) => {
                        setSelectedUser(user);
                        setIsUserInfoModalOpen(true);
                      }
                    : null
                }
              />
            ))}
          </div>
        </CollapsibleSection>

        {/* Join Requests (Admin Only) */}
        {isCurrentUserAdmin && joinRequests.length > 0 && (
          <CollapsibleSection
            title="Pending Requests"
            icon={<FaUserShield />}
            count={joinRequests.length}
            defaultOpen={true}
          >
            <div className="space-y-1">
              {joinRequests.map((request) => (
                <JoinRequestItem
                  key={request.id}
                  request={request}
                  onAccept={(id) => handleJoinRequest(id, true)}
                  onReject={(id) => handleJoinRequest(id, false)}
                />
              ))}
            </div>
          </CollapsibleSection>
        )}

        {/* Invite Link */}
        <CollapsibleSection title="Invite Link" icon={<FaLink />} defaultOpen={false}>
          <div className="space-y-3">
            <p className="font-['Inter'] text-sm text-brand-grey-600 dark:text-brand-grey-400">
              Share this link to invite others to the group
            </p>
            <div className="flex gap-2">
              <Input
                type="text"
                value={groupData?.inviteLink}
                readOnly
                className="flex-1 text-sm"
                aria-label="Invite link"
              />
              <Button variant="secondary" onClick={handleCopyInviteLink}>
                <FaCopy />
              </Button>
            </div>
          </div>
        </CollapsibleSection>
      </div>

      {/* Footer Actions */}
      <div className="px-6 py-4 border-t border-brand-grey-200 dark:border-brand-grey-light flex-shrink-0">
        <button
          onClick={() => setIsLeaveModalOpen(true)}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 text-error hover:bg-error/10 rounded-2xl transition-colors font-['Montserrat'] font-semibold"
        >
          <FaTimesCircle />
          Leave Group
        </button>
      </div>

      {/* Leave Group Modal */}
      <Modal
        isOpen={isLeaveModalOpen}
        onClose={() => setIsLeaveModalOpen(false)}
        title="Leave Group"
      >
        <p className="font-['Inter'] text-brand-grey-600 dark:text-brand-grey-400 mb-6">
          Are you sure you want to leave <strong>{groupData?.name}</strong>? You'll need to be
          re-invited to rejoin.
        </p>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => setIsLeaveModalOpen(false)} className="flex-1">
            Cancel
          </Button>
          <Button variant="primary" onClick={handleLeaveGroup} className="flex-1 bg-error hover:bg-error/90 text-white">
            Leave Group
          </Button>
        </div>
      </Modal>

      {/* User Info Modal */}
      <Modal
        isOpen={isUserInfoModalOpen}
        onClose={() => setIsUserInfoModalOpen(false)}
        title="Manage Member"
      >
        {selectedUser && (
          <div>
            <div className="text-center mb-6">
              <Avatar
                src={selectedUser.profile_picture}
                alt={selectedUser.given_name}
                fallback={selectedUser.given_name?.charAt(0)}
                size="xl"
                className="mx-auto mb-4"
              />
              <h3 className="font-['Montserrat'] font-bold text-lg text-brand-grey-dark dark:text-brand-white mb-1">
                {selectedUser.given_name}
              </h3>
              <p className="font-['Inter'] text-sm text-brand-grey-600 dark:text-brand-grey-400">
                {selectedUser.email}
              </p>
            </div>
            {isCurrentUserAdmin && (
              <div className="flex flex-col gap-3">
                <Button
                  variant="primary"
                  onClick={() => handleUserAction(selectedUser.id, "makeAdmin")}
                  className="w-full flex items-center justify-center"
                >
                  <FaUserShield className="mr-2" />
                  Make Admin
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => handleUserAction(selectedUser.id, "removeMember")}
                  className="w-full flex items-center justify-center border-error text-error hover:bg-error/10"
                >
                  <FaTimesCircle className="mr-2" />
                  Remove Member
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </aside>
  );
};

export default ChatInfo;
