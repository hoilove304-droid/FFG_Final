package com.ffg.backend.controller;

import com.ffg.backend.dto.Member;
import com.ffg.backend.mapper.MemberMapper;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

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
}