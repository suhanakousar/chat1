import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Modal,
  Avatar,
  Badge,
  Button,
  IconButton,
  Divider,
} from '../ui/ThemeAwareComponents';
import {
  FaUsers,
  FaUserShield,
  FaTimesCircle,
  FaCrown,
  FaEnvelope,
  FaCalendar,
  FaTimes,
  FaEllipsisV,
} from 'react-icons/fa';
import { showToastError, showToastSuccess } from '../common/ShowToast';
import { API_BASE_URL } from '../../config/api';

const MemberListItem = ({ member, isAdmin, isCurrentUserAdmin, currentUserId, onClick }) => {
  const [showActions, setShowActions] = useState(false);
  const isCurrentUser = member.id === currentUserId;

  return (
    <div
      className="group flex items-center justify-between p-3 hover:bg-brand-grey-50 dark:hover:bg-brand-grey-light/30 rounded-xl cursor-pointer transition-colors"
      onClick={() => onClick(member)}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
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
      
      {isCurrentUserAdmin && !isCurrentUser && showActions && (
        <IconButton
          icon={<FaEllipsisV />}
          onClick={(e) => {
            e.stopPropagation();
            onClick(member);
          }}
          ariaLabel={`Manage ${member.given_name}`}
          className="opacity-0 group-hover:opacity-100"
        />
      )}
    </div>
  );
};

const MemberProfileModal = ({
  isOpen,
  onClose,
  member,
  isAdmin,
  isCurrentUserAdmin,
  currentUserId,
  onMakeAdmin,
  onRemoveMember,
  chatId,
}) => {
  const [memberDetails, setMemberDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMemberDetails = async () => {
      if (!member || !isOpen) return;

      try {
        setLoading(true);
        const response = await axios.get(
          `${API_BASE_URL}/chatroom/${chatId}/members/${member.id}`
        );
        setMemberDetails(response.data.member);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch member details:', error);
        setMemberDetails(member);
        setLoading(false);
      }
    };

    if (isOpen && member) {
      fetchMemberDetails();
    }
  }, [isOpen, member, chatId]);

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown';
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const isCurrentUser = member?.id === currentUserId;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Member Profile">
      {loading ? (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-brand-grey-200 dark:border-brand-grey-600 border-t-brand-yellow"></div>
        </div>
      ) : (
        <div>
          <div className="text-center mb-6">
            <Avatar
              src={memberDetails?.profile_picture || member?.profile_picture}
              alt={memberDetails?.given_name || member?.given_name}
              fallback={(memberDetails?.given_name || member?.given_name)?.charAt(0)}
              size="xl"
              className="mx-auto mb-4"
            />
            <div className="flex items-center justify-center gap-2 mb-2">
              <h3 className="font-['Montserrat'] font-bold text-xl text-brand-grey-dark dark:text-brand-white">
                {memberDetails?.given_name || member?.given_name}
              </h3>
              {isAdmin && <Badge variant="admin">Admin</Badge>}
              {isCurrentUser && <Badge variant="default">You</Badge>}
            </div>
            
            {(memberDetails?.email || member?.email) && (
              <div className="flex items-center justify-center gap-2 text-brand-grey-600 dark:text-brand-grey-400 mb-4">
                <FaEnvelope className="text-sm" />
                <span className="font-['Inter'] text-sm">
                  {memberDetails?.email || member?.email}
                </span>
              </div>
            )}
          </div>

          <Divider />

          <div className="space-y-4 my-6">
            <div className="flex items-start gap-3">
              <FaCalendar className="text-brand-grey-500 dark:text-brand-grey-400 mt-1" />
              <div className="flex-1">
                <p className="font-['Inter'] text-xs text-brand-grey-600 dark:text-brand-grey-400 mb-1">
                  Joined
                </p>
                <p className="font-['Inter'] text-sm text-brand-grey-dark dark:text-brand-white">
                  {formatDate(memberDetails?.timestamp || member?.timestamp)}
                </p>
              </div>
            </div>

            {isAdmin && (
              <div className="flex items-start gap-3">
                <FaCrown className="text-brand-yellow mt-1" />
                <div className="flex-1">
                  <p className="font-['Inter'] text-xs text-brand-grey-600 dark:text-brand-grey-400 mb-1">
                    Role
                  </p>
                  <p className="font-['Inter'] text-sm text-brand-grey-dark dark:text-brand-white">
                    Administrator
                  </p>
                </div>
              </div>
            )}
          </div>

          {isCurrentUserAdmin && !isCurrentUser && (
            <>
              <Divider />
              <div className="flex flex-col gap-3 mt-6">
                {!isAdmin && (
                  <Button
                    variant="primary"
                    onClick={() => {
                      onMakeAdmin(member.id);
                      onClose();
                    }}
                    className="w-full flex items-center justify-center"
                  >
                    <FaUserShield className="mr-2" />
                    Make Admin
                  </Button>
                )}
                <Button
                  variant="secondary"
                  onClick={() => {
                    onRemoveMember(member.id);
                    onClose();
                  }}
                  className="w-full flex items-center justify-center border-error text-error hover:bg-error/10"
                >
                  <FaTimesCircle className="mr-2" />
                  Remove from Group
                </Button>
              </div>
            </>
          )}
        </div>
      )}
    </Modal>
  );
};

const MemberProfiles = ({ chatId, currentUserId, isOpen, onClose }) => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [showMemberProfile, setShowMemberProfile] = useState(false);
  const [adminId, setAdminId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchMembers = async () => {
      if (!isOpen || !chatId) return;

      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/chatroom/${chatId}`);
        const chatRoom = response.data.chatRoom;

        const approvedMembers = chatRoom.members.filter(
          (member) => member.status === 'approved'
        );

        setMembers(approvedMembers);
        setAdminId(chatRoom.admin_id);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch members:', err);
        setError('Failed to load members');
        setLoading(false);
      }
    };

    fetchMembers();
  }, [isOpen, chatId]);

  const handleMemberClick = (member) => {
    setSelectedMember(member);
    setShowMemberProfile(true);
  };

  const handleMakeAdmin = async (userId) => {
    try {
      await axios.put(`${API_BASE_URL}/chatroom/${chatId}/changeAdmin`, {
        newAdminId: userId,
      });
      setAdminId(userId);
      showToastSuccess('Admin status transferred successfully');
      
      const response = await axios.get(`${API_BASE_URL}/chatroom/${chatId}`);
      const chatRoom = response.data.chatRoom;
      const approvedMembers = chatRoom.members.filter(
        (member) => member.status === 'approved'
      );
      setMembers(approvedMembers);
    } catch (err) {
      console.error('Failed to make admin:', err);
      showToastError('Failed to make admin');
    }
  };

  const handleRemoveMember = async (userId) => {
    try {
      await axios.delete(`${API_BASE_URL}/chatroom/${chatId}/members/${userId}`);
      setMembers((prev) => prev.filter((member) => member.id !== userId));
      showToastSuccess('Member removed successfully');
    } catch (err) {
      console.error('Failed to remove member:', err);
      showToastError('Failed to remove member');
    }
  };

  const isCurrentUserAdmin = adminId === Number(currentUserId);

  const filteredMembers = members.filter((member) =>
    member.given_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title={`Members (${members.length})`}>
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-brand-grey-200 dark:border-brand-grey-600 border-t-brand-yellow"></div>
          </div>
        ) : error ? (
          <div className="text-center p-6">
            <p className="font-['Inter'] text-error mb-4">{error}</p>
            <Button variant="secondary" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </div>
        ) : (
          <div>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-modern w-full"
                aria-label="Search members"
              />
            </div>

            <div className="space-y-1 max-h-[60vh] overflow-y-auto scrollbar-custom">
              {filteredMembers.length === 0 ? (
                <div className="text-center py-8">
                  <FaUsers className="mx-auto text-4xl text-brand-grey-400 mb-3" />
                  <p className="font-['Inter'] text-brand-grey-600 dark:text-brand-grey-400">
                    No members found
                  </p>
                </div>
              ) : (
                filteredMembers.map((member) => (
                  <MemberListItem
                    key={member.id}
                    member={member}
                    isAdmin={member.id === adminId}
                    isCurrentUserAdmin={isCurrentUserAdmin}
                    currentUserId={Number(currentUserId)}
                    onClick={handleMemberClick}
                  />
                ))
              )}
            </div>
          </div>
        )}
      </Modal>

      <MemberProfileModal
        isOpen={showMemberProfile}
        onClose={() => {
          setShowMemberProfile(false);
          setSelectedMember(null);
        }}
        member={selectedMember}
        isAdmin={selectedMember?.id === adminId}
        isCurrentUserAdmin={isCurrentUserAdmin}
        currentUserId={Number(currentUserId)}
        onMakeAdmin={handleMakeAdmin}
        onRemoveMember={handleRemoveMember}
        chatId={chatId}
      />
    </>
  );
};

export default MemberProfiles;
