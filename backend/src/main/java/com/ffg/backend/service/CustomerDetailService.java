package com.ffg.backend.service;

import com.ffg.backend.dto.CustomerDetailCustomerDto;
import com.ffg.backend.dto.CustomerDetailResponseDto;
import com.ffg.backend.dto.CustomerTransactionDto;
import com.ffg.backend.mapper.CustomerDetailMapper;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class CustomerDetailService {

  private final CustomerDetailMapper customerDetailMapper;

  public CustomerDetailService(CustomerDetailMapper customerDetailMapper) {
    this.customerDetailMapper = customerDetailMapper;
  }

  public CustomerDetailResponseDto getCustomerDetail(String bankCode, String userId, Long txId) {
    CustomerDetailCustomerDto customer =
        customerDetailMapper.selectCustomerInfo(bankCode, userId);

    CustomerTransactionDto currentTransaction =
        customerDetailMapper.selectCurrentTransaction(bankCode, userId, txId);

    List<CustomerTransactionDto> recentTransactions =
        customerDetailMapper.selectRecentTransactions(bankCode, userId);

    Map<String, Object> summary =
        customerDetailMapper.selectSummary(bankCode, userId);

    Map<String, Object> score = buildScore(currentTransaction);

    CustomerDetailResponseDto response = new CustomerDetailResponseDto();
    response.setCustomer(customer);
    response.setCurrentTransaction(currentTransaction);
    response.setRecentTransactions(recentTransactions);
    response.setSummary(summary);
    response.setScore(score);

    return response;
  }

  private Map<String, Object> buildScore(CustomerTransactionDto tx) {
    Map<String, Object> score = new HashMap<>();

    int timeScore = 0;
    int amountScore = 0;
    int locationScore = 0;
    int deviceScore = 0;

    if (tx != null) {
      if (tx.getFraudScore() != null) {
        amountScore = Math.min((int) Math.round(tx.getFraudScore() * 0.4), 100);
        timeScore = Math.min((int) Math.round(tx.getFraudScore() * 0.2), 100);
        locationScore = Math.min((int) Math.round(tx.getFraudScore() * 0.2), 100);
        deviceScore = Math.min((int) Math.round(tx.getFraudScore() * 0.2), 100);
      }
    }

    int totalScore = timeScore + amountScore + locationScore + deviceScore;

    score.put("timeScore", timeScore);
    score.put("amountScore", amountScore);
    score.put("locationScore", locationScore);
    score.put("deviceScore", deviceScore);
    score.put("totalScore", totalScore);

    return score;
  }
}