package com.ffg.backend.dto;

import java.util.List;
import java.util.Map;

public class CustomerDetailResponseDto {
  private CustomerDetailCustomerDto customer;
  private CustomerTransactionDto currentTransaction;
  private List<CustomerTransactionDto> recentTransactions;
  private Map<String, Object> summary;
  private Map<String, Object> score;

  public CustomerDetailCustomerDto getCustomer() { return customer; }
  public void setCustomer(CustomerDetailCustomerDto customer) { this.customer = customer; }

  public CustomerTransactionDto getCurrentTransaction() { return currentTransaction; }
  public void setCurrentTransaction(CustomerTransactionDto currentTransaction) { this.currentTransaction = currentTransaction; }

  public List<CustomerTransactionDto> getRecentTransactions() { return recentTransactions; }
  public void setRecentTransactions(List<CustomerTransactionDto> recentTransactions) { this.recentTransactions = recentTransactions; }

  public Map<String, Object> getSummary() { return summary; }
  public void setSummary(Map<String, Object> summary) { this.summary = summary; }

  public Map<String, Object> getScore() { return score; }
  public void setScore(Map<String, Object> score) { this.score = score; }
}