package com.smartstock.enterprise.repository;

import com.smartstock.enterprise.model.ProductLock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ProductLockRepository extends JpaRepository<ProductLock, UUID> {
    // expiresAt is stored as TEXT "yyyy-MM-dd HH:mm:ss" — string comparison works
    // correctly
    List<ProductLock> findByStatusAndExpiresAtBefore(ProductLock.LockStatus status, String now);

    // Find active locks for a product to calculate available stock
    List<ProductLock> findByProduct_IdAndStatus(Long productId, ProductLock.LockStatus status);
}
