package com.ffg.backend.service;

import com.ffg.backend.dto.Member;
import com.ffg.backend.mapper.MemberMapper;
import org.springframework.stereotype.Service;

@Service
public class MemberService {
  private final MemberMapper memberMapper;

  public MemberService(MemberMapper memberMapper){
    this.memberMapper = memberMapper;
  }

  public int insertMember(Member member) {
    return memberMapper.insertMember(member);
  }
}
