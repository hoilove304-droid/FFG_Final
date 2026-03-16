package com.ffg.backend.controller;

import com.ffg.backend.dto.Member;
import com.ffg.backend.mapper.MemberMapper;
import com.ffg.backend.service.MemberService;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api")
public class MemberController {

  private final MemberMapper memberMapper;
  private final MemberService memberService;

  public MemberController(MemberMapper memberMapper, MemberService memberService) {
    this.memberMapper = memberMapper;
    this.memberService = memberService;
  }

  @GetMapping("/members")
  public List<Member> members() {
    return memberMapper.findAll();
  }

  @PostMapping("/login")
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

  @PostMapping("/members")
  public Map<String, Object> insertMember(@RequestBody Member member) {
    Map<String, Object> result = new HashMap<>();

    int insertCount = memberService.insertMember(member);

    result.put("success", insertCount > 0);
    result.put("message", insertCount > 0 ? "사용자 추가 완료" : "사용자 추가 실패");

    return result;
  }
}