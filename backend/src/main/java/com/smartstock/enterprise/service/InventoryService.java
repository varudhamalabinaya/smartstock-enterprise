package com.smartstock.enterprise.service;

import com.smartstock.enterprise.model.Product;
import com.smartstock.enterprise.model.ProductLock;
import com.smartstock.enterprise.model.User;
import com.smartstock.enterprise.repository.ProductLockRepository;
import com.smartstock.enterprise.repository.ProductRepository;
import com.smartstock.enterprise.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class InventoryService {

    private final ProductRepository productRepository;
    private final ProductLockRepository productLockRepository;
    private final UserRepository userRepository;

    private static final int LOCK_DURATION_MINUTES = 7;
    private static final DateTimeFormatter FMT = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    @Transactional
    public ProductLock lockStock(Long userId, Long productId, int quantity) {
        Product product = productRepository.findByIdWithLock(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        List<ProductLock> activeLocks = productLockRepository.findByProduct_IdAndStatus(productId,
                ProductLock.LockStatus.LOCKED);
        int lockedQuantity = activeLocks.stream().mapToInt(ProductLock::getQuantity).sum();

        int availableStock = product.getStockQuantity() - lockedQuantity;

        if (availableStock < quantity) {
            throw new RuntimeException("Insufficient stock. Available: " + availableStock);
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        ProductLock lock = new ProductLock();
        lock.setProduct(product);
        lock.setUser(user);
        lock.setQuantity(quantity);
        lock.setStatus(ProductLock.LockStatus.LOCKED);
        lock.setLockedAt(LocalDateTime.now().format(FMT));
        lock.setExpiresAt(LocalDateTime.now().plusMinutes(LOCK_DURATION_MINUTES).format(FMT));

        return productLockRepository.save(lock);
    }

    @Scheduled(fixedRate = 60000) // Run every minute
    @Transactional
    public void releaseExpiredLocks() {
        log.info("Checking for expired locks...");
        String nowStr = LocalDateTime.now().format(FMT);
        List<ProductLock> expiredLocks = productLockRepository.findByStatusAndExpiresAtBefore(
                ProductLock.LockStatus.LOCKED, nowStr);

        for (ProductLock lock : expiredLocks) {
            lock.setStatus(ProductLock.LockStatus.RELEASED);
            log.info("Released expired lock: {}", lock.getId());
        }

        if (!expiredLocks.isEmpty()) {
            productLockRepository.saveAll(expiredLocks);
        }
    }

    public Product getProductWithAvailability(Long productId) {
        return productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
    }

    public int getAvailableStock(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        List<ProductLock> activeLocks = productLockRepository.findByProduct_IdAndStatus(productId,
                ProductLock.LockStatus.LOCKED);
        int lockedQuantity = activeLocks.stream().mapToInt(ProductLock::getQuantity).sum();

        return product.getStockQuantity() - lockedQuantity;
    }
}
