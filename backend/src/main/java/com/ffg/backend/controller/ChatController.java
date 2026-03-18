package com.ffg.backend.controller;

import com.ffg.backend.dto.ChatMessageDto;
import com.ffg.backend.dto.ChatSendRequestDto;
import com.ffg.backend.dto.ChatUserDto;
import com.ffg.backend.service.ChatService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/chat")
public class ChatController {

  private final ChatService chatService;

  public ChatController(ChatService chatService) {
    this.chatService = chatService;
  }

  @GetMapping("/users")
  public List<ChatUserDto> getChatUsers(@RequestParam String memberId) {
    return chatService.getChatUsers(memberId);
  }

  @GetMapping("/history")
  public List<ChatMessageDto> getChatHistory(
      @RequestParam String myId,
      @RequestParam String targetId
  ) {
    return chatService.getChatHistory(myId, targetId);
  }

  @PostMapping("/send")
  public Map<String, Object> sendMessage(@RequestBody ChatSendRequestDto request) {
    boolean success = chatService.sendMessage(
        request.getSenderId(),
        request.getReceiverId(),
        request.getMessage()
    );

    Map<String, Object> result = new HashMap<>();
    result.put("success", success);

    if (success) {
      result.put("message", "메시지 전송 성공");
    } else {
      result.put("message", "메시지 전송 실패");
    }

    return result;
  }

  @PostMapping("/read")
  public Map<String, Object> markMessagesAsRead(
      @RequestParam String myId,
      @RequestParam String targetId
  ) {
    int updatedCount = chatService.markMessagesAsRead(myId, targetId);

    Map<String, Object> result = new HashMap<>();
    result.put("success", true);
    result.put("updatedCount", updatedCount);
    return result;
  }
}