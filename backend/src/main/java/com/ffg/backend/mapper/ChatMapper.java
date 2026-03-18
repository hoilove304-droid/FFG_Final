package com.ffg.backend.mapper;

import com.ffg.backend.dto.ChatMessageDto;
import com.ffg.backend.dto.ChatUserDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface ChatMapper {

  List<ChatUserDto> findAllBankUsersExceptMe(@Param("memberId") String memberId);

  List<ChatUserDto> findSameBankUsersExceptMe(
      @Param("memberId") String memberId,
      @Param("bankCode") String bankCode
  );

  List<ChatMessageDto> findChatHistory(
      @Param("myId") String myId,
      @Param("targetId") String targetId
  );

  int insertChatMessage(
      @Param("senderId") String senderId,
      @Param("receiverId") String receiverId,
      @Param("message") String message
  );

  int markMessagesAsRead(
      @Param("myId") String myId,
      @Param("targetId") String targetId
  );
}