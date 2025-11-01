// controllers/messageController.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.createMessage = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { text, userId } = req.body;
    console.log("roomId:", roomId);
    // Validate incoming data
    if (!roomId || !text || !userId) {
      return res
        .status(400)
        .json({ error: "Missing required fields (roomId, text, userId)." });
    }

    // Check if chatroom exists
    const chatroom = await prisma.chatRoom.findUnique({
      where: { id: roomId }
    });
    if (!chatroom) {
      return res.status(404).json({ error: "Chat room not found" });
    }

    // Check if user is an approved member of the room
    const membership = await prisma.chatRoomMember.findFirst({
      where: {
        chat_id: roomId,
        user_id: userId,
        status: 'approved'
      }
    });
    if (!membership) {
      return res.status(403).json({ error: "User is not a member of this chat room" });
    }

    // 1. Create the new message
    const newMessage = await prisma.message.create({
      data: {
        content: text,
        created_by: userId,
        chat_id: roomId,
      },
    });

    // 2. Update the last_message field of the room
    await prisma.chatRoom.update({
      where: { id: roomId },
      data: {
        last_message: text,
        updated_at: new Date(),
      },
    });

    // 3. Update read status for all members (set unread = true), except sender
    const members = await prisma.chatRoomMember.findMany({
      where: {
        chat_id: roomId,
        status: 'approved',
        NOT: {
          user_id: userId,
        },
      },
      select: { user_id: true },
    });

    const memberIds = members.map(m => m.user_id);

    if (memberIds.length > 0) {
      await prisma.chatRoomRead.updateMany({
        where: {
          chat_id: roomId,
          user_id: { in: memberIds },
        },
        data: {
          unread: true,
        },
      });
    }

    return res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error creating message:", error);
    return res.status(500).json({ error: "Failed to create message" });
  }
};