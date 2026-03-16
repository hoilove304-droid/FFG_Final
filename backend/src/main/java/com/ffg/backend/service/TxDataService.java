package com.ffg.backend.service;

import com.ffg.backend.dto.TxDataRequest;
import com.ffg.backend.dto.TxDataResponse;
import com.ffg.backend.mapper.TxDataMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TxDataService {

  private final TxDataMapper txDataMapper;

  public TxDataService(TxDataMapper txDataMapper) {
    this.txDataMapper = txDataMapper;
  }

  public int insertTxData(TxDataRequest request) {
    return txDataMapper.insertTxData(request);
  }

  public List<TxDataResponse> getRecentTxData() {
    return txDataMapper.selectRecentTxData();
  }
}