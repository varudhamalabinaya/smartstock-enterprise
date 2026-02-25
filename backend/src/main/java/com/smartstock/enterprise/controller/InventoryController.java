package com.smartstock.enterprise.controller;

import com.smartstock.enterprise.dto.Dto;
import com.smartstock.enterprise.model.ProductLock;
import com.smartstock.enterprise.service.InventoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/inventory")
@RequiredArgsConstructor
public class InventoryController {

    private final InventoryService inventoryService;

    @PostMapping("/lock")
    public ResponseEntity<ProductLock> lockStock(@RequestBody Dto.LockRequest request) {
        ProductLock lock = inventoryService.lockStock(request.getUserId(), request.getProductId(),
                request.getQuantity());
        return ResponseEntity.ok(lock);
    }

    @GetMapping("/available/{productId}")
    public ResponseEntity<Integer> getAvailableStock(@PathVariable Long productId) {
        return ResponseEntity.ok(inventoryService.getAvailableStock(productId));
    }
}
