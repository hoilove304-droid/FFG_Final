package com.ffg.backend.mapper;

import com.ffg.backend.dto.Member;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface MemberMapper {
  List<Member> findAll();

  Member login(@Param("memberId") String memberId, @Param("pwd") String pwd);

  int insertMember(Member member);
}