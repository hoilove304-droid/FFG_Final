package com.ffg.backend.mapper;
import com.ffg.backend.dto.Member;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface MemberMapper {
  List<Member> findAll();
}
