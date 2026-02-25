package com.smartstock.enterprise.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;

@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String category;
    
    @Column(name = "stock_quantity")
    private Integer stockQuantity;
    
    private BigDecimal price;
    
    @Version
    private Long version; // Optimistic locking support
}
