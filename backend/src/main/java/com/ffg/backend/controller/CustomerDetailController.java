package com.ffg.backend.controller;

import com.ffg.backend.dto.CustomerDetailResponseDto;
import com.ffg.backend.service.CustomerDetailService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bank")
public class CustomerDetailController {

  private final CustomerDetailService customerDetailService;

  public CustomerDetailController(CustomerDetailService customerDetailService) {
    this.customerDetailService = customerDetailService;
  }

  @GetMapping("/{bankCode}/customer/{userId}/tx/{txId}")
  public CustomerDetailResponseDto getCustomerDetail(
      @PathVariable String bankCode,
      @PathVariable String userId,
      @PathVariable Long txId
  ) {
    return customerDetailService.getCustomerDetail(bankCode, userId, txId);
  }
}