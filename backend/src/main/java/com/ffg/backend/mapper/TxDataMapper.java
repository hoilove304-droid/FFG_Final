package com.ffg.backend.mapper;

import com.ffg.backend.dto.TxDataRequest;
import com.ffg.backend.dto.TxDataResponse;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface TxDataMapper {

  int insertTxData(TxDataRequest request);

  List<TxDataResponse> selectRecentTxData();
}