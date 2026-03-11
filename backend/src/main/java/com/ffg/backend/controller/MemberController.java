package com.ffg.backend.controller;

import com.ffg.backend.dto.Member;
import com.ffg.backend.mapper.MemberMapper;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
public class MemberController {

  private final MemberMapper memberMapper;

  public MemberController(MemberMapper memberMapper) {
    this.memberMapper = memberMapper;
  }

  @GetMapping("/members")
  public List<Member> members() {
    return memberMapper.findAll();
  }

  @PostMapping("/api/login")
  public Map<String, Object> login(@RequestBody Map<String, String> req) {
    String memberId = req.get("memberId");
    String pwd = req.get("pwd");

    Member member = memberMapper.login(memberId, pwd);

    Map<String, Object> result = new HashMap<>();

    if (member == null) {
      result.put("success", false);
      result.put("message", "아이디 또는 비밀번호가 올바르지 않습니다.");
      return result;
    }

    result.put("success", true);
    result.put("id", member.getMemberId());
    result.put("role", member.getRole());
    result.put("bankCode", member.getBankCode());

    return result;
  }
}