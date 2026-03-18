package com.ffg.backend.service;

import com.ffg.backend.dto.ChatMessageDto;
import com.ffg.backend.dto.ChatUserDto;
import com.ffg.backend.dto.Member;
import com.ffg.backend.mapper.ChatMapper;
import com.ffg.backend.mapper.MemberMapper;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class ChatService {

  private final ChatMapper chatMapper;
  private final MemberMapper memberMapper;

  public ChatService(ChatMapper chatMapper, MemberMapper memberMapper) {
    this.chatMapper = chatMapper;
    this.memberMapper = memberMapper;
  }

  public List<ChatUserDto> getChatUsers(String memberId) {
    Member loginUser = memberMapper.findByMemberId(memberId);

    if (loginUser == null) {
      return Collections.emptyList();
    }

    String role = loginUser.getRole();
    String bankCode = loginUser.getBankCode();

    if ("admin".equalsIgnoreCase(role)) {
      return chatMapper.findAllBankUsersExceptMe(memberId);
    }

    if ("bank".equalsIgnoreCase(role)) {
      return chatMapper.findSameBankUsersExceptMe(memberId, bankCode);
    }

    return Collections.emptyList();
  }

  public List<ChatMessageDto> getChatHistory(String myId, String targetId) {
    if (myId == null || myId.isBlank() || targetId == null || targetId.isBlank()) {
      return Collections.emptyList();
    }

    return chatMapper.findChatHistory(myId, targetId);
  }

  public boolean sendMessage(String senderId, String receiverId, String message) {
    if (senderId == null || senderId.isBlank()) {
      return false;
    }

    if (receiverId == null || receiverId.isBlank()) {
      return false;
    }

    if (message == null || message.isBlank()) {
      return false;
    }

    String trimmedMessage = message.trim();

    if (trimmedMessage.length() > 1000) {
      return false;
    }

    int result = chatMapper.insertChatMessage(senderId, receiverId, trimmedMessage);
    return result > 0;
  }

  public int markMessagesAsRead(String myId, String targetId) {
    if (myId == null || myId.isBlank() || targetId == null || targetId.isBlank()) {
      return 0;
    }

    return chatMapper.markMessagesAsRead(myId, targetId);
  }
}