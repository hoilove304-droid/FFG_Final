package com.ffg.backend.controller;

import com.ffg.backend.dto.TxDataRequest;
import com.ffg.backend.dto.TxDataResponse;
import com.ffg.backend.service.TxDataService;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/api/tx")
public class TxDataController {

  private final TxDataService txDataService;

  public TxDataController(TxDataService txDataService) {
    this.txDataService = txDataService;
  }

  @PostMapping
  public Map<String, Object> insertTxData(@RequestBody TxDataRequest request) {
    Map<String, Object> result = new HashMap<>();

    if (request.getUserId() == null || request.getUserId().trim().isEmpty()) {
      result.put("success", false);
      result.put("message", "사용자 ID는 필수입니다.");
      return result;
    }

    if (request.getBankCode() == null || request.getBankCode().trim().isEmpty()) {
      result.put("success", false);
      result.put("message", "은행 코드는 필수입니다.");
      return result;
    }

    if (request.getTxChannel() == null || request.getTxChannel().trim().isEmpty()) {
      result.put("success", false);
      result.put("message", "거래 채널은 필수입니다.");
      return result;
    }

    if (request.getTxType() == null || request.getTxType().trim().isEmpty()) {
      result.put("success", false);
      result.put("message", "거래 유형은 필수입니다.");
      return result;
    }

    if (request.getTxAmount() == null || request.getTxAmount() <= 0) {
      result.put("success", false);
      result.put("message", "거래 금액은 0보다 커야 합니다.");
      return result;
    }

    if (request.getTxDatetime() == null || request.getTxDatetime().trim().isEmpty()) {
      result.put("success", false);
      result.put("message", "거래 일시는 필수입니다.");
      return result;
    }

    int insertCount = txDataService.insertTxData(request);

    result.put("success", insertCount > 0);
    result.put("message", insertCount > 0 ? "거래 데이터 저장 성공" : "거래 데이터 저장 실패");

    return result;
  }

  @GetMapping("/recent")
  public List<TxDataResponse> getRecentTxData() {
    return txDataService.getRecentTxData();
  }
}