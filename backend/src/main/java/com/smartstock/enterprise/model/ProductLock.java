package com.smartstock.enterprise.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

@Entity
@Table(name = "product_locks")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductLock {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private Integer quantity;

    // Stored as TEXT in SQLite to avoid JDBC timestamp parsing errors
    @Column(name = "locked_at")
    private String lockedAt;

    @Column(name = "expires_at")
    private String expiresAt;

    @Enumerated(EnumType.STRING)
    private LockStatus status;

    private static final DateTimeFormatter FMT = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    @PrePersist
    public void prePersist() {
        if (this.lockedAt == null) {
            this.lockedAt = LocalDateTime.now().format(FMT);
        }
    }

    /** Helper: get expiresAt as LocalDateTime for comparison */
    public LocalDateTime getExpiresAtAsDateTime() {
        return expiresAt == null ? null : LocalDateTime.parse(expiresAt, FMT);
    }

    /** Helper: get lockedAt as LocalDateTime */
    public LocalDateTime getLockedAtAsDateTime() {
        return lockedAt == null ? null : LocalDateTime.parse(lockedAt, FMT);
    }

    public enum LockStatus {
        LOCKED,
        RELEASED,
        PURCHASED
    }
}
